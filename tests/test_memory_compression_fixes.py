"""Regression tests for compression fixes: enabled flag, single-line previews,
prior-turn archive paths, offload retention and multi-store reads."""

from __future__ import annotations

import pytest

import os
import time
from pathlib import Path

from langchain_core.messages import (
    AIMessage,
    HumanMessage,
    RemoveMessage,
    SystemMessage,
    ToolMessage,
)

from memory.compress import ContextCompressor, make_compressor
from memory.config import CompressionConfig
from memory.offload import OffloadStore
from memory.tokens import count_tokens
from tools.errors import ToolErrorType
from memory.tools import OffloadReadError, read_offloaded_file
from tests.minimal_chat_model import MinimalChatModel


def _config(tmp_path: Path, **overrides) -> CompressionConfig:
    values = {
        "context_window": 1_000,
        "tool_result_offload_threshold": 50,
        "tool_input_offload_threshold": 20,
        "fill_trigger": 0.5,
        "recent_messages_keep": 0.2,
        "offload_dir": tmp_path / "offload",
    }
    values.update(overrides)
    return CompressionConfig(**values)


def _offload_files(cfg: CompressionConfig) -> list[Path]:
    return sorted(cfg.offload_dir.glob("*.txt"))


# --- 1. enabled = false ---------------------------------------------------


def test_disabled_compressor_returns_no_updates(tmp_path: Path) -> None:
    cfg = _config(tmp_path, enabled=False)
    compressor = ContextCompressor(config=cfg)
    messages = [
        HumanMessage(content="Q1", id="h-1"),
        AIMessage(content="", id="ai-1", tool_calls=[{"name": "q", "args": {}, "id": "c1"}]),
        ToolMessage(content="row data " * 200, tool_call_id="c1", name="q", id="tm-1"),
        AIMessage(content="A1", id="ai-reply"),
        HumanMessage(content="Q2", id="h-2"),
    ]

    assert compressor.run(messages, force=True) == []
    assert compressor({"messages": messages, "autonomous_compact_requested": True}) == {
        "autonomous_compact_requested": False
    }
    assert _offload_files(cfg) == []


def test_make_compressor_respects_enabled_false(tmp_path: Path) -> None:
    assert CompressionConfig.from_mapping({"enabled": False}).enabled is False
    compressor = make_compressor(MinimalChatModel(), _config(tmp_path, enabled=False))
    assert isinstance(compressor, ContextCompressor)
    big = [ToolMessage(content="x " * 500, tool_call_id="c", name="t", id="tm")]
    assert compressor.run(big) == []


# --- 2. single-line results ----------------------------------------------


def test_single_line_result_preview_is_capped_and_not_reoffloaded(tmp_path: Path) -> None:
    cfg = _config(tmp_path)
    compressor = ContextCompressor(config=cfg)
    payload = (
        '{"rows": ['
        + ", ".join(f'{{"id": {i}, "v": "value-{i}"}}' for i in range(500))
        + "]}"
    )
    assert "\n" not in payload
    messages = [
        AIMessage(content="", id="ai-1", tool_calls=[{"name": "q", "args": {}, "id": "c1"}]),
        ToolMessage(content=payload, tool_call_id="c1", name="q", id="tm-1"),
    ]

    first = compressor.layer1_offload_tool_results(messages)
    assert len(first) == 1
    preview = first[0].content
    # Preview body is capped at ~threshold * 2 chars (plus header/footer paths).
    assert len(preview) < 1_000 < len(payload)
    assert count_tokens(preview) < count_tokens(payload) / 10

    second = compressor.layer1_offload_tool_results([messages[0], first[0]])
    assert second == []
    assert len(_offload_files(cfg)) == 1


def test_existing_offload_preview_is_never_reoffloaded(tmp_path: Path) -> None:
    cfg = _config(tmp_path)
    compressor = ContextCompressor(config=cfg)
    # A legacy (uncapped) preview that still exceeds the threshold.
    legacy = "[OFFLOADED — 9,999 tokens → /x/tool_q_1a2b3c4d.txt]\nPreview:\n" + "y " * 2000
    messages = [ToolMessage(content=legacy, tool_call_id="c1", name="q", id="tm-1")]

    assert compressor.layer1_offload_tool_results(messages) == []
    assert _offload_files(cfg) == []


# --- 3. prior-turn fold archive path in state -----------------------------


def test_prior_turn_fold_puts_archive_path_in_state(tmp_path: Path) -> None:
    cfg = _config(tmp_path, fill_trigger=0.99, context_window=100_000)
    compressor = ContextCompressor(config=cfg)
    messages = [
        HumanMessage(content="Q1", id="h-1"),
        AIMessage(
            content="", id="ai-tool", tool_calls=[{"name": "search", "args": {}, "id": "c1"}]
        ),
        ToolMessage(content="secret-hit", tool_call_id="c1", name="search", id="tm-tool"),
        AIMessage(content="A1", id="ai-reply"),
        HumanMessage(content="Q2", id="h-2"),
    ]

    updates = compressor.run(messages)

    notes = [u for u in updates if not isinstance(u, RemoveMessage)]
    assert len(notes) == 1
    note = notes[0]
    assert isinstance(note, SystemMessage)
    assert note.id == "ai-tool"  # replaced in place, keeps its position
    archives = list(cfg.offload_dir.glob("prior_turn_tools_archive_*.txt"))
    assert len(archives) == 1
    assert archives[0].as_posix() in note.content
    assert "secret-hit" in read_offloaded_file.invoke({"path": archives[0].as_posix()})

    # The note is kept on the next pass, so folding is idempotent.
    folded = ContextCompressor._apply_replacements(messages, updates)
    assert [m.id for m in folded] == ["h-1", "ai-tool", "ai-reply", "h-2"]
    assert compressor.run(folded) == []


# --- 4. offload retention -------------------------------------------------


def _age(path: Path, days: float) -> None:
    stamp = time.time() - days * 86_400
    os.utime(path, (stamp, stamp))


def test_offload_store_prunes_old_files_on_creation(tmp_path: Path) -> None:
    root = tmp_path / "offload"
    seed = OffloadStore(root)
    old = seed.write("old", label="tool_q")
    fresh = seed.write("fresh", label="tool_q")
    _age(old, 45)
    _age(fresh, 1)
    foreign = root / "notes.txt"  # does not match the offload file pattern
    foreign.write_text("keep", encoding="utf-8")
    _age(foreign, 400)
    outside = tmp_path / "tool_q_deadbeef.txt"  # outside the store root
    outside.write_text("keep", encoding="utf-8")
    _age(outside, 400)

    ContextCompressor(config=_config(tmp_path))  # default offload_max_age_days = 30

    assert not old.exists()
    assert fresh.exists()
    assert foreign.exists()
    assert outside.exists()


def test_offload_retention_zero_disables_pruning(tmp_path: Path) -> None:
    old = OffloadStore(tmp_path / "offload").write("old", label="tool_q")
    _age(old, 400)

    ContextCompressor(config=_config(tmp_path, offload_max_age_days=0))

    assert old.exists()


def test_offload_max_age_days_from_mapping() -> None:
    assert CompressionConfig().offload_max_age_days == 30
    assert CompressionConfig.from_mapping({"offload_max_age_days": 7}).offload_max_age_days == 7
    assert CompressionConfig.from_mapping({"offload_max_age_days": 0}).offload_max_age_days == 0
    assert (
        CompressionConfig.from_mapping({"offload_max_age_days": "x"}).offload_max_age_days == 30
    )


# --- 5. read_offloaded_file across stores --------------------------------


def test_read_offloaded_file_resolves_every_configured_store(tmp_path: Path) -> None:
    first = ContextCompressor(config=_config(tmp_path, offload_dir=tmp_path / "a"))
    second = ContextCompressor(config=_config(tmp_path, offload_dir=tmp_path / "b"))
    path_a = first.store.write("from-a", label="tool_a")
    path_b = second.store.write("from-b", label="tool_b")

    assert read_offloaded_file.invoke({"path": str(path_a)}) == "from-a"
    assert read_offloaded_file.invoke({"path": str(path_b)}) == "from-b"

    outside = tmp_path / "elsewhere.txt"
    outside.write_text("nope", encoding="utf-8")
    escape = str(tmp_path / "a" / ".." / "elsewhere.txt")
    for bad in (str(outside), escape):
        with pytest.raises(OffloadReadError) as info:
            read_offloaded_file.invoke({"path": bad})
        assert str(info.value).startswith("Failed to read offloaded file")
        assert info.value.error_type == ToolErrorType.PERMISSION


def test_read_offloaded_file_errors_are_structured(tmp_path: Path) -> None:
    """Failures raise a classified error instead of returning text."""
    from tools.errors import resolve_exception

    compressor = ContextCompressor(config=_config(tmp_path, offload_dir=tmp_path / "a"))
    missing = compressor.store.root / "tool_x_deadbeef.txt"
    with pytest.raises(OffloadReadError) as info:
        read_offloaded_file.invoke({"path": str(missing)})
    assert info.value.error_type == ToolErrorType.NOT_FOUND
    resolved = resolve_exception(info.value)
    assert resolved[0] == ToolErrorType.NOT_FOUND

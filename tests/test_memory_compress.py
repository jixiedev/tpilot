"""Unit tests for the three-layer context compression pipeline."""

from __future__ import annotations

import json
from pathlib import Path

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage, ToolMessage

from memory.compress import ContextCompressor
from memory.config import CompressionConfig
from memory.offload import OffloadStore
from memory.tools import AUTONOMOUS_COMPACT_MARKER, configure_offload_tools, read_offloaded_file
from memory.tokens import count_tokens


class _FakeSummarizer:
    def invoke(self, messages):
        return AIMessage(
            content=json.dumps(
                {
                    "session_intent": "Explore warehouse tables",
                    "progress_so_far": "Listed schemas",
                    "key_facts": "catalog=hive",
                    "artifacts_created": "none",
                    "next_steps": "Describe target table",
                    "open_questions": "Which table?",
                }
            )
        )


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


def test_layer1_offloads_large_tool_result(tmp_path: Path) -> None:
    cfg = _config(tmp_path)
    compressor = ContextCompressor(config=cfg, store=OffloadStore(cfg.offload_dir))
    big = "row data " * 80
    messages = [
        AIMessage(content="", id="ai-1", tool_calls=[{"name": "trino_run_query", "args": {}, "id": "c1"}]),
        ToolMessage(content=big, tool_call_id="c1", name="trino_run_query", id="tm-1"),
    ]

    updates = compressor.layer1_offload_tool_results(messages)

    assert len(updates) == 1
    assert updates[0].id == "tm-1"
    assert "OFFLOADED" in updates[0].content
    assert "read_offloaded_file" in updates[0].content
    stored = list((tmp_path / "offload").glob("tool_trino_run_query_*.txt"))
    assert len(stored) == 1
    assert stored[0].read_text(encoding="utf-8") == big


def test_layer1_skips_chat_completion(tmp_path: Path) -> None:
    cfg = _config(tmp_path)
    compressor = ContextCompressor(config=cfg, store=OffloadStore(cfg.offload_dir))
    big = "y" * 400
    messages = [
        ToolMessage(content=big, tool_call_id="c1", name="chat_completion", id="tm-1"),
    ]

    assert compressor.layer1_offload_tool_results(messages) == []


def test_layer2_evicts_write_tool_args(tmp_path: Path) -> None:
    cfg = _config(tmp_path)
    compressor = ContextCompressor(config=cfg, store=OffloadStore(cfg.offload_dir))
    payload = {"content": "z" * 200}
    messages = [
        AIMessage(
            content="",
            id="ai-1",
            tool_calls=[{"name": "ingest_document", "args": payload, "id": "c1"}],
        )
    ]

    updates = compressor.layer2_offload_tool_inputs(messages)

    assert len(updates) == 1
    assert updates[0].tool_calls[0]["args"]["__offloaded__"]
    path = Path(updates[0].tool_calls[0]["args"]["__offloaded__"])
    assert json.loads(path.read_text(encoding="utf-8")) == payload


def test_layer3_summarizes_and_orders_summary_before_tail(tmp_path: Path) -> None:
    cfg = _config(tmp_path, context_window=80, recent_messages_keep=0.15)
    compressor = ContextCompressor(
        config=cfg,
        llm=_FakeSummarizer(),
        store=OffloadStore(cfg.offload_dir),
    )
    messages = [
        SystemMessage(content="You are TahoePilot.", id="sys-1"),
        HumanMessage(content="List tables " + ("a" * 200), id="h-1"),
        AIMessage(content="Working " + ("b" * 200), id="ai-1"),
        ToolMessage(content="result " + ("c" * 200), tool_call_id="c1", name="trino_run_query", id="tm-1"),
        HumanMessage(content="Now describe sales", id="h-2"),
    ]

    updates = compressor.layer3_summarize(messages)

    from langchain_core.messages import RemoveMessage

    remove_ids = [u.id for u in updates if isinstance(u, RemoveMessage)]
    assert "h-1" in remove_ids or "ai-1" in remove_ids or "tm-1" in remove_ids
    summary = next(u for u in updates if isinstance(u, SystemMessage) and "CONTEXT COMPRESSED" in u.content)
    assert "Explore warehouse tables" in summary.content
    assert "Archive:" in summary.content
    summary_index = updates.index(summary)
    assert any(isinstance(u, HumanMessage) for u in updates[summary_index + 1 :])


def test_force_runs_layer2_below_fill_trigger(tmp_path: Path) -> None:
    cfg = _config(tmp_path, fill_trigger=0.99, context_window=100_000)
    compressor = ContextCompressor(config=cfg, store=OffloadStore(cfg.offload_dir))
    payload = {"content": "z" * 200}
    messages = [
        AIMessage(
            content="",
            id="ai-1",
            tool_calls=[{"name": "write_file", "args": payload, "id": "c1"}],
        ),
        ToolMessage(
            content=f"[{AUTONOMOUS_COMPACT_MARKER} at now] Reason: phase done",
            tool_call_id="c2",
            name="compact_context",
            id="tm-1",
        ),
    ]

    updates = compressor.run(messages, force=True)

    assert any(
        isinstance(u, AIMessage) and u.tool_calls and u.tool_calls[0]["args"].get("__offloaded__")
        for u in updates
    )


def test_read_offloaded_file_tool(tmp_path: Path) -> None:
    store = OffloadStore(tmp_path / "offload")
    configure_offload_tools(store)
    path = store.write("hello-offload", label="tool_demo")

    result = read_offloaded_file.invoke({"path": str(path)})

    assert result == "hello-offload"


def test_layer_prior_turns_qa_only_keeps_qa_drops_tool_trail(tmp_path: Path) -> None:
    cfg = _config(tmp_path)
    compressor = ContextCompressor(config=cfg, store=OffloadStore(cfg.offload_dir))
    messages = [
        SystemMessage(content="You are TahoePilot.", id="sys-role"),
        HumanMessage(content="What is GMV?", id="h-1"),
        AIMessage(
            content="",
            id="ai-search",
            tool_calls=[{"name": "search", "args": {"query": "GMV"}, "id": "c1"}],
        ),
        ToolMessage(content="glossary hit...", tool_call_id="c1", name="search", id="tm-search"),
        AIMessage(
            content="",
            id="ai-reply-1",
            tool_calls=[{"name": "chat_completion", "args": {"reply": "GMV is ..."}, "id": "c2"}],
        ),
        ToolMessage(
            content="GMV is gross merchandise value.",
            tool_call_id="c2",
            name="chat_completion",
            id="tm-reply-1",
        ),
        SystemMessage(content="--- Session turn boundary ---\nPrior above.", id="sys-boundary"),
        HumanMessage(content="Show related tables", id="h-2"),
        AIMessage(
            content="",
            id="ai-current",
            tool_calls=[{"name": "search", "args": {"query": "tables"}, "id": "c3"}],
        ),
        ToolMessage(content="table list...", tool_call_id="c3", name="search", id="tm-current"),
    ]

    updates = compressor.layer_prior_turns_qa_only(messages)

    from langchain_core.messages import RemoveMessage

    remove_ids = {u.id for u in updates if isinstance(u, RemoveMessage)}
    assert remove_ids == {"ai-search", "tm-search"}
    assert "ai-reply-1" not in remove_ids
    assert "tm-reply-1" not in remove_ids
    assert "h-1" not in remove_ids
    assert "sys-role" not in remove_ids
    assert "sys-boundary" not in remove_ids
    assert "h-2" not in remove_ids
    assert "ai-current" not in remove_ids
    assert "tm-current" not in remove_ids
    archived = list((tmp_path / "offload").glob("prior_turn_tools_archive_*.txt"))
    assert len(archived) == 1


def test_run_applies_prior_turn_qa_fold(tmp_path: Path) -> None:
    cfg = _config(tmp_path, fill_trigger=0.99, context_window=100_000)
    compressor = ContextCompressor(config=cfg, store=OffloadStore(cfg.offload_dir))
    messages = [
        HumanMessage(content="Q1", id="h-1"),
        AIMessage(
            content="",
            id="ai-tool",
            tool_calls=[{"name": "trino_run_query", "args": {}, "id": "c1"}],
        ),
        ToolMessage(content="rows", tool_call_id="c1", name="trino_run_query", id="tm-tool"),
        AIMessage(
            content="",
            id="ai-reply",
            tool_calls=[{"name": "chat_completion", "args": {"reply": "A1"}, "id": "c2"}],
        ),
        ToolMessage(content="A1", tool_call_id="c2", name="chat_completion", id="tm-reply"),
        HumanMessage(content="Q2", id="h-2"),
    ]

    updates = compressor.run(messages)

    from langchain_core.messages import RemoveMessage

    remove_ids = {u.id for u in updates if isinstance(u, RemoveMessage)}
    assert "ai-tool" in remove_ids
    assert "tm-tool" in remove_ids
    assert "tm-reply" not in remove_ids


def test_prior_turns_qa_only_can_be_disabled(tmp_path: Path) -> None:
    cfg = _config(tmp_path, prior_turns_qa_only=False, fill_trigger=0.99, context_window=100_000)
    compressor = ContextCompressor(config=cfg, store=OffloadStore(cfg.offload_dir))
    messages = [
        HumanMessage(content="Q1", id="h-1"),
        AIMessage(
            content="",
            id="ai-tool",
            tool_calls=[{"name": "search", "args": {}, "id": "c1"}],
        ),
        ToolMessage(content="hit", tool_call_id="c1", name="search", id="tm-tool"),
        AIMessage(
            content="",
            id="ai-reply",
            tool_calls=[{"name": "chat_completion", "args": {"reply": "A1"}, "id": "c2"}],
        ),
        ToolMessage(content="A1", tool_call_id="c2", name="chat_completion", id="tm-reply"),
        HumanMessage(content="Q2", id="h-2"),
    ]

    assert compressor.run(messages) == []

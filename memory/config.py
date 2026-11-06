"""Configuration for the graduated context compression pipeline."""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass, field, replace
from pathlib import Path
from typing import Any, Self

from config.local_config import get_local_paths

# Tools whose large arguments are safe to evict after the write has persisted.
DEFAULT_WRITE_TOOLS: frozenset[str] = frozenset(
    {
        "write_file",
        "edit_file",
        "create_file",
        "save_content",
        "ingest_document",
        "ingest_file_path",
        "str_replace_editor",
    }
)

# Tool results that must stay in-context.
DEFAULT_NEVER_OFFLOAD_TOOLS: frozenset[str] = frozenset()

# Marker text used between CLI turns (see ``BaseAgent.turn_boundary``).
TURN_BOUNDARY_MARKER = "--- Session turn boundary ---"


@dataclass(frozen=True)
class CompressionConfig:
    """Thresholds and paths for graduated context compression."""

    enabled: bool = True
    context_window: int = 128_000
    tool_result_offload_threshold: int = 2_000
    tool_input_offload_threshold: int = 500
    fill_trigger: float = 0.85
    recent_messages_keep: float = 0.10
    preview_lines: int = 10
    # Delete offload files older than this when a store is created; 0 disables.
    offload_max_age_days: float = 30.0
    offload_dir: Path = field(default_factory=lambda: get_local_paths().offload_dir)
    write_tools: frozenset[str] = DEFAULT_WRITE_TOOLS
    never_offload_tools: frozenset[str] = DEFAULT_NEVER_OFFLOAD_TOOLS
    # Drop prior-turn tool trajectories; keep Human + final assistant text.
    prior_turns_qa_only: bool = True
    turn_boundary_marker: str = TURN_BOUNDARY_MARKER

    @classmethod
    def from_mapping(cls, raw: Mapping[str, Any] | None = None) -> Self:
        """Overlay agent-file keys onto the code defaults.

        ``offload_dir`` and ``turn_boundary_marker`` are not read from the
        mapping. They stay on this dataclass so the offload path and the
        session turn marker have one source.
        """
        data = dict(raw or {})
        current = cls()
        updates: dict[str, Any] = {}
        if "enabled" in data:
            updates["enabled"] = _as_bool(data["enabled"], current.enabled)
        if "context_window" in data:
            updates["context_window"] = _as_int(data["context_window"], current.context_window)
        if "tool_result_offload_threshold" in data:
            updates["tool_result_offload_threshold"] = _as_int(
                data["tool_result_offload_threshold"],
                current.tool_result_offload_threshold,
            )
        if "tool_input_offload_threshold" in data:
            updates["tool_input_offload_threshold"] = _as_int(
                data["tool_input_offload_threshold"],
                current.tool_input_offload_threshold,
            )
        if "fill_trigger" in data:
            updates["fill_trigger"] = _as_float(data["fill_trigger"], current.fill_trigger)
        if "recent_messages_keep" in data:
            updates["recent_messages_keep"] = _as_float(
                data["recent_messages_keep"],
                current.recent_messages_keep,
            )
        if "preview_lines" in data:
            updates["preview_lines"] = _as_int(data["preview_lines"], current.preview_lines)
        if "offload_max_age_days" in data:
            updates["offload_max_age_days"] = _as_float(
                data["offload_max_age_days"],
                current.offload_max_age_days,
            )
        if "prior_turns_qa_only" in data:
            updates["prior_turns_qa_only"] = _as_bool(
                data["prior_turns_qa_only"],
                current.prior_turns_qa_only,
            )
        if "write_tools" in data:
            updates["write_tools"] = _as_names(data["write_tools"])
        if "never_offload_tools" in data:
            updates["never_offload_tools"] = _as_names(data["never_offload_tools"])
        if not updates:
            return current
        return replace(current, **updates)


def _as_int(value: object, default: int) -> int:
    if isinstance(value, bool) or not isinstance(value, (int, float, str)):
        return default
    try:
        return int(value)
    except ValueError:
        return default


def _as_float(value: object, default: float) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float, str)):
        return default
    try:
        return float(value)
    except ValueError:
        return default


def _as_bool(value: object, default: bool) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return bool(value)
    text = str(value).strip().lower()
    if text in ("true", "1", "yes", "on", "enabled"):
        return True
    if text in ("false", "0", "no", "off", "disabled", "disable"):
        return False
    return default


def _as_names(value: object) -> frozenset[str]:
    if isinstance(value, str):
        text = value.strip()
        return frozenset({text}) if text else frozenset()
    return frozenset(str(item).strip() for item in (value or ()) if str(item).strip())

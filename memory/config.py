"""Configuration for the graduated context compression pipeline."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

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

# Marker text used by SessionTurnBuilder between CLI turns.
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
    offload_dir: Path = field(default_factory=lambda: get_local_paths().offload_dir)
    write_tools: frozenset[str] = DEFAULT_WRITE_TOOLS
    never_offload_tools: frozenset[str] = DEFAULT_NEVER_OFFLOAD_TOOLS
    # Drop prior-turn tool trajectories; keep Human + final assistant text.
    prior_turns_qa_only: bool = True
    turn_boundary_marker: str = TURN_BOUNDARY_MARKER

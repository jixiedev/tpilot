"""Configuration for the three-layer context compression pipeline."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

# Tools whose large arguments are safe to evict after the write has persisted.
DEFAULT_WRITE_TOOLS: frozenset[str] = frozenset(
    {
        "write_file",
        "edit_file",
        "create_file",
        "save_content",
        "ingest_document",
        "ingest_file_path",
    }
)

# Tool results that must stay in-context (e.g. the user-visible reply).
DEFAULT_NEVER_OFFLOAD_TOOLS: frozenset[str] = frozenset({"chat_completion"})


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
    offload_dir: Path = field(default_factory=lambda: Path("offload_store"))
    write_tools: frozenset[str] = DEFAULT_WRITE_TOOLS
    never_offload_tools: frozenset[str] = DEFAULT_NEVER_OFFLOAD_TOOLS

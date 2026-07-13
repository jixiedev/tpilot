"""Tools for recovering offloaded content and requesting autonomous compaction."""

from __future__ import annotations

from datetime import datetime, timezone

from langchain.tools import tool

from memory.config import CompressionConfig
from memory.offload import OffloadStore

COMPACT_CONTEXT_TOOL_NAME = "compact_context"
READ_OFFLOADED_FILE_TOOL_NAME = "read_offloaded_file"
AUTONOMOUS_COMPACT_MARKER = "AUTONOMOUS COMPACT REQUESTED"

_DEFAULT_STORE = OffloadStore(CompressionConfig().offload_dir)


def configure_offload_tools(store: OffloadStore) -> None:
    """Point recovery tools at the active offload store (used by the compressor)."""
    global _DEFAULT_STORE
    _DEFAULT_STORE = store


@tool
def read_offloaded_file(path: str) -> str:
    """Read a previously offloaded tool result or archive from disk by path."""
    try:
        return _DEFAULT_STORE.read(path)
    except (OSError, ValueError) as exc:
        return f"Failed to read offloaded file {path!r}: {exc}"


@tool
def compact_context(reason: str = "") -> str:
    """
    Trigger context compression at a natural task boundary.

    Call after finishing a major phase, or before starting an unrelated new task,
    when the conversation holds stale intermediate tool output.
    """
    stamp = datetime.now(timezone.utc).isoformat()
    detail = reason.strip() or "unspecified"
    return f"[{AUTONOMOUS_COMPACT_MARKER} at {stamp}] Reason: {detail}"


COMPRESSION_TOOLS = [read_offloaded_file, compact_context]

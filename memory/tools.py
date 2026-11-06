"""Tools for recovering offloaded content and requesting autonomous compaction."""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

from langchain.tools import tool

from memory.config import CompressionConfig
from memory.offload import OffloadStore
from tools.errors import ToolErrorType, register_exception
from tools.registry import register_tool


class OffloadReadError(RuntimeError):
    """``read_offloaded_file`` failed; ``error_type`` says why."""

    def __init__(self, message: str, error_type: ToolErrorType) -> None:
        super().__init__(message)
        self.error_type = error_type


register_exception(
    OffloadReadError,
    classifier=lambda exc: (getattr(exc, "error_type", ToolErrorType.UNKNOWN), False, str(exc)),
)

AUTONOMOUS_COMPACT_MARKER = "AUTONOMOUS COMPACT REQUESTED"

_DEFAULT_STORE = OffloadStore(CompressionConfig().offload_dir)

# Every store a compressor has registered, keyed by resolved root. Agents in one
# process may use different ``offload_dir`` values; reads resolve against all.
_STORES: dict[Path, OffloadStore] = {_DEFAULT_STORE.root.resolve(): _DEFAULT_STORE}


def configure_offload_tools(store: OffloadStore) -> None:
    """Register ``store`` so ``read_offloaded_file`` can read paths under its root.

    Registration is additive: earlier stores stay readable.
    """
    _STORES[store.root.resolve()] = store


def _store_for(path: str) -> OffloadStore | None:
    """Most specific registered store whose root contains ``path``."""
    matches = [store for store in _STORES.values() if store.contains(path)]
    if not matches:
        return None
    return max(matches, key=lambda store: len(store.root.resolve().parts))


@register_tool
@tool
def read_offloaded_file(path: str) -> str:
    """Read a previously offloaded tool result or archive from disk by path."""
    store = _store_for(path)
    if store is None:
        raise OffloadReadError(
            f"Failed to read offloaded file {path!r}: outside every offload store root",
            ToolErrorType.PERMISSION,
        )
    try:
        return store.read(path)
    except FileNotFoundError as exc:
        raise OffloadReadError(
            f"Failed to read offloaded file {path!r}: {exc} (it may have been pruned)",
            ToolErrorType.NOT_FOUND,
        ) from exc
    except (OSError, ValueError) as exc:
        raise OffloadReadError(
            f"Failed to read offloaded file {path!r}: {exc}", ToolErrorType.UNKNOWN
        ) from exc


@register_tool
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

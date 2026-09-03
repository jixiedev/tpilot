"""Backward-compatible path helpers. Prefer ``config.local_config``."""

from __future__ import annotations

from config.local_config import (
    LocalPaths,
    ensure_local_dirs,
    get_local_paths,
    reset_local_paths_cache,
)

_ATTR_MAP = {
    "LOCAL_DATA_DIR": "data_dir",
    "CHECKPOINT_DB": "checkpoint_db",
    "PROFILES_DIR": "profiles_dir",
    "OFFLOAD_DIR": "offload_dir",
    "LOGS_DIR": "logs_dir",
    "DEFAULT_LOG_FILE": "log_file",
}

__all__ = [
    *list(_ATTR_MAP),
    "LocalPaths",
    "ensure_local_dirs",
    "get_local_paths",
    "reset_local_paths_cache",
]


def __getattr__(name: str):
    attr = _ATTR_MAP.get(name)
    if attr is not None:
        return getattr(get_local_paths(), attr)
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")

"""Runtime paths (checkpoints, profiles, offload store, logs, dev servers, RAG jobs) and user defaults from ``<config dir>/runtime.toml``.

``runtime.toml`` is the only source: there are no env-var or CLI overrides.
Relative paths resolve against the project root; ``~`` is expanded.
"""

from __future__ import annotations

import tomllib
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel, Field

from tahoepilot.settings.paths import PROJECT_ROOT as _PROJECT_ROOT, config_file

_DEFAULT_DATA_DIR = ".local"
_DEFAULT_CHECKPOINT = "checkpoints.sqlite"
_DEFAULT_PROFILES = "profiles"
_DEFAULT_OFFLOAD = "offload_store"
_DEFAULT_LOGS = "logs"
_DEFAULT_LOG_FILE = "tahoepilot.log"
_DEFAULT_WORKSPACE = "workspace"
_DEFAULT_RUN = "run"
_DEFAULT_LANGGRAPH = "langgraph"
_DEFAULT_RAG_JOBS = "rag-jobs"


class PathsConfig(BaseModel):
    """``[paths]``: runtime state. Empty fields default under ``data_dir``."""

    data_dir: str = _DEFAULT_DATA_DIR
    checkpoint_db: str = ""
    profiles_dir: str = ""
    offload_dir: str = ""
    logs_dir: str = ""
    log_file: str = ""
    workspace_dir: str = ""
    run_dir: str = ""
    langgraph_dir: str = ""
    rag_jobs_dir: str = ""


class UserConfig(BaseModel):
    """``[user]``: ``default_id`` is used when no user id is given (else the OS user)."""

    default_id: str = ""


class RuntimeConfig(BaseModel):
    """``runtime.toml`` as written."""

    paths: PathsConfig = Field(default_factory=PathsConfig)
    user: UserConfig = Field(default_factory=UserConfig)


@dataclass(frozen=True)
class RuntimePaths:
    """Resolved absolute paths built from :class:`PathsConfig` (defaults filled in)."""

    data_dir: Path
    checkpoint_db: Path
    profiles_dir: Path
    offload_dir: Path
    logs_dir: Path
    log_file: Path
    #: Working folder of the code tools (bash, python_execute, str_replace_editor).
    workspace_dir: Path
    #: PID files and logs of ``scripts/dev.sh start`` (and eval logs).
    run_dir: Path
    #: Working folder of ``langgraph dev``; its store is ``<langgraph_dir>/.langgraph_api``.
    langgraph_dir: Path
    #: Default folder for ``python -m tahoepilot.rag plan|run --tasks <file name>``.
    rag_jobs_dir: Path


def _resolve_path(raw: str, *, base: Path) -> Path:
    path = Path(raw).expanduser()
    if path.is_absolute():
        return path
    return (base / path).resolve()


def _path_or(raw: str, default: Path) -> Path:
    raw = (raw or "").strip()
    return _resolve_path(raw, base=_PROJECT_ROOT) if raw else default


@lru_cache(maxsize=1)
def get_runtime_config() -> RuntimeConfig:
    path = config_file("runtime.toml")
    if not path.is_file():
        return RuntimeConfig()
    with path.open("rb") as f:
        return RuntimeConfig.model_validate(tomllib.load(f))


def build_runtime_paths(cfg: RuntimeConfig | None = None) -> RuntimePaths:
    paths = (cfg or get_runtime_config()).paths
    data_dir = _path_or(paths.data_dir, _resolve_path(_DEFAULT_DATA_DIR, base=_PROJECT_ROOT))
    logs_dir = _path_or(paths.logs_dir, data_dir / _DEFAULT_LOGS)
    return RuntimePaths(
        data_dir=data_dir,
        checkpoint_db=_path_or(paths.checkpoint_db, data_dir / _DEFAULT_CHECKPOINT),
        profiles_dir=_path_or(paths.profiles_dir, data_dir / _DEFAULT_PROFILES),
        offload_dir=_path_or(paths.offload_dir, data_dir / _DEFAULT_OFFLOAD),
        logs_dir=logs_dir,
        log_file=_path_or(paths.log_file, logs_dir / _DEFAULT_LOG_FILE),
        workspace_dir=_path_or(paths.workspace_dir, data_dir / _DEFAULT_WORKSPACE),
        run_dir=_path_or(paths.run_dir, data_dir / _DEFAULT_RUN),
        langgraph_dir=_path_or(paths.langgraph_dir, data_dir / _DEFAULT_LANGGRAPH),
        rag_jobs_dir=_path_or(paths.rag_jobs_dir, data_dir / _DEFAULT_RAG_JOBS),
    )


def default_user_id() -> str:
    """``[user].default_id`` of ``runtime.toml`` (empty when unset)."""
    return get_runtime_config().user.default_id.strip()


@lru_cache(maxsize=1)
def get_runtime_paths() -> RuntimePaths:
    return build_runtime_paths()


def reset_runtime_paths_cache() -> None:
    get_runtime_config.cache_clear()
    get_runtime_paths.cache_clear()


def ensure_runtime_dirs() -> RuntimePaths:
    paths = get_runtime_paths()
    for path in (
        paths.data_dir,
        paths.profiles_dir,
        paths.offload_dir,
        paths.logs_dir,
        paths.workspace_dir,
    ):
        path.mkdir(parents=True, exist_ok=True)
    paths.log_file.parent.mkdir(parents=True, exist_ok=True)
    return paths

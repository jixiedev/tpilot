"""Local runtime paths (checkpoints, profiles, logs, offload) from ``config/local.toml``."""

from __future__ import annotations

import os
import tomllib
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel, Field

_CONFIG_PATH = Path(__file__).resolve().parent / "local.toml"
_PROJECT_ROOT = Path(__file__).resolve().parent.parent

_DEFAULT_DATA_DIR = ".local"
_DEFAULT_CHECKPOINT = "checkpoints.sqlite"
_DEFAULT_PROFILES = "profiles"
_DEFAULT_OFFLOAD = "offload_store"
_DEFAULT_LOGS = "logs"
_DEFAULT_LOG_FILE = "tahoepilot.log"


class PathsConfig(BaseModel):
    data_dir: str = _DEFAULT_DATA_DIR
    checkpoint_db: str = ""
    profiles_dir: str = ""
    offload_dir: str = ""
    logs_dir: str = ""
    log_file: str = ""

    data_dir_env: str | None = "TAHOEPILOT_LOCAL_DIR"
    checkpoint_db_env: str | None = "TAHOEPILOT_CHECKPOINT_DB"
    profiles_dir_env: str | None = "TAHOEPILOT_PROFILE_DIR"
    offload_dir_env: str | None = "TAHOEPILOT_OFFLOAD_DIR"
    logs_dir_env: str | None = "TAHOEPILOT_LOGS_DIR"
    log_file_env: str | None = "TAHOEPILOT_LOG_FILE"


class LocalConfig(BaseModel):
    paths: PathsConfig = Field(default_factory=PathsConfig)


@dataclass(frozen=True)
class LocalPaths:
    data_dir: Path
    checkpoint_db: Path
    profiles_dir: Path
    offload_dir: Path
    logs_dir: Path
    log_file: Path


def _env_value(env_name: str | None) -> str:
    if not env_name:
        return ""
    return os.environ.get(env_name, "").strip()


def _env_or_toml(env_name: str | None, toml_value: str) -> str:
    env = _env_value(env_name)
    if env:
        return env
    return (toml_value or "").strip()


def _resolve_path(raw: str, *, base: Path) -> Path:
    path = Path(raw).expanduser()
    if path.is_absolute():
        return path
    return (base / path).resolve()


def _first_env_path(*env_names: str | None, base: Path) -> Path | None:
    for env_name in env_names:
        value = _env_value(env_name)
        if value:
            return _resolve_path(value, base=base)
    return None


def _resolve_subpath(
    *,
    toml_value: str,
    env_name: str | None,
    data_dir: Path,
    default_name: str,
    base: Path,
) -> Path:
    env_path = _first_env_path(env_name, base=base)
    if env_path is not None:
        return env_path
    if toml_value.strip():
        return _resolve_path(toml_value.strip(), base=base)
    return data_dir / default_name


@lru_cache(maxsize=1)
def get_local_config() -> LocalConfig:
    if not _CONFIG_PATH.is_file():
        return LocalConfig()
    with _CONFIG_PATH.open("rb") as f:
        return LocalConfig.model_validate(tomllib.load(f))


def build_local_paths(cfg: LocalConfig | None = None) -> LocalPaths:
    local = cfg or get_local_config()
    paths = local.paths
    base = _PROJECT_ROOT

    data_dir_raw = _env_or_toml(paths.data_dir_env, paths.data_dir) or _DEFAULT_DATA_DIR
    data_dir = _resolve_path(data_dir_raw, base=base)

    checkpoint_db = _first_env_path(
        paths.checkpoint_db_env,
        "AGUI_CHECKPOINT_DB",
        base=base,
    )
    if checkpoint_db is None:
        if paths.checkpoint_db.strip():
            checkpoint_db = _resolve_path(paths.checkpoint_db.strip(), base=base)
        else:
            checkpoint_db = data_dir / _DEFAULT_CHECKPOINT

    profiles_dir = _resolve_subpath(
        toml_value=paths.profiles_dir,
        env_name=paths.profiles_dir_env,
        data_dir=data_dir,
        default_name=_DEFAULT_PROFILES,
        base=base,
    )
    offload_dir = _resolve_subpath(
        toml_value=paths.offload_dir,
        env_name=paths.offload_dir_env,
        data_dir=data_dir,
        default_name=_DEFAULT_OFFLOAD,
        base=base,
    )
    logs_dir = _resolve_subpath(
        toml_value=paths.logs_dir,
        env_name=paths.logs_dir_env,
        data_dir=data_dir,
        default_name=_DEFAULT_LOGS,
        base=base,
    )

    log_file = _first_env_path(paths.log_file_env, base=base)
    if log_file is None:
        if paths.log_file.strip():
            log_file = _resolve_path(paths.log_file.strip(), base=base)
        else:
            log_file = logs_dir / _DEFAULT_LOG_FILE

    return LocalPaths(
        data_dir=data_dir,
        checkpoint_db=checkpoint_db,
        profiles_dir=profiles_dir,
        offload_dir=offload_dir,
        logs_dir=logs_dir,
        log_file=log_file,
    )


@lru_cache(maxsize=1)
def get_local_paths() -> LocalPaths:
    return build_local_paths()


def reset_local_paths_cache() -> None:
    get_local_config.cache_clear()
    get_local_paths.cache_clear()


def ensure_dir(path: Path) -> None:
    """Create ``path`` (and its parents) when it does not exist yet.

    ``Path.mkdir(exist_ok=True)`` calls ``os.mkdir`` *even when the directory
    is already there*, and ``langgraph dev`` refuses blocking syscalls inside
    the ASGI event loop. Checking first keeps the common path syscall-free:
    ``is_dir`` uses ``os.stat``, which is allowed.
    """
    if not path.is_dir():
        path.mkdir(parents=True, exist_ok=True)


def ensure_local_dirs() -> LocalPaths:
    paths = get_local_paths()
    for path in (
        paths.data_dir,
        paths.profiles_dir,
        paths.offload_dir,
        paths.logs_dir,
    ):
        ensure_dir(path)
    ensure_dir(paths.log_file.parent)
    return paths

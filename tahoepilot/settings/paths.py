"""The one place that decides where configuration and secrets live.

Every non-secret setting (paths, endpoints, ports, models, agents, metric
catalog) is read from files in the config directory, so a deployment mounts it
as a single volume (e.g. a k8s ConfigMap at ``/tahoepilot/config``).

Two env files are loaded when this module is imported; real environment
variables always win, and neither file overrides the other's keys:

1. ``<project root>/.env`` holds non-secret variables only: where the config
   directory and the secrets file are, plus library flags (``HF_*``).
2. The secrets file holds API keys, passwords and tokens (``KEY=value`` lines).
   Its path is ``TAHOEPILOT_SECRETS_FILE``, default
   ``/tahoepilot/secrets/secrets.env`` (a k8s Secret mounted as a file). A
   missing file is fine: secrets may also arrive as real env vars (``envFrom``).

``TAHOEPILOT_CONFIG_DIR`` defaults to ``/tahoepilot/config``. Relative values of
either variable resolve against the project root, so a dev checkout's ``.env``
has ``TAHOEPILOT_CONFIG_DIR=config`` and ``TAHOEPILOT_SECRETS_FILE=secrets.env``.

Config files name the secrets they need with ``*_env`` keys (e.g.
``api_key_env = "MiniMax_API_KEY"``) or ``${VAR}`` in ``mcp.json``.
"""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

# This file is <root>/tahoepilot/settings/paths.py.
PROJECT_ROOT = Path(__file__).resolve().parents[2]
CONFIG_DIR_ENV = "TAHOEPILOT_CONFIG_DIR"
DEFAULT_CONFIG_DIR = Path("/tahoepilot/config")
SECRETS_FILE_ENV = "TAHOEPILOT_SECRETS_FILE"
DEFAULT_SECRETS_FILE = Path("/tahoepilot/secrets/secrets.env")


def resolve_project_path(raw: str | Path) -> Path:
    """``raw`` as an absolute path; relative values resolve against the project root."""
    path = Path(raw).expanduser()
    return path if path.is_absolute() else (PROJECT_ROOT / path).resolve()


def config_dir() -> Path:
    """``$TAHOEPILOT_CONFIG_DIR``, or ``/tahoepilot/config`` when unset."""
    raw = os.environ.get(CONFIG_DIR_ENV, "").strip()
    return resolve_project_path(raw) if raw else DEFAULT_CONFIG_DIR


def config_file(*parts: str) -> Path:
    """A path inside :func:`config_dir`, e.g. ``config_file("agents", "lead.toml")``."""
    return config_dir().joinpath(*parts)


def secrets_file() -> Path:
    """``$TAHOEPILOT_SECRETS_FILE``, or ``/tahoepilot/secrets/secrets.env`` when unset."""
    raw = os.environ.get(SECRETS_FILE_ENV, "").strip()
    return resolve_project_path(raw) if raw else DEFAULT_SECRETS_FILE


def load_env_files() -> None:
    """Load ``.env`` (non-secret), then the secrets file; never override set variables."""
    load_dotenv(PROJECT_ROOT / ".env", override=False)
    path = secrets_file()
    if path.is_file():
        load_dotenv(path, override=False)


load_env_files()

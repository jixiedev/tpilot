from __future__ import annotations

import os
from pathlib import Path

# Tests always read the repo's config/, whatever .env or the shell says.
os.environ["TAHOEPILOT_CONFIG_DIR"] = str(Path(__file__).resolve().parents[1] / "config")

import pytest  # noqa: E402

from tahoepilot.tools.data import hive, trino  # noqa: E402


@pytest.fixture(autouse=True)
def _reset_tool_thread_locals() -> None:
    """Clear per-thread HMS/Trino clients so mocks apply cleanly."""
    for module in (hive, trino):
        if hasattr(module._thread_local, "client"):
            del module._thread_local.client
        if hasattr(module._thread_local, "conn"):
            del module._thread_local.conn
        if hasattr(module._thread_local, "conns"):
            del module._thread_local.conns


@pytest.fixture(autouse=True)
def _login_off_by_default():
    """Run with the web login off unless a test turns it on.

    config/server.toml may enable ``[auth]``; endpoint tests that are not about
    login must not need a session token. A private MonkeyPatch keeps the
    tests' own ``monkeypatch`` fixture in its usual setup/teardown order.
    """
    import sys

    from tahoepilot.settings.server_config import AuthConfig

    off = AuthConfig(enabled=False)
    patcher = pytest.MonkeyPatch()
    for name in ("tahoepilot.server.auth", "tahoepilot.server.app"):
        module = sys.modules.get(name)
        if module is not None and hasattr(module, "auth_config"):
            patcher.setattr(module, "auth_config", lambda: off)
    yield
    patcher.undo()

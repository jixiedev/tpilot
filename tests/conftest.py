from __future__ import annotations

import pytest

from tools.data import hive, trino


@pytest.fixture(autouse=True)
def _reset_tool_thread_locals() -> None:
    """Clear per-thread HMS/Trino clients so mocks apply cleanly."""
    for module in (hive, trino):
        if hasattr(module._thread_local, "client"):
            del module._thread_local.client
        if hasattr(module._thread_local, "conn"):
            del module._thread_local.conn

from __future__ import annotations

import json
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from tools.mcp import mcp as mcp_module


def test_expand_env_vars_substitutes_when_set(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("MY_TOKEN", "secret-value")

    assert mcp_module._expand_env_vars("Bearer ${MY_TOKEN}") == "Bearer secret-value"


def test_expand_env_vars_leaves_placeholder_when_unset() -> None:
    assert mcp_module._expand_env_vars("Bearer ${MISSING_VAR}") == "Bearer ${MISSING_VAR}"


def test_expand_config_recurses_nested_structures(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("PORT", "9090")
    raw = {
        "url": "http://localhost:${PORT}",
        "servers": [{"token": "${PORT}"}],
        "count": 3,
    }

    expanded = mcp_module._expand_config(raw)

    assert expanded == {
        "url": "http://localhost:9090",
        "servers": [{"token": "9090"}],
        "count": 3,
    }


def test_load_mcp_config_reads_and_expands(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("AUTH", "tok")
    config_file = tmp_path / "mcp.json"
    config_file.write_text(
        json.dumps({"server": {"token": "${AUTH}"}}),
        encoding="utf-8",
    )

    with patch.object(mcp_module, "mcp_config_path", return_value=config_file):
        assert mcp_module.load_mcp_config() == {"server": {"token": "tok"}}


@pytest.mark.asyncio
async def test_get_mcp_tools_returns_empty_when_config_missing(tmp_path: Path) -> None:
    missing = tmp_path / "missing.json"

    with patch.object(mcp_module, "mcp_config_path", return_value=missing):
        assert await mcp_module.get_mcp_tools() == []


@pytest.mark.asyncio
async def test_get_mcp_tools_returns_empty_on_client_error(tmp_path: Path) -> None:
    config_file = tmp_path / "mcp.json"
    config_file.write_text("{}", encoding="utf-8")

    client = MagicMock()
    client.get_tools = AsyncMock(side_effect=RuntimeError("connection refused"))

    with (
        patch.object(mcp_module, "mcp_config_path", return_value=config_file),
        patch.object(mcp_module, "get_client", return_value=client),
    ):
        assert await mcp_module.get_mcp_tools() == []


@pytest.mark.asyncio
async def test_get_mcp_tools_returns_tools_on_success(tmp_path: Path) -> None:
    config_file = tmp_path / "mcp.json"
    config_file.write_text("{}", encoding="utf-8")
    tools = [MagicMock(name="search")]

    client = MagicMock()
    client.get_tools = AsyncMock(return_value=tools)

    with (
        patch.object(mcp_module, "mcp_config_path", return_value=config_file),
        patch.object(mcp_module, "get_client", return_value=client),
    ):
        assert await mcp_module.get_mcp_tools() == tools


@pytest.mark.asyncio
async def test_get_tools_for_server_uses_session(tmp_path: Path) -> None:
    config_file = tmp_path / "mcp.json"
    config_file.write_text("{}", encoding="utf-8")
    session = MagicMock()
    expected = [MagicMock(name="get_lineage")]

    client = MagicMock()
    client.session.return_value.__aenter__ = AsyncMock(return_value=session)
    client.session.return_value.__aexit__ = AsyncMock(return_value=None)

    with (
        patch.object(mcp_module, "mcp_config_path", return_value=config_file),
        patch.object(mcp_module, "get_client", return_value=client),
        patch(
            "tools.mcp.mcp.load_mcp_tools",
            new_callable=AsyncMock,
            return_value=expected,
        ) as mock_load,
    ):
        result = await mcp_module.get_tools_for_server("datahub")

    assert result == expected
    client.session.assert_called_once_with("datahub")
    mock_load.assert_awaited_once_with(session)

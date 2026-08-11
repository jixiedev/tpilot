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
    raw_tool = MagicMock()
    raw_tool.name = "search"
    raw_tool.description = "Search DataHub"

    client = MagicMock()
    client.get_tools = AsyncMock(return_value=[raw_tool])

    with (
        patch.object(mcp_module, "mcp_config_path", return_value=config_file),
        patch.object(mcp_module, "get_client", return_value=client),
    ):
        tools = await mcp_module.get_mcp_tools()

    assert tools == [raw_tool]


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


@pytest.mark.asyncio
async def test_configured_mcp_server_names_reads_mcp_servers(tmp_path: Path) -> None:
    config_file = tmp_path / "mcp.json"
    config_file.write_text(
        json.dumps({"mcpServers": {"datahub": {}, "files": {}}}),
        encoding="utf-8",
    )

    with patch.object(mcp_module, "mcp_config_path", return_value=config_file):
        assert mcp_module.configured_mcp_server_names() == ["datahub", "files"]


@pytest.mark.asyncio
async def test_configured_mcp_server_names_reads_flat_server_map(tmp_path: Path) -> None:
    config_file = tmp_path / "mcp.json"
    config_file.write_text(
        json.dumps(
            {
                "datahub": {"transport": "stdio", "command": "uvx", "args": ["mcp-server-datahub"]},
                "files": {"transport": "stdio", "command": "npx", "args": ["-y", "x"]},
            }
        ),
        encoding="utf-8",
    )

    with patch.object(mcp_module, "mcp_config_path", return_value=config_file):
        assert mcp_module.configured_mcp_server_names() == ["datahub", "files"]


@pytest.mark.asyncio
async def test_check_mcp_servers_reports_per_server_status(tmp_path: Path) -> None:
    config_file = tmp_path / "mcp.json"
    config_file.write_text(
        json.dumps({"mcpServers": {"datahub": {}, "broken": {}}}),
        encoding="utf-8",
    )

    async def fake_get_tools(server_name: str):
        if server_name == "broken":
            raise RuntimeError("connection refused")
        return [MagicMock(name="search"), MagicMock(name="get_entities")]

    with (
        patch.object(mcp_module, "mcp_config_path", return_value=config_file),
        patch.object(mcp_module, "get_tools_for_server", side_effect=fake_get_tools),
    ):
        statuses = await mcp_module.check_mcp_servers()

    assert len(statuses) == 2
    by_name = {status.name: status for status in statuses}
    assert by_name["datahub"].available is True
    assert by_name["datahub"].tool_count == 2
    assert by_name["broken"].available is False
    assert "connection refused" in by_name["broken"].error


def test_format_mcp_startup_lines_when_not_configured(tmp_path: Path) -> None:
    missing = tmp_path / "missing.json"
    with patch.object(mcp_module, "mcp_config_path", return_value=missing):
        lines = mcp_module.format_mcp_startup_lines([])

    assert len(lines) == 1
    assert "not configured" in lines[0]
    assert str(missing) in lines[0]


def test_format_mcp_startup_lines_lists_servers() -> None:
    lines = mcp_module.format_mcp_startup_lines(
        [
            mcp_module.McpServerStatus(name="datahub", available=True, tool_count=5),
            mcp_module.McpServerStatus(
                name="broken",
                available=False,
                error="connection refused",
            ),
        ]
    )

    assert lines[0] == "MCP servers:"
    assert "datahub: ok (5 tools)" in lines[1]
    assert "broken: unavailable (connection refused)" in lines[2]

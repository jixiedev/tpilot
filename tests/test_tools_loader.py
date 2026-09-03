from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from agent.registry import get_agent_tools
from tools import loader as loader_mod
from tools.dynamic import register_dynamic_tool_bindings, reset_dynamic_tool_bindings


@pytest.fixture(autouse=True)
def _reset_dynamic_bindings() -> None:
    reset_dynamic_tool_bindings()


@pytest.mark.asyncio
async def test_load_knowledge_tools_prefers_datahub_mcp() -> None:
    mcp_tool = MagicMock()
    mcp_tool.name = "search"

    async def _fake_get_tools(server_name: str) -> list:
        if server_name == "datahub":
            return [mcp_tool]
        return []

    with patch(
        "tools.dynamic.get_tools_for_server",
        side_effect=_fake_get_tools,
    ):
        await register_dynamic_tool_bindings()
        tools = await loader_mod.load_knowledge_tools()

    names = [t.name for t in tools]
    assert "search" in names
    assert "fetch_related_jira_tickets" in names
    assert names.index("search") > names.index("fetch_related_jira_tickets")


@pytest.mark.asyncio
async def test_load_knowledge_tools_falls_back_to_native_datahub() -> None:
    with patch(
        "tools.dynamic.get_tools_for_server",
        new_callable=AsyncMock,
        return_value=[],
    ):
        await register_dynamic_tool_bindings()
        tools = await loader_mod.load_knowledge_tools()

    names = [t.name for t in tools]
    assert "datahub_list_glossary_terms" in names
    assert "fetch_related_jira_tickets" in names
    assert not any(name == "search" for name in names)


@pytest.mark.asyncio
async def test_knowledge_catalog_identifier_replaced_by_mcp() -> None:
    native_before = [
        t.name
        for t in get_agent_tools("knowledge", "catalog")
        if t.name.startswith("datahub_")
    ]
    assert native_before

    mcp_tool = MagicMock()
    mcp_tool.name = "search"

    async def _fake_get_tools(server_name: str) -> list:
        if server_name == "datahub":
            return [mcp_tool]
        return []

    with patch(
        "tools.dynamic.get_tools_for_server",
        side_effect=_fake_get_tools,
    ):
        await register_dynamic_tool_bindings()

    catalog_names = [t.name for t in get_agent_tools("knowledge", "catalog")]
    assert catalog_names == ["search"]


def test_load_general_tools_includes_janus_equivalents() -> None:
    names = {tool.name for tool in loader_mod.load_general_tools()}
    assert {
        "bash",
        "python_execute",
        "str_replace_editor",
        "web_search",
        "planning",
    } <= names

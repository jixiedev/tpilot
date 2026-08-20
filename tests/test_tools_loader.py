from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from tools import loader as loader_mod


@pytest.mark.asyncio
async def test_load_knowledge_tools_prefers_datahub_mcp() -> None:
    mcp_tool = MagicMock()
    mcp_tool.name = "search"
    rag_tool = MagicMock()
    rag_tool.name = "fetch_related_jira_tickets"
    k8s_tool = MagicMock()
    k8s_tool.name = "k8s_list_pods"
    native_tool = MagicMock()
    native_tool.name = "datahub_list_datasets"
    s3_tool = MagicMock()
    s3_tool.name = "s3_list_objects"

    with (
        patch.object(
            loader_mod,
            "get_datahub_mcp_tools",
            new_callable=AsyncMock,
            return_value=[mcp_tool],
        ),
        patch.object(loader_mod, "datahub_tools", [native_tool]),
        patch.object(loader_mod, "s3_tools", [s3_tool]),
        patch("tools.k8s.TOOLS", [k8s_tool]),
        patch("tools.rag.TOOLS", [rag_tool]),
    ):
        tools = await loader_mod.load_knowledge_tools()

    names = [t.name for t in tools]
    assert names == [
        "search",
        "k8s_list_pods",
        "s3_list_objects",
        "fetch_related_jira_tickets",
    ]


@pytest.mark.asyncio
async def test_load_knowledge_tools_falls_back_to_native_datahub() -> None:
    rag_tool = MagicMock()
    rag_tool.name = "fetch_related_jira_tickets"
    k8s_tool = MagicMock()
    k8s_tool.name = "k8s_list_events"
    native_tool = MagicMock()
    native_tool.name = "datahub_list_glossary_terms"
    s3_tool = MagicMock()
    s3_tool.name = "s3_head_object"

    with (
        patch.object(
            loader_mod,
            "get_datahub_mcp_tools",
            new_callable=AsyncMock,
            return_value=[],
        ),
        patch.object(loader_mod, "datahub_tools", [native_tool]),
        patch.object(loader_mod, "s3_tools", [s3_tool]),
        patch("tools.k8s.TOOLS", [k8s_tool]),
        patch("tools.rag.TOOLS", [rag_tool]),
    ):
        tools = await loader_mod.load_knowledge_tools()

    names = [t.name for t in tools]
    assert names == [
        "datahub_list_glossary_terms",
        "k8s_list_events",
        "s3_head_object",
        "fetch_related_jira_tickets",
    ]


def test_load_general_tools_includes_janus_equivalents() -> None:
    names = {tool.name for tool in loader_mod.load_general_tools()}
    assert {
        "bash",
        "python_execute",
        "str_replace_editor",
        "web_search",
        "planning",
    } <= names

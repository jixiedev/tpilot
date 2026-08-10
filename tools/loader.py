"""Shared tool loading for data-plane integrations."""

from __future__ import annotations

from langchain_core.tools import BaseTool

from tools.data.hive import TOOLS as hive_tools
from tools.data.trino import TOOLS as trino_tools
from tools.external.datahub import TOOLS as datahub_tools
from tools.mcp.mcp import get_mcp_tools


async def load_data_tools() -> list[BaseTool]:
    mcp_tools = await get_mcp_tools()
    return [*mcp_tools, *datahub_tools, *hive_tools, *trino_tools]


async def load_knowledge_tools() -> list[BaseTool]:
    """Tools for knowledge-oriented agents (metadata search first)."""
    return [*datahub_tools]

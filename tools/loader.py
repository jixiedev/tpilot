"""Shared tool loading for data-plane integrations."""

from __future__ import annotations

from langchain_core.tools import BaseTool

from tools.hive import TOOLS as hive_tools
from tools.mcp.mcp import get_mcp_tools
from tools.trino import TOOLS as trino_tools


async def load_data_tools() -> list[BaseTool]:
    mcp_tools = await get_mcp_tools()
    return [*mcp_tools, *hive_tools, *trino_tools]

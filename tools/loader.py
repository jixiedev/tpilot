"""Shared tool loading for data-plane integrations."""

from __future__ import annotations

from langchain_core.tools import BaseTool

from tools.datahub_glossary import find_search_tool, make_search_glossary_term_tool
from tools.hive import TOOLS as hive_tools
from tools.mcp.mcp import get_mcp_tools
from tools.trino import TOOLS as trino_tools


async def load_data_tools() -> list[BaseTool]:
    mcp_tools = await get_mcp_tools()
    glossary_tool = make_search_glossary_term_tool(find_search_tool(mcp_tools))
    return [glossary_tool, *mcp_tools, *hive_tools, *trino_tools]

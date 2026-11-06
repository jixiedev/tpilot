"""Runtime tool registration (MCP and other async sources)."""

from __future__ import annotations

import logging

from langchain_core.tools import BaseTool

from config.agent_config import MCP_ALL_SERVERS
from tools.mcp.client import configured_mcp_server_names, get_tools_for_server

_logger = logging.getLogger(__name__)


async def load_mcp_tools_for_servers(server_names: tuple[str, ...]) -> list[BaseTool]:
    """Load tools from named MCP servers (``"*"`` = every server in mcp.json)."""
    configured = configured_mcp_server_names()
    targets: list[str] = []
    for name in server_names:
        if name == MCP_ALL_SERVERS:
            targets.extend(configured)
            continue
        targets.append(name)

    tools: list[BaseTool] = []
    seen_servers: set[str] = set()
    for server in targets:
        if server in seen_servers:
            continue
        seen_servers.add(server)
        try:
            tools.extend(await get_tools_for_server(server))
        except Exception:
            _logger.warning(
                "Failed to load MCP tools from server %r; continuing",
                server,
                exc_info=True,
            )
    return tools


async def register_dynamic_tool_bindings() -> None:
    """Register MCP tools per each agent's ``accepted_mcp``."""
    from agent.catalog import AgentCatalog

    await AgentCatalog.register_mcp_tools()


def reset_dynamic_tool_bindings() -> None:
    """Test helper: allow MCP registration to run again."""
    from agent.catalog import AgentCatalog

    AgentCatalog.reset_mcp_tools()

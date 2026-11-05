"""Runtime tool registration (MCP and other async sources)."""

from __future__ import annotations

import logging

from langchain_core.tools import BaseTool

from agent.registry import AGENTS, MCP_ALL_SERVERS
from tools.bootstrap import ensure_tools_registered
from tools.common import register_tool_binding
from tools.mcp.mcp import configured_mcp_server_names, get_tools_for_server

_logger = logging.getLogger(__name__)

_DYNAMIC_REGISTERED = False


def _format_load_error(exc: BaseException) -> str:
    """Flatten ExceptionGroup trees into a short one-line message."""
    if isinstance(exc, BaseExceptionGroup):
        parts = [_format_load_error(item) for item in exc.exceptions]
        return f"{type(exc).__name__}({'; '.join(parts)})"
    return f"{type(exc).__name__}: {exc}"


async def _load_mcp_tools_for_servers(server_names: tuple[str, ...]) -> list[BaseTool]:
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
        except Exception as exc:
            # ExceptionGroup MCP failures dump multi-page traces with exc_info=True.
            _logger.warning(
                "Failed to load MCP tools from server %r (%s); continuing",
                server,
                _format_load_error(exc),
            )
    return tools


async def register_dynamic_tool_bindings() -> None:
    """Register MCP tools per ``AgentSpec.accepted_mcp``."""
    global _DYNAMIC_REGISTERED
    if _DYNAMIC_REGISTERED:
        return

    ensure_tools_registered()

    for agent_name, spec in AGENTS.items():
        if not spec.accepted_mcp:
            continue
        for identifier, server_names in spec.accepted_mcp.items():
            tools = await _load_mcp_tools_for_servers(server_names)
            if tools and identifier in spec.mcp_replace_identifiers:
                spec.register_tools[identifier] = []
            for tool in tools:
                register_tool_binding(f"{agent_name},{identifier}", tool)

    _DYNAMIC_REGISTERED = True


def reset_dynamic_tool_bindings() -> None:
    """Test helper: allow MCP registration to run again."""
    global _DYNAMIC_REGISTERED
    _DYNAMIC_REGISTERED = False
    from tools.bootstrap import restore_register_tools_snapshot

    restore_register_tools_snapshot()

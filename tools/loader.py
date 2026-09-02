"""Shared tool loading for data-plane integrations.

Legacy helpers that resolve tools from ``AgentSpec.register_tools`` by scope
identifier after static registration and optional MCP binding.
"""

from __future__ import annotations

from langchain_core.tools import BaseTool

from agent.react.databot.tool_scopes import REGISTRY_NAME as DATABOT_REGISTRY
from agent.react.databot.tool_scopes import TOOL_ID_DEFAULT as DATABOT_DEFAULT
from agent.react.knowledge.tool_scopes import knowledge_react_tools
from agent.react.tahoe.tool_scopes import TOOL_ID_REACT, tahoe_tools
from agent.scoped_tools import tools_for_scope
from tools.dynamic import register_dynamic_tool_bindings

_GENERAL_TOOL_NAMES = frozenset(
    {"bash", "python_execute", "str_replace_editor", "web_search", "planning"}
)


def load_general_tools() -> list[BaseTool]:
    """Local coding / search / planning tools shared by Tahoe team agents."""
    return [
        tool
        for tool in tahoe_tools(TOOL_ID_REACT)
        if getattr(tool, "name", "") in _GENERAL_TOOL_NAMES
    ]


async def load_data_tools() -> list[BaseTool]:
    """Tools registered for the Databot ``default`` scope."""
    await register_dynamic_tool_bindings()
    return tools_for_scope(DATABOT_REGISTRY, DATABOT_DEFAULT)


async def load_knowledge_tools() -> list[BaseTool]:
    """Tools for the Knowledge main ReAct scope (``default`` + ``catalog``)."""
    await register_dynamic_tool_bindings()
    return knowledge_react_tools()

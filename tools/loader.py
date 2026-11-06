"""Shared tool loading for data-plane integrations.

Legacy helpers that resolve tools from ``AgentCatalog`` by scope identifier
after static registration and optional MCP binding.
"""

from __future__ import annotations

from langchain_core.tools import BaseTool

from agent.catalog import AgentCatalog
from agent.specialists.knowledge import REGISTRY_NAME as KNOWLEDGE_REGISTRY
from agent.specialists.knowledge import TOOL_ID_REACT as KNOWLEDGE_REACT
from agent.specialists.swe import REGISTRY_NAME as SWE_REGISTRY
from agent.specialists.swe import TOOL_ID_DEFAULT as SWE_DEFAULT
from tools.dynamic import register_dynamic_tool_bindings

_GENERAL_TOOL_NAMES = frozenset(
    {"bash", "python_execute", "str_replace_editor", "web_search", "planning"}
)


def load_general_tools() -> list[BaseTool]:
    """Local coding / search / planning tools shared by Tahoe team agents."""
    return [
        tool
        for tool in AgentCatalog.tools_for(SWE_REGISTRY, SWE_DEFAULT)
        if getattr(tool, "name", "") in _GENERAL_TOOL_NAMES
    ]


async def load_knowledge_tools() -> list[BaseTool]:
    """Tools for the Knowledge main ReAct scope (``default`` + ``catalog``)."""
    await register_dynamic_tool_bindings()
    return AgentCatalog.tools_for_scopes(KNOWLEDGE_REGISTRY, KNOWLEDGE_REACT)

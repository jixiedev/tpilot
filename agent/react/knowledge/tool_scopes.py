"""Knowledge agent registry scope identifiers."""

from __future__ import annotations

from langchain_core.tools import BaseTool

from agent.scoped_tools import tools_for_scope, tools_for_scopes

REGISTRY_NAME = "knowledge"

TOOL_ID_DEFAULT = "default"
TOOL_ID_CATALOG = "catalog"
# Main ReAct loop: static default tools plus catalog (native or MCP DataHub).
TOOL_ID_REACT: tuple[str, ...] = (TOOL_ID_DEFAULT, TOOL_ID_CATALOG)


def knowledge_tools(identifier: str) -> list[BaseTool]:
    return tools_for_scope(REGISTRY_NAME, identifier)


def knowledge_react_tools() -> list[BaseTool]:
    return tools_for_scopes(REGISTRY_NAME, TOOL_ID_REACT)

"""Diagnostic agent registry scope identifiers."""

from __future__ import annotations

from langchain_core.tools import BaseTool

from agent.scoped_tools import tools_for_scope

REGISTRY_NAME = "diagnostic"

TOOL_ID_DEFAULT = "default"
TOOL_ID_REACT: tuple[str, ...] = (TOOL_ID_DEFAULT,)


def diagnostic_react_tools() -> list[BaseTool]:
    return tools_for_scope(REGISTRY_NAME, TOOL_ID_DEFAULT)

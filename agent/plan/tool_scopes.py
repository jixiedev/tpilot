"""Plan agent registry scope identifiers."""

from __future__ import annotations

from langchain_core.tools import BaseTool

from agent.scoped_tools import tools_for_scope

REGISTRY_NAME = "plan"

TOOL_ID_DEFAULT = "default"
TOOL_ID_CREATE = "create"
TOOL_ID_SUBAGENT = "subagent"
TOOL_ID_ADJUST = "adjust"


def plan_tools(identifier: str) -> list[BaseTool]:
    return tools_for_scope(REGISTRY_NAME, identifier)

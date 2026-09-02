"""Tahoe agent registry scope identifiers."""

from __future__ import annotations

from langchain_core.tools import BaseTool

from agent.scoped_tools import tools_for_scope

REGISTRY_NAME = "tahoe"
TOOL_ID_REACT = "react"


def tahoe_tools(identifier: str) -> list[BaseTool]:
    return tools_for_scope(REGISTRY_NAME, identifier)

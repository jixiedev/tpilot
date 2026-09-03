"""Databot registry scope identifiers (subgraphs and default tool surface)."""

from __future__ import annotations

from langchain_core.tools import BaseTool

from agent.scoped_tools import tools_for_scope

REGISTRY_NAME = "databot"

TOOL_ID_DEFAULT = "default"
TOOL_ID_FETCH = "fetch"
TOOL_ID_SQL = "sql"
TOOL_ID_EXECUTE = "execute"
TOOL_ID_RAG = "rag"


def databot_tools(identifier: str) -> list[BaseTool]:
    """Return tools for one Databot scope (fetch / sql / execute / default / rag)."""
    return tools_for_scope(REGISTRY_NAME, identifier)

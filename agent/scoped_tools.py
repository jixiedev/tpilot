"""Resolve tool lists from the agent registry by scope identifier."""

from __future__ import annotations

from collections.abc import Sequence

from langchain_core.tools import BaseTool

from agent.registry import dedupe_tools, get_agent_tools


def tools_for_scope(registry_name: str, identifier: str) -> list[BaseTool]:
    """Return tools registered for one agent scope (``agent,identifier``)."""
    return list(get_agent_tools(registry_name, identifier))


def tools_for_scopes(registry_name: str, identifiers: Sequence[str]) -> list[BaseTool]:
    """Return the union of several scopes, de-duplicated by tool name."""
    return dedupe_tools(
        [tool for ident in identifiers for tool in get_agent_tools(registry_name, ident)]
    )


class RegistryScopedTools:
    """Mixin: set ``registry_name`` on the agent class and resolve scopes in-process."""

    registry_name: str

    @classmethod
    def tools_for_scope(cls, identifier: str) -> list[BaseTool]:
        return tools_for_scope(cls.registry_name, identifier)

    @classmethod
    def tools_for_scopes(cls, *identifiers: str) -> list[BaseTool]:
        return tools_for_scopes(cls.registry_name, identifiers)

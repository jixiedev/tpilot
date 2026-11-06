"""Shared tool helpers."""

from __future__ import annotations

import json
from collections.abc import Callable
from typing import Any, TypeVar

from langchain_core.tools import BaseTool

F = TypeVar("F", bound=Callable)

# tool_name -> optional peer tool the model may consider after a failure
_ALTERNATIVE_TOOLS: dict[str, str] = {}

# Every static tool by name; agents pick from it via ``[tools]`` in their config.
_TOOL_REGISTRY: dict[str, BaseTool] = {}


def register_tool(
    tool: BaseTool | None = None,
    *,
    key: str | None = None,
) -> Any:
    """Add ``tool`` to the registry; use as ``@register_tool`` or ``@register_tool(key=...)``.

    The registry key defaults to ``tool.name``. Pass ``key`` when two tools
    share a model-facing name (e.g. the plan agent's own ``planning`` is
    registered as ``plan.planning``). Which agents get a tool is declared in
    ``config/agents/<agent>.toml`` under ``[tools]``, by registry key.
    """
    if tool is None:
        return lambda t: register_tool(t, key=key)
    registry_key = key or getattr(tool, "name", "") or ""
    if not registry_key:
        raise ValueError(f"cannot register a tool without a name: {tool!r}")
    existing = _TOOL_REGISTRY.get(registry_key)
    if existing is not None and existing is not tool:
        raise ValueError(
            f"tool key {registry_key!r} is already registered by another tool; "
            "pass register_tool(key=...) to disambiguate"
        )
    _TOOL_REGISTRY[registry_key] = tool
    return tool


def registered_tools() -> dict[str, BaseTool]:
    """Copy of the registry key → tool mapping."""
    return dict(_TOOL_REGISTRY)


def parse_agent_identifier(agent_identifier: str) -> tuple[str, str]:
    """Split ``\"agent,identifier\"`` into agent name and tool-group id."""
    if "," not in agent_identifier:
        raise ValueError(
            f"agent_identifier must be 'agent,identifier', got {agent_identifier!r}"
        )
    agent, identifier = agent_identifier.split(",", 1)
    agent = agent.strip()
    identifier = identifier.strip()
    if not agent or not identifier:
        raise ValueError(
            f"agent_identifier must be 'agent,identifier', got {agent_identifier!r}"
        )
    return agent, identifier


def register_tool_binding(
    agent_identifier: str,
    tool: BaseTool,
    *,
    replace: bool = False,
) -> None:
    """Bind ``tool`` to an agent scope at runtime (tests, dynamic wiring).

    Static assignments belong in the agent's ``[tools]`` config instead.
    """
    from agent.catalog import AgentCatalog

    AgentCatalog.register_tool(agent_identifier, tool, replace=replace)


def alternative_tool(alternative_tool_name: str) -> Callable[[F], F]:
    """Register a heuristic plan-B tool name for the decorated function.

    Does not wrap failures. On error, ``StructuredToolError`` may surface
    ``fallback_tool`` so the LLM can decide whether to switch.
    """

    def decorator(func: F) -> F:
        _ALTERNATIVE_TOOLS[func.__name__] = alternative_tool_name
        return func

    return decorator


def lookup_alternative_tool(tool_name: str) -> str | None:
    """Return the registered plan-B tool for ``tool_name``, if any."""
    return _ALTERNATIVE_TOOLS.get(tool_name)


def find_tool(tools: list[BaseTool], name: str) -> BaseTool | None:
    """Return the first tool with ``.name == name`` or ``None`` if missing."""
    for tool in tools:
        if getattr(tool, "name", None) == name:
            return tool
    return None


def encode_tool_summary(payload: Any) -> str:
    """Serialize a tool result payload for ``ToolMessage`` content."""
    return json.dumps(payload, ensure_ascii=False)


def register_alternative_tool(tool_name: str, alternative_tool_name: str) -> None:
    """Register or overwrite a plan-B mapping (used by tests and dynamic wiring)."""
    _ALTERNATIVE_TOOLS[tool_name] = alternative_tool_name


def clear_alternative_tools() -> None:
    """Test helper: reset the alternative-tool registry."""
    _ALTERNATIVE_TOOLS.clear()

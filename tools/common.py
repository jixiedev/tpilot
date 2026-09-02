"""Shared tool helpers."""

from __future__ import annotations

import json
from collections.abc import Callable
from typing import Any, TypeVar

from langchain_core.tools import BaseTool

F = TypeVar("F", bound=Callable)

# tool_name -> optional peer tool the model may consider after a failure
_ALTERNATIVE_TOOLS: dict[str, str] = {}


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
    """Register one tool under an agent's identifier bucket."""
    from agent.registry import AGENTS

    agent, identifier = parse_agent_identifier(agent_identifier)
    if agent not in AGENTS:
        available = ", ".join(sorted(AGENTS))
        raise ValueError(f"Unknown agent {agent!r}; available: {available}")
    agent_spec = AGENTS[agent]
    bucket = agent_spec.register_tools.setdefault(identifier, [])
    if replace:
        bucket.clear()
    name = getattr(tool, "name", "") or ""
    if name and any(getattr(existing, "name", "") == name for existing in bucket):
        return
    bucket.append(tool)


def bind_tool_to_agent(agent_identifier: str) -> Callable[[BaseTool], BaseTool]:
    """Register a tool under ``agent,identifier`` when the module loads."""

    def decorator(tool: BaseTool) -> BaseTool:
        register_tool_binding(agent_identifier, tool)
        return tool

    return decorator


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

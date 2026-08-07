"""Shared tool helpers."""

from __future__ import annotations

from collections.abc import Callable
from typing import TypeVar

F = TypeVar("F", bound=Callable)

# tool_name -> optional peer tool the model may consider after a failure
_ALTERNATIVE_TOOLS: dict[str, str] = {}


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


def register_alternative_tool(tool_name: str, alternative_tool_name: str) -> None:
    """Register or overwrite a plan-B mapping (used by tests and dynamic wiring)."""
    _ALTERNATIVE_TOOLS[tool_name] = alternative_tool_name


def clear_alternative_tools() -> None:
    """Test helper: reset the alternative-tool registry."""
    _ALTERNATIVE_TOOLS.clear()

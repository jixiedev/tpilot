from __future__ import annotations

import logging
from collections.abc import Callable
from typing import Any, Union

from langchain_core.messages import AnyMessage
from pydantic import BaseModel

logger = logging.getLogger(__name__)


def tool_call_count(state: Union[list[AnyMessage], dict[str, Any], BaseModel]) -> int:
    if isinstance(state, dict):
        return state.get("tool_call_count", 0)
    if isinstance(state, list):
        return 0
    return getattr(state, "tool_call_count", 0)


def idle_rounds(state: Union[list[AnyMessage], dict[str, Any], BaseModel]) -> int:
    if isinstance(state, dict):
        return state.get("idle_rounds", 0)
    if isinstance(state, list):
        return 0
    return getattr(state, "idle_rounds", 0)


def last_ai_message(
    state: Union[list[AnyMessage], dict[str, Any], BaseModel],
    messages_key: str = "messages",
) -> AnyMessage:
    if isinstance(state, list):
        return state[-1]
    if isinstance(state, dict) and (messages := state.get(messages_key, [])):
        return messages[-1]
    if messages := getattr(state, messages_key, []):
        return messages[-1]
    raise ValueError(f"No messages found in input state to tool_edge: {state!r}")


def limited_tools_condition(
    max_steps: int = 10,
    default_outlet: str = "__end__",
    no_tool_outlet: str = "__end__",
) -> Callable[[Union[list[AnyMessage], dict[str, Any], BaseModel]], str]:
    """Route to tools while under budget; otherwise end the graph turn."""

    def tool_condition(
        state: Union[list[AnyMessage], dict[str, Any], BaseModel],
    ) -> str:
        ai_message = last_ai_message(state)
        tool_calls = getattr(ai_message, "tool_calls", None) or []

        if not tool_calls:
            return no_tool_outlet

        if tool_call_count(state) >= max_steps:
            logger.warning(
                "reached maximum tool steps (%s); routing to %s",
                max_steps,
                default_outlet,
            )
            return default_outlet

        return "tools"

    return tool_condition

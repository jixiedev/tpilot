from __future__ import annotations

import logging
from collections.abc import Callable
from typing import Any, Union

from langchain_core.messages import AnyMessage, ToolMessage
from pydantic import BaseModel

from agent.chatbot.tools import CHAT_COMPLETION_TOOL_NAME
from graph.edge import idle_rounds, latest_message, tool_call_count

logger = logging.getLogger(__name__)

DEFAULT_MAX_IDLE_ROUNDS = 3

StateLike = Union[list[AnyMessage], dict[str, Any], BaseModel]


def _tool_calls_are_chat_completion_only(tool_calls: list) -> bool:
    return bool(tool_calls) and all(
        call.get("name") == CHAT_COMPLETION_TOOL_NAME for call in tool_calls
    )


def _tool_budget_exhausted(state: StateLike, max_tool_steps: int) -> bool:
    return tool_call_count(state) >= max_tool_steps


def _chat_completion_executed(state: StateLike) -> bool:
    messages = state["messages"] if isinstance(state, dict) else getattr(state, "messages", [])
    index = len(messages) - 1
    while index >= 0:
        message = messages[index]
        if isinstance(message, ToolMessage):
            if message.name == CHAT_COMPLETION_TOOL_NAME:
                return True
            index -= 1
            continue
        if message.type == "ai":
            return False
        index -= 1
    return False


def chatbot_route_after_step(
    max_tool_steps: int = 10,
    max_idle_rounds: int = DEFAULT_MAX_IDLE_ROUNDS,
    *,
    idle_outlet: str = "step_llm",
    tools_outlet: str = "step_tools",
    end_outlet: str = "__end__",
) -> Callable[[StateLike], str]:
    """Chatbot routing: plain text cannot end a turn; chat_completion ends after tools."""

    def route(state: StateLike) -> str:
        ai_message = latest_message(state)
        tool_calls = getattr(ai_message, "tool_calls", None) or []
        budget_exhausted = _tool_budget_exhausted(state, max_tool_steps)

        if not tool_calls:
            if budget_exhausted:
                if idle_rounds(state) >= max_idle_rounds:
                    logger.warning(
                        "tool budget exhausted and reached maximum idle steps "
                        "(%s); routing to %s",
                        max_idle_rounds,
                        end_outlet,
                    )
                    return end_outlet
                return idle_outlet
            if idle_rounds(state) >= max_idle_rounds:
                logger.warning(
                    "reached maximum idle steps (%s); routing to %s",
                    max_idle_rounds,
                    end_outlet,
                )
                return end_outlet
            return idle_outlet

        if budget_exhausted:
            if _tool_calls_are_chat_completion_only(tool_calls):
                return tools_outlet
            logger.warning(
                "reached maximum tool steps (%s); routing to %s for chat_completion",
                max_tool_steps,
                idle_outlet,
            )
            return idle_outlet

        return tools_outlet

    return route


def chatbot_route_after_tools(
    *,
    step_outlet: str = "step_llm",
    end_outlet: str = "__end__",
) -> Callable[[StateLike], str]:
    """End the turn when chat_completion has been executed."""

    def route(state: StateLike) -> str:
        if _chat_completion_executed(state):
            return end_outlet
        return step_outlet

    return route

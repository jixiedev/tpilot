from __future__ import annotations

from collections.abc import Callable
from typing import Any, Union

from langchain_core.messages import AnyMessage, ToolMessage
from pydantic import BaseModel

from tools.chat import CHAT_COMPLETION_TOOL_NAME

DEFAULT_MAX_IDLE_ROUNDS = 3


def _tool_call_count(state: Union[list[AnyMessage], dict[str, Any], BaseModel]) -> int:
    if isinstance(state, dict):
        return state.get("tool_call_count", 0)
    if isinstance(state, list):
        return 0
    return getattr(state, "tool_call_count", 0)


def _idle_rounds(state: Union[list[AnyMessage], dict[str, Any], BaseModel]) -> int:
    if isinstance(state, dict):
        return state.get("idle_rounds", 0)
    if isinstance(state, list):
        return 0
    return getattr(state, "idle_rounds", 0)


def _last_ai_message(
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


def _chat_completion_executed(state: Union[list[AnyMessage], dict[str, Any], BaseModel]) -> bool:
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


def limited_tools_condition(
    max_steps: int = 10,
    default_outlet: str = "__end__",
    no_tool_outlet: str = "__end__",
) -> Callable[[Union[list[AnyMessage], dict[str, Any], BaseModel]], str]:
    """Route to tools while under budget; otherwise end the graph turn."""

    def tool_condition(
        state: Union[list[AnyMessage], dict[str, Any], BaseModel],
    ) -> str:
        ai_message = _last_ai_message(state)
        tool_calls = getattr(ai_message, "tool_calls", None) or []

        if not tool_calls:
            return no_tool_outlet

        if _tool_call_count(state) >= max_steps:
            print(
                f"⚠️ reached maximum tool steps ({max_steps}); "
                f"routing to {default_outlet}"
            )
            return default_outlet

        return "tools"

    return tool_condition


def chatbot_route_after_step(
    max_tool_steps: int = 10,
    max_idle_rounds: int = DEFAULT_MAX_IDLE_ROUNDS,
    *,
    idle_outlet: str = "step_llm",
    tools_outlet: str = "tools",
    end_outlet: str = "__end__",
) -> Callable[[Union[list[AnyMessage], dict[str, Any], BaseModel]], str]:
    """Chatbot routing: plain text cannot end a turn; chat_completion ends after tools."""

    def route(state: Union[list[AnyMessage], dict[str, Any], BaseModel]) -> str:
        ai_message = _last_ai_message(state)
        tool_calls = getattr(ai_message, "tool_calls", None) or []

        if not tool_calls:
            if _idle_rounds(state) >= max_idle_rounds:
                print(
                    f"⚠️ reached maximum idle steps ({max_idle_rounds}); "
                    f"routing to {end_outlet}"
                )
                return end_outlet
            return idle_outlet

        if _tool_call_count(state) >= max_tool_steps:
            print(
                f"⚠️ reached maximum tool steps ({max_tool_steps}); "
                f"routing to {end_outlet}"
            )
            return end_outlet

        return tools_outlet

    return route


def chatbot_route_after_tools(
    *,
    step_outlet: str = "step_llm",
    end_outlet: str = "__end__",
) -> Callable[[Union[list[AnyMessage], dict[str, Any], BaseModel]], str]:
    """End the turn when chat_completion has been executed."""

    def route(state: Union[list[AnyMessage], dict[str, Any], BaseModel]) -> str:
        if _chat_completion_executed(state):
            return end_outlet
        return step_outlet

    return route

"""Chatbot graph assembly."""

from __future__ import annotations

from langchain_core.language_models import BaseChatModel
from langgraph.graph.state import CompiledStateGraph

from agent.chatbot.prompt import (
    IDLE_CHAT_COMPLETION_PROMPT,
    NEXT_STEP_PROMPT,
    SYSTEM_PROMPT,
    TOOL_BUDGET_EXHAUSTED_PROMPT,
)
from agent.chatbot.display import print_tool_call
from agent.chatbot.routes import DEFAULT_MAX_IDLE_ROUNDS, chatbot_route_after_step, chatbot_route_after_tools
from agent.chatbot.tools import TOOLS as chatbot_tools
from graph.builder import build_react_graph
from tools.loader import load_data_tools

DEFAULT_MAX_TOOL_CALLS = 10


async def build_chat_graph(
    model: BaseChatModel,
    *,
    system_prompt: str = SYSTEM_PROMPT,
    next_step_prompt: str = NEXT_STEP_PROMPT,
    idle_nudge_prompt: str = IDLE_CHAT_COMPLETION_PROMPT,
    tool_budget_exhausted_prompt: str = TOOL_BUDGET_EXHAUSTED_PROMPT,
    max_tool_calls: int = DEFAULT_MAX_TOOL_CALLS,
    max_idle_rounds: int = DEFAULT_MAX_IDLE_ROUNDS,
) -> CompiledStateGraph:
    tools = [*await load_data_tools(), *chatbot_tools]
    return build_react_graph(
        model,
        tools,
        system_prompt=system_prompt,
        next_step_prompt=next_step_prompt,
        route_after_step=chatbot_route_after_step(
            max_tool_calls,
            max_idle_rounds=max_idle_rounds,
        ),
        route_after_tools=chatbot_route_after_tools(),
        idle_nudge_prompt=idle_nudge_prompt,
        tool_budget_exhausted_prompt=tool_budget_exhausted_prompt,
        max_tool_calls=max_tool_calls,
        on_tool_call=print_tool_call,
    )

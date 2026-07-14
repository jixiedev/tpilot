"""Chatbot graph assembly."""

from __future__ import annotations

from langchain_core.language_models import BaseChatModel
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph.state import CompiledStateGraph

from agent.chatbot.prompt import (
    CLASSIFY_TASK_PROMPT,
    IDLE_CHAT_COMPLETION_PROMPT,
    NEXT_STEP_PROMPT,
    REFINE_USER_PROFILE_PROMPT,
    TOOL_BUDGET_EXHAUSTED_PROMPT,
    ChatbotSystemPrompt,
)
from agent.chatbot.display import print_tool_call
from agent.chatbot.routes import DEFAULT_MAX_IDLE_ROUNDS, chatbot_route_after_step, chatbot_route_after_tools
from agent.chatbot.tools import TOOLS as chatbot_tools
from graph.builder import SystemPromptSpec, build_react_graph
from memory import COMPRESSION_TOOLS, CompressionConfig, make_compressor
from memory.profile import coerce_user_profile
from state.state import SessionAgentState
from tools.loader import load_data_tools

DEFAULT_MAX_TOOL_CALLS = 10

_CHATBOT_PROMPT = ChatbotSystemPrompt()


def render_chatbot_system_prompt(state: SessionAgentState) -> str:
    """Build the chatbot system prompt from the session ``user_profile``."""
    return _CHATBOT_PROMPT.with_profile(coerce_user_profile(state.get("user_profile"))).build()


async def build_chat_graph(
    model: BaseChatModel,
    *,
    system_prompt: SystemPromptSpec = render_chatbot_system_prompt,
    next_step_prompt: str = NEXT_STEP_PROMPT,
    idle_nudge_prompt: str = IDLE_CHAT_COMPLETION_PROMPT,
    tool_budget_exhausted_prompt: str = TOOL_BUDGET_EXHAUSTED_PROMPT,
    refine_user_profile_prompt: str = REFINE_USER_PROFILE_PROMPT,
    max_tool_calls: int = DEFAULT_MAX_TOOL_CALLS,
    max_idle_rounds: int = DEFAULT_MAX_IDLE_ROUNDS,
    checkpointer: BaseCheckpointSaver,
    compression_config: CompressionConfig | None = None,
    enable_compression: bool = True,
) -> CompiledStateGraph:
    tools = [*await load_data_tools(), *COMPRESSION_TOOLS, *chatbot_tools]
    compressor = make_compressor(model, compression_config) if enable_compression else None
    refine_enabled = bool(refine_user_profile_prompt and refine_user_profile_prompt.strip())
    return build_react_graph(
        model,
        tools,
        checkpointer=checkpointer,
        system_prompt=system_prompt,
        next_step_prompt=next_step_prompt,
        route_after_step=chatbot_route_after_step(
            max_tool_calls,
            max_idle_rounds=max_idle_rounds,
        ),
        route_after_tools=chatbot_route_after_tools(
            end_outlet="refine_user_profile" if refine_enabled else "__end__",
        ),
        compressor=compressor,
        refine_user_profile_prompt=refine_user_profile_prompt or None,
        classify_prompt=CLASSIFY_TASK_PROMPT,
        idle_nudge_prompt=idle_nudge_prompt,
        tool_budget_exhausted_prompt=tool_budget_exhausted_prompt,
        max_tool_calls=max_tool_calls,
        on_tool_call=print_tool_call,
    )

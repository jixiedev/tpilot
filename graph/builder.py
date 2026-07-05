"""LangGraph ReAct builder for conversational chat."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import SystemMessage
from langchain_core.tools import BaseTool
from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import CompiledStateGraph

from graph.edge import (
    DEFAULT_MAX_IDLE_ROUNDS,
    chatbot_route_after_step,
    chatbot_route_after_tools,
)
from graph.node import CounterToolNode, make_step_agent_node
from state.agent_state import AgentState
from tools.chat import TOOLS as chatbot_tools
from tools.hive import TOOLS as hive_tools
from tools.mcp.mcp import get_mcp_tools
from tools.trino import TOOLS as trino_tools

DEFAULT_MAX_TOOL_CALLS = 10


def _has_system_prompt(messages, system_prompt: str) -> bool:
    return any(
        isinstance(message, SystemMessage) and message.content == system_prompt
        for message in messages
    )


def make_system_prompt_node(system_prompt: str) -> Callable[[AgentState], dict[str, Any]]:
    """Inject the session system prompt once; no model call."""

    def system_prompt_node(state: AgentState) -> dict[str, Any]:
        if not system_prompt.strip():
            return {}
        if _has_system_prompt(state["messages"], system_prompt):
            return {}
        return {"messages": [SystemMessage(content=system_prompt)]}

    return system_prompt_node


async def load_data_tools() -> list[BaseTool]:
    mcp_tools = await get_mcp_tools()
    return [*mcp_tools, *hive_tools, *trino_tools]


async def load_all_tools() -> list[BaseTool]:
    return [*await load_data_tools(), *chatbot_tools]


async def build_chat_graph(
    model: BaseChatModel,
    *,
    system_prompt: str,
    next_step_prompt: str,
    idle_nudge_prompt: str = "",
    max_tool_calls: int = DEFAULT_MAX_TOOL_CALLS,
    max_idle_rounds: int = DEFAULT_MAX_IDLE_ROUNDS,
) -> CompiledStateGraph:
    tools = await load_all_tools()
    bound_model = model.bind_tools(tools)
    route_after_step = chatbot_route_after_step(
        max_tool_calls,
        max_idle_rounds=max_idle_rounds,
    )
    route_after_tools = chatbot_route_after_tools()

    graph = StateGraph(AgentState)
    graph.add_node("system_prompt", make_system_prompt_node(system_prompt))
    graph.add_node(
        "step_llm",
        make_step_agent_node(
            bound_model,
            next_step_prompt,
            idle_nudge_prompt=idle_nudge_prompt,
        ),
    )
    graph.add_node("tools", CounterToolNode(tools))
    graph.add_edge(START, "system_prompt")
    graph.add_edge("system_prompt", "step_llm")
    graph.add_conditional_edges("step_llm", route_after_step)
    graph.add_conditional_edges("tools", route_after_tools)
    return graph.compile()

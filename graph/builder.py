"""LangGraph ReAct builder for conversational chat."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.tools import BaseTool
from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import CompiledStateGraph

from graph.edge import limited_tools_condition
from graph.node import CounterToolNode
from state.agent_state import AgentState
from tools.hive import TOOLS as hive_tools
from tools.mcp.mcp import get_mcp_tools
from tools.trino import TOOLS as trino_tools

DEFAULT_MAX_TOOL_CALLS = 10


def make_agent_node(model: BaseChatModel) -> Callable[[AgentState], dict[str, Any]]:
    def agent(state: AgentState) -> dict[str, Any]:
        response = model.invoke(state["messages"])
        return {"messages": [response]}

    return agent


async def load_all_tools() -> list[BaseTool]:
    mcp_tools = await get_mcp_tools()
    return [*mcp_tools, *hive_tools, *trino_tools]


async def build_chat_graph(
    model: BaseChatModel,
    *,
    max_tool_calls: int = DEFAULT_MAX_TOOL_CALLS,
) -> CompiledStateGraph:
    tools = await load_all_tools()
    bound_model = model.bind_tools(tools)
    route = limited_tools_condition(max_tool_calls, END, END)

    graph = StateGraph(AgentState)
    graph.add_node("agent", make_agent_node(bound_model))
    graph.add_node("tools", CounterToolNode(tools))
    graph.add_edge(START, "agent")
    graph.add_conditional_edges("agent", route)
    graph.add_edge("tools", "agent")
    return graph.compile()

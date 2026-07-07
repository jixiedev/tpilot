"""Generic LangGraph ReAct builder."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import SystemMessage
from langchain_core.tools import BaseTool
from langgraph.graph import START, StateGraph
from langgraph.graph.state import CompiledStateGraph

from graph.node import CounterToolNode, make_step_agent_node
from state.state import AgentState


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


def build_react_graph(
    model: BaseChatModel,
    tools: list[BaseTool],
    *,
    system_prompt: str,
    next_step_prompt: str,
    route_after_step: Callable[[AgentState], str],
    route_after_tools: Callable[[AgentState], str],
    idle_nudge_prompt: str = "",
    tool_budget_exhausted_prompt: str = "",
    max_tool_calls: int = 10,
) -> CompiledStateGraph:
    """Compile a system_prompt → step_llm ↔ tools ReAct loop."""
    bound_model = model.bind_tools(tools)

    graph = StateGraph(AgentState)
    graph.add_node("system_prompt", make_system_prompt_node(system_prompt))
    graph.add_node(
        "step_llm",
        make_step_agent_node(
            bound_model,
            next_step_prompt,
            idle_nudge_prompt=idle_nudge_prompt,
            tool_budget_exhausted_prompt=tool_budget_exhausted_prompt,
            max_tool_calls=max_tool_calls,
        ),
    )
    graph.add_node("tools", CounterToolNode(tools))
    graph.add_edge(START, "system_prompt")
    graph.add_edge("system_prompt", "step_llm")
    graph.add_conditional_edges("step_llm", route_after_step)
    graph.add_conditional_edges("tools", route_after_tools)
    return graph.compile()

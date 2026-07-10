"""Generic LangGraph ReAct builder."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import SystemMessage
from langchain_core.tools import BaseTool
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph import START, StateGraph
from langgraph.graph.state import CompiledStateGraph

from graph.node import StepToolsNode, ToolCallListener, make_step_llm_node
from state.state import SessionAgentState


def _has_system_prompt(messages, system_prompt: str) -> bool:
    return any(
        isinstance(message, SystemMessage) and message.content == system_prompt
        for message in messages
    )


def make_inject_system_prompt_node(system_prompt: str) -> Callable[[SessionAgentState], dict[str, Any]]:
    """Inject the session system prompt once; no model call."""

    def inject_system_prompt(state: SessionAgentState) -> dict[str, Any]:
        if not system_prompt.strip():
            return {}
        if _has_system_prompt(state["messages"], system_prompt):
            return {}
        return {"messages": [SystemMessage(content=system_prompt)]}

    return inject_system_prompt


def build_react_graph(
    model: BaseChatModel,
    tools: list[BaseTool],
    *,
    compressor,
    checkpointer: BaseCheckpointSaver,
    system_prompt: str,
    next_step_prompt: str,
    route_after_step: Callable[[SessionAgentState], str],
    route_after_tools: Callable[[SessionAgentState], str],
    idle_nudge_prompt: str = "",
    tool_budget_exhausted_prompt: str = "",
    max_tool_calls: int = 10,
    on_tool_call: ToolCallListener | None = None,
) -> CompiledStateGraph:
    """Compile an inject_system_prompt → step_llm ↔ step_tools ReAct loop."""
    model_with_tools = model.bind_tools(tools)

    graph = StateGraph(SessionAgentState)
    if compressor:
        graph.add_node("compressor", compressor)
    graph.add_node("inject_system_prompt", make_inject_system_prompt_node(system_prompt))
    graph.add_node(
        "step_llm",
        make_step_llm_node(
            model_with_tools,
            next_step_prompt,
            idle_nudge_prompt=idle_nudge_prompt,
            tool_budget_exhausted_prompt=tool_budget_exhausted_prompt,
            max_tool_calls=max_tool_calls,
        ),
    )
    graph.add_node("step_tools", StepToolsNode(tools, on_tool_call=on_tool_call))
    if compressor:
        graph.add_edge(START, "compressor")
        graph.add_edge("compressor", "inject_system_prompt")
    else:
        graph.add_edge(START, "inject_system_prompt")
    graph.add_edge("inject_system_prompt", "step_llm")
    graph.add_conditional_edges("step_llm", route_after_step)
    graph.add_conditional_edges("step_tools", route_after_tools)
    return graph.compile(checkpointer=checkpointer)

"""Generic LangGraph ReAct builder (shared topology only)."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import SystemMessage
from langchain_core.tools import BaseTool
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import CompiledStateGraph
from langgraph.types import RetryPolicy

from graph.error_recovery import (
    default_tool_retry_policy,
    make_step_tools_error_handler,
)
from graph.node import (
    LlmStartListener,
    LlmStepListener,
    StepToolsNode,
    ToolCallListener,
    ToolResultListener,
    make_step_llm_node,
)
from state.state import SessionAgentState

# Static prompt string, or a callable that renders from the current state (e.g. user profile).
SystemPromptSpec = str | Callable[[SessionAgentState], str]
StateNode = Callable[[SessionAgentState], dict[str, Any]]


def _resolve_system_prompt(system_prompt: SystemPromptSpec, state: SessionAgentState) -> str:
    if callable(system_prompt):
        return system_prompt(state)
    return system_prompt


def _has_system_prompt(messages, system_prompt: str) -> bool:
    return any(
        isinstance(message, SystemMessage) and message.content == system_prompt
        for message in messages
    )


def make_inject_system_prompt_node(
    system_prompt: SystemPromptSpec,
) -> StateNode:
    """Inject the session system prompt once; no model call."""

    def inject_system_prompt(state: SessionAgentState) -> dict[str, Any]:
        content = _resolve_system_prompt(system_prompt, state)
        if not content.strip():
            return {}
        if _has_system_prompt(state["messages"], content):
            return {}
        return {"messages": [SystemMessage(content=content)]}

    return inject_system_prompt


def build_react_graph(
    model: BaseChatModel,
    tools: list[BaseTool],
    *,
    checkpointer: BaseCheckpointSaver,
    system_prompt: SystemPromptSpec,
    next_step_prompt: str,
    route_after_step: Callable[[SessionAgentState], str],
    route_after_tools: Callable[[SessionAgentState], str],
    compressor: StateNode | None = None,
    refine_user_profile_node: StateNode | None = None,
    idle_nudge_prompt: str = "",
    tool_budget_exhausted_prompt: str = "",
    max_tool_calls: int = 10,
    tool_retry_policy: RetryPolicy | None = None,
    on_tool_call: ToolCallListener | None = None,
    on_tool_result: ToolResultListener | None = None,
    on_llm_start: LlmStartListener | None = None,
    on_llm_step: LlmStepListener | None = None,
) -> CompiledStateGraph:
    """Compile inject_system_prompt → step_llm ↔ step_tools.

    Agent-specific nodes (e.g. profile refine) are optional callables supplied by
    the agent layer; this builder only wires shared ReAct topology.

    When ``compressor`` is set, it runs at turn start and after every tool batch.

    When ``refine_user_profile_node`` is set, agents should route turn completion
    to ``refine_user_profile``, which then ends the turn.
    """
    model_with_tools = model.bind_tools(tools)

    graph = StateGraph(SessionAgentState)
    if compressor:
        graph.add_node("compress_on_start", compressor)
        graph.add_node("compress_after_tools", compressor)
    graph.add_node("inject_system_prompt", make_inject_system_prompt_node(system_prompt))
    graph.add_node(
        "step_llm",
        make_step_llm_node(
            model_with_tools,
            next_step_prompt,
            idle_nudge_prompt=idle_nudge_prompt,
            tool_budget_exhausted_prompt=tool_budget_exhausted_prompt,
            max_tool_calls=max_tool_calls,
            on_llm_start=on_llm_start,
            on_llm_step=on_llm_step,
        ),
    )
    graph.add_node(
        "step_tools",
        StepToolsNode(
            tools,
            on_tool_call=on_tool_call,
            on_tool_result=on_tool_result,
        ),
        retry_policy=tool_retry_policy or default_tool_retry_policy(),
        error_handler=make_step_tools_error_handler(),
    )
    if refine_user_profile_node is not None:
        graph.add_node("refine_user_profile", refine_user_profile_node)

    if compressor:
        graph.add_edge(START, "compress_on_start")
        graph.add_edge("compress_on_start", "inject_system_prompt")
        graph.add_edge("step_tools", "compress_after_tools")
        graph.add_conditional_edges("compress_after_tools", route_after_tools)
    else:
        graph.add_edge(START, "inject_system_prompt")
        graph.add_conditional_edges("step_tools", route_after_tools)

    graph.add_edge("inject_system_prompt", "step_llm")

    if refine_user_profile_node is not None:
        graph.add_edge("refine_user_profile", END)

    graph.add_conditional_edges("step_llm", route_after_step)
    return graph.compile(checkpointer=checkpointer)

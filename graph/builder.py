"""Generic LangGraph ReAct builder (shared topology only)."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import AIMessage, SystemMessage
from langchain_core.tools import BaseTool
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.graph.state import CompiledStateGraph
from langgraph.types import RetryPolicy

from graph.error_recovery import (
    default_tool_retry_policy,
    make_step_action_error_handler,
)
from graph.node import StepActionNode, make_step_reason_node
from state.state import SessionAgentState

STEP_REASON = "step_reason"
STEP_ACTION = "step_action"

StateNode = Callable[[SessionAgentState], dict[str, Any]]
# Any MessagesState subclass works as the inner ReAct subgraph's state
# schema — the builder only adds ``messages`` and a couple of ReAct
# bookkeeping keys. Databot subgraphs pass ``DatabotState`` so they
# can write to the staged pipeline's fields (``review_cards``,
# ``cards_reasons``, ``stage``, etc.) directly via ``Command(update=...)``
# without LangGraph silently dropping unknown keys.
InnerStateClass = type[MessagesState]


def static_system_prompt(content: str) -> Callable[[SessionAgentState], str]:
    """Wrap a fixed prompt string as a state renderer."""

    def render(_state: SessionAgentState) -> str:
        return content

    return render


def _has_system_prompt(messages, system_prompt: str) -> bool:
    return any(
        isinstance(message, SystemMessage) and message.content == system_prompt
        for message in messages
    )


def make_inject_system_prompt_node(
    system_prompt: Callable[[SessionAgentState], str],
) -> StateNode:
    """Inject the session system prompt once; no model call."""

    def inject_system_prompt(state: SessionAgentState) -> dict[str, Any]:
        content = system_prompt(state)
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
    system_prompt: Callable[[SessionAgentState], str],
    next_step_prompt: str,
    route_after_reason: Callable[[SessionAgentState], str],
    route_after_action: Callable[[SessionAgentState], str],
    compressor: StateNode | None = None,
    include_profile_refinement: bool = False,
    refine_user_profile_node: StateNode | None = None,
    post_refine_outlet: str = "__end__",
    idle_nudge_prompt: str = "",
    tool_budget_exhausted_prompt: str = "",
    max_tool_calls: int = 10,
    tool_retry_policy: RetryPolicy | None = None,
    on_tool_call: Callable[[str, dict[str, Any]], None] | None = None,
    on_tool_result: Callable[[str, Any], None] | None = None,
    on_reason_start: Callable[[int, int, int], None] | None = None,
    on_reason_step: Callable[[AIMessage], None] | None = None,
    persist_plain_text: bool = True,
    state_class: InnerStateClass = SessionAgentState,
) -> CompiledStateGraph:
    """Compile inject_system_prompt → step_reason ↔ step_action.

    Agent-specific nodes (e.g. profile refine) are optional callables supplied by
    the agent layer; this builder only wires shared ReAct topology.

    When ``compressor`` is set, it runs at turn start and after every action batch.

    When ``include_profile_refinement`` is True and ``refine_user_profile_node``
    is supplied, agents should route turn completion to ``refine_user_profile``,
    then ``post_refine_outlet`` (default ``__end__``). Subgraphs and other inner
    ReAct loops default to ``include_profile_refinement=False``.

    ``state_class`` is the ``MessagesState`` subclass used as the
    subgraph's state schema. The default ``SessionAgentState`` works
    for Tahoe base. Databot subgraphs pass ``DatabotState`` so that
    ``Command(update=...)`` writes to databot fields (``review_cards``,
    ``cards_reasons``, ``stage``, etc.) actually land in the inner
    state instead of being silently dropped by LangGraph 1.2 because
    the key is not in the schema.
    """
    model_with_tools = model.bind_tools(tools)

    graph = StateGraph(state_class)
    if compressor:
        graph.add_node("compress_on_start", compressor)
        graph.add_node("compress_after_action", compressor)
    graph.add_node("inject_system_prompt", make_inject_system_prompt_node(system_prompt))
    graph.add_node(
        STEP_REASON,
        make_step_reason_node(
            model_with_tools,
            next_step_prompt,
            idle_nudge_prompt=idle_nudge_prompt,
            tool_budget_exhausted_prompt=tool_budget_exhausted_prompt,
            max_tool_calls=max_tool_calls,
            on_reason_start=on_reason_start,
            on_reason_step=on_reason_step,
            persist_plain_text=persist_plain_text,
        ),
    )
    graph.add_node(
        STEP_ACTION,
        StepActionNode(
            tools,
            on_tool_call=on_tool_call,
            on_tool_result=on_tool_result,
        ),
        retry_policy=tool_retry_policy or default_tool_retry_policy(),
        error_handler=make_step_action_error_handler(),
    )
    if include_profile_refinement and refine_user_profile_node is not None:
        graph.add_node("refine_user_profile", refine_user_profile_node)

    inject_end_target = END if post_refine_outlet == "__end__" else post_refine_outlet
    has_refine = include_profile_refinement and refine_user_profile_node is not None
    if has_refine:
        graph.add_edge("refine_user_profile", inject_end_target)

    if compressor:
        graph.add_edge(START, "compress_on_start")
        graph.add_edge("compress_on_start", "inject_system_prompt")
        graph.add_edge(STEP_ACTION, "compress_after_action")
        graph.add_conditional_edges("compress_after_action", route_after_action)
    else:
        graph.add_edge(START, "inject_system_prompt")
        graph.add_conditional_edges(STEP_ACTION, route_after_action)

    graph.add_edge("inject_system_prompt", STEP_REASON)

    graph.add_conditional_edges(STEP_REASON, route_after_reason)
    return graph.compile(checkpointer=checkpointer)

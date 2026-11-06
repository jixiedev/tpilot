"""Generic LangGraph ReAct builder (shared topology only)."""

from __future__ import annotations

from collections.abc import Callable, Mapping
from dataclasses import dataclass
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.tools import BaseTool
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.graph.state import CompiledStateGraph
from langgraph.types import RetryPolicy

from agent.listener import ListenerHub
from agent.router import CompletionToolRouter
from graph.error_recovery import (
    default_tool_retry_policy,
    make_step_action_error_handler,
)
from graph.node import StepActionNode, make_step_reason_node
from memory.compress import ContextCompressor
from graph.state import ReactAgentState

STEP_REASON = "step_reason"
STEP_ACTION = "step_action"

# Any MessagesState subclass works as the inner ReAct subgraph's state
# schema — the builder only adds ``messages`` and a couple of ReAct
# bookkeeping keys. Databot layer ReAct uses :class:`DatabotReactState` with separate I/O schemas.
InnerStateClass = type[MessagesState]

REACT_TURN_INIT = "react_turn_init"
COMPRESS_ON_START = "compress_on_start"
COMPRESS_AFTER_ACTION = "compress_after_action"


@dataclass(frozen=True)
class ReactLoopSpec:
    """Step prompts and tool budget for one ReAct loop."""

    next_step_prompt: str
    idle_nudge_prompt: str = ""
    tool_budget_exhausted_prompt: str = ""
    max_tool_calls: int = 10

    @classmethod
    def from_run_context(
        cls, run_context: Mapping[str, Any], *, default_max_tool_calls: int = 10
    ) -> ReactLoopSpec:
        """Read ``next_step`` / nudge / budget prompts and ``max_tool_calls``."""
        from config.agent_config import AgentConfig

        return cls(
            next_step_prompt=AgentConfig.as_str(run_context, "next_step"),
            idle_nudge_prompt=AgentConfig.as_str(run_context, "idle_nudge_prompt"),
            tool_budget_exhausted_prompt=AgentConfig.as_str(
                run_context, "tool_budget_exhausted_prompt"
            ),
            max_tool_calls=AgentConfig.as_int(
                run_context, "max_tool_calls", default_max_tool_calls
            ),
        )


@dataclass(frozen=True)
class ReactStateSpec:
    """State schema of the ReAct subgraph.

    ``state_class`` is any ``MessagesState`` subclass. Databot layers pass
    :class:`DatabotReactState` with separate I/O schemas and a ``turn_init``
    node that resets per-layer counters.
    """

    state_class: InnerStateClass = ReactAgentState
    input_schema: type | None = None
    output_schema: type | None = None
    turn_init: Callable[..., dict[str, Any]] | None = None


def build_react_graph(
    model: BaseChatModel,
    tools: list[BaseTool],
    *,
    router: CompletionToolRouter,
    loop: ReactLoopSpec,
    state: ReactStateSpec = ReactStateSpec(),
    checkpointer: BaseCheckpointSaver | None = None,
    listener: ListenerHub | None = None,
    compressor: ContextCompressor | None = None,
    tool_retry_policy: RetryPolicy | None = None,
) -> CompiledStateGraph:
    """Compile START → [turn_init] → [compress] → step_reason ↔ step_action.

    The initial state is assumed to already contain the session system prompt.
    When ``compressor`` is set it runs at turn start and after every action batch.
    ``step_reason`` calls ``model`` with ``tools`` bound, and the unbound ``model``
    once ``loop.max_tool_calls`` is reached, so a loop at budget ends on text.
    """
    graph = StateGraph(
        state.state_class,
        input_schema=state.input_schema,
        output_schema=state.output_schema,
    )
    graph.add_node(
        STEP_REASON,
        make_step_reason_node(
            model.bind_tools(tools),
            loop.next_step_prompt,
            idle_nudge_prompt=loop.idle_nudge_prompt,
            tool_budget_exhausted_prompt=loop.tool_budget_exhausted_prompt,
            max_tool_calls=loop.max_tool_calls,
            listener=listener,
            final_model=model,
        ),
    )
    graph.add_node(
        STEP_ACTION,
        StepActionNode(tools, listener=listener),
        retry_policy=tool_retry_policy or default_tool_retry_policy(),
        error_handler=make_step_action_error_handler(),
    )

    # Entry chain: optional turn init, then optional compression, then reason.
    entry: list[str] = []
    if state.turn_init is not None:
        graph.add_node(REACT_TURN_INIT, state.turn_init)
        entry.append(REACT_TURN_INIT)
    if compressor is not None:
        graph.add_node(COMPRESS_ON_START, compressor)
        entry.append(COMPRESS_ON_START)
    for src, dst in zip([START, *entry], [*entry, STEP_REASON]):
        graph.add_edge(src, dst)

    if compressor is not None:
        graph.add_node(COMPRESS_AFTER_ACTION, compressor)
        graph.add_edge(STEP_ACTION, COMPRESS_AFTER_ACTION)
        graph.add_conditional_edges(COMPRESS_AFTER_ACTION, router.route_after_action())
    else:
        graph.add_conditional_edges(STEP_ACTION, router.route_after_action())

    graph.add_conditional_edges(STEP_REASON, router.route_after_reason())
    return graph.compile(checkpointer=checkpointer)

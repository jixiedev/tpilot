"""Databot outer graph — state machine with ReAct subgraphs per stage."""

from __future__ import annotations

import logging
from collections.abc import Callable
from pathlib import Path
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import HumanMessage
from langchain_core.tools import BaseTool
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import CompiledStateGraph

from agent.react.databot._constants import (
    NODE_END_WITH_REFUSAL,
    NODE_END_WITH_SUMMARY,
    NODE_EXECUTE_SQL,
    NODE_FETCH_CARDS,
    NODE_GATE_CARDS,
    NODE_GATE_SQL,
    NODE_GENERATE_SQL,
    NODE_INJECT_SYSTEM_PROMPT,
    NODE_PREPARE_CARDS_FOR_GATE,
    NODE_ROUTE_MAP,
    NODE_WRITE_CARDS_ARTIFACT,
    NODE_WRITE_SQL_ARTIFACT,
    STAGE_DONE,
    STAGE_EXECUTE,
    STAGE_FETCH,
    STAGE_GATE_CARDS,
    STAGE_GATE_SQL,
    STAGE_SQL,
    VALID_STAGES,
)
from agent.react.databot.execute import make_execute_sql_node
from agent.react.databot.gates import make_cards_gate_node, make_sql_gate_node
from agent.react.databot.profile_persistence import make_persist_turn_artifact_node
from agent.react.databot.prompts.system import SYSTEM_PROMPT as DATABOT_SYSTEM_PROMPT
from agent.react.databot.state import DatabotState, fresh_turn_state_defaults
from agent.react.databot.subgraphs import build_fetch_cards_subgraph, build_generate_sql_subgraph
from agent.react.databot.stage_prep import make_prepare_cards_for_gate_node
from agent.react.databot.turn_summary import make_turn_summary_node
from agent.react.databot.tool_scopes import (
    databot_tools,
    TOOL_ID_EXECUTE,
    TOOL_ID_FETCH,
    TOOL_ID_SQL,
)
from graph.builder import make_inject_system_prompt_node, SystemPromptSpec
from tools.bootstrap import ensure_tools_registered
from tools.common import find_tool

logger = logging.getLogger(__name__)


DEFAULT_STAGE_MAX_TOOL_CALLS = 8

_AFTER_GATE_CARDS_ROUTES = {
    NODE_END_WITH_REFUSAL: NODE_END_WITH_REFUSAL,
    NODE_FETCH_CARDS: NODE_FETCH_CARDS,
    NODE_WRITE_CARDS_ARTIFACT: NODE_WRITE_CARDS_ARTIFACT,
    NODE_END_WITH_SUMMARY: NODE_END_WITH_SUMMARY,
}

_AFTER_GATE_SQL_ROUTES = {
    NODE_END_WITH_REFUSAL: NODE_END_WITH_REFUSAL,
    NODE_GENERATE_SQL: NODE_GENERATE_SQL,
    NODE_WRITE_SQL_ARTIFACT: NODE_WRITE_SQL_ARTIFACT,
    NODE_END_WITH_SUMMARY: NODE_END_WITH_SUMMARY,
}


_NON_HUMAN_MESSAGE_TYPES = frozenset(
    {"remove", "tool", "ai", "system", "function", "chat"},
)
_TRAILING_REPLAY_ARTIFACT_TYPES = frozenset({"remove", "tool", "function"})


def _message_type(message: Any) -> str | None:
    if isinstance(message, dict):
        return message.get("type")
    return getattr(message, "type", None)


def _message_is_replayed(message: Any) -> bool:
    if isinstance(message, dict):
        if message.get("replayed"):
            return True
        kwargs = message.get("additional_kwargs") or {}
        return bool(kwargs.get("replayed"))
    kwargs = getattr(message, "additional_kwargs", None) or {}
    return bool(kwargs.get("replayed"))


def _message_is_human(message: Any) -> bool:
    msg_type = _message_type(message)
    if msg_type in _NON_HUMAN_MESSAGE_TYPES:
        return False
    if isinstance(message, HumanMessage):
        return not _message_is_replayed(message)
    if msg_type == "human":
        return not _message_is_replayed(message)
    if isinstance(message, dict):
        role = message.get("role")
        is_human = role in ("user", "human") or message.get("type") == "human"
        return is_human and not _message_is_replayed(message)
    return False


def _trailing_human_wants_new_turn(state: DatabotState) -> bool:
    """True when the latest message is a new user turn (web chat follow-up).

    The CLI calls ``prepare_turn_input`` with a fresh partial state each
    time, but the CopilotKit / AG-UI path appends ``HumanMessage``s to the
    checkpoint and re-invokes with ``stage`` still ``"done"``. Without this
    guard the router sends those runs straight to ``end_with_summary``.

    Replay paths may append ``RemoveMessage`` / ``ToolMessage`` /
    ``FunctionMessage`` after the user text; those are skipped when scanning
    backward. Replayed user messages (``additional_kwargs.replayed``) do not
    count as a new turn.
    """
    messages = state.get("messages") or []
    if not messages:
        return False
    for message in reversed(messages):
        if _message_type(message) in _TRAILING_REPLAY_ARTIFACT_TYPES:
            continue
        return _message_is_human(message)
    return False


def make_databot_entry_node(
    system_prompt: SystemPromptSpec,
) -> Callable[[DatabotState], dict[str, Any]]:
    """Inject the system prompt and reset turn fields for web follow-ups."""
    inject = make_inject_system_prompt_node(system_prompt)

    def entry(state: DatabotState) -> dict[str, Any]:
        patch: dict[str, Any] = dict(inject(state) or {})
        stage = state.get("stage") or STAGE_FETCH
        if _trailing_human_wants_new_turn(state) and stage == STAGE_DONE:
            patch.update(fresh_turn_state_defaults())
        return patch

    return entry


def _stage_route(state: DatabotState) -> str:
    """Pick the next node by ``stage``."""
    stage = state.get("stage") or STAGE_FETCH
    if not isinstance(stage, str) or stage not in VALID_STAGES:
        return NODE_FETCH_CARDS
    if stage == STAGE_FETCH:
        return NODE_FETCH_CARDS
    if stage == STAGE_GATE_CARDS:
        return NODE_GATE_CARDS
    if stage == STAGE_SQL:
        return NODE_WRITE_CARDS_ARTIFACT
    if stage == STAGE_GATE_SQL:
        return NODE_GATE_SQL
    if stage == STAGE_EXECUTE:
        return NODE_WRITE_SQL_ARTIFACT
    if stage == STAGE_DONE:
        if _trailing_human_wants_new_turn(state):
            return NODE_FETCH_CARDS
        return NODE_END_WITH_SUMMARY
    logger.warning("databot outer graph: unknown stage %r; routing to end", stage)
    return NODE_END_WITH_SUMMARY


def _after_gate_cards(state: DatabotState) -> str:
    """Decide where to go after the cards gate node returns."""
    if state.get("halt_reason"):
        return NODE_END_WITH_REFUSAL
    return _stage_route(state)


def _after_gate_sql(state: DatabotState) -> str:
    if state.get("halt_reason"):
        return NODE_END_WITH_REFUSAL
    stage = state.get("stage") or STAGE_FETCH
    if stage == STAGE_SQL:
        return NODE_GENERATE_SQL
    return _stage_route(state)


def _sql_stage_contract_met(state: DatabotState) -> bool:
    draft = (state.get("draft_sql") or "").strip()
    reasons = state.get("sql_reasons") or {}
    return bool(draft) and bool(reasons)


def _after_generate_sql(state: DatabotState) -> str:
    """Break sql↔gate loops when the subgraph exits without filling state."""
    stage = state.get("stage") or STAGE_FETCH
    if stage == STAGE_SQL and not _sql_stage_contract_met(state):
        logger.warning(
            "generate_sql subgraph exited without draft_sql + sql_reasons; "
            "routing to gate_sql",
        )
        return NODE_GATE_SQL
    return _stage_route(state)


def _end_with_refusal_node() -> Callable[[DatabotState], dict[str, Any]]:
    def end_with_refusal(state: DatabotState) -> dict[str, Any]:
        from langchain_core.messages import AIMessage

        reason = (state.get("halt_reason") or "").strip() or "user halted"
        text = (
            f"Databot turn halted at user request: {reason}. "
            "No SQL was executed and no profile artifact was written."
        )
        return {"messages": [AIMessage(content=text)], "stage": STAGE_DONE}

    return end_with_refusal


# ---------------------------------------------------------------------------
# Tool composition
# ---------------------------------------------------------------------------

def _build_stage_tool_lists() -> tuple[list[BaseTool], list[BaseTool], BaseTool | None]:
    """Load per-stage tool lists from ``AgentSpec.register_tools`` identifiers."""
    ensure_tools_registered()
    fetch_tools = databot_tools(TOOL_ID_FETCH)
    sql_tools = databot_tools(TOOL_ID_SQL)
    execute_tools = databot_tools(TOOL_ID_EXECUTE)

    if find_tool(fetch_tools, "fetch_related_models") is None:
        raise KeyError(
            "databot: fetch_related_models missing — register under identifier 'fetch'"
        )
    if find_tool(fetch_tools, "commit_cards") is None:
        raise KeyError(
            "databot: commit_cards missing — register under identifier 'fetch'"
        )
    if find_tool(fetch_tools, "chat_completion") is None:
        raise KeyError("databot: chat_completion missing from identifier 'fetch'")
    if find_tool(sql_tools, "trino_explain") is None:
        raise KeyError(
            "databot: trino_explain missing from identifier 'sql' — "
            "the SQL stage needs it to validate drafted SQL via EXPLAIN"
        )

    trino_run = find_tool(execute_tools, "trino_run_query")
    if trino_run is None:
        raise KeyError(
            "databot: trino_run_query missing — register under identifier 'execute'"
        )
    return fetch_tools, sql_tools, trino_run


# ---------------------------------------------------------------------------
# Public builder
# ---------------------------------------------------------------------------

def build_databot_graph(
    model: BaseChatModel,
    *,
    checkpointer: BaseCheckpointSaver,
    system_prompt: SystemPromptSpec = DATABOT_SYSTEM_PROMPT,
    max_tool_calls: int = DEFAULT_STAGE_MAX_TOOL_CALLS,
    profile_dir: Path | None = None,
) -> CompiledStateGraph:
    """Compile the Databot v2 state machine.

    Per-stage tool scopes are resolved from the registry (`fetch`, `sql`,
    `execute` identifiers) via ``agent.react.databot.tool_scopes``.
    """
    fetch_tools, sql_tools, trino_run_query = _build_stage_tool_lists()

    fetch_subgraph = build_fetch_cards_subgraph(
        model,
        fetch_tools,
        checkpointer=checkpointer,
        max_tool_calls=max_tool_calls,
        max_idle_rounds=1,  # one plain-text reply ends the stage subgraph
    )
    sql_subgraph = build_generate_sql_subgraph(
        model,
        sql_tools,
        checkpointer=checkpointer,
        max_tool_calls=max_tool_calls,
        max_idle_rounds=1,
    )

    graph = StateGraph(DatabotState)
    graph.add_node(NODE_INJECT_SYSTEM_PROMPT, make_databot_entry_node(system_prompt))
    graph.add_node(NODE_FETCH_CARDS, fetch_subgraph)
    graph.add_node(
        NODE_PREPARE_CARDS_FOR_GATE,
        make_prepare_cards_for_gate_node(model),
    )
    graph.add_node(NODE_GATE_CARDS, make_cards_gate_node())
    graph.add_node(
        NODE_WRITE_CARDS_ARTIFACT,
        make_persist_turn_artifact_node(profile_dir or Path("profiles")),
    )
    graph.add_node(NODE_GENERATE_SQL, sql_subgraph)
    graph.add_node(NODE_GATE_SQL, make_sql_gate_node())
    graph.add_node(
        NODE_WRITE_SQL_ARTIFACT,
        make_persist_turn_artifact_node(profile_dir or Path("profiles")),
    )
    graph.add_node(NODE_EXECUTE_SQL, make_execute_sql_node(trino_run_query))
    graph.add_node(NODE_END_WITH_SUMMARY, make_turn_summary_node(model))
    graph.add_node(NODE_END_WITH_REFUSAL, _end_with_refusal_node())

    graph.add_edge(START, NODE_INJECT_SYSTEM_PROMPT)
    graph.add_conditional_edges(
        NODE_INJECT_SYSTEM_PROMPT,
        _stage_route,
        NODE_ROUTE_MAP,
    )
    graph.add_edge(NODE_FETCH_CARDS, NODE_PREPARE_CARDS_FOR_GATE)
    graph.add_edge(NODE_PREPARE_CARDS_FOR_GATE, NODE_GATE_CARDS)
    graph.add_conditional_edges(
        NODE_GATE_CARDS,
        _after_gate_cards,
        _AFTER_GATE_CARDS_ROUTES,
    )
    graph.add_edge(NODE_WRITE_CARDS_ARTIFACT, NODE_GENERATE_SQL)
    graph.add_conditional_edges(NODE_GENERATE_SQL, _after_generate_sql, NODE_ROUTE_MAP)
    graph.add_conditional_edges(
        NODE_GATE_SQL,
        _after_gate_sql,
        _AFTER_GATE_SQL_ROUTES,
    )
    graph.add_edge(NODE_WRITE_SQL_ARTIFACT, NODE_EXECUTE_SQL)
    graph.add_edge(NODE_EXECUTE_SQL, NODE_END_WITH_SUMMARY)
    graph.add_edge(NODE_END_WITH_SUMMARY, END)
    graph.add_edge(NODE_END_WITH_REFUSAL, END)

    return graph.compile(checkpointer=checkpointer)

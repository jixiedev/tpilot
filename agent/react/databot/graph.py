"""Databot v2 outer graph — explicit state machine with ReAct inside each stage.

Topology (matches thought 1 in ``tools/rag/semantic.py``):

    START
      → inject_system_prompt
      → fetch_cards_subgraph    (parallel RAG + MCP, LLM picks cards)
      → gate_cards              (interrupt: approve/deny/dryrun)
          ├ deny-halt  → end_with_refusal
          ├ deny-comments → back to fetch
          └ approve | dryrun → next
      → write_cards_artifact    (only on approve; profile sidecar)
      → generate_sql_subgraph   (draft SQL from approved cards)
      → gate_sql                (interrupt)
          ├ deny-halt  → end_with_refusal
          ├ deny-comments → back to sql
          └ approve | dryrun → next
      → write_sql_artifact      (only on approve)
      → execute_sql             (trino_run_query with approved_sql)
      → chart_question          (optional interrupt: emit Superset chart?)
      → end_with_summary
      → END

Why a state machine: the thought-1 spec has *hard* human gates between
stages and a strict per-stage tool scope. A free-form ReAct cannot
enforce either — the LLM would skip gates or call the wrong tools. The
subgraphs preserve ReAct's flexibility for the parts that benefit from
it (discovery and SQL drafting) without losing the guarantees.
"""

from __future__ import annotations

import logging
from collections.abc import Callable
from pathlib import Path
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.tools import BaseTool
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import CompiledStateGraph

from agent.config import AgentPromptConfig
from agent.react.databot.execute import make_execute_sql_node
from agent.react.databot.gates import make_cards_gate_node, make_chart_question_node, make_sql_gate_node
from agent.react.databot.profile_persistence import make_persist_turn_artifact_node
from agent.react.databot.prompt import IDLE_NUDGE_PROMPT, SYSTEM_PROMPT as DATABOT_SYSTEM_PROMPT
from agent.react.databot.stage_tools import fetch_stage_tools, sql_stage_tools
from agent.react.databot.state import DatabotState
from agent.react.databot.subgraphs import build_fetch_cards_subgraph, build_generate_sql_subgraph
from graph.builder import make_inject_system_prompt_node

logger = logging.getLogger(__name__)


# Databot uses a different (stricter) default max_idle_rounds than the
# generic Tahoe base: when a stage finishes the LLM should call the
# "I'm done with this stage" tool, not just emit idle text. If we ever
# see a stray idle round in a stage subgraph, the outer machine will
# still progress because the conditional edges below all use ``stage``,
# not idle_rounds.
DEFAULT_STAGE_MAX_TOOL_CALLS = 8


def _message_is_human(message: Any) -> bool:
    msg_type = getattr(message, "type", None)
    if msg_type == "human":
        return True
    if isinstance(message, dict):
        role = message.get("role")
        return role in ("user", "human") or message.get("type") == "human"
    return False


def _trailing_human_wants_new_turn(state: DatabotState) -> bool:
    """True when the latest message is a new user turn (web chat follow-up).

    The CLI calls ``prepare_turn_input`` with a fresh partial state each
    time, but the CopilotKit / AG-UI path appends ``HumanMessage``s to the
    checkpoint and re-invokes with ``stage`` still ``"done"``. Without this
    guard the router sends those runs straight to ``end_with_summary``.
    """
    messages = state.get("messages") or []
    if not messages:
        return False
    return _message_is_human(messages[-1])


def _fresh_turn_state_patch() -> dict[str, Any]:
    """Reset per-turn databot fields for a follow-up question on the same thread.

    ``messages`` are intentionally preserved so each new request reruns the
    full pipeline (fetch → gates → sql → execute) while the LLM can read
    prior turns for context (metric corrections, entities, time range).
    """
    return {
        "stage": "fetch",
        "staging_cards": [],
        "candidate_cards": [],
        "selected_cards": [],
        "approved_cards": [],
        "metric_conflicts": [],
        "draft_sql": "",
        "approved_sql": "",
        "sql_validated": False,
        "execution_result": {},
        "gate_decisions": [],
        "cards_reasons": {},
        "sql_reasons": {},
        "dryrun": False,
        "halt_reason": "",
        "chart_requested": False,
        "deny_feedback": "",
        "tool_call_count": 0,
        "idle_rounds": 0,
        "failed_tools": [],
    }


def make_databot_entry_node(
    system_prompt: str | Callable[[DatabotState], str],
) -> Callable[[DatabotState], dict[str, Any]]:
    """Inject the system prompt and reset turn fields for web follow-ups."""
    inject = make_inject_system_prompt_node(system_prompt)

    def entry(state: DatabotState) -> dict[str, Any]:
        patch: dict[str, Any] = dict(inject(state) or {})
        stage = state.get("stage") or "fetch"
        if _trailing_human_wants_new_turn(state) and stage in {"done", "chart"}:
            patch.update(_fresh_turn_state_patch())
        return patch

    return entry


# Inner ReAct routers -------------------------------------------------------
# Subgraphs reuse the standard ``CompletionToolRouter`` from
# ``agent.router`` (see ``subgraphs._stage_completion_router``): the LLM
# exits a stage by calling ``chat_completion``; plain text bumps the
# idle counter; ``max_tool_calls`` bounds the loop. This is the same
# router the Tahoe base uses and what fixes the "step_llm called twice
# in a row" bug we hit on the first CLI dry run.


def _stage_route(state: DatabotState) -> str:
    """Outer conditional edge: pick the next node by ``stage``.

    Note the cards-gate "approve" branch goes through
    ``write_cards_artifact`` (the profile sidecar write) before reaching
    the SQL stage — that is intentional per thought 1.

    Defaults to ``fetch`` when ``stage`` is missing or unrecognized; the
    entry point relies on this for fresh turns.
    """
    stage = state.get("stage") or "fetch"
    if not isinstance(stage, str) or stage not in {
        "fetch", "gate_cards", "sql", "gate_sql", "execute", "chart", "done",
    }:
        return "fetch_cards"
    if stage == "fetch":
        return "fetch_cards"
    if stage == "gate_cards":
        return "gate_cards"
    if stage == "sql":
        return "write_cards_artifact"
    if stage == "gate_sql":
        return "gate_sql"
    if stage == "execute":
        return "write_sql_artifact"
    if stage == "chart":
        return "chart_question"
    if stage == "done":
        if _trailing_human_wants_new_turn(state):
            return "fetch_cards"
        return "end_with_summary"
    logger.warning("databot outer graph: unknown stage %r; routing to end", stage)
    return "end_with_summary"


def _after_gate_cards(state: DatabotState) -> str:
    """Decide where to go after the cards gate node returns."""
    if state.get("halt_reason"):
        return "end_with_refusal"
    return _stage_route(state)


def _after_gate_sql(state: DatabotState) -> str:
    if state.get("halt_reason"):
        return "end_with_refusal"
    stage = state.get("stage") or "fetch"
    # ``deny-comments`` at the SQL gate sets ``stage="sql"`` so the
    # generate_sql subgraph re-runs. That must NOT go through
    # ``write_cards_artifact`` (cards were already approved).
    if stage == "sql":
        return "generate_sql"
    return _stage_route(state)


def _sql_stage_contract_met(state: DatabotState) -> bool:
    draft = (state.get("draft_sql") or "").strip()
    reasons = state.get("sql_reasons") or {}
    return bool(draft) and bool(reasons)


def _cards_stage_contract_met(state: DatabotState) -> bool:
    cards = state.get("selected_cards") or []
    reasons = state.get("cards_reasons") or {}
    return bool(cards) and bool(reasons)


def _after_fetch_cards(state: DatabotState) -> str:
    """Break fetch↔gate loops when the subgraph exits without filling state."""
    stage = state.get("stage") or "fetch"
    if stage == "fetch" and not _cards_stage_contract_met(state):
        logger.warning(
            "fetch_cards subgraph exited without selected_cards + cards_reasons; "
            "routing to gate_cards",
        )
        return "gate_cards"
    return _stage_route(state)


def _after_generate_sql(state: DatabotState) -> str:
    """Break sql↔gate loops when the subgraph exits without filling state."""
    stage = state.get("stage") or "fetch"
    if stage == "sql" and not _sql_stage_contract_met(state):
        logger.warning(
            "generate_sql subgraph exited without draft_sql + sql_reasons; "
            "routing to gate_sql",
        )
        return "gate_sql"
    return _stage_route(state)


def _after_execute(state: DatabotState) -> str:
    return _stage_route(state)


def _after_chart(state: DatabotState) -> str:
    return "end_with_summary"


def _end_with_summary_node() -> Callable[[DatabotState], dict[str, Any]]:
    def end_with_summary(state: DatabotState) -> dict[str, Any]:
        # The actual user-visible summary is built in the CLI from the
        # latest chat_completion ToolMessage (if any) or the execution
        # result. We do not synthesize a final AI message here — that
        # would re-introduce an LLM call and break the deterministic
        # state machine.
        return {"stage": "done"}

    return end_with_summary


def _end_with_refusal_node() -> Callable[[DatabotState], dict[str, Any]]:
    def end_with_refusal(state: DatabotState) -> dict[str, Any]:
        from langchain_core.messages import AIMessage

        reason = (state.get("halt_reason") or "").strip() or "user halted"
        text = (
            f"Databot turn halted at user request: {reason}. "
            "No SQL was executed and no profile artifact was written."
        )
        return {"messages": [AIMessage(content=text)], "stage": "done"}

    return end_with_refusal


# ---------------------------------------------------------------------------
# Subgraph → outer stage bridge
# ---------------------------------------------------------------------------
#
# As of the state-based refactor, the per-stage subgraphs are compiled
# against ``DatabotState`` (not ``SessionAgentState``), so their
# ``Command(update=...)`` writes to ``stage`` actually land in the
# inner state. ``write_gate_reasons`` advances the stage pointer as
# part of its normal work, so by the time the inner subgraph exits
# ``state["stage"]`` already holds the next stage's name. The outer
# machine just reads it via ``_stage_route`` — no bridge node needed.

# ---------------------------------------------------------------------------
# Tool composition
# ---------------------------------------------------------------------------

def _find_tool(tools: list[BaseTool], name: str) -> BaseTool | None:
    """Return the first tool with ``.name == name`` or ``None`` if missing.

    We do NOT raise here: tool availability depends on which MCP servers
    are configured (``tools/mcp/mcp.json``) and which optional tool
    modules are importable. The stage builder treats missing tools as a
    degradation signal — the stage still compiles, the LLM simply does
    not see that tool.
    """
    for tool in tools:
        if getattr(tool, "name", None) == name:
            return tool
    return None


def _find_tools_by_predicate(
    tools: list[BaseTool],
    *predicates: Callable[[BaseTool], bool],
) -> list[BaseTool]:
    """Return every tool matching ANY of ``predicates`` (preserves order)."""
    out: list[BaseTool] = []
    seen: set[int] = set()
    for tool in tools:
        if id(tool) in seen:
            continue
        if any(pred(tool) for pred in predicates):
            out.append(tool)
            seen.add(id(tool))
    return out


def _name_starts_with(prefix: str) -> Callable[[BaseTool], bool]:
    return lambda tool: (getattr(tool, "name", "") or "").startswith(prefix)


def _build_stage_tool_lists(
    all_tools: list[BaseTool],
    rag_tools: list[BaseTool],
) -> tuple[list[BaseTool], list[BaseTool], BaseTool | None]:
    """Split the full tool set into fetch-stage and SQL-stage lists.

    Required tools (RAG, ``trino_run_query``, ``chat_completion``) are
    looked up by exact name. Optional data-context tools (datahub
    glossary + native datahub GraphQL helpers, trino/hive desc) are
    matched by prefix so the stage works whether datahub is exposed via
    MCP ``search`` / ``get_entities`` or via the native
    ``datahub_list_glossary_terms`` / ``datahub_graphql_query`` tools.

    Missing optional tools are silently dropped — the LLM just does not
    see them, which is the right behavior when an MCP server is offline.
    """
    fetch_related = _find_tool(rag_tools, "fetch_related_models")
    add_card = _find_tool(rag_tools, "add_card_to_state")
    if fetch_related is None or add_card is None:
        raise KeyError(
            "databot: RAG tools missing — fetch_related_models and "
            "add_card_to_state must be present in rag_tools"
        )

    # Datahub glossary / entity tools: accept either the (legacy?) MCP
    # ``search`` / ``get_entities`` names, or the native
    # ``datahub_*`` tools from ``tools/external/datahub.py``. Whichever
    # is present is wired in; if both, all are exposed.
    datahub_search = _find_tools_by_predicate(
        all_tools,
        lambda t: getattr(t, "name", "") in {"search", "datahub_search"},
        _name_starts_with("datahub_list_glossary"),
    )
    datahub_get_entities = _find_tools_by_predicate(
        all_tools,
        lambda t: getattr(t, "name", "") in {"get_entities", "datahub_get_entities"},
        lambda t: getattr(t, "name", "") == "datahub_graphql_query",
    )

    trino_desc = _find_tool(all_tools, "trino_desc_table")
    hive_desc = _find_tool(all_tools, "hive_desc_table")
    trino_run = _find_tool(all_tools, "trino_run_query")
    trino_explain = _find_tool(all_tools, "trino_explain")
    chat_completion = _find_tool(all_tools, "chat_completion")
    if chat_completion is None:
        raise KeyError("databot: chat_completion tool missing from all_tools")
    if trino_explain is None:
        # ``trino_explain`` is the SQL stage's only honest path to
        # ``validated=True``; if it is missing the LLM will fabricate
        # that flag, exit the stage as a plain-text idle round, and
        # the SQL gate will never fire. Fail loud at graph build
        # time rather than hanging the CopilotKit UI later.
        raise KeyError(
            "databot: trino_explain tool missing from all_tools — "
            "the SQL stage needs it to validate drafted SQL via EXPLAIN"
        )

    fetch_list = fetch_stage_tools(
        fetch_related_models=fetch_related,
        datahub_search=datahub_search,
        datahub_get_entities=datahub_get_entities,
        add_card_to_state=add_card,
        chat_completion=chat_completion,
    )
    sql_list = sql_stage_tools(
        trino_desc_table=trino_desc,
        hive_desc_table=hive_desc,
        trino_explain=trino_explain,
        chat_completion=chat_completion,
    )
    return fetch_list, sql_list, trino_run


# ---------------------------------------------------------------------------
# Public builder
# ---------------------------------------------------------------------------

def build_databot_graph(
    model: BaseChatModel,
    all_tools: list[BaseTool],
    rag_tools: list[BaseTool],
    *,
    checkpointer: BaseCheckpointSaver,
    system_prompt: str = DATABOT_SYSTEM_PROMPT,
    max_tool_calls: int = DEFAULT_STAGE_MAX_TOOL_CALLS,
    profile_dir: Path | None = None,
) -> CompiledStateGraph:
    """Compile the Databot v2 state machine.

    ``all_tools`` is the full databot tool set (warehouse + datahub + RAG).
    ``rag_tools`` is a subset (the RAG / semantic tool group) used to
    look up the RAG-only tools by name during stage composition.
    """
    fetch_tools, sql_tools, trino_run_query = _build_stage_tool_lists(all_tools, rag_tools)

    prompt_config = AgentPromptConfig(
        next_step="",  # subgraphs use their own next_step prompts
        idle_nudge_prompt=IDLE_NUDGE_PROMPT,
        tool_budget_exhausted_prompt="",
        refine_user_profile_prompt="",
    )

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
    graph.add_node("inject_system_prompt", make_databot_entry_node(system_prompt))
    graph.add_node("fetch_cards", fetch_subgraph)
    graph.add_node("gate_cards", make_cards_gate_node())
    graph.add_node("write_cards_artifact", make_persist_turn_artifact_node(profile_dir or Path("profiles")))
    graph.add_node("generate_sql", sql_subgraph)
    graph.add_node("gate_sql", make_sql_gate_node())
    graph.add_node("write_sql_artifact", make_persist_turn_artifact_node(profile_dir or Path("profiles")))
    graph.add_node("execute_sql", make_execute_sql_node(trino_run_query))
    graph.add_node("chart_question", make_chart_question_node())
    graph.add_node("end_with_summary", _end_with_summary_node())
    graph.add_node("end_with_refusal", _end_with_refusal_node())

    graph.add_edge(START, "inject_system_prompt")
    # After injecting the system prompt, jump to whatever the current
    # ``stage`` says — ``fetch`` on a fresh turn, but a resumed turn (e.g.
    # after a deny-comments loop) keeps its current stage.
    graph.add_conditional_edges(
        "inject_system_prompt",
        _stage_route,
        {
            "fetch_cards": "fetch_cards",
            "gate_cards": "gate_cards",
            "write_cards_artifact": "write_cards_artifact",
            "generate_sql": "generate_sql",
            "gate_sql": "gate_sql",
            "write_sql_artifact": "write_sql_artifact",
            "execute_sql": "execute_sql",
            "chart_question": "chart_question",
            "end_with_summary": "end_with_summary",
            "end_with_refusal": "end_with_refusal",
        },
    )
    # The inner subgraphs (``fetch_cards``, ``generate_sql``) write the
    # next stage directly via their tools (``write_gate_reasons`` advances
    # ``stage`` as part of its normal work), so when the subgraph ends
    # ``state.stage`` already points at the gate. ``_stage_route`` reads
    # it and routes — no bridge node needed. On a deny-comments re-entry
    # the gate has already set ``stage`` back to ``"fetch"`` / ``"sql"``
    # so the same conditional edge sends us right back into the
    # subgraph with the new ``deny_feedback`` in messages.
    _stage_route_map = {
        "fetch_cards": "fetch_cards",
        "gate_cards": "gate_cards",
        "write_cards_artifact": "write_cards_artifact",
        "generate_sql": "generate_sql",
        "gate_sql": "gate_sql",
        "write_sql_artifact": "write_sql_artifact",
        "execute_sql": "execute_sql",
        "chart_question": "chart_question",
        "end_with_summary": "end_with_summary",
        "end_with_refusal": "end_with_refusal",
    }
    graph.add_conditional_edges("fetch_cards", _after_fetch_cards, _stage_route_map)
    graph.add_conditional_edges(
        "gate_cards",
        _after_gate_cards,
        {
            "end_with_refusal": "end_with_refusal",
            "fetch_cards": "fetch_cards",
            "write_cards_artifact": "write_cards_artifact",
            "end_with_summary": "end_with_summary",
        },
    )
    graph.add_edge("write_cards_artifact", "generate_sql")
    graph.add_conditional_edges("generate_sql", _after_generate_sql, _stage_route_map)
    graph.add_conditional_edges(
        "gate_sql",
        _after_gate_sql,
        {
            "end_with_refusal": "end_with_refusal",
            "generate_sql": "generate_sql",
            "write_sql_artifact": "write_sql_artifact",
            "end_with_summary": "end_with_summary",
        },
    )
    graph.add_edge("write_sql_artifact", "execute_sql")
    graph.add_conditional_edges(
        "execute_sql",
        _after_execute,
        {
            "chart_question": "chart_question",
            "end_with_summary": "end_with_summary",
        },
    )
    graph.add_conditional_edges(
        "chart_question",
        _after_chart,
        {"end_with_summary": "end_with_summary"},
    )
    graph.add_edge("end_with_summary", END)
    graph.add_edge("end_with_refusal", END)

    return graph.compile(checkpointer=checkpointer)

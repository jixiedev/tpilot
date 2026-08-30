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
# Subgraph → outer stage bridge nodes
# ---------------------------------------------------------------------------
#
# The fetch_cards and generate_sql subgraphs are compiled against
# ``SessionAgentState``, which does NOT declare ``stage``,
# ``selected_cards``, ``draft_sql``, ``cards_reasons`` or ``sql_reasons``.
# LangGraph therefore silently drops any ``Command(update=...)`` that
# tries to write those keys from inside the subgraph. As a result, the
# outer state machine never observes the LLM's selection of cards or its
# draft SQL via state writes alone — the LLM has to also stash the data
# in ``ToolMessage.artifact`` (for cards) and the SQL subgraph has to
# rely on the same trick for SQL, but ``stage`` itself is not on
# ``ToolMessage`` at all.
#
# Without a stage advance, the outer machine gets stuck: it routes
# ``state.stage == "sql"`` to ``write_cards_artifact`` → ``generate_sql``
# in an infinite loop, and the SQL human gate (``gate_sql``) is never
# reached. This is the "CopilotKit UI hangs after propose_sql" symptom.
#
# These two bridge nodes are placed immediately after each subgraph. They
# only advance ``stage`` when the subgraph just ran (i.e. ``stage`` still
# holds the *sub-stage* name). When the gate has already advanced
# ``stage`` (e.g. on a resume after ``deny-comments``), the bridge is a
# no-op so the existing routing still wins.

def _advance_stage(
    state: DatabotState,
    *,
    from_stage: str,
    to_stage: str,
) -> dict[str, Any]:
    if state.get("stage") == from_stage:
        return {"stage": to_stage}
    return {}


def _extract_reasons_from_text(text: str) -> dict[str, str]:
    """Best-effort fallback for ``write_gate_reasons`` LLM-side laziness.

    The LLM is told to call ``write_gate_reasons`` with one short reason
    per gate option. When it forgets (we have seen this in the wild) the
    gate UI shows empty per-option reasons. To keep the UI useful, scan
    the LLM's most recent assistant text for the four canonical option
    labels and grab whatever short text follows each one.

    Returns ``{}`` when nothing matches. Never raises.
    """
    import re

    if not text:
        return {}
    # Match lines like ``approve: <reason>`` / ``- approve: <reason>``
    # / backticked forms. Anchored to start-of-line so we don't pick up
    # the LLM quoting the option name inside a longer sentence.
    pattern = re.compile(
        r"(?im)^\s*[-*]?\s*\*?\*?(approve|deny-comments|deny-halt|dryrun)\*?\*?\s*[:\-]\s*(.+?)\s*$"
    )
    out: dict[str, str] = {}
    for match in pattern.finditer(text):
        opt = match.group(1).strip().lower()
        reason = match.group(2).strip()
        if opt not in out and reason:
            out[opt] = reason[:200]
    return out


def _fallback_sql_reasons(state: DatabotState) -> dict[str, str]:
    """Populate ``sql_reasons`` from the last AI text if the LLM skipped
    ``write_gate_reasons``."""
    existing = state.get("sql_reasons")
    if isinstance(existing, dict) and existing:
        return {}
    from langchain_core.messages import AIMessage

    for msg in reversed(state.get("messages") or []):
        if not isinstance(msg, AIMessage):
            continue
        content = msg.content
        if isinstance(content, list):
            content = "".join(
                p.get("text", "") if isinstance(p, dict) else str(p) for p in content
            )
        if not isinstance(content, str):
            continue
        reasons = _extract_reasons_from_text(content)
        if reasons:
            return {"sql_reasons": reasons}
        return {}
    return {}


def _fallback_cards_reasons(state: DatabotState) -> dict[str, str]:
    """Same idea for the cards gate, in case the LLM forgets there too."""
    existing = state.get("cards_reasons")
    if isinstance(existing, dict) and existing:
        return {}
    from langchain_core.messages import AIMessage

    for msg in reversed(state.get("messages") or []):
        if not isinstance(msg, AIMessage):
            continue
        content = msg.content
        if isinstance(content, list):
            content = "".join(
                p.get("text", "") if isinstance(p, dict) else str(p) for p in content
            )
        if not isinstance(content, str):
            continue
        reasons = _extract_reasons_from_text(content)
        if reasons:
            return {"cards_reasons": reasons}
        return {}
    return {}


def _stage_completion_marker_present(state: DatabotState) -> bool:
    """Return True if the most recent tool result is ``chat_completion``.

    The per-stage ReAct subgraphs exit by calling the ``chat_completion``
    tool — that is the only authoritative signal that the LLM actually
    finished a stage. We use it here to distinguish a real stage exit
    (advance the outer ``stage`` to the gate) from a re-entry that the
    outer machine just routed in (e.g. a deny-comments resume that
    re-entered ``fetch_cards`` with new feedback — the subgraph has not
    run yet, the most recent tool message is whatever the previous turn
    left behind, and we must NOT advance ``stage`` again or the user
    never gets a chance to act on their feedback).
    """
    from langchain_core.messages import ToolMessage

    for msg in reversed(state.get("messages") or []):
        if isinstance(msg, ToolMessage):
            return getattr(msg, "name", "") == "chat_completion"
        # Stop scanning once we hit a non-ToolMessage boundary — there
        # may be a trailing AIMessage after the completion tool result
        # if the LLM did another round after completion (e.g. an
        # idle round). In that case the most recent ToolMessage still
        # tells us whether the stage actually finished.
        return False
    return False


def _advance_after_fetch_node() -> Callable[[DatabotState], dict[str, Any]]:
    def advance_after_fetch(state: DatabotState) -> dict[str, Any]:
        if state.get("stage") != "fetch":
            return {}
        if not _stage_completion_marker_present(state):
            # Re-entry without a fresh stage completion — the gate
            # will route the next step on its own. Leave ``stage``
            # alone so the subgraph can actually run with the new
            # ``deny_feedback``.
            return {}
        update = {"stage": "gate_cards"}
        update.update(_fallback_cards_reasons(state))
        return update

    return advance_after_fetch


def _advance_after_sql_node() -> Callable[[DatabotState], dict[str, Any]]:
    def advance_after_sql(state: DatabotState) -> dict[str, Any]:
        if state.get("stage") != "sql":
            return {}
        if not _stage_completion_marker_present(state):
            return {}
        update = {"stage": "gate_sql"}
        update.update(_fallback_sql_reasons(state))
        return update

    return advance_after_sql


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
    graph.add_node("inject_system_prompt", make_inject_system_prompt_node(system_prompt))
    graph.add_node("fetch_cards", fetch_subgraph)
    graph.add_node("advance_after_fetch", _advance_after_fetch_node())
    graph.add_node("gate_cards", make_cards_gate_node())
    graph.add_node("write_cards_artifact", make_persist_turn_artifact_node(profile_dir or Path("profiles")))
    graph.add_node("generate_sql", sql_subgraph)
    graph.add_node("advance_after_sql", _advance_after_sql_node())
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
    # Each gate writes the next ``stage``; ``_stage_route`` picks the node.
    # The halt path is the only exception (refusal branch is unconditional).
    # The subgraphs (fetch_cards, generate_sql) run against
    # ``SessionAgentState`` and therefore cannot write ``stage`` themselves.
    # We bridge them with no-op advance nodes that promote ``stage`` from
    # the sub-stage to its gate only when the gate has not already done so
    # (e.g. on a deny-comments resume, the stage is already back to
    # ``"fetch"`` and the bridge stays out of the way).
    graph.add_edge("fetch_cards", "advance_after_fetch")
    graph.add_conditional_edges(
        "advance_after_fetch",
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
    graph.add_edge("generate_sql", "advance_after_sql")
    graph.add_conditional_edges(
        "advance_after_sql",
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

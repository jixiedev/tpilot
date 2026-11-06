"""Databot LangGraph: phase routing, layer subgraphs, and outer pipeline compile."""

from __future__ import annotations

import json
import logging
import re
from collections.abc import Callable, Mapping
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, SystemMessage
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import BaseTool
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import CompiledStateGraph
from langgraph.types import StateSnapshot

from agent.catalog import AgentCatalog
from agent.run_context import DatabotRunContext, ReactRunContext
from agent.listener import CliListener
from agent.router import CompletionToolRouter, StageCompleteFn
from agent.specialists.databot.state import (
    DatabotReactState,
    DatabotState,
    FetchReactInput,
    FetchReactOutput,
    PHASE_EXECUTE_SQL,
    PHASE_PREPARE_CARDS,
    PHASE_PREPARE_SQL,
    PHASE_SUMMARY,
    SqlReactInput,
    SqlReactOutput,
)
from agent.specialists.databot.state import fetch_react_input, merge_fetch_react_output, merge_sql_react_output, react_turn_init, sql_react_input
from config.agent_config import AgentConfig, DatabotAgentConfig
from agent.specialists.databot.ui_actions import is_gate_redraft_message, user_question_from_messages
from graph.builder import ReactLoopSpec, ReactStateSpec, build_react_graph
from graph.error_recovery import invoke_with_transient_retry
from graph.messages import (
    is_internal_assistant_narration,
    message_content_to_str,
    strip_think_blocks,
)
from tools.bootstrap import ensure_tools_registered
from tools.registry import find_tool

logger = logging.getLogger(__name__)

DEFAULT_ROW_LIMIT = 100

NODE_FETCH_CARDS = "fetch_cards"
NODE_INJECT_STAGE_INSTRUCTION = "inject_stage_instruction"
NODE_PREPARE_CARDS_FOR_GATE = "prepare_cards_for_gate"
NODE_GATE_CARDS = "gate_cards"
NODE_GENERATE_SQL = "generate_sql"
NODE_GATE_SQL = "gate_sql"
NODE_EXECUTE_SQL = "execute_sql"
NODE_END_WITH_SUMMARY = "end_with_summary"
NODE_END_WITH_REFUSAL = "end_with_refusal"
NODE_START_TURN = "start_turn"

LAYER_PREPARE_CARDS = "layer_prepare_cards"
LAYER_PREPARE_SQL = "layer_prepare_sql"
LAYER_EXECUTE_SQL = "layer_execute_sql"
LAYER_SUMMARY = "layer_summary"

VALID_PHASES = frozenset({
    PHASE_PREPARE_CARDS,
    PHASE_PREPARE_SQL,
    PHASE_EXECUTE_SQL,
    PHASE_SUMMARY,
})

REGISTRY_NAME = "databot"
TOOL_ID_DEFAULT = "default"
TOOL_ID_FETCH = "fetch"
TOOL_ID_SQL = "sql"
TOOL_ID_EXECUTE = "execute"

# Outer graph layer node → tool-registry identifier (summary has no tools).
LAYER_SUBGRAPH_IDENTIFIER: dict[str, str] = {
    LAYER_PREPARE_CARDS: TOOL_ID_FETCH,
    LAYER_PREPARE_SQL: TOOL_ID_SQL,
    LAYER_EXECUTE_SQL: TOOL_ID_EXECUTE,
    LAYER_SUMMARY: PHASE_SUMMARY,
}


# ---------------------------------------------------------------------------
# Maps pipeline state to the next phase layer or in-layer node.
# ---------------------------------------------------------------------------

def phase_of(state: Mapping[str, Any]) -> str:
    """Return the current ``stage``, or ``prepare_cards`` when it is missing or unknown."""
    raw = str(state.get("stage") or PHASE_PREPARE_CARDS)
    return raw if raw in VALID_PHASES else PHASE_PREPARE_CARDS

def latest_gate(state: Mapping[str, Any]) -> tuple[str, str]:
    """Return ``(gate, decision)`` from the last audit row, or empty strings."""
    audit = state.get("gate_decisions") or []
    if not audit:
        return "", ""
    entry = audit[-1]
    return str(entry.get("gate", "")), str(entry.get("decision", ""))

def node_for_state(state: Mapping[str, Any]) -> str:
    """Pick the in-layer node that should run for the current snapshot."""
    phase = phase_of(state)
    if phase == PHASE_PREPARE_CARDS:
        if state.get("halt_reason"):
            return NODE_END_WITH_REFUSAL
        if state.get("review_cards") and state.get("cards_reasons"):
            return NODE_GATE_CARDS
        return NODE_FETCH_CARDS
    if phase == PHASE_PREPARE_SQL:
        if state.get("halt_reason"):
            return NODE_END_WITH_REFUSAL
        # A SQL-gate deny-comments clears draft_sql and sql_reasons, so the
        # completeness check alone sends a redraft back to generate_sql and a
        # finished redraft on to the gate.
        if sql_react_complete(state):
            return NODE_GATE_SQL
        return NODE_GENERATE_SQL
    if phase == PHASE_EXECUTE_SQL:
        return NODE_EXECUTE_SQL
    if state.get("halt_reason"):
        return NODE_END_WITH_REFUSAL
    return NODE_END_WITH_SUMMARY

def layer_for_state(state: Mapping[str, Any]) -> str:
    """Map ``node_for_state`` onto one of the four outer phase layers."""
    node = node_for_state(state)
    if node in (NODE_FETCH_CARDS, NODE_GATE_CARDS):
        return LAYER_PREPARE_CARDS
    if node in (NODE_GENERATE_SQL, NODE_GATE_SQL):
        return LAYER_PREPARE_SQL
    if node == NODE_EXECUTE_SQL:
        return LAYER_EXECUTE_SQL
    return LAYER_SUMMARY

def to_next_layer(state: Mapping[str, Any]) -> str:
    """Outer-graph conditional: which phase layer to enter next."""
    return layer_for_state(state)

def after_generate_sql(state: Mapping[str, Any]) -> str:
    """Stay on the SQL gate until a draft and its reasons are both present."""
    if phase_of(state) == PHASE_PREPARE_SQL and not sql_react_complete(
        state
    ):
        return NODE_GATE_SQL
    return node_for_state(state)

def sql_react_complete(state: Mapping[str, Any]) -> bool:
    """SQL ReAct subgraph may exit when draft SQL and gate reasons exist."""
    return bool((state.get("draft_sql") or "").strip() and state.get("sql_reasons"))


def starts_new_turn(state: Mapping[str, Any]) -> bool:
    """Whether a finished turn (``stage = summary``) just received a new question.

    True only when the last message is a non-empty ``HumanMessage`` that is
    neither replayed (``additional_kwargs.replayed``) nor a gate redraft
    message. The CLI resets the pipeline before invoking the graph, so its
    turns arrive with ``stage = prepare_cards`` and never match.
    """
    if phase_of(state) != PHASE_SUMMARY:
        return False
    messages = state.get("messages") or []
    if not messages:
        return False
    last = messages[-1]
    if not isinstance(last, HumanMessage):
        return False
    if (last.additional_kwargs or {}).get("replayed"):
        return False
    text = message_content_to_str(last.content).strip()
    return bool(text) and not is_gate_redraft_message(text)


def start_turn(state: Mapping[str, Any]) -> dict[str, Any]:
    """Outer entry node: reset the pipeline when a finished thread gets a new question.

    The web path (``/agui``) drives the compiled graph directly, without
    ``DatabotTurnMessagePolicy``; this applies the same per-turn baseline
    there. ``history_cards`` is kept, as the CLI policy carries it forward.
    """
    if not starts_new_turn(state):
        return {}
    # Imported here: databot_agent imports this module.
    from agent.specialists.databot.databot_agent import DatabotTurnMessagePolicy

    fields = DatabotTurnMessagePolicy.baseline_fields()
    fields.pop("history_cards", None)
    return fields


from agent.specialists.databot import gates as human_gates


class DatabotTopology:
    """Routes, node callables, and compiled subgraphs for the databot pipeline."""

    # -------------------------------------------------------------------------
    # Wiring (outer graph + shared ReAct compile)
    # -------------------------------------------------------------------------

    def __init__(
        self,
        model: BaseChatModel,
        *,
        checkpointer: Any | None = None,
        run_context: DatabotRunContext | None = None,
    ) -> None:
        self._model = model
        self._checkpointer = checkpointer
        self._run_context = run_context
        self._gates = DatabotAgentConfig.gates_from(run_context)
        self._trino_run: BaseTool | None = None
        self._subgraphs: dict[str, CompiledStateGraph] | None = None
        if checkpointer is not None and run_context is not None:
            self._build_subgraphs()

    @staticmethod
    def react_layer_node(
        react_graph: CompiledStateGraph,
        *,
        build_input: Callable[[Mapping[str, Any]], dict[str, Any]],
        merge_output: Callable[[Mapping[str, Any]], dict[str, Any]],
    ) -> Callable[..., dict[str, Any]]:
        """Invoke inner ReAct with ``build_input(state)``; return ``merge_output(result)``."""

        # LangGraph always passes ``config``; a non-Optional annotation keeps it
        # from warning about the postponed ``RunnableConfig | None`` string.
        def node(state: Mapping[str, Any], config: RunnableConfig) -> dict[str, Any]:
            react_in = build_input(state)
            result = react_graph.invoke(react_in, config)
            return merge_output(result if isinstance(result, dict) else {})

        return node

    def subgraph(self, identifier: str) -> CompiledStateGraph:
        """Compiled phase layer for ``identifier`` (``fetch`` / ``sql`` / ``execute`` / ``summary``)."""
        if self._subgraphs is None:
            raise RuntimeError(
                "DatabotTopology subgraphs require checkpointer and run_context"
            )
        return self._subgraphs[identifier]

    def _build_subgraphs(self) -> None:
        if self._run_context is None or self._checkpointer is None:
            raise RuntimeError("checkpointer and run_context are required to compile layers")
        ensure_tools_registered()
        fetch_tools = AgentCatalog.tools_for(REGISTRY_NAME, TOOL_ID_FETCH)
        sql_tools = AgentCatalog.tools_for(REGISTRY_NAME, TOOL_ID_SQL)
        self._trino_run = find_tool(
            AgentCatalog.tools_for(REGISTRY_NAME, TOOL_ID_EXECUTE),
            "trino_run_query",
        )
        react = self._run_context.get("react") or {}
        self._subgraphs = {
            TOOL_ID_FETCH: self._compile_prepare_cards(
                fetch_tools,
                react["fetch"],
            ),
            TOOL_ID_SQL: self._compile_prepare_sql(
                sql_tools,
                react["sql"],
            ),
            TOOL_ID_EXECUTE: self._compile_execute_sql(),
            PHASE_SUMMARY: self._compile_summary(),
        }

    @staticmethod
    def inject_stage_instruction(prompt: str) -> Callable[[DatabotState], dict[str, Any]]:
        """Append layer opening copy to session ``messages`` before ReAct runs.

        Dedupes only within the current turn: the scan stops at the latest
        real user question (gate redraft messages do not count), so every
        new turn gets the instruction again while a redraft loop does not.
        """
        text = prompt.strip()

        def node(state: DatabotState) -> dict[str, Any]:
            if not text:
                return {}
            for msg in reversed(state.get("messages") or []):
                if isinstance(msg, SystemMessage) and message_content_to_str(msg.content) == text:
                    return {}
                if isinstance(msg, HumanMessage) and not is_gate_redraft_message(
                    message_content_to_str(msg.content)
                ):
                    break
            return {"messages": [SystemMessage(content=text)]}

        return node

    def _compile_react_layer(
        self,
        tools: list[BaseTool],
        *,
        run_context: ReactRunContext,
        input_schema: type,
        output_schema: type,
        build_input: Callable[[dict[str, Any]], dict[str, Any]],
        merge_output: Callable[[dict[str, Any]], dict[str, Any]],
        stage_complete: StageCompleteFn | None = None,
    ) -> Callable[[DatabotState], dict[str, Any]]:
        router = CompletionToolRouter(run_context, stage_complete=stage_complete)
        react_graph = build_react_graph(
            self._model,
            tools,
            router=router,
            loop=ReactLoopSpec.from_run_context(run_context),
            state=ReactStateSpec(
                state_class=DatabotReactState,
                input_schema=input_schema,
                output_schema=output_schema,
                turn_init=react_turn_init,
            ),
        )
        return DatabotTopology.react_layer_node(
            react_graph,
            build_input=build_input,
            merge_output=merge_output,
        )

    # -------------------------------------------------------------------------
    # Layer: prepare_cards (fetch ReAct, gate prep, cards HITL)
    # -------------------------------------------------------------------------

    @staticmethod
    def prepare_cards_entry(state: DatabotState) -> str:
        """Skip fetch when review cards and gate reasons are already staged."""
        if state.get("review_cards") and state.get("cards_reasons"):
            return NODE_GATE_CARDS
        return NODE_FETCH_CARDS

    @staticmethod
    def after_gate_cards(state: DatabotState) -> str:
        """Leave the cards layer on approve, or loop back to fetch on redraft."""
        gate, decision = latest_gate(state)
        if gate == "cards" and decision == "deny-comments":
            return NODE_INJECT_STAGE_INSTRUCTION
        if phase_of(state) in (PHASE_PREPARE_SQL, PHASE_SUMMARY):
            return END
        return NODE_INJECT_STAGE_INSTRUCTION

    def prepare_cards_for_gate(self) -> Callable[[DatabotState], dict[str, Any]]:
        """Copy committed cards into ``review_cards`` and write the four gate reasons."""
        model = self._model

        def node(state: DatabotState) -> dict[str, Any]:
            review = [
                dict(card)
                for card in (state.get("committed_cards") or [])
                if isinstance(card, dict)
            ]
            reasons = human_gates.default_reasons("cards")
            try:
                response = invoke_with_transient_retry(
                    lambda: model.invoke(
                        [
                            SystemMessage(
                                content=DatabotAgentConfig.node_prompt_from(
                                    self._run_context,
                                    "prepare_cards_for_gate",
                                ),
                            ),
                            HumanMessage(
                                content=(
                                    "Write the four gate-option reasons for this selection.\n\n"
                                    + DatabotTopology._cards_gate_brief(state, review)
                                )
                            ),
                        ]
                    )
                )
                if isinstance(response, AIMessage):
                    reasons = human_gates.merge_reasons(
                        "cards",
                        human_gates.coerce_reasons(message_content_to_str(response.content)),
                    )
            except Exception as exc:
                logger.warning("prepare_cards_for_gate LLM call failed: %s", exc)
            return {
                "review_cards": review,
                "cards_reasons": reasons,
                "cards_selection_summary": human_gates.cards_selection_summary(review),
                "stage": PHASE_PREPARE_CARDS,
            }

        return node

    @staticmethod
    def _cards_gate_brief(state: DatabotState, review: list[dict[str, Any]]) -> str:
        cards = [
            {
                "name": card.get("name"),
                "selected_metrics": card.get("selected_metrics") or [],
                "selected_dimensions": card.get("selected_dimensions") or [],
                "selection_notes": (card.get("selection_notes") or "")[:240],
            }
            for card in review
        ]
        payload = {
            "user_question": user_question_from_messages(state.get("messages") or []),
            "committed_models": cards,
            "metric_conflicts": state.get("metric_conflicts") or [],
            "gate_redraft_feedback": (state.get("deny_feedback") or "").strip(),
        }
        return json.dumps(payload, ensure_ascii=False, indent=2)

    def _compile_prepare_cards(
        self,
        fetch_tools: list[BaseTool],
        fetch_ctx: ReactRunContext,
    ) -> CompiledStateGraph:
        fetch_instruction = AgentConfig.as_str(fetch_ctx, "fetch_instruction")
        graph = StateGraph(DatabotState)
        graph.add_node(
            NODE_INJECT_STAGE_INSTRUCTION,
            DatabotTopology.inject_stage_instruction(fetch_instruction),
        )
        graph.add_node(
            NODE_FETCH_CARDS,
            self._compile_react_layer(
                fetch_tools,
                run_context=fetch_ctx,
                input_schema=FetchReactInput,
                output_schema=FetchReactOutput,
                build_input=fetch_react_input,
                merge_output=merge_fetch_react_output,
                stage_complete=lambda state: bool(state.get("committed_cards")),
            ),
        )
        graph.add_node(NODE_PREPARE_CARDS_FOR_GATE, self.prepare_cards_for_gate())
        graph.add_node(NODE_GATE_CARDS, human_gates.cards_node(enabled=self._gates["cards_enabled"]))
        graph.add_edge(START, NODE_INJECT_STAGE_INSTRUCTION)
        graph.add_conditional_edges(
            NODE_INJECT_STAGE_INSTRUCTION, DatabotTopology.prepare_cards_entry
        )
        graph.add_edge(NODE_FETCH_CARDS, NODE_PREPARE_CARDS_FOR_GATE)
        graph.add_edge(NODE_PREPARE_CARDS_FOR_GATE, NODE_GATE_CARDS)
        graph.add_conditional_edges(NODE_GATE_CARDS, DatabotTopology.after_gate_cards)
        return graph.compile(checkpointer=self._checkpointer)

    # -------------------------------------------------------------------------
    # Layer: prepare_sql (generate ReAct, sql HITL)
    # -------------------------------------------------------------------------

    @staticmethod
    def prepare_sql_entry(state: DatabotState) -> str:
        """Open the SQL gate when a draft and reasons exist; otherwise generate SQL."""
        if sql_react_complete(state):
            return NODE_GATE_SQL
        return NODE_GENERATE_SQL

    @staticmethod
    def after_generate_sql(state: DatabotState) -> str:
        """Stay inside the SQL layer, or end it when the phase has moved on."""
        target = after_generate_sql(state)
        if target == NODE_GENERATE_SQL:
            return NODE_INJECT_STAGE_INSTRUCTION
        if target == NODE_GATE_SQL:
            return NODE_GATE_SQL
        return END

    @staticmethod
    def after_gate_sql(state: DatabotState) -> str:
        """Leave the SQL layer on approve or halt, or loop back to generate on redraft."""
        if state.get("halt_reason"):
            return END
        gate, decision = latest_gate(state)
        if gate == "sql" and decision == "deny-comments":
            return NODE_INJECT_STAGE_INSTRUCTION
        if phase_of(state) in (PHASE_EXECUTE_SQL, PHASE_SUMMARY):
            return END
        return NODE_INJECT_STAGE_INSTRUCTION

    def _compile_prepare_sql(
        self,
        sql_tools: list[BaseTool],
        sql_ctx: ReactRunContext,
    ) -> CompiledStateGraph:
        sql_instruction = AgentConfig.as_str(sql_ctx, "sql_instruction")
        graph = StateGraph(DatabotState)
        graph.add_node(
            NODE_INJECT_STAGE_INSTRUCTION,
            DatabotTopology.inject_stage_instruction(sql_instruction),
        )
        graph.add_node(
            NODE_GENERATE_SQL,
            self._compile_react_layer(
                sql_tools,
                run_context=sql_ctx,
                input_schema=SqlReactInput,
                output_schema=SqlReactOutput,
                build_input=sql_react_input,
                merge_output=merge_sql_react_output,
                stage_complete=sql_react_complete,
            ),
        )
        graph.add_node(NODE_GATE_SQL, human_gates.sql_node(enabled=self._gates["sql_enabled"]))
        graph.add_edge(START, NODE_INJECT_STAGE_INSTRUCTION)
        graph.add_conditional_edges(
            NODE_INJECT_STAGE_INSTRUCTION, DatabotTopology.prepare_sql_entry
        )
        graph.add_conditional_edges(NODE_GENERATE_SQL, DatabotTopology.after_generate_sql)
        graph.add_conditional_edges(NODE_GATE_SQL, DatabotTopology.after_gate_sql)
        return graph.compile(checkpointer=self._checkpointer)

    # -------------------------------------------------------------------------
    # Layer: execute_sql (Trino)
    # -------------------------------------------------------------------------

    def execute_sql(
        self, row_limit: int = DEFAULT_ROW_LIMIT
    ) -> Callable[[DatabotState], dict[str, Any]]:
        """Run ``approved_sql`` and store the rows or error on ``execution_result``."""
        if self._trino_run is None:
            ensure_tools_registered()
            self._trino_run = find_tool(
                AgentCatalog.tools_for(REGISTRY_NAME, TOOL_ID_EXECUTE),
                "trino_run_query",
            )
        trino_run = self._trino_run

        def node(state: DatabotState) -> dict[str, Any]:
            sql = (state.get("approved_sql") or "").strip()
            if not sql:
                return {
                    "execution_result": {"ok": False, "error": "no approved SQL in state"},
                    "stage": PHASE_SUMMARY,
                }
            if trino_run is None:
                return {
                    "execution_result": {
                        "ok": False,
                        "error": "trino_run_query tool not available this turn",
                        "sql": sql,
                    },
                    "stage": PHASE_SUMMARY,
                }
            try:
                result = trino_run.invoke({"sql": sql, "limit": row_limit})
            except Exception as exc:
                logger.warning("trino_run_query failed: %s", exc)
                return {
                    "execution_result": {"ok": False, "error": str(exc), "sql": sql},
                    "stage": PHASE_SUMMARY,
                }
            if not isinstance(result, dict):
                result = {"ok": True, "raw": result}
            return {
                "execution_result": {**result, "ok": True, "sql": sql},
                "stage": PHASE_SUMMARY,
            }

        return node

    def _compile_execute_sql(self) -> CompiledStateGraph:
        graph = StateGraph(DatabotState)
        graph.add_node(NODE_EXECUTE_SQL, self.execute_sql())
        graph.add_edge(START, NODE_EXECUTE_SQL)
        graph.add_edge(NODE_EXECUTE_SQL, END)
        return graph.compile(checkpointer=self._checkpointer)

    # -------------------------------------------------------------------------
    # Layer: summary (user-facing close)
    # -------------------------------------------------------------------------

    @staticmethod
    def summary_entry(state: DatabotState) -> str:
        """Write a refusal when the turn was halted; otherwise summarize the result."""
        if (state.get("halt_reason") or "").strip():
            return NODE_END_WITH_REFUSAL
        return NODE_END_WITH_SUMMARY

    def turn_summary(self) -> Callable[[DatabotState], dict[str, Any]]:
        """Append one user-facing summary of the question, cards, SQL, and result."""
        model = self._model

        def node(state: DatabotState) -> dict[str, Any]:
            messages = list(state.get("messages") or [])
            question = user_question_from_messages(messages)
            context = DatabotTopology._turn_summary_context(state)
            text = ""
            try:
                response = invoke_with_transient_retry(
                    lambda: model.invoke(
                        [
                            SystemMessage(
                                content=DatabotAgentConfig.node_prompt_from(
                                    self._run_context,
                                    "turn_summary_system",
                                ),
                            ),
                            HumanMessage(
                                content=(
                                    f"User question:\n{question or '(not found)'}\n\n"
                                    f"Turn artifacts (JSON):\n{context}"
                                )
                            ),
                        ]
                    )
                )
                if isinstance(response, AIMessage):
                    text = DatabotTopology._extract_summary_text(response)
            except Exception as exc:
                logger.warning("turn summary LLM call failed: %s", exc)
            if not text:
                text = DatabotTopology._fallback_turn_summary(state, question)
            return {"messages": [AIMessage(content=text)], "stage": PHASE_SUMMARY}

        return node

    @staticmethod
    def end_with_refusal() -> Callable[[DatabotState], dict[str, Any]]:
        """Append a halt message. No SQL is run and no retrieval record is written."""

        def node(state: DatabotState) -> dict[str, Any]:
            reason = (state.get("halt_reason") or "").strip() or "user halted"
            text = (
                f"Databot turn halted at user request: {reason}. "
                "No SQL was executed and no profile artifact was written."
            )
            return {"messages": [AIMessage(content=text)], "stage": PHASE_SUMMARY}

        return node

    @staticmethod
    def _turn_summary_context(state: DatabotState) -> str:
        audit = state.get("gate_decisions") or []
        gate_lines = [
            (
                f"{entry.get('gate')}: {entry.get('decision')}"
                + (f" ({entry.get('comments')})" if entry.get("comments") else "")
            )
            for entry in audit
            if isinstance(entry, dict)
        ]
        payload = {
            "dryrun_preview_only": bool(state.get("dryrun")),
            "approved_models": [
                str(c["name"])
                for c in (state.get("approved_cards") or [])
                if isinstance(c, dict) and c.get("name")
            ],
            "metric_conflicts": state.get("metric_conflicts") or [],
            "approved_sql": (state.get("approved_sql") or "").strip(),
            "execution_result": DatabotTopology._execution_preview(
                state.get("execution_result") or {}
            ),
            "gate_decisions": gate_lines,
        }
        return json.dumps(payload, ensure_ascii=False, indent=2)

    @staticmethod
    def _execution_preview(result: dict[str, Any]) -> dict[str, Any]:
        if not result:
            return {}
        preview = dict(result)
        rows = preview.get("rows")
        if isinstance(rows, list) and len(rows) > 5:
            preview["rows"] = rows[:5]
            preview["rows_truncated"] = True
        return preview

    @staticmethod
    def _extract_summary_text(response: AIMessage) -> str:
        visible = strip_think_blocks(CliListener.message_text_content(response.content))
        if DatabotTopology._looks_like_user_summary(visible):
            return visible
        reasoning = strip_think_blocks(CliListener.message_reasoning(response))
        if DatabotTopology._looks_like_user_summary(reasoning):
            return reasoning
        return ""

    @staticmethod
    def _looks_like_user_summary(text: str) -> bool:
        cleaned = strip_think_blocks(text)
        return bool(cleaned) and not is_internal_assistant_narration(cleaned)

    @staticmethod
    def _fallback_turn_summary(state: DatabotState, question: str) -> str:
        chinese = bool(re.search(r"[\u4e00-\u9fff]", question))
        models = [
            str(c["name"])
            for c in (state.get("approved_cards") or [])
            if isinstance(c, dict) and c.get("name")
        ]
        model_label = ", ".join(models) if models else ("所选模型" if chinese else "the selected models")
        result = state.get("execution_result") or {}
        ok = bool(result.get("ok"))
        error = str(result.get("error") or "").strip()
        rows = result.get("rows")
        n_rows = len(rows) if isinstance(rows, list) else None
        dryrun = bool(state.get("dryrun"))
        if chinese:
            lines = [f"已根据你的问题跑完查询，使用模型：{model_label}。"]
            if dryrun:
                lines.append("这是预览，没有写入 profile。")
            if ok and n_rows is not None:
                lines.append(f"结果共 {n_rows} 行，请看右侧 Results。")
            elif ok:
                lines.append("查询已执行，请看右侧 Results。")
            elif error:
                lines.append(f"查询没有跑成：{error}")
            else:
                lines.append("本轮没有可展示的查询结果。")
            return "\n".join(lines)
        lines = [f"I finished the query using {model_label}."]
        if dryrun:
            lines.append("This was a preview; no profile artifact was saved.")
        if ok and n_rows is not None:
            lines.append(f"{n_rows} row(s) are in the Results tab.")
        elif ok:
            lines.append("The query ran; see the Results tab.")
        elif error:
            lines.append(f"The query did not run: {error}")
        else:
            lines.append("This turn has no query result to show.")
        return "\n".join(lines)

    def _compile_summary(self) -> CompiledStateGraph:
        graph = StateGraph(DatabotState)
        graph.add_node(NODE_END_WITH_SUMMARY, self.turn_summary())
        graph.add_node(NODE_END_WITH_REFUSAL, DatabotTopology.end_with_refusal())
        graph.add_conditional_edges(START, DatabotTopology.summary_entry)
        graph.add_edge(NODE_END_WITH_SUMMARY, END)
        graph.add_edge(NODE_END_WITH_REFUSAL, END)
        return graph.compile(checkpointer=self._checkpointer)


class DatabotGraphBuilder:
    """Compile four phase layers with shared outer routing."""

    def __init__(
        self,
        model: BaseChatModel,
        *,
        checkpointer: BaseCheckpointSaver,
        run_context: DatabotRunContext,
    ) -> None:
        self._model = model
        self._checkpointer = checkpointer
        self._run_context = run_context

    def compile(self) -> CompiledStateGraph:
        """Wire phase layers; route exits through ``to_next_layer``."""
        topology = DatabotTopology(
            self._model,
            checkpointer=self._checkpointer,
            run_context=self._run_context,
        )
        graph = StateGraph(DatabotState)
        for layer in (
            LAYER_PREPARE_CARDS,
            LAYER_PREPARE_SQL,
            LAYER_EXECUTE_SQL,
            LAYER_SUMMARY,
        ):
            identifier = LAYER_SUBGRAPH_IDENTIFIER[layer]
            graph.add_node(layer, topology.subgraph(identifier))

        graph.add_node(NODE_START_TURN, start_turn)
        graph.add_edge(START, NODE_START_TURN)
        graph.add_conditional_edges(NODE_START_TURN, to_next_layer)
        for layer in (LAYER_PREPARE_CARDS, LAYER_PREPARE_SQL, LAYER_EXECUTE_SQL):
            graph.add_conditional_edges(layer, to_next_layer)
        graph.add_edge(LAYER_SUMMARY, END)
        return graph.compile(checkpointer=self._checkpointer)

    @classmethod
    def build(
        cls,
        model: BaseChatModel,
        *,
        checkpointer: BaseCheckpointSaver,
        run_context: DatabotRunContext,
    ) -> CompiledStateGraph:
        """Compile the outer databot graph for one model and checkpointer."""
        return cls(
            model,
            checkpointer=checkpointer,
            run_context=run_context,
        ).compile()

    @staticmethod
    async def aget_active_state(
        graph: CompiledStateGraph,
        config: RunnableConfig,
    ) -> StateSnapshot:
        """Snapshot of the innermost layer subgraph that is paused at a gate.

        Gates run inside layer subgraphs, so while one is waiting for a
        human decision the outer checkpoint still holds the values from
        before the layer started. Read (and ``aupdate_state`` against the
        returned ``config``) this snapshot instead. Falls back to the outer
        snapshot when no layer is in flight.
        """
        snapshot = await graph.aget_state(config, subgraphs=True)
        while True:
            child = next(
                (
                    task.state
                    for task in snapshot.tasks
                    if isinstance(task.state, StateSnapshot) and task.state.values
                ),
                None,
            )
            if child is None:
                return snapshot
            snapshot = child

__all__ = [
    "DatabotGraphBuilder",
    "DatabotTopology",
    "LAYER_EXECUTE_SQL",
    "LAYER_PREPARE_CARDS",
    "LAYER_PREPARE_SQL",
    "LAYER_SUBGRAPH_IDENTIFIER",
    "LAYER_SUMMARY",
    "NODE_END_WITH_REFUSAL",
    "NODE_END_WITH_SUMMARY",
    "NODE_EXECUTE_SQL",
    "NODE_FETCH_CARDS",
    "NODE_GATE_CARDS",
    "NODE_GATE_SQL",
    "NODE_GENERATE_SQL",
    "NODE_START_TURN",
    "PHASE_EXECUTE_SQL",
    "PHASE_PREPARE_CARDS",
    "PHASE_PREPARE_SQL",
    "PHASE_SUMMARY",
    "REGISTRY_NAME",
    "TOOL_ID_DEFAULT",
    "TOOL_ID_EXECUTE",
    "TOOL_ID_FETCH",
    "TOOL_ID_SQL",
]

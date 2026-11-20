"""Databot staged pipeline: outer state machine with ReAct subgraphs per stage."""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import SystemMessage
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import BaseTool
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph.state import CompiledStateGraph
from langgraph.types import StateSnapshot

from agent.agent import BaseAgent
from agent.listener import AgentListener, CliListener, ListenerHub
from agent.prompt import SystemPromptAssembler
from agent.turn_messages import TurnMessagePolicy
from agent.session import SessionUserRequest
from agent.specialists.databot.graph import (
    DatabotGraphBuilder,
    PHASE_PREPARE_CARDS,
    TOOL_ID_DEFAULT,
)
from agent.specialists.databot.history import DataRetrievalRecord, DataRetrievalStore
from agent.specialists.databot.state import DatabotState
from agent.specialists.databot.ui_actions import databot_state_subset
from agent.subagent import SubagentResult, SubagentTask, leading_rows
from settings.agent_config import AgentConfig, DatabotAgentConfig, agent_config_path
from memory.session_runtime import SessionRuntime


# Per-turn databot graph fields (not ``messages`` / session ids). Copied in
# ``DatabotTurnMessagePolicy.baseline_fields`` / ``history_state``.
_DATABOT_FIELD_DEFAULTS: dict[str, Any] = {
    "history_cards": [],
    "stage": PHASE_PREPARE_CARDS,
    "staging_cards": [],
    "committed_cards": [],
    "review_cards": [],
    "approved_cards": [],
    "metric_conflicts": [],
    "cards_reasons": {},
    "cards_selection_summary": "",
    "draft_sql": "",
    "approved_sql": "",
    "sql_validated": False,
    "sql_reasons": {},
    "gate_decisions": [],
    "dryrun": False,
    "halt_reason": "",
    "deny_feedback": "",
    "execution_result": {},
}

_ARTIFACT_MAX_ROWS = 20
_ARTIFACT_MAX_CHARS = 4000


def result_rows_preview(rows: Any) -> list[Any]:
    """The first result rows, bounded by count and JSON size (for the lead and fallbacks)."""
    return leading_rows(rows, max_rows=_ARTIFACT_MAX_ROWS, max_chars=_ARTIFACT_MAX_CHARS)


class DatabotTurnMessagePolicy(TurnMessagePolicy):
    """Retrieval history on accept; persist artifacts on commit."""

    def __init__(
        self,
        retrievals: DataRetrievalStore | None,
        *,
        session_runtime: SessionRuntime,
    ) -> None:
        self._retrievals = retrievals
        self._session_runtime = session_runtime

    @staticmethod
    def baseline_fields() -> dict[str, Any]:
        """Fresh databot pipeline defaults for ``history_state``."""
        return DatabotTurnMessagePolicy._copy_field_defaults(_DATABOT_FIELD_DEFAULTS)

    @staticmethod
    def _copy_field_defaults(template: Mapping[str, Any]) -> dict[str, Any]:
        fresh: dict[str, Any] = {}
        for key, value in template.items():
            if isinstance(value, list):
                fresh[key] = []
            elif isinstance(value, dict):
                fresh[key] = {}
            else:
                fresh[key] = value
        return fresh

    def history_state(self, prior: Mapping[str, Any] | None = None) -> dict[str, Any]:
        """Start a turn from a blank snapshot, carrying forward prior retrieval cards."""
        fields = DatabotTurnMessagePolicy.baseline_fields()
        prior_cards = [
            dict(card)
            for card in ((prior or {}).get("history_cards") or [])
            if isinstance(card, dict)
        ]
        if prior_cards:
            fields["history_cards"] = prior_cards
            return fields
        store = self._retrievals
        if store is not None:
            fields["history_cards"] = store.history_cards(
                self._session_runtime.resolve_user_id()
            )
        return fields

    def commit_turn_state(self, state: DatabotState) -> dict[str, Any]:
        """Persist an approved retrieval and refresh ``history_cards`` on the committed state."""
        merged = dict(state)
        store = self._retrievals
        if store is None:
            return merged
        history_cards = store.persist_from_state(state)
        if history_cards is None:
            return merged
        merged["history_cards"] = history_cards
        return merged

    @staticmethod
    def inject_history_briefing(state: Mapping[str, Any]) -> None:
        """Prepend a one-shot history_cards hint when accepting a new turn."""
        history = state.get("history_cards") or []
        if not history:
            return
        messages = list(state.get("messages") or [])
        if DataRetrievalRecord.briefing_already_injected(messages):
            return
        state["messages"] = [
            SystemMessage(content=DataRetrievalRecord.briefing(history)),
            *messages,
        ]


class DatabotSystemPrompt(SystemPromptAssembler):
    """Databot: Tahoe base plus read-only warehouse / retrieval rules."""

    def __init__(self, config: AgentConfig | None = None) -> None:
        super().__init__(config or AgentConfig(agent_config_path("databot")))


class DatabotAgent(BaseAgent):
    """Data-retrieval specialist with a staged, human-gated pipeline.

    Example checkpoint ``messages`` (multi-turn; gate loops omitted)::

        Turn 1 accept (optional history briefing first)::

            [SYS]   history_cards briefing
            [SYS]   agent persona
            [HUMAN] user question

        Turn 1 graph::

            [SYS]   fetch_instruction
            [AI/TOOL …] fetch ReAct → outer checkpoint
            [SYS]   sql_instruction
            [AI/TOOL …] SQL ReAct → outer checkpoint
            [AI]    turn summary

        Turn 2 accept::

            ┌─ Turn 1 ────────────────────────────────────────────
            │ … persona, q1, traces, summary …
            ├─ Turn 2 ────────────────────────────────────────────
            │ [SYS]   turn boundary
            │ [SYS]   history briefing (if needed)
            │ [HUMAN] q2
            └─ staged layers repeat under q2
    """

    tool_ids = (TOOL_ID_DEFAULT,)

    def __init__(
        self,
        *,
        model: BaseChatModel,
        checkpointer: BaseCheckpointSaver,
        session_runtime: SessionRuntime,
        agent_config: DatabotAgentConfig,
        tools: Sequence[BaseTool],
        retrievals: DataRetrievalStore | None = None,
        listener: AgentListener | ListenerHub | None = None,
    ) -> None:
        if retrievals is None:
            try:
                retrievals = DataRetrievalStore(session_runtime.filesystem_root())
            except TypeError:
                retrievals = None
        super().__init__(
            model=model,
            checkpointer=checkpointer,
            session_runtime=session_runtime,
            prompt_assembler=DatabotSystemPrompt(agent_config),
            turn_message_policy=DatabotTurnMessagePolicy(
                retrievals,
                session_runtime=session_runtime,
            ),
            agent_config=agent_config,
            listener=listener or CliListener(),
        )
        self.tools = list(tools)
        self.retrievals = retrievals

    def build_graph(self, **kwargs) -> CompiledStateGraph:
        """Compile the staged pipeline once and reuse it."""
        if self.graph is not None:
            return self.graph
        compiled = DatabotGraphBuilder.build(
            self.model,
            checkpointer=self.checkpointer,
            run_context=self.run_context,
            listener=self.listener,
        )
        self.graph = compiled
        return compiled

    def subagent_input(self, task: SubagentTask) -> dict[str, Any]:
        """Delegated turn: same per-turn baseline, plus the retrieval-history briefing."""
        state = super().subagent_input(task)
        DatabotTurnMessagePolicy.inject_history_briefing(state)
        return state

    def ui_view(self, state: Mapping[str, Any]) -> dict[str, Any]:
        """Artifact-panel and gate fields (``DATABOT_STATE_KEYS``)."""
        return databot_state_subset(state)

    async def aget_active_snapshot(self, config: RunnableConfig) -> StateSnapshot:
        """Gates pause inside layer subgraphs: return the paused layer's snapshot."""
        return await DatabotGraphBuilder.aget_active_state(self.build_graph(), config)

    def result_from_state(self, state: Mapping[str, Any]) -> SubagentResult:
        """Turn summary as text; approved models, SQL and result shape as artifacts."""
        base = super().result_from_state(state)
        # ``halted`` means a person stopped the run at a gate; a stop with no
        # gate decision (nothing to review) is a failure the lead reports.
        decisions = state.get("gate_decisions") or []
        stopped_by_reviewer = bool(decisions) and decisions[-1].get("decision") == "deny-halt"
        halted = bool((state.get("halt_reason") or "").strip()) and stopped_by_reviewer
        stopped_early = bool((state.get("halt_reason") or "").strip()) and not stopped_by_reviewer
        execution = state.get("execution_result") or {}
        artifacts: dict[str, Any] = {}
        approved = [
            str(card.get("name"))
            for card in (state.get("approved_cards") or [])
            if isinstance(card, Mapping) and card.get("name")
        ]
        if approved:
            artifacts["models"] = approved
        if (state.get("approved_sql") or "").strip():
            artifacts["sql"] = state["approved_sql"]
        if isinstance(execution, Mapping) and execution:
            artifacts["execution"] = {
                key: execution[key]
                for key in ("ok", "columns", "row_count", "truncated", "error")
                if key in execution
            }
            # The values themselves: without them a weak summary left the lead
            # with nothing to answer from, and it re-ran the whole retrieval.
            leading = result_rows_preview(execution.get("rows"))
            if leading:
                artifacts["execution"]["leading_rows"] = leading
        if state.get("metric_conflicts"):
            artifacts["metric_conflicts"] = list(state["metric_conflicts"])
        if state.get("dryrun"):
            artifacts["dryrun"] = True
        if halted or stopped_early:
            artifacts["halt_reason"] = state["halt_reason"]
        failed = isinstance(execution, Mapping) and execution.get("ok") is False
        status = "halted" if halted else ("failed" if failed or stopped_early else base.status)
        return SubagentResult(
            agent=base.agent,
            status=status,
            summary=base.summary,
            artifacts=artifacts,
            ui_state=self.ui_view(state),
        )

    async def accept_user_request(
        self,
        user_prompt: str,
        session: str,
        user_id: str | None = None,
    ) -> SessionUserRequest:
        """Accept the user turn and prepend prior retrieval cards when they exist."""
        user_request = await super().accept_user_request(user_prompt, session, user_id)
        DatabotTurnMessagePolicy.inject_history_briefing(user_request.state)
        return user_request

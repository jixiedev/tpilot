"""Databot staged pipeline: outer state machine with ReAct subgraphs per stage."""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import SystemMessage
from langchain_core.tools import BaseTool
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph.state import CompiledStateGraph

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
from config.agent_config import AgentConfig, DatabotAgentConfig, agent_config_path
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
        )
        self.graph = compiled
        return compiled

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

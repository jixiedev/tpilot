"""Per-turn message handling: build a turn's input messages and commit its state."""

from __future__ import annotations

from abc import ABC
from collections.abc import Mapping
from typing import TYPE_CHECKING, Any

from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langgraph.types import StateSnapshot

from graph.state import SessionAgentState, has_prior_turns
from memory.profile import UserProfile

if TYPE_CHECKING:
    from agent.prompt import SystemPromptAssembler


class TurnMessagePolicy(ABC):
    """Per-agent turn accept and commit: messages, history fields, checkpoint write-back."""

    @staticmethod
    def checkpoint_values(snapshot: StateSnapshot | Mapping[str, Any] | None) -> dict[str, Any]:
        if snapshot is None:
            return {}
        if isinstance(snapshot, Mapping):
            return dict(snapshot)
        return dict(getattr(snapshot, "values", None) or {})

    def restore_from_snapshot(
        self, snapshot: StateSnapshot | Mapping[str, Any]
    ) -> list[BaseMessage]:
        values = self.checkpoint_values(snapshot)
        messages = values.get("messages") or []
        return list(messages)

    def history_state(self, prior: Mapping[str, Any] | None = None) -> dict[str, Any]:
        """Non-message graph fields derived from prior checkpoint / sidecars."""
        return {}

    def commit_turn_state(self, state: SessionAgentState) -> dict[str, Any]:
        """Return full checkpoint state after turn commit (side effects + any field updates)."""
        return dict(state)


class DefaultTurnMessagePolicy(TurnMessagePolicy):
    """Pass-through restore; commit returns graph state unchanged."""


class SessionTurnProcessor:
    """Builds graph input for a new session turn and delegates turn commit to policy."""

    def __init__(
        self,
        system_prompt_assembler: SystemPromptAssembler,
        turn_message_policy: TurnMessagePolicy,
    ) -> None:
        self.system_prompt_assembler = system_prompt_assembler
        self.turn_message_policy = turn_message_policy

    def history_fields(self, prior: Mapping[str, Any] | None = None) -> dict[str, Any]:
        return self.turn_message_policy.history_state(prior)

    def commit_turn_state(self, state: SessionAgentState) -> dict[str, Any]:
        return self.turn_message_policy.commit_turn_state(state)

    def new_turn_state_with_messages(
        self,
        *,
        session: str,
        user_id: str,
        user_prompt: str,
        user_profile: UserProfile,
        prior: Mapping[str, Any] | None,
        turn_boundary: str,
    ) -> dict[str, Any]:
        messages = self.new_turn_messages(
            user_prompt,
            user_profile,
            prior or {},
            turn_boundary=turn_boundary,
        )
        return {
            "messages": messages,
            "session_name": session,
            "user_id": user_id,
            **self.history_fields(prior),
        }

    def new_turn_messages(
        self,
        user_prompt: str,
        user_profile: UserProfile,
        snapshot: StateSnapshot | Mapping[str, Any],
        *,
        turn_boundary: str,
    ) -> list[BaseMessage]:
        """Message delta merged into checkpoint history for this turn."""
        marker = turn_boundary.strip()
        prior_messages = self.turn_message_policy.restore_from_snapshot(snapshot)
        has_history = has_prior_turns(prior_messages)

        delta: list[BaseMessage] = []
        if not has_history:
            system_text = self.system_prompt_assembler.build(user_profile)
            if system_text.strip():
                delta.append(SystemMessage(content=system_text))
        elif marker:
            delta.append(SystemMessage(content=marker))

        delta.append(HumanMessage(content=user_prompt))
        return delta

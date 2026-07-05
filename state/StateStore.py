from __future__ import annotations

import logging
from typing import Optional

from langgraph.graph import MessagesState

from state.agent_state import AgentState


class StateStore:
    """In-memory session store for single-process CLI sessions."""

    def __init__(self, max_sessions: int = 200, evict_enabled: bool = False):
        self.session_states: dict[str, AgentState] = {}
        self.max_sessions = max_sessions
        self.evict_enabled = evict_enabled
        self.spilled_sessions: set[str] = set()

    def is_full(self) -> bool:
        return len(self.session_states) >= self.max_sessions

    def spill_session(self) -> bool:
        return False

    def find_spilled_session(self, session: str) -> MessagesState:
        raise KeyError(f"Spilled session not available: {session!r}")

    def evict_session(self) -> bool:
        if not self.session_states:
            return False
        oldest = next(iter(self.session_states))
        del self.session_states[oldest]
        return True

    def retrieval_state(self, session: str) -> AgentState:
        if session in self.session_states:
            return self.session_states[session]

        if session in self.spilled_sessions:
            return self.find_spilled_session(session)

        if self.is_full():
            if self.evict_enabled and self.evict_session():
                return self.initiate_session(session)
            logging.warning(
                "Session store full (%s); cannot create session %r",
                self.max_sessions,
                session,
            )
            raise RuntimeError("Session store is full")

        return self.initiate_session(session)

    def initiate_session(self, session: str) -> AgentState:
        state: AgentState = {"messages": [], "tool_call_count": 0}
        self.session_states[session] = state
        return state

    def save_session(self, session: str, state: MessagesState) -> bool:
        if session in self.session_states:
            self.session_states[session] = state  # type: ignore[assignment]
            return True
        if session in self.spilled_sessions:
            return True
        logging.warning("Unknown session %r; state not saved", session)
        return False

    def save_spilled_session(self, session: str, state: MessagesState) -> None:
        raise NotImplementedError("Spill-to-disk is not implemented")

    def shadow(self) -> None:
        raise NotImplementedError("Shadow eviction is not implemented")

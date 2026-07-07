from __future__ import annotations

import logging

from langchain_core.messages import AnyMessage, BaseMessage, HumanMessage, SystemMessage
from langgraph.graph import MessagesState


class AgentState(MessagesState):
    """Conversation state: message history plus per-turn tool budget."""

    tool_call_count: int
    idle_rounds: int


def _has_prior_turns(messages: list[BaseMessage]) -> bool:
    return any(message.type == "human" for message in messages)


def new_chat_state(system_prompt: str) -> AgentState:
    return {
        "messages": [SystemMessage(content=system_prompt)],
        "tool_call_count": 0,
        "idle_rounds": 0,
    }


def append_user_turn(state: AgentState, user_prompt: str) -> AgentState:
    """Append a user message and reset the tool-call budget for this turn."""
    state["messages"].append(HumanMessage(content=user_prompt))
    state["tool_call_count"] = 0
    state["idle_rounds"] = 0
    return state


def last_ai_message(state: AgentState) -> AnyMessage | None:
    for message in reversed(state["messages"]):
        if message.type == "ai" and message.content:
            return message
    return None


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
        state: AgentState = {"messages": [], "tool_call_count": 0, "idle_rounds": 0}
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


class StateProcessor:
    """Load session history, append the user turn, and persist graph output."""

    def __init__(self, state_store: StateStore):
        self.state_store = state_store

    def begin_turn(
        self,
        session: str,
        user_prompt: str,
        *,
        turn_boundary: str | None = None,
    ) -> AgentState:
        state = self.state_store.retrieval_state(session)
        if turn_boundary and _has_prior_turns(state["messages"]):
            state["messages"].append(SystemMessage(content=turn_boundary))
        state["messages"].append(HumanMessage(content=user_prompt))
        state["tool_call_count"] = 0
        state["idle_rounds"] = 0
        return state

    def finish_turn(self, session: str, state: AgentState) -> None:
        self.state_store.save_session(session, state)

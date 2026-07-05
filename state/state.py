from __future__ import annotations

from state.StateStore import StateStore
from state.agent_state import AgentState
from state.prompt import PromptLayout


class StateProcessor:
    """Load session history, append the user turn, and persist graph output."""

    def __init__(self, state_store: StateStore, prompt_layout: PromptLayout):
        self.state_store = state_store
        self.prompt_layout = prompt_layout

    def begin_turn(self, session: str, user_prompt: str) -> AgentState:
        state = self.state_store.retrieval_state(session)
        state = self.prompt_layout.assemble(state, raw_system_prompt="")
        for message in self.prompt_layout.turn_messages(state, user_prompt):
            state["messages"].append(message)
        state["tool_call_count"] = 0
        state["idle_rounds"] = 0
        return state

    def finish_turn(self, session: str, state: AgentState) -> None:
        self.state_store.save_session(session, state)

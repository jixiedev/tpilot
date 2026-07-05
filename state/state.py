from __future__ import annotations

from langchain_core.messages import HumanMessage, SystemMessage

from state.StateStore import StateStore
from state.agent_state import AgentState
from state.prompt import PromptLayout


class StateProcessor:
    """Prepare per-turn state from a session store."""

    def __init__(self, state_store: StateStore, prompt_layout: PromptLayout):
        self.state_store = state_store
        self.prompt_layout = prompt_layout

    def new_state(
        self,
        session: str,
        user_prompt: str,
        *,
        system_prompt: str | None = None,
    ) -> AgentState:
        history_state = self.state_store.retrieval_state(session)
        if not history_state["messages"] and system_prompt:
            history_state["messages"].append(SystemMessage(content=system_prompt))

        history_state["messages"].append(HumanMessage(content=user_prompt))
        history_state["tool_call_count"] = 0
        return history_state

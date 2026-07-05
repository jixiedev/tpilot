from __future__ import annotations

from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage

from state.agent_state import AgentState

SESSION_TURN_BOUNDARY = """\
--- Session turn boundary ---
Messages above this line are prior session history (context only).
Messages below this line are the current user request for this turn.
Use history for reference; focus tool calls and your reply on the current request.
"""


def _has_prior_turns(messages: list[BaseMessage]) -> bool:
    return any(message.type == "human" for message in messages)


class PromptLayout:
    @classmethod
    def turn_messages(cls, state: AgentState, user_prompt: str) -> list[BaseMessage]:
        """Messages to append when starting a new turn within a session."""
        batch: list[BaseMessage] = []
        if _has_prior_turns(state["messages"]):
            batch.append(SystemMessage(content=SESSION_TURN_BOUNDARY))
        batch.append(HumanMessage(content=user_prompt))
        return batch

    @staticmethod
    def assemble(state: AgentState, raw_system_prompt: str) -> AgentState:
        """Hook for future dynamic system prompt assembly; passthrough for now."""
        return state

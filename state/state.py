from __future__ import annotations

from langchain_core.messages import AnyMessage, BaseMessage, HumanMessage, SystemMessage
from langgraph.graph import MessagesState
from memory.compress import MemoryRecord


class SessionAgentState(MessagesState):
    """Conversation state: message history, session id, and per-turn tool budget."""

    session_name: str
    tool_call_count: int
    idle_rounds: int
    memories: list["MemoryRecord"]


    @staticmethod
    def reset_turn(state: SessionAgentState) -> None:
        state["tool_call_count"] = 0
        state["idle_rounds"] = 0

    @staticmethod
    def last_ai_message(state: SessionAgentState) -> AnyMessage | None:
        """Return the most recent AI message that has non-empty text content."""
        for message in reversed(state["messages"]):
            if message.type == "ai" and message.content:
                return message
        return None

    @staticmethod
    def has_prior_turns(messages: list[BaseMessage]) -> bool:
        return any(message.type == "human" for message in messages)

from __future__ import annotations

from typing import Literal

from langchain_core.messages import AnyMessage, BaseMessage
from langgraph.graph import MessagesState

from memory.profile import UserProfile

TurnTaskType = Literal["table_meta", "metric_def", "data_query", "anomaly", "other", "unclear"]
DEFAULT_TURN_TASK_TYPE: TurnTaskType = "unclear"


class SessionAgentState(MessagesState):
    """Conversation state: message history, session id, and per-turn tool budget."""

    session_name: str
    tool_call_count: int
    idle_rounds: int
    autonomous_compact_requested: bool
    failed_tools: list[str]
    turn_task_type: TurnTaskType
    user_profile: UserProfile

    @staticmethod
    def reset_turn(state: SessionAgentState) -> None:
        """Clear per-turn counters; leave ``user_profile`` intact across turns."""
        state["tool_call_count"] = 0
        state["idle_rounds"] = 0
        state["failed_tools"] = []
        state["turn_task_type"] = DEFAULT_TURN_TASK_TYPE

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

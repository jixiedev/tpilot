from __future__ import annotations

from typing import Any, Literal

from langchain_core.messages import AnyMessage, BaseMessage
from langgraph.graph import MessagesState

# Free-form intention label from IntentOrchestrator; specialists declare labels in the registry.
UserIntention = str
IntentionStatus = Literal["pending", "published", "rejected"]
DEFAULT_USER_INTENTION: UserIntention = "UNCLEAR"
DEFAULT_INTENTION_STATUS: IntentionStatus = "pending"


def message_text(content: Any) -> str:
    """Normalize message content (string or content blocks) to plain text."""
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        parts: list[str] = []
        for block in content:
            if isinstance(block, str) and block.strip():
                parts.append(block.strip())
            elif isinstance(block, dict) and block.get("text"):
                parts.append(str(block["text"]).strip())
        return "\n".join(part for part in parts if part)
    if content is None:
        return ""
    return str(content).strip()


def _messages(state: MessagesState | list[BaseMessage]) -> list[BaseMessage]:
    if isinstance(state, list):
        return state
    return list(state.get("messages") or [])


def last_ai_message(state: MessagesState | list[BaseMessage]) -> AnyMessage | None:
    """Return the most recent AI message with non-empty text content."""
    for message in reversed(_messages(state)):
        if getattr(message, "type", None) != "ai":
            continue
        if message_text(getattr(message, "content", None)):
            return message
    return None


def latest_human_text(state: MessagesState | list[BaseMessage]) -> str | None:
    """Return text from the most recent human message, if any."""
    for message in reversed(_messages(state)):
        if getattr(message, "type", None) != "human":
            continue
        text = message_text(getattr(message, "content", None))
        return text or None
    return None


def has_prior_turns(messages: list[BaseMessage]) -> bool:
    """Whether ``messages`` already contains at least one human turn."""
    return any(message.type == "human" for message in messages)


class SessionAgentState(MessagesState):
    """Conversation state: message history, session id, and per-turn tool budget."""

    session_name: str
    user_id: str
    tool_call_count: int
    idle_rounds: int
    autonomous_compact_requested: bool
    failed_tools: list[str]

    @staticmethod
    def reset_turn(state: SessionAgentState) -> None:
        """Clear per-turn counters; leave ``user_id`` intact across turns."""
        state["tool_call_count"] = 0
        state["idle_rounds"] = 0
        state["failed_tools"] = []


class IntentionState(MessagesState):
    """State for the intent-routing graph.

    ``user_intentions`` is always the canonical list (length 1 for simple tasks).
    ``user_intention`` / ``route_target`` mirror the first plan step for display.
    ``execution_plan`` is the ordered specialist plan published for AgentChain.
    """

    user_id: str
    user_question: str
    user_intention: UserIntention
    user_intentions: list[UserIntention]
    confidence: float
    need_clarification: str
    status: IntentionStatus
    route_target: str
    route_targets: list[str]
    plan_draft: list[dict[str, Any]]
    execution_plan: list[dict[str, Any]]
    clarification_rounds: int

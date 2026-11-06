"""LangGraph state schemas, plus helpers that read messages and counters from state."""

from __future__ import annotations

from typing import Any, Literal

from langchain_core.messages import AnyMessage, BaseMessage
from langgraph.graph import MessagesState
from pydantic import BaseModel

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
    """Conversation state shared by every session agent: history and identity."""

    session_name: str
    user_id: str


class ReactAgentState(SessionAgentState):
    """Session state plus ReAct loop bookkeeping."""

    tool_call_count: int
    idle_reason_rounds: int
    autonomous_compact_requested: bool
    failed_tools: list[str]

    @staticmethod
    def fresh_turn_defaults() -> dict[str, Any]:
        return {
            "tool_call_count": 0,
            "idle_reason_rounds": 0,
            "autonomous_compact_requested": False,
            "failed_tools": [],
        }

    @staticmethod
    def reset_turn(state: ReactAgentState) -> None:
        """Clear per-turn counters; leave ``user_id`` intact across turns."""
        state.update(ReactAgentState.fresh_turn_defaults())


class IntentionState(MessagesState):
    """State for the intent-routing graph.

    ``user_intentions`` lists detected labels (length 1 for simple tasks).
    Composite requests route to the Plan agent; ``route_target`` is the agent name.
    """

    user_id: str
    user_question: str
    user_intention: UserIntention
    user_intentions: list[UserIntention]
    confidence: float
    need_clarification: str
    status: IntentionStatus
    route_target: str
    clarification_rounds: int


# Readers used by ReAct routing; accept a state dict, model, or message list.


def tool_call_count(state: list[AnyMessage] | dict[str, Any] | BaseModel) -> int:
    if isinstance(state, dict):
        return state.get("tool_call_count", 0)
    if isinstance(state, list):
        return 0
    return getattr(state, "tool_call_count", 0)


def idle_reason_rounds(state: list[AnyMessage] | dict[str, Any] | BaseModel) -> int:
    if isinstance(state, dict):
        return state.get("idle_reason_rounds", 0)
    if isinstance(state, list):
        return 0
    return getattr(state, "idle_reason_rounds", 0)


def latest_message(
    state: list[AnyMessage] | dict[str, Any] | BaseModel,
    messages_key: str = "messages",
) -> AnyMessage:
    if isinstance(state, list):
        return state[-1]
    if isinstance(state, dict) and (messages := state.get(messages_key, [])):
        return messages[-1]
    if messages := getattr(state, messages_key, []):
        return messages[-1]
    raise ValueError(f"No messages found in input state to tool_edge: {state!r}")

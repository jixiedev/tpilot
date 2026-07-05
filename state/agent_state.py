"""LangGraph state schema for chat sessions."""

from __future__ import annotations

from langchain_core.messages import AnyMessage, HumanMessage, SystemMessage, ToolMessage
from langgraph.graph import MessagesState

from tools.chat import CHAT_COMPLETION_TOOL_NAME


class AgentState(MessagesState):
    """Conversation state: message history plus per-turn tool budget."""

    tool_call_count: int
    idle_rounds: int


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


def last_chat_reply(state: AgentState) -> str | None:
    """Return the reply from the most recent chat_completion tool result."""
    for message in reversed(state["messages"]):
        if isinstance(message, ToolMessage) and message.name == CHAT_COMPLETION_TOOL_NAME:
            content = message.content
            if isinstance(content, str):
                return content
            return str(content)
    return None

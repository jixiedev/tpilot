"""LangGraph state schema for chat sessions."""

from __future__ import annotations

from langchain_core.messages import AnyMessage, HumanMessage, SystemMessage
from langgraph.graph import MessagesState


class AgentState(MessagesState):
    """Conversation state: message history plus per-turn tool budget."""

    tool_call_count: int


def new_chat_state(system_prompt: str) -> AgentState:
    return {
        "messages": [SystemMessage(content=system_prompt)],
        "tool_call_count": 0,
    }


def append_user_turn(state: AgentState, user_prompt: str) -> AgentState:
    """Append a user message and reset the tool-call budget for this turn."""
    state["messages"].append(HumanMessage(content=user_prompt))
    state["tool_call_count"] = 0
    return state


def last_ai_message(state: AgentState) -> AnyMessage | None:
    for message in reversed(state["messages"]):
        if message.type == "ai" and message.content:
            return message
    return None

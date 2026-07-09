from __future__ import annotations

from langchain_core.messages import ToolMessage

from agent.chatbot.prompt import SESSION_TURN_BOUNDARY
from agent.chatbot.tools import CHAT_COMPLETION_TOOL_NAME
from state.state import SessionAgentState, StateProcessor


def begin_turn(state_processor: StateProcessor, session: str, user_prompt: str) -> SessionAgentState:
    return state_processor.begin_turn(
        session,
        user_prompt,
        turn_boundary=SESSION_TURN_BOUNDARY,
    )


def last_chat_reply(state: SessionAgentState) -> str | None:
    """Return the reply from the most recent chat_completion tool result."""
    for message in reversed(state["messages"]):
        if isinstance(message, ToolMessage) and message.name == CHAT_COMPLETION_TOOL_NAME:
            content = message.content
            if isinstance(content, str):
                return content
            return str(content)
    return None

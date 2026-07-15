from __future__ import annotations

import getpass

from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
from langgraph.graph.state import CompiledStateGraph

from agent.chatbot.prompt import SESSION_TURN_BOUNDARY
from agent.chatbot.tools import CHAT_COMPLETION_TOOL_NAME
from state.state import DEFAULT_TURN_TASK_TYPE, SessionAgentState


def graph_config(session: str) -> dict:
    return {"configurable": {"thread_id": session}}


def resolve_user_id(prior_user_id: object | None, *, explicit: str | None = None) -> str:
    """Pick the session user id from an explicit value, checkpoint, or process user."""
    if explicit is not None and str(explicit).strip():
        return str(explicit).strip()
    if isinstance(prior_user_id, str) and prior_user_id.strip():
        return prior_user_id.strip()
    return getpass.getuser()


async def prepare_turn_input(
    graph: CompiledStateGraph,
    session: str,
    user_prompt: str,
    *,
    user_id: str | None = None,
) -> SessionAgentState:
    """Build the per-turn graph input using checkpoint history for turn boundaries.

    Returned ``messages`` are merged via ``add_messages``, so each turn after the
    first persists another ``SESSION_TURN_BOUNDARY`` SystemMessage before the new
    HumanMessage. Markers accumulate by design (one per completed turn boundary).

    User profiles are loaded from ``ProfileStore`` by ``user_id``; only ``user_id``
    is kept in the session checkpoint.
    """
    snapshot = await graph.aget_state(graph_config(session))
    prior = snapshot.values or {}
    prior_messages = prior.get("messages", [])

    messages: list = []
    # Enters state (unlike step_llm ephemeral prompts). One marker per new turn.
    if prior_messages and SessionAgentState.has_prior_turns(prior_messages):
        messages.append(SystemMessage(content=SESSION_TURN_BOUNDARY))
    messages.append(HumanMessage(content=user_prompt))

    return {
        "messages": messages,
        "session_name": session,
        "user_id": resolve_user_id(prior.get("user_id"), explicit=user_id),
        "tool_call_count": 0,
        "idle_rounds": 0,
        "autonomous_compact_requested": False,
        "failed_tools": [],
        "turn_task_type": DEFAULT_TURN_TASK_TYPE,
    }


def last_chat_reply(state: SessionAgentState) -> str | None:
    """Return the reply from the most recent chat_completion tool result."""
    for message in reversed(state["messages"]):
        if isinstance(message, ToolMessage) and message.name == CHAT_COMPLETION_TOOL_NAME:
            content = message.content
            if isinstance(content, str):
                return content
            return str(content)
    return None

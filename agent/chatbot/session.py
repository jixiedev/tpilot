from __future__ import annotations

from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
from langgraph.graph.state import CompiledStateGraph

from agent.chatbot.prompt import SESSION_TURN_BOUNDARY
from agent.chatbot.tools import CHAT_COMPLETION_TOOL_NAME
from memory.profile import coerce_user_profile
from state.state import DEFAULT_TURN_TASK_TYPE, SessionAgentState


def graph_config(session: str) -> dict:
    return {"configurable": {"thread_id": session}}


async def prepare_turn_input(
    graph: CompiledStateGraph,
    session: str,
    user_prompt: str,
) -> SessionAgentState:
    """Build the per-turn graph input using checkpoint history for turn boundaries.

    Returned ``messages`` are merged via ``add_messages``, so each turn after the
    first persists another ``SESSION_TURN_BOUNDARY`` SystemMessage before the new
    HumanMessage. Markers accumulate by design (one per completed turn boundary).

    ``user_profile`` comes from the checkpoint when present; otherwise
    ``coerce_user_profile`` creates one with the process user as ``user_id``.
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
        "tool_call_count": 0,
        "idle_rounds": 0,
        "autonomous_compact_requested": False,
        "failed_tools": [],
        "turn_task_type": DEFAULT_TURN_TASK_TYPE,
        "user_profile": coerce_user_profile(prior.get("user_profile")),
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

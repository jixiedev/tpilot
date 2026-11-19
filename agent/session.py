"""Session ids and the accepted user turn passed into a graph."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from memory.profile import UserProfile
from graph.state import SessionAgentState


#: Graph-step ceiling for every run. LangGraph's default (25) is reached after
#: about eight ReAct rounds (reason, action, compress per round); the real
#: bounds are the tool and delegation budgets, so this is only a safety net.
GRAPH_RECURSION_LIMIT = 200


def session_graph_config(session_id: str) -> dict[str, Any]:
    """LangGraph runnable config keyed by session (checkpointer ``thread_id``)."""
    return {"configurable": {"thread_id": session_id}, "recursion_limit": GRAPH_RECURSION_LIMIT}


@dataclass
class SessionUserRequest:
    """One accepted user turn: identity, prompt, profile, and graph input."""

    session_id: str
    user_id: str
    user_prompt: str
    user_profile: UserProfile
    state: SessionAgentState

    def graph_config(self) -> dict[str, Any]:
        return session_graph_config(self.session_id)

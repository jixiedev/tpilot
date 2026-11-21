"""Session ids and the accepted user turn passed into a graph."""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any

from tahoepilot.memory.profile import UserProfile
from tahoepilot.memory.profile_store import RUN_USER_ID_KEY
from tahoepilot.agent.graph.state import SessionAgentState


#: Graph-step ceiling for every run. LangGraph's default (25) is reached after
#: about eight ReAct rounds (reason, action, compress per round); the real
#: bounds are the tool and delegation budgets, so this is only a safety net.
GRAPH_RECURSION_LIMIT = 200


def with_run_user(config: Mapping[str, Any] | None, user_id: str | None) -> dict[str, Any]:
    """``config`` with ``configurable.user_id`` set (unchanged copy when ``user_id`` is empty)."""
    merged = dict(config or {})
    uid = (user_id or "").strip()
    if uid:
        merged["configurable"] = {**(merged.get("configurable") or {}), RUN_USER_ID_KEY: uid}
    return merged


def session_graph_config(session_id: str, user_id: str | None = None) -> dict[str, Any]:
    """LangGraph runnable config keyed by session (checkpointer ``thread_id``).

    ``user_id`` goes to ``configurable.user_id``, where tools and nested
    specialists read it (``tahoepilot.memory.profile_store.run_user_id``).
    """
    config = {"configurable": {"thread_id": session_id}, "recursion_limit": GRAPH_RECURSION_LIMIT}
    return with_run_user(config, user_id)


@dataclass
class SessionUserRequest:
    """One accepted user turn: identity, prompt, profile, and graph input."""

    session_id: str
    user_id: str
    user_prompt: str
    user_profile: UserProfile
    state: SessionAgentState

    def graph_config(self) -> dict[str, Any]:
        return session_graph_config(self.session_id, self.user_id)

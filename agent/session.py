"""Session ids and the accepted user turn passed into a graph."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Literal

from memory.profile import UserProfile
from graph.state import SessionAgentState


def session_graph_config(session_id: str) -> dict[str, Any]:
    """LangGraph runnable config keyed by session (checkpointer ``thread_id``)."""
    return {"configurable": {"thread_id": session_id}}


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


SpecialistSessionKind = Literal["specialist", "chain", "plan", "route"]


class SpecialistSession:
    """Isolated checkpoint thread id for a child agent."""

    @staticmethod
    def id(
        parent: str,
        agent_name: str | int,
        *,
        kind: SpecialistSessionKind = "specialist",
        run: str | None = None,
    ) -> str:
        if kind == "specialist":
            return f"{parent}:{agent_name}"
        if kind == "chain":
            return f"{parent}:chain:{agent_name}"
        if kind == "route":
            return f"{parent}:route:{agent_name}"
        if kind == "plan":
            run_id = run or "pending"
            return f"{parent}:plan:{run_id}:step:{agent_name}"
        raise ValueError(f"unknown session kind: {kind!r}")

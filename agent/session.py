"""Session / turn helpers shared by ReAct agents."""

from __future__ import annotations

import getpass
from typing import Literal

from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph.state import CompiledStateGraph

from state.state import SessionAgentState, has_prior_turns

SpecialistSessionKind = Literal["specialist", "chain", "plan", "route"]


def config_thread_id() -> str:
    """Thread id for the active LangGraph run, or empty outside a run."""
    try:
        from langgraph.config import get_config

        cfg = get_config()
    except Exception:
        return ""
    configurable = cfg.get("configurable") if isinstance(cfg, dict) else None
    if not isinstance(configurable, dict):
        return ""
    return str(configurable.get("thread_id") or "").strip()


def specialist_session_id(
    parent: str,
    agent_name: str | int,
    *,
    kind: SpecialistSessionKind = "specialist",
    run: str | None = None,
) -> str:
    """Derive an isolated checkpoint thread id for a child agent."""
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


class SessionTurnBuilder:
    """Build per-turn graph input from checkpoint history."""

    def __init__(self, turn_boundary: str = "") -> None:
        self.turn_boundary = turn_boundary

    @staticmethod
    def graph_config(session: str) -> dict:
        return {"configurable": {"thread_id": session}}

    @staticmethod
    def resolve_user_id(prior_user_id: object | None, *, explicit: str | None = None) -> str:
        if explicit is not None and str(explicit).strip():
            return str(explicit).strip()
        if isinstance(prior_user_id, str) and prior_user_id.strip():
            return prior_user_id.strip()
        return getpass.getuser()

    async def prepare_turn_input(
        self,
        graph: CompiledStateGraph,
        session: str,
        user_prompt: str,
        *,
        user_id: str | None = None,
    ) -> SessionAgentState:
        snapshot = await graph.aget_state(self.graph_config(session))
        prior = snapshot.values or {}
        prior_messages = prior.get("messages", [])

        messages: list = []
        if (
            self.turn_boundary
            and prior_messages
            and has_prior_turns(prior_messages)
        ):
            messages.append(SystemMessage(content=self.turn_boundary))
        messages.append(HumanMessage(content=user_prompt))

        return {
            "messages": messages,
            "session_name": session,
            "user_id": self.resolve_user_id(prior.get("user_id"), explicit=user_id),
            "tool_call_count": 0,
            "idle_rounds": 0,
            "autonomous_compact_requested": False,
            "failed_tools": [],
        }

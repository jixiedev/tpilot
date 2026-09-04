"""State schema for the Plan agent outer graph."""

from __future__ import annotations

from typing import Any

from agent.plan._constants import STAGE_CREATE
from state.state import SessionAgentState


class PlanState(SessionAgentState):
    """Plan-and-execute turn state."""

    plan_id: str
    stage: str
    step_results: list[dict[str, Any]]
    subagent_rounds: int
    adjust_had_tool_calls: bool
    user_question: str
    # JSON-serializable mirror of the in-process Plan, written back by the
    # create_plan / planning tools so the AG-UI frontend can render the task
    # tree without needing access to the planning tool's process-local state.
    plan_snapshot: dict[str, Any] | None


def fresh_turn_state_defaults() -> dict[str, Any]:
    """Reset per-turn plan fields while keeping session messages."""
    return {
        "plan_id": "",
        "stage": STAGE_CREATE,
        "step_results": [],
        "subagent_rounds": 0,
        "adjust_had_tool_calls": False,
        "user_question": "",
        "plan_snapshot": None,
    }

"""State schema for the Plan agent outer graph."""

from __future__ import annotations

from typing import Any

from agent.react.plan._constants import STAGE_CREATE
from state.state import SessionAgentState


class PlanState(SessionAgentState):
    """Plan-and-execute turn state."""

    plan_id: str
    stage: str
    step_results: list[dict[str, Any]]
    subagent_rounds: int
    adjust_had_tool_calls: bool
    user_question: str


def fresh_turn_state_defaults() -> dict[str, Any]:
    """Reset per-turn plan fields while keeping session messages."""
    return {
        "plan_id": "",
        "stage": STAGE_CREATE,
        "step_results": [],
        "subagent_rounds": 0,
        "adjust_had_tool_calls": False,
        "user_question": "",
    }

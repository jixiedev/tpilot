"""State schema for the Plan agent outer graph."""

from __future__ import annotations

from typing import Annotated, Any

from agent.plan._constants import STAGE_CREATE
from state.state import SessionAgentState


def keep_latest(current: Any, update: Any) -> Any:
    """Keep the newest value when several writers land in one step.

    LangGraph's default ``LastValue`` channel rejects two writes to the same
    key in the same step with ``InvalidUpdateError``. The Plan agent has
    several writers for the same fields — the round node, the ``planning``
    tool, ``create_plan`` and ``invoke_agent`` — and the model may call two
    of them in a single turn, which would abort the whole run.
    """
    return update


class PlanState(SessionAgentState):
    """Plan-and-execute turn state."""

    plan_id: str
    # ``stage`` is written by the round node and by three tools.
    stage: Annotated[str, keep_latest]
    # ``step_results`` is written by ``invoke_agent``; it already appends to
    # the previous list, so the newest write is the complete one.
    step_results: Annotated[list[dict[str, Any]], keep_latest]
    subagent_rounds: int
    # Written by the round node and by the ``planning`` tool.
    adjust_had_tool_calls: Annotated[bool, keep_latest]
    user_question: str
    # JSON-serializable mirror of the in-process Plan, written back by the
    # create_plan / planning tools so the AG-UI frontend can render the task
    # tree without needing access to the planning tool's process-local state.
    # Every writer publishes a snapshot of the same in-process plan, so the
    # newest one is also the correct one.
    plan_snapshot: Annotated[dict[str, Any] | None, keep_latest]


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

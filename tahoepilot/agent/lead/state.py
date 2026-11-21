"""Lead agent state: the conversation plus the per-turn plan and the session work record."""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from typing import Any

from tahoepilot.agent.subagent import (
    STEP_BLOCKED,
    STEP_DONE,
    STEP_FAILED,
    STEP_PENDING,
    STEP_SKIPPED,
    STATUS_TO_STEP,
    compact_work_record,
)
from tahoepilot.agent.graph.state import ReactAgentState, latest_human_text

PLAN_STATUSES = frozenset({STEP_PENDING, STEP_DONE, STEP_BLOCKED, STEP_FAILED, STEP_SKIPPED})
OPEN_STATUSES = frozenset({STEP_PENDING})


class LeadState(ReactAgentState):
    """Lead ReAct state.

    ``plan`` is reset every turn; ``work_record`` and ``active_subagent`` are
    kept across turns (the record is compacted at each turn start).
    """

    user_question: str
    turn_index: int
    plan: list[dict[str, Any]]
    work_record: list[dict[str, Any]]
    turn_delegations: int
    #: UI view of the latest specialist run: ``{"name": ..., "state": {...}}``.
    #: AG-UI overlays the live state of a specialist paused at a gate.
    active_subagent: dict[str, Any]


def turn_start(state: Mapping[str, Any]) -> dict[str, Any]:
    """Graph entry for every new turn (CLI and AG-UI): reset per-turn fields."""
    return {
        **ReactAgentState.fresh_turn_defaults(),
        "user_question": latest_human_text(state) or "",
        "turn_index": int(state.get("turn_index") or 0) + 1,
        "plan": [],
        "turn_delegations": 0,
        "work_record": compact_work_record(list(state.get("work_record") or [])),
    }


def turn_finish(state: Mapping[str, Any]) -> dict[str, Any]:
    """Graph exit: steps still pending when the lead answered are marked skipped."""
    plan = [dict(step) for step in state.get("plan") or []]
    changed = False
    for step in plan:
        if step.get("status") in OPEN_STATUSES:
            step["status"] = STEP_SKIPPED
            changed = True
    return {"plan": plan} if changed else {}


def normalize_steps(
    steps: Sequence[Mapping[str, Any]],
    *,
    known_agents: frozenset[str],
) -> list[dict[str, Any]]:
    """Validate ``write_plan`` input. Raises ``ValueError`` with a message for the LLM."""
    if not steps:
        raise ValueError("`steps` must list at least one step")
    out: list[dict[str, Any]] = []
    for index, raw in enumerate(steps, start=1):
        text = str(raw.get("text") or "").strip()
        if not text:
            raise ValueError(f"step {index} has no text")
        agent = str(raw.get("agent") or "").strip().lower()
        if agent and agent not in known_agents:
            allowed = ", ".join(sorted(known_agents))
            raise ValueError(f"step {index}: unknown agent {agent!r}; choose one of: {allowed}")
        status = str(raw.get("status") or STEP_PENDING).strip().lower()
        if status not in PLAN_STATUSES:
            raise ValueError(
                f"step {index}: unknown status {status!r}; use one of: {', '.join(sorted(PLAN_STATUSES))}"
            )
        out.append({"text": text, "agent": agent, "status": status})
    return out


def mark_step(
    plan: Sequence[Mapping[str, Any]],
    *,
    step: int | None,
    agent: str,
    task: str,
    result_status: str,
) -> tuple[list[dict[str, Any]], int | None]:
    """Record one delegation's outcome in the plan.

    - ``step`` given and valid → that step.
    - otherwise the first pending step for ``agent`` (or with no agent).
    - otherwise, when a plan exists, a new finished step is appended, so the
      plan always lists what actually ran.
    Returns the new plan and the 1-based step number (``None`` without a plan).
    """
    steps = [dict(item) for item in plan]
    if not steps:
        return steps, None
    status = STATUS_TO_STEP.get(result_status, STEP_FAILED)
    index: int | None = None
    if step is not None and 1 <= step <= len(steps):
        index = step - 1
    else:
        for i, item in enumerate(steps):
            if item.get("status") in OPEN_STATUSES and item.get("agent") in ("", agent):
                index = i
                break
    if index is None:
        steps.append({"text": task, "agent": agent, "status": status, "added": True})
        return steps, len(steps)
    steps[index]["status"] = status
    if not steps[index].get("agent"):
        steps[index]["agent"] = agent
    return steps, index + 1


def pending_steps(plan: Sequence[Mapping[str, Any]]) -> list[int]:
    return [i for i, step in enumerate(plan, start=1) if step.get("status") in OPEN_STATUSES]


def render_plan(plan: Sequence[Mapping[str, Any]]) -> str:
    lines = []
    for i, step in enumerate(plan, start=1):
        agent = f"[{step['agent']}] " if step.get("agent") else ""
        lines.append(f"{i}. ({step.get('status', STEP_PENDING)}) {agent}{step.get('text', '')}")
    return "\n".join(lines)


def render_work_record(record: Sequence[Mapping[str, Any]], *, limit: int = 10) -> str:
    """Compact work-record listing for the lead's step prompt."""
    lines = []
    for row in list(record)[-limit:]:
        summary = " ".join(str(row.get("summary") or "").split())
        if len(summary) > 300:
            summary = summary[:299].rstrip() + "…"
        artifacts = row.get("artifacts") or {}
        extra = f" · artifacts: {', '.join(sorted(artifacts))}" if artifacts else ""
        lines.append(
            f"- turn {row.get('turn', '?')} · {row.get('agent', '?')} · {row.get('status', '?')}"
            f" · task: {row.get('task', '')} → {summary}{extra}"
        )
    return "\n".join(lines)

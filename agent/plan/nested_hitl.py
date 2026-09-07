"""Run a nested specialist so its interrupts pause the parent Plan graph.

LangGraph replays the parent tool from the top on resume. The child graph
keeps its own checkpoint under ``{plan_session}:{agent}``. If that child
thread is still sitting on an interrupt, this module skips a new turn and
only ``Command(resume=...)`` the child after the parent ``interrupt()``
returns.

``interrupt()`` calls in the parent tool are matched by order. After each
nested resume that leads to another gate, the number of already-applied
resumes is kept in-process (keyed by child session) so the next parent
replay can replay that many ``interrupt()`` calls before the current gate.
"""

from __future__ import annotations

import json
from collections.abc import Mapping
from typing import Any

from langgraph.types import Command, interrupt

from agent.turn import (
    extract_turn_output,
    interrupt_values,
    interrupt_values_from_snapshot,
)

APPLIED_KEY = "parent_hitl_applied"

# Keep in sync with ``PLAN_NESTED_HITL_REPLAY_ID`` in the Plan UI.
REPLAY_INTERRUPT_ID = "plan-nested-hitl-replay"

_REPLAY_MARKER: dict[str, str] = {
    "id": REPLAY_INTERRUPT_ID,
    "reason": "replay",
    "message": "",
}


_applied_by_session: dict[str, int] = {}


def applied_hitl_rounds(state: Mapping[str, Any] | None) -> int:
    """How many nested interrupts this parent tool has already resumed."""
    if not state:
        return 0
    try:
        return max(0, int(state.get(APPLIED_KEY) or 0))
    except (TypeError, ValueError):
        return 0


def as_parent_interrupt(value: Any) -> dict[str, Any]:
    """Normalize a nested interrupt value into the AG-UI ``{id, reason, message}`` shape."""
    if isinstance(value, dict):
        if value.get("id") and "message" in value:
            return {
                "id": str(value.get("id") or "plan-nested-interrupt"),
                "reason": str(value.get("reason") or "")[:120],
                "message": value.get("message"),
            }
        question = value.get("question")
        if question is not None and str(question).strip():
            message = (
                json.dumps(value, ensure_ascii=False)
                if "gate" in value
                else str(question).strip()
            )
            return {
                "id": str(value.get("id") or value.get("type") or "plan-nested-interrupt"),
                "reason": str(question).strip()[:120],
                "message": message,
            }
        reason = str(value.get("reason") or "").strip()
        if reason:
            return {
                "id": str(value.get("id") or "plan-nested-interrupt"),
                "reason": reason[:120],
                "message": reason,
            }
    text = str(value).strip() if value is not None else ""
    return {
        "id": "plan-nested-interrupt",
        "reason": (text or "Please provide the information needed to continue.")[:120],
        "message": text or "Please provide the information needed to continue.",
    }


def _bound_graph(specialist: Any) -> Any | None:
    try:
        return specialist.graph
    except (AttributeError, RuntimeError):
        return None


async def run_specialist_bubbling_interrupts(
    specialist: Any,
    task: str,
    session: str,
) -> str:
    """Invoke ``specialist`` and re-emit nested interrupts on the calling graph."""
    graph = _bound_graph(specialist)
    if graph is None:
        raise RuntimeError("specialist graph is not bound")
    config = specialist.graph_config(session)
    snapshot = await graph.aget_state(config)
    pending = interrupt_values_from_snapshot(snapshot)

    if pending:
        state: Any = dict(snapshot.values or {})
        applied = _applied_by_session.get(session, applied_hitl_rounds(state))
        for _ in range(applied):
            interrupt(_REPLAY_MARKER)
    else:
        turn_input = await specialist.prepare_turn_input(
            graph, session, task, user_id=None
        )
        if isinstance(turn_input, dict):
            turn_input = {**turn_input, APPLIED_KEY: 0}
        _applied_by_session[session] = 0
        state = await graph.ainvoke(turn_input, config)
        pending = interrupt_values(state)
        applied = 0

    while pending:
        reply = interrupt(as_parent_interrupt(pending[0]))
        state = await graph.ainvoke(Command(resume=reply), config)
        applied += 1
        _applied_by_session[session] = applied
        pending = interrupt_values(state)

    _applied_by_session.pop(session, None)
    return extract_turn_output(state if isinstance(state, dict) else {})

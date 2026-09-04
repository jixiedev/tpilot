"""Pure state subset for the Plan agent UI (AG-UI bridge + REST actions).

The frontend binds to a small, stable shape that the AG-UI ``STATE_SNAPSHOT``
event carries in its delta. Keep ``PLAN_STATE_KEYS`` aligned with the keys
the Plan page actually reads — adding a new key here forces the frontend to
handle the new field, which is the contract we want.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

# Fields the frontend reads off the LangGraph state. Mirrors PlanState.
PLAN_STATE_KEYS: tuple[str, ...] = (
    "plan_id",
    "stage",
    "user_question",
    "subagent_rounds",
    "step_results",
    "plan_snapshot",
)


def plan_state_subset(state: Mapping[str, Any]) -> dict[str, Any]:
    """Return plan fields from a LangGraph state dict for the frontend.

    ``state`` is whatever ``CompiledStateGraph.aget_state(config).values``
    yielded — the Plan checkpoint values plus session messages. We pull out
    just the keys the plan UI needs; everything else (messages, profile
    internals, etc.) stays on the backend.
    """
    out: dict[str, Any] = {}
    for key in PLAN_STATE_KEYS:
        if key in state:
            out[key] = state[key]
    return out

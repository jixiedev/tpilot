"""State subset for the Plan agent UI (AG-UI bridge + REST actions).

The frontend binds to a small, stable shape that the AG-UI ``STATE_SNAPSHOT``
event carries. Keep ``PLAN_STATE_KEYS`` aligned with the keys the Plan page
actually reads — adding a new key here forces the frontend to handle the new
field, which is the contract we want.

A plan round runs inside a subgraph. Step updates land in that subgraph's
checkpoint and in the in-memory plan, but the parent checkpoint keeps the
snapshot from when the round started until the round returns. AG-UI snapshots
the parent, so the task tree would jump backwards. ``overlay_live_plan_snapshot``
puts the in-memory plan on every snapshot while that plan still exists.
"""

from __future__ import annotations

import copy
import logging
import sqlite3
from collections.abc import Mapping
from typing import Any

from agent.plan._constants import STAGE_EXECUTE, VALID_STAGES
from tools.plan import get_plan_dict

logger = logging.getLogger(__name__)

# Latest decoded plan snapshot per thread, keyed by checkpoint id so a
# snapshot emission does not re-decode the same blob.
_checkpoint_snapshot_cache: dict[str, tuple[str, dict[str, Any] | None]] = {}

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


def _plan_id_of(state: Mapping[str, Any]) -> str:
    plan_id = str(state.get("plan_id") or "").strip()
    if plan_id:
        return plan_id
    snapshot = state.get("plan_snapshot")
    if isinstance(snapshot, Mapping):
        return str(snapshot.get("plan_id") or "").strip()
    return ""


def _checkpoint_plan_snapshot(thread_id: str) -> dict[str, Any] | None:
    """Plan snapshot from the newest checkpoint of ``thread_id``.

    The newest row is the running subgraph while a round is open, and that
    row already has the step statuses the parent checkpoint does not.
    """
    from config.local_config import get_local_paths
    from langgraph.checkpoint.serde.jsonplus import JsonPlusSerializer

    path = get_local_paths().checkpoint_db
    if not path.is_file():
        return None
    try:
        con = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
    except sqlite3.Error:
        logger.debug("plan snapshot: could not open checkpoint db", exc_info=True)
        return None
    try:
        row = con.execute(
            """SELECT checkpoint_id, type, checkpoint FROM checkpoints
               WHERE thread_id = ? ORDER BY checkpoint_id DESC LIMIT 1""",
            (thread_id,),
        ).fetchone()
    except sqlite3.Error:
        logger.debug("plan snapshot: checkpoint read failed", exc_info=True)
        return None
    finally:
        con.close()
    if not row:
        return None
    checkpoint_id, typed, blob = row
    cached = _checkpoint_snapshot_cache.get(thread_id)
    if cached is not None and cached[0] == checkpoint_id:
        return cached[1]
    try:
        data = JsonPlusSerializer().loads_typed((typed, blob))
    except Exception:
        logger.debug("plan snapshot: checkpoint decode failed", exc_info=True)
        _checkpoint_snapshot_cache[thread_id] = (checkpoint_id, None)
        return None
    channels = data.get("channel_values") if isinstance(data, Mapping) else None
    snapshot = channels.get("plan_snapshot") if isinstance(channels, Mapping) else None
    if not isinstance(snapshot, dict) or not snapshot.get("plan_id"):
        snapshot = None
    _checkpoint_snapshot_cache[thread_id] = (checkpoint_id, snapshot)
    return snapshot


def _apply_plan_snapshot(out: dict[str, Any], live: Mapping[str, Any]) -> dict[str, Any]:
    out["plan_snapshot"] = copy.deepcopy(live)
    if not str(out.get("plan_id") or "").strip():
        out["plan_id"] = live.get("plan_id")
    steps = live.get("steps") or []
    in_progress = any(
        isinstance(step, Mapping) and step.get("status") == "in_progress"
        for step in steps
    )
    # A nested specialist writes its own stage (sql, fetch, …) onto the
    # same field. While a step is still claimed, the plan is executing.
    if in_progress and out.get("stage") not in VALID_STAGES:
        out["stage"] = STAGE_EXECUTE
    return out


def overlay_live_plan_snapshot(state: Mapping[str, Any] | None) -> dict[str, Any]:
    """Copy ``state`` and replace ``plan_snapshot`` with the current plan.

    Returns a new dict. ``state`` is left unchanged. The in-memory plan wins
    while this process is running it. Otherwise the newest checkpoint for
    the thread is used, which is the subgraph copy while a round is open.
    """
    if not isinstance(state, Mapping):
        return {}
    out = dict(state)
    live = get_plan_dict(_plan_id_of(out))
    if live:
        return _apply_plan_snapshot(out, live)
    thread_id = str(out.get("session_name") or "").strip()
    if not thread_id:
        return out
    durable = _checkpoint_plan_snapshot(thread_id)
    if not durable:
        return out
    state_plan_id = _plan_id_of(out)
    if state_plan_id and durable.get("plan_id") != state_plan_id:
        return out
    return _apply_plan_snapshot(out, durable)

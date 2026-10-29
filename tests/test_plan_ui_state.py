"""Tests for the Plan agent UI state subset helper.

The frontend binds to a small, stable shape (see ``agent/plan/ui_state.py``).
Adding or removing a key here is a contract change; these tests pin the
current shape so a future edit doesn't silently drop a field the UI reads.
"""

from __future__ import annotations

from agent.plan import ui_state
from agent.plan.agui_agent import PlanLangGraphAgent, with_live_plan_snapshot_event
from agent.plan.ui_state import PLAN_STATE_KEYS, overlay_live_plan_snapshot, plan_state_subset
from tools.plan import StepStatus, mark_step_status, run_planning


def test_plan_state_keys_are_stable() -> None:
    assert PLAN_STATE_KEYS == (
        "plan_id",
        "stage",
        "user_question",
        "subagent_rounds",
        "step_results",
        "plan_snapshot",
    )


def test_plan_state_subset_picks_only_known_keys() -> None:
    full = {
        "plan_id": "p1",
        "stage": "execute",
        "user_question": "what's GMV?",
        "subagent_rounds": 2,
        "step_results": [{"agent": "databot", "output": "42"}],
        "plan_snapshot": {"plan_id": "p1", "title": "T", "steps": []},
        # Keys the UI does not read — must be filtered out.
        "messages": ["hidden"],
        "profile_blob": "internal",
        "_private": True,
    }
    out = plan_state_subset(full)
    assert out == {
        "plan_id": "p1",
        "stage": "execute",
        "user_question": "what's GMV?",
        "subagent_rounds": 2,
        "step_results": [{"agent": "databot", "output": "42"}],
        "plan_snapshot": {"plan_id": "p1", "title": "T", "steps": []},
    }
    assert "messages" not in out
    assert "_private" not in out


def test_plan_state_subset_handles_missing_keys() -> None:
    """Partial state (e.g. mid-turn) must not raise; missing keys are simply absent."""
    out = plan_state_subset({"plan_id": "p1"})
    assert out == {"plan_id": "p1"}


def test_plan_state_subset_handles_empty() -> None:
    assert plan_state_subset({}) == {}


def test_plan_state_subset_preserves_none_snapshot() -> None:
    """``plan_snapshot`` is ``None`` before the agent calls ``create_plan``."""
    out = plan_state_subset({"plan_id": "p1", "stage": "create", "plan_snapshot": None})
    assert out == {"plan_id": "p1", "stage": "create", "plan_snapshot": None}


def test_overlay_replaces_a_stale_parent_snapshot() -> None:
    """The parent checkpoint lags the round; the live plan is what the tree shows."""
    plan_id = "p-overlay-stale"
    run_planning(
        "create",
        plan_id=plan_id,
        title="GMV",
        steps=["[databot] look up", "[databot] query"],
    )
    try:
        mark_step_status(plan_id, 0, StepStatus.COMPLETED, "done")
        mark_step_status(plan_id, 1, StepStatus.IN_PROGRESS)
        stale = {
            "plan_id": plan_id,
            "stage": "sql",
            "plan_snapshot": {
                "plan_id": plan_id,
                "steps": [
                    {"index": 0, "status": "in_progress"},
                    {"index": 1, "status": "not_started"},
                ],
                "progress": {"completed": 0, "in_progress": 1},
            },
        }
        out = overlay_live_plan_snapshot(stale)
        assert stale["plan_snapshot"]["progress"]["completed"] == 0
        assert out["plan_snapshot"]["steps"][0]["status"] == "completed"
        assert out["plan_snapshot"]["steps"][1]["status"] == "in_progress"
        assert out["plan_snapshot"]["progress"]["completed"] == 1
        assert out["stage"] == "execute"
    finally:
        run_planning("delete", plan_id=plan_id)


def test_overlay_uses_the_subgraph_checkpoint_when_memory_was_cleared(
    monkeypatch,
) -> None:
    """A restarted process has no in-memory plan; the newest checkpoint does."""
    durable = {
        "plan_id": "p-durable",
        "steps": [
            {"index": 0, "status": "completed"},
            {"index": 1, "status": "completed"},
            {"index": 2, "status": "in_progress"},
        ],
        "progress": {"total": 3, "completed": 2, "in_progress": 1},
    }
    monkeypatch.setattr(ui_state, "_checkpoint_plan_snapshot", lambda thread_id: durable)
    out = overlay_live_plan_snapshot(
        {
            "plan_id": "p-durable",
            "session_name": "thread-1",
            "stage": "execute",
            "plan_snapshot": {
                "plan_id": "p-durable",
                "steps": [{"index": 0, "status": "in_progress"}],
                "progress": {"completed": 0, "in_progress": 1},
            },
        }
    )
    assert out["plan_snapshot"]["progress"]["completed"] == 2
    assert out["plan_snapshot"]["steps"][2]["status"] == "in_progress"
    out["plan_snapshot"]["steps"][2]["status"] = "completed"
    assert durable["steps"][2]["status"] == "in_progress"


def test_overlay_keeps_checkpoint_snapshot_when_the_plan_is_gone() -> None:
    checkpoint = {
        "plan_id": "p-overlay-missing",
        "stage": "execute",
        "plan_snapshot": {"plan_id": "p-overlay-missing", "steps": []},
    }
    out = overlay_live_plan_snapshot(checkpoint)
    assert out["plan_snapshot"] == checkpoint["plan_snapshot"]
    assert out is not checkpoint


def test_overlay_reads_plan_id_from_the_snapshot() -> None:
    plan_id = "p-overlay-from-snap"
    run_planning("create", plan_id=plan_id, title="T", steps=["[databot] one"])
    try:
        mark_step_status(plan_id, 0, StepStatus.COMPLETED)
        out = overlay_live_plan_snapshot(
            {"stage": "execute", "plan_snapshot": {"plan_id": plan_id, "steps": []}}
        )
        assert out["plan_id"] == plan_id
        assert out["plan_snapshot"]["steps"][0]["status"] == "completed"
        assert out["stage"] == "execute"
    finally:
        run_planning("delete", plan_id=plan_id)


class _Started:
    type = "RUN_STARTED"


class _Finished:
    type = "RUN_FINISHED"


def test_interrupt_replay_inserts_the_snapshot_after_run_started() -> None:
    snapshot = object()
    events = with_live_plan_snapshot_event([_Started(), _Finished()], snapshot)
    assert events is not None
    assert [type(event).__name__ if event is not snapshot else "snap" for event in events] == [
        "_Started",
        "snap",
        "_Finished",
    ]


class _Nodes:
    nodes: dict = {}


def test_plan_agent_snapshot_uses_the_live_plan() -> None:
    plan_id = "p-agent-snapshot"
    run_planning("create", plan_id=plan_id, title="T", steps=["[databot] one"])
    try:
        mark_step_status(plan_id, 0, StepStatus.IN_PROGRESS)
        agent = PlanLangGraphAgent(name="plan", graph=_Nodes())  # type: ignore[arg-type]
        agent.active_run = {"schema_keys": None}
        out = agent.get_state_snapshot(
            {
                "plan_id": plan_id,
                "stage": "fetch",
                "plan_snapshot": {"plan_id": plan_id, "steps": [{"status": "not_started"}]},
            }
        )
        assert out["plan_snapshot"]["steps"][0]["status"] == "in_progress"
        assert out["stage"] == "execute"
    finally:
        run_planning("delete", plan_id=plan_id)

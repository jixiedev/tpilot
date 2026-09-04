from __future__ import annotations

import pytest

from tools.plan import PlanToolError, clear_plans, get_plan_dict, planning, run_planning


@pytest.fixture(autouse=True)
def _reset_plans() -> None:
    clear_plans()
    yield
    clear_plans()


def test_create_list_get() -> None:
    created = run_planning(
        "create",
        plan_id="p1",
        title="Trip",
        steps=["Book flight", "Book hotel"],
    )
    assert "Plan created" in created
    assert "Book flight" in created

    listed = run_planning("list")
    assert "p1" in listed

    got = run_planning("get", plan_id="p1")
    assert "[ ] Book flight" in got


def test_mark_step_requires_plan_id() -> None:
    run_planning("create", plan_id="p1", title="Task", steps=["Step A", "Step B"])
    with pytest.raises(PlanToolError, match="plan_id"):
        run_planning("mark_step", plan_id=None, step_index=0, step_status="completed")

    marked = run_planning(
        "mark_step",
        plan_id="p1",
        step_index=0,
        step_status="completed",
        step_notes="done",
    )
    assert "[✓] Step A" in marked
    assert "Notes: done" in marked


def test_update_preserves_matching_step_status() -> None:
    run_planning("create", plan_id="p1", title="Task", steps=["A", "B"])
    run_planning("mark_step", plan_id="p1", step_index=0, step_status="completed")
    updated = run_planning("update", plan_id="p1", steps=["A", "C"])
    assert "[✓] A" in updated
    assert "[ ] C" in updated


def test_get_requires_plan_id() -> None:
    run_planning("create", plan_id="p1", title="Task", steps=["A"])
    run_planning("delete", plan_id="p1")
    with pytest.raises(PlanToolError, match="plan_id"):
        run_planning("get", plan_id=None)


def test_create_rejects_duplicate_id() -> None:
    run_planning("create", plan_id="p1", title="One", steps=["x"])
    with pytest.raises(PlanToolError, match="already exists"):
        run_planning("create", plan_id="p1", title="Two", steps=["y"])


def test_planning_tool_invoke() -> None:
    result = planning.invoke(
        {"command": "create", "plan_id": "p2", "title": "Demo", "steps": ["one", "two"]}
    )
    assert "Plan created" in result


def test_get_plan_dict_returns_json_shape() -> None:
    """``get_plan_dict`` is the source of truth for the AG-UI plan tree."""
    run_planning(
        "create",
        plan_id="p3",
        title="Demo plan",
        steps=["[databot] Find GMV", "Draft summary", "Notify team"],
    )
    snap = get_plan_dict("p3")
    assert snap is not None
    assert snap["plan_id"] == "p3"
    assert snap["title"] == "Demo plan"
    assert len(snap["steps"]) == 3
    for i, step in enumerate(snap["steps"]):
        assert step["index"] == i
        assert step["status"] == "not_started"
        assert step["notes"] == ""
    assert snap["progress"] == {
        "total": 3,
        "completed": 0,
        "in_progress": 0,
        "blocked": 0,
        "not_started": 3,
    }


def test_get_plan_dict_reflects_mark_step() -> None:
    run_planning("create", plan_id="p4", title="T", steps=["a", "b", "c"])
    run_planning("mark_step", plan_id="p4", step_index=0, step_status="completed")
    run_planning(
        "mark_step", plan_id="p4", step_index=1, step_status="in_progress", step_notes="doing"
    )
    run_planning("mark_step", plan_id="p4", step_index=2, step_status="blocked")
    snap = get_plan_dict("p4")
    assert snap is not None
    assert [s["status"] for s in snap["steps"]] == [
        "completed",
        "in_progress",
        "blocked",
    ]
    assert snap["steps"][1]["notes"] == "doing"
    assert snap["progress"] == {
        "total": 3,
        "completed": 1,
        "in_progress": 1,
        "blocked": 1,
        "not_started": 0,
    }


def test_get_plan_dict_none_for_missing_or_empty() -> None:
    assert get_plan_dict("nonexistent") is None
    assert get_plan_dict("") is None
    assert get_plan_dict(None) is None
    assert get_plan_dict("   ") is None


def test_get_plan_dict_after_delete_returns_none() -> None:
    run_planning("create", plan_id="p5", title="T", steps=["a"])
    assert get_plan_dict("p5") is not None
    run_planning("delete", plan_id="p5")
    assert get_plan_dict("p5") is None

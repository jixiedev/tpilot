from __future__ import annotations

import pytest

from tools.plan import PlanToolError, clear_plans, planning, run_planning


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

"""Tests for the Plan agent's stage tools.

The plan tools mutate both the in-process planning state and the LangGraph
checkpoint state. The ``plan_snapshot`` writeback is what makes the AG-UI
frontend able to render the task tree without direct access to the
planning tool's process-local dict, so we lock the contract here.
"""

from __future__ import annotations

from langgraph.prebuilt import ToolRuntime

from agent.plan.stage_tools import create_plan, planning
from tools.plan import clear_plans, get_plan_dict


def _runtime(state: dict | None = None, tool_call_id: str = "call_1") -> ToolRuntime:
    """Build a ``ToolRuntime`` with the minimum fields the plan tools read.

    The dataclass has many required fields in the pinned langgraph version;
    we only exercise the ones the plan tools actually use (``state`` and
    ``tool_call_id``). The remaining fields fall back to their dataclass
    defaults, which are safe to leave empty for these unit tests.
    """
    return ToolRuntime(
        state=state or {},
        context=None,  # type: ignore[arg-type]
        config=None,  # type: ignore[arg-type]
        stream_writer=None,  # type: ignore[arg-type]
        tool_call_id=tool_call_id,
        store=None,  # type: ignore[arg-type]
        tools=[],
    )


def setup_function(_func) -> None:  # noqa: D401  (pytest fixture style)
    clear_plans()


def test_create_plan_writes_plan_snapshot() -> None:
    cmd = create_plan.invoke(
        {
            "plan_id": "p1",
            "title": "Demo",
            "steps": ["A", "B", "C"],
            "runtime": _runtime(),
        }
    )
    update = cmd.update
    assert update["plan_id"] == "p1"
    snap = update["plan_snapshot"]
    assert snap is not None
    assert snap["plan_id"] == "p1"
    assert snap["title"] == "Demo"
    assert [s["text"] for s in snap["steps"]] == ["A", "B", "C"]
    assert all(s["status"] == "not_started" for s in snap["steps"])
    # And the in-process plan is in sync with the snapshot.
    assert get_plan_dict("p1") == snap


def test_planning_mark_step_updates_snapshot() -> None:
    # Seed a plan first.
    create_plan.invoke(
        {
            "plan_id": "p2",
            "title": "T",
            "steps": ["[databot] x", "y"],
            "runtime": _runtime(tool_call_id="seed"),
        }
    )
    cmd = planning.invoke(
        {
            "command": "mark_step",
            "plan_id": "p2",
            "step_index": 0,
            "step_status": "completed",
            "step_notes": "done",
            "runtime": _runtime(
                state={"plan_id": "p2", "stage": "adjust"},
                tool_call_id="mark_1",
            ),
        }
    )
    snap = cmd.update["plan_snapshot"]
    assert snap["steps"][0]["status"] == "completed"
    assert snap["steps"][0]["notes"] == "done"
    # ``adjust`` with mark_step loops back to execute.
    assert cmd.update["stage"] == "execute"
    assert cmd.update["adjust_had_tool_calls"] is True


def test_planning_get_does_not_overwrite_snapshot() -> None:
    """Read-only planning commands must not regress the snapshot field."""
    create_plan.invoke(
        {
            "plan_id": "p3",
            "title": "T",
            "steps": ["a"],
            "runtime": _runtime(tool_call_id="seed"),
        }
    )
    cmd = planning.invoke(
        {
            "command": "get",
            "plan_id": "p3",
            "runtime": _runtime(state={"plan_id": "p3", "stage": "execute"}),
        }
    )
    # ``get`` doesn't add a ``plan_snapshot`` key — the existing one stands.
    assert "plan_snapshot" not in cmd.update
    assert "messages" in cmd.update

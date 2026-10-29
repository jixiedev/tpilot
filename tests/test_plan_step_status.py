"""Tests for the Plan agent's step-status bookkeeping.

The task tree in the web UI is rendered from ``plan_snapshot`` — the JSON
mirror of the in-process :class:`~tools.plan.Plan`. Its step statuses are
the only thing the UI has to show progress, so they must be maintained by
the execution path itself, not by the model remembering to call
``planning(mark_step)``.

These tests lock that contract down.
"""

from __future__ import annotations

import pytest

from agent.plan.stage_tools import _target_step_index, create_plan
from tools.plan import (
    Plan,
    StepStatus,
    claim_next_step,
    clear_plans,
    get_plan,
    get_plan_dict,
    mark_step_status,
    release_step_claims,
)


def setup_function(_func) -> None:  # noqa: D401  (pytest fixture style)
    clear_plans()


def _seed_plan(plan_id: str = "p1", steps: list[str] | None = None) -> None:
    plan = Plan(plan_id, "T", steps or ["[databot] one", "[swe] two", "three"])
    get_plan  # keep the import meaningful for readers
    from tools.plan import _plans  # noqa: PLC0415  (test-local store access)

    _plans[plan_id] = plan


def test_claim_next_step_marks_first_open_step_in_progress() -> None:
    _seed_plan()
    snap = claim_next_step("p1")
    assert snap is not None
    assert snap["steps"][0]["status"] == "in_progress"
    assert snap["steps"][1]["status"] == "not_started"
    assert snap["progress"]["in_progress"] == 1


def test_claim_next_step_never_leaves_two_open_claims() -> None:
    """A claim still open when the next round starts means that step never ran."""
    _seed_plan()
    claim_next_step("p1")
    snap = claim_next_step("p1")
    assert snap is not None
    # Exactly one open claim, and it is the first unfinished step.
    assert snap["progress"]["in_progress"] == 1
    assert snap["steps"][0]["status"] == "in_progress"


def test_claim_next_step_moves_on_after_a_step_completed() -> None:
    _seed_plan()
    mark_step_status("p1", 0, StepStatus.COMPLETED, "ok")
    snap = claim_next_step("p1")
    assert snap is not None
    assert snap["steps"][0]["status"] == "completed"
    assert snap["steps"][1]["status"] == "in_progress"


def test_release_step_claims_clears_open_claims() -> None:
    _seed_plan()
    claim_next_step("p1")
    snap = release_step_claims("p1")
    assert snap is not None
    assert all(s["status"] == "not_started" for s in snap["steps"])
    # Nothing changed the second time around.
    assert release_step_claims("p1") is None


def test_mark_step_status_writes_the_snapshot() -> None:
    _seed_plan()
    snap = mark_step_status("p1", 1, StepStatus.COMPLETED, "done")
    assert snap is not None
    assert snap["steps"][1]["status"] == "completed"
    assert snap["steps"][1]["notes"] == "done"
    assert snap["progress"]["completed"] == 1


def test_mark_step_status_ignores_out_of_range_index() -> None:
    _seed_plan()
    assert mark_step_status("p1", 99, StepStatus.COMPLETED) is None


def test_target_step_prefers_the_step_owned_by_the_agent() -> None:
    plan = Plan("p2", "T", ["[swe] a", "[databot] b", "[databot] c"])
    assert _target_step_index(plan, "databot") == 1
    assert _target_step_index(plan, "swe") == 0
    # An agent with no owned step falls back to the first open step.
    assert _target_step_index(plan, "knowledge") == 0


def test_target_step_skips_finished_steps() -> None:
    plan = Plan("p3", "T", ["[databot] a", "[databot] b"])
    plan.mark_step(0, StepStatus.COMPLETED, None)
    assert _target_step_index(plan, "databot") == 1


def test_target_step_returns_none_when_everything_is_done() -> None:
    plan = Plan("p4", "T", ["[databot] a"])
    plan.mark_step(0, StepStatus.COMPLETED, None)
    assert _target_step_index(plan, "databot") is None


def test_snapshot_never_regresses_to_all_pending_after_a_step_completes() -> None:
    """Regression guard for the reported bug: the UI showed every step as
    "pending" forever because nothing updated the mirror."""
    create_plan.invoke(
        {
            "plan_id": "p5",
            "title": "T",
            "steps": ["[databot] one", "two"],
            "runtime": _runtime(tool_call_id="seed"),
        }
    )
    claim_next_step("p5")
    snap = mark_step_status("p5", 0, StepStatus.COMPLETED, "ok")
    assert snap is not None
    assert snap["steps"][0]["status"] == "completed"
    assert snap["progress"]["completed"] == 1
    assert get_plan_dict("p5")["steps"][0]["status"] == "completed"


class _StubRunner:
    """Minimal ``SpecialistRunner`` stand-in for the delegation tool."""

    def __init__(self, output: str = "done", error: Exception | None = None) -> None:
        self.output = output
        self.error = error
        self.calls: list[tuple[str, str]] = []

    async def run(
        self,
        agent_name: str,
        task: str,
        *,
        parent_session: str = "",
        bubble_to_parent: bool = True,
    ) -> str:
        self.calls.append((agent_name, task))
        if self.error is not None:
            raise self.error
        return self.output


async def test_invoke_agent_marks_the_step_completed() -> None:
    """The delegation path owns the step status — the model does not have to
    remember to call ``planning(mark_step)``."""
    from agent.plan.stage_tools import make_invoke_agent_tool

    create_plan.invoke(
        {
            "plan_id": "p6",
            "title": "T",
            "steps": ["[swe] one", "[swe] two"],
            "runtime": _runtime(tool_call_id="seed"),
        }
    )
    tool = make_invoke_agent_tool(_StubRunner("listed 3 files"))
    cmd = await tool.ainvoke(
        {
            "agent_name": "swe",
            "task": "list the files",
            "runtime": _runtime(state={"plan_id": "p6"}, tool_call_id="call_1"),
        }
    )
    update = cmd.update
    assert update["stage"] == "execute"
    assert update["step_results"][0]["agent"] == "swe"
    snap = update["plan_snapshot"]
    assert snap["steps"][0]["status"] == "completed"
    assert snap["steps"][0]["notes"] == "listed 3 files"
    assert snap["progress"]["completed"] == 1
    # The in-process plan agrees with the snapshot.
    assert get_plan_dict("p6")["steps"][0]["status"] == "completed"


async def test_invoke_agent_publishes_step_status_while_the_specialist_runs() -> None:
    """The task tree is pushed when a step is claimed and when it finishes.

    The stream does not snapshot a Command, so the UI would otherwise keep
    the status from the last node that returned a dict.
    """
    from unittest.mock import AsyncMock, patch

    from agent.plan.stage_tools import make_invoke_agent_tool

    create_plan.invoke(
        {
            "plan_id": "p6b",
            "title": "T",
            "steps": ["[databot] look up", "[databot] query"],
            "runtime": _runtime(tool_call_id="seed"),
        }
    )
    publish = AsyncMock()
    tool = make_invoke_agent_tool(_StubRunner("gmv is 10"))
    with patch("agent.plan.stage_tools.adispatch_custom_event", publish):
        await tool.ainvoke(
            {
                "agent_name": "databot",
                "task": "look up gmv",
                "runtime": _runtime(
                    state={"plan_id": "p6b", "stage": "create", "subagent_rounds": 1},
                    tool_call_id="call_1",
                ),
            }
        )
    assert publish.await_count == 2
    started = publish.await_args_list[0].args
    finished = publish.await_args_list[1].args
    assert started[0] == "manually_emit_state"
    assert started[1]["stage"] == "execute"
    assert started[1]["plan_snapshot"]["steps"][0]["status"] == "in_progress"
    assert started[1]["plan_snapshot"]["steps"][1]["status"] == "not_started"
    assert finished[1]["plan_snapshot"]["steps"][0]["status"] == "completed"
    assert finished[1]["plan_snapshot"]["progress"]["completed"] == 1
    assert finished[1]["step_results"][0]["output"] == "gmv is 10"
    assert finished[1]["subagent_rounds"] == 1


async def test_invoke_agent_blocks_the_step_when_the_specialist_fails() -> None:
    from agent.plan.stage_tools import make_invoke_agent_tool

    create_plan.invoke(
        {
            "plan_id": "p7",
            "title": "T",
            "steps": ["[swe] one"],
            "runtime": _runtime(tool_call_id="seed"),
        }
    )
    tool = make_invoke_agent_tool(_StubRunner(error=RuntimeError("boom")))
    cmd = await tool.ainvoke(
        {
            "agent_name": "swe",
            "task": "do it",
            "runtime": _runtime(state={"plan_id": "p7"}, tool_call_id="call_1"),
        }
    )
    snap = cmd.update["plan_snapshot"]
    assert snap["steps"][0]["status"] == "blocked"
    assert snap["progress"]["blocked"] == 1


@pytest.mark.parametrize("plan_id", [None, "", "unknown"])
def test_helpers_tolerate_unknown_plans(plan_id: str | None) -> None:
    assert claim_next_step(plan_id) is None
    assert release_step_claims(plan_id) is None
    assert mark_step_status(plan_id, 0, StepStatus.COMPLETED) is None


def test_multi_writer_channels_have_reducers() -> None:
    """Two writers in one step must not abort the run.

    ``plan_snapshot`` is written by the round node, by ``planning`` and by
    ``invoke_agent``; the model may call two of them in the same turn.
    Without a reducer LangGraph raises
    ``InvalidUpdateError: Can receive only one value per step``.
    """
    from typing import Annotated, get_origin, get_type_hints

    from agent.plan.state import PlanState

    hints = get_type_hints(PlanState, include_extras=True)
    for key in ("stage", "step_results", "adjust_had_tool_calls", "plan_snapshot"):
        annotation = hints[key]
        assert get_origin(annotation) is Annotated, (
            f"{key} needs a reducer: it has several writers in one step"
        )


def _runtime(state: dict | None = None, tool_call_id: str = "call_1"):
    from langgraph.prebuilt import ToolRuntime

    return ToolRuntime(
        state=state or {},
        context=None,  # type: ignore[arg-type]
        config=None,  # type: ignore[arg-type]
        stream_writer=None,  # type: ignore[arg-type]
        tool_call_id=tool_call_id,
        store=None,  # type: ignore[arg-type]
        tools=[],
    )

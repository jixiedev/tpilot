from __future__ import annotations

from agent.listener import CliReactListener
from agent.plan.plan_agent import PlanStepStatus
from agent.plan.stage_tools import PlanSubagentListener


def test_format_plan_step_status_includes_agent_and_task() -> None:
    text = PlanStepStatus.format("databot", "Find GMV definition")
    assert text == "Running databot: Find GMV definition"


def test_format_plan_step_status_truncates_long_task() -> None:
    task = "x" * 200
    text = PlanStepStatus.format("swe", task)
    assert text.startswith("Running swe: ")
    assert text.endswith("…")
    assert len(text) < len(task)


def test_plan_tool_call_listener_prints_status_for_invoke_agent(capsys) -> None:
    listener = CliReactListener()
    on_tool_call = PlanSubagentListener(listener).tool_call_callback()
    on_tool_call(
        "invoke_agent",
        {"agent_name": "databot", "task": "Look up revenue tables"},
    )
    out = capsys.readouterr().out
    assert "Status> Running databot: Look up revenue tables" in out
    assert "Tool> invoke_agent" not in out


def test_plan_tool_call_listener_forwards_other_tools(capsys) -> None:
    listener = CliReactListener()
    on_tool_call = PlanSubagentListener(listener).tool_call_callback()
    on_tool_call("planning", {"command": "get"})
    out = capsys.readouterr().out
    assert "Tool> planning" in out

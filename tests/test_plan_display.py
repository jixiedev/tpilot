from __future__ import annotations

from agent.listener import CliReactListener
from agent.plan.display import format_plan_step_status
from agent.plan.tool_listeners import make_plan_tool_call_listener


def test_format_plan_step_status_includes_agent_and_task() -> None:
    text = format_plan_step_status("databot", "Find GMV definition")
    assert text == "Running databot: Find GMV definition"


def test_format_plan_step_status_truncates_long_task() -> None:
    task = "x" * 200
    text = format_plan_step_status("swe", task)
    assert text.startswith("Running swe: ")
    assert text.endswith("…")
    assert len(text) < len(task)


def test_plan_tool_call_listener_prints_status_for_invoke_agent(capsys) -> None:
    listener = CliReactListener()
    on_tool_call = make_plan_tool_call_listener(listener)
    on_tool_call(
        "invoke_agent",
        {"agent_name": "databot", "task": "Look up revenue tables"},
    )
    out = capsys.readouterr().out
    assert "Status> Running databot: Look up revenue tables" in out
    assert "Tool> invoke_agent" not in out


def test_plan_tool_call_listener_forwards_other_tools(capsys) -> None:
    listener = CliReactListener()
    on_tool_call = make_plan_tool_call_listener(listener)
    on_tool_call("planning", {"command": "get"})
    out = capsys.readouterr().out
    assert "Tool> planning" in out

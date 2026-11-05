from __future__ import annotations

import json
from pathlib import Path

import pytest
from langchain_core.messages import AIMessage

from agent.turn import AgentTurnResult
from observability.case import ReactEvalCase, ToolsSpec
from observability.evaluator import score_max_tool_calls
from observability.trace import EvalReactListener


def _react_case(**overrides) -> ReactEvalCase:
    values = dict(
        agent_name="knowledge",
        eval_set="harness",
        name="sample",
        prompt="hello",
        expected_output={},
        models=["MiniMax-M3"],
        tools=ToolsSpec.empty(),
        max_tool_calls=0,
    )
    values.update(overrides)
    return ReactEvalCase(**values)


def _listener_with_tools(*names: str) -> EvalReactListener:
    listener = EvalReactListener()
    for index, name in enumerate(names):
        listener.on_tool_call(name, {"step": index})
        listener.on_reason_step(
            AIMessage(content="", tool_calls=[{"name": name, "args": {}, "id": str(index)}])
        )
    return listener


def test_tools_spec_ordered_match() -> None:
    spec = ToolsSpec(required=["planning", "bash"], allowed=["planning", "bash"])
    score, details = spec.score(["planning", "bash"])
    assert score == 1.0
    assert details["reason"] == "ordered match"


def test_tools_spec_unexpected_calls() -> None:
    score, details = ToolsSpec.empty().score(["planning"])
    assert score == 0.0
    assert details["reason"] == "no tools expected"


def test_tools_spec_disallowed() -> None:
    spec = ToolsSpec(required=["planning"], allowed=["planning"])
    score, details = spec.score(["planning", "bash"])
    assert score == 0.0
    assert details["reason"] == "disallowed tool used"


def test_tools_spec_unordered_partial_credit() -> None:
    spec = ToolsSpec(required=["planning", "bash"], allowed=["planning", "bash"])
    score, details = spec.score(["bash", "planning"])
    assert score == 0.5
    assert details["reason"] == "unordered partial"


def test_score_max_tool_calls_within_budget() -> None:
    score, details = score_max_tool_calls(2, 2)
    assert score == 1.0
    assert details["actual"] == 2


def test_score_max_tool_calls_overshoot_penalty() -> None:
    score, _details = score_max_tool_calls(1, 3)
    assert score == pytest.approx(0.0)


def test_react_case_scores_tools_budget_and_answer() -> None:
    case = _react_case(
        tools=ToolsSpec(required=["planning", "bash"], allowed=["planning", "bash"]),
        max_tool_calls=2,
    )
    result = case.score(
        AgentTurnResult(state={"reply": '{"ticket": "TAHOE-949"}'}),
        _listener_with_tools("planning", "bash"),
    )
    assert result.score.value_of("tools") == 1.0
    assert result.score.value_of("max_tool_calls") == 1.0

    answer = _react_case(expected_output={"ticket": "TAHOE-949"}).score(
        AgentTurnResult(state={"reply": '{"ticket": "TAHOE-949"}'}),
        EvalReactListener(),
    )
    assert answer.score.value_of("answer") == 1.0


def test_tools_spec_from_raw_object(tmp_path: Path) -> None:
    payload = {
        "required": ["search"],
        "allowed": ["search"],
        "forbidden": [],
    }
    spec = ToolsSpec.from_raw(payload)
    assert spec.required == ["search"]
    assert spec.allowed == ["search"]
    (tmp_path / "ok.json").write_text(json.dumps(payload), encoding="utf-8")
    assert json.loads((tmp_path / "ok.json").read_text(encoding="utf-8")) == payload

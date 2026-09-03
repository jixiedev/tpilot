from __future__ import annotations

import json
from pathlib import Path
from unittest.mock import AsyncMock

import pytest
from langchain_core.messages import AIMessage

from agent.turn import AgentTurnResult
from observability.case import (
    CaseAggregate,
    CaseResult,
    ToolCallCase,
    _is_subsequence,
    _normalize_suites,
    find_cases,
    format_case_aggregate,
    format_case_result,
    list_case_groups,
    parse_models_field,
    resolve_group_path,
    run_cases,
)
from observability.observe import CaseScore, EvalReactListener


def _case(**overrides) -> ToolCallCase:
    defaults = {
        "name": "sample",
        "case_group": "general/default",
        "query": "hello",
        "expected_tools": [],
        "total_rounds": 1,
        "answer": {},
        "models": ["sensenova-6.7-flash-lite"],
    }
    defaults.update(overrides)
    return ToolCallCase(**defaults)


def _eval_listener_with_tools(*names: str) -> EvalReactListener:
    eval_listener = EvalReactListener()
    for index, name in enumerate(names):
        eval_listener.on_tool_call(name, {"step": index})
        eval_listener.on_reason_step(
            AIMessage(content="", tool_calls=[{"name": name, "args": {}, "id": str(index)}])
        )
    return eval_listener


def test_is_subsequence() -> None:
    assert _is_subsequence(["a", "b"], ["x", "a", "y", "b"])
    assert not _is_subsequence(["a", "b"], ["b", "a"])
    assert _is_subsequence([], ["anything"])
    assert not _is_subsequence(["a"], [])


def test_score_tools_ordered_match() -> None:
    case = _case(expected_tools=["planning", "bash"])
    eval_listener = _eval_listener_with_tools("planning", "bash")
    score, details = case._score_tools(eval_listener)
    assert score == 1.0
    assert details["reason"] == "ordered match"


def test_score_tools_unexpected_calls() -> None:
    case = _case(expected_tools=[])
    eval_listener = _eval_listener_with_tools("planning")
    score, details = case._score_tools(eval_listener)
    assert score == 0.0
    assert details["reason"] == "no tools expected"


def test_score_tools_unordered_partial_credit() -> None:
    case = _case(expected_tools=["planning", "bash"])
    eval_listener = _eval_listener_with_tools("bash", "planning")
    score, details = case._score_tools(eval_listener)
    assert score == 0.5
    assert details["reason"] == "unordered partial"


def test_score_rounds_within_budget() -> None:
    case = _case(total_rounds=2)
    eval_listener = _eval_listener_with_tools("planning", "bash")
    score, details = case._score_rounds(eval_listener)
    assert score == 1.0
    assert details["actual"] == 2


def test_score_rounds_overshoot_penalty() -> None:
    case = _case(total_rounds=1)
    eval_listener = _eval_listener_with_tools("planning", "bash", "web_search")
    score, _details = case._score_rounds(eval_listener)
    assert score == pytest.approx(0.0)


def test_score_answer_json_match() -> None:
    case = _case(answer={"ticket": "TAHOE-949"})
    score, details = case._score_answer('{"ticket": "TAHOE-949"}')
    assert score == 1.0
    assert details["missing"] == []


def test_score_answer_json_missing_or_invalid() -> None:
    case = _case(answer={"ticket": "TAHOE-949"})
    score, details = case._score_answer("No ticket here.")
    assert score == 0.0
    assert details["missing"] == ["ticket"]

    score_mismatch, details_mismatch = case._score_answer('{"ticket": "TAHOE-1"}')
    assert score_mismatch == 0.0
    assert details_mismatch["mismatched"] == ["ticket"]


def test_score_cancelled_turn() -> None:
    case = _case(answer={"x": "1"})
    eval_listener = EvalReactListener()
    result = case.score(AgentTurnResult(cancelled=True), eval_listener)
    assert result.cancelled
    assert "CANCELLED" in format_case_result(result)


def test_normalize_suites_accepts_list_or_dict() -> None:
    assert _normalize_suites([{"name": "a"}]) == {"default": [{"name": "a"}]}
    assert _normalize_suites({"jira": [{"name": "b"}]}) == {"jira": [{"name": "b"}]}
    assert _normalize_suites({"models": ["m1"], "jira": [{"name": "b"}]}) == {
        "jira": [{"name": "b"}]
    }


def test_parse_models_field() -> None:
    assert parse_models_field("a", label="x") == ["a"]
    assert parse_models_field(["a", "b"], label="x") == ["a", "b"]
    assert parse_models_field(None, label="x", default_models=["d"]) == ["d"]
    with pytest.raises(ValueError, match="missing required field 'models'"):
        parse_models_field(None, label="x")


def test_find_cases_loads_group_and_validates_fields(tmp_path: Path) -> None:
    payload = {
        "models": ["sensenova-6.7-flash-lite", "glm-4.7-flash"],
        "default": [
            {
                "name": "ok",
                "query": "hello",
                "expected_tools": ["planning"],
                "answer": {"x": "y"},
            }
        ],
    }
    (tmp_path / "general.json").write_text(json.dumps(payload), encoding="utf-8")
    cases = find_cases(["general"], cases_dir=tmp_path)
    assert len(cases) == 1
    assert cases[0].name == "ok"
    assert cases[0].expected_tools == ["planning"]
    assert cases[0].models == ["sensenova-6.7-flash-lite", "glm-4.7-flash"]


def test_find_cases_case_level_models_override_file_default(tmp_path: Path) -> None:
    payload = {
        "models": ["file-model"],
        "default": [
            {
                "name": "override",
                "query": "hello",
                "models": ["case-model"],
            }
        ],
    }
    (tmp_path / "general.json").write_text(json.dumps(payload), encoding="utf-8")
    cases = find_cases(["general"], cases_dir=tmp_path)
    assert cases[0].models == ["case-model"]


def test_find_cases_requires_models(tmp_path: Path) -> None:
    (tmp_path / "bad.json").write_text(
        json.dumps({"default": [{"name": "x", "query": "q"}]}),
        encoding="utf-8",
    )
    with pytest.raises(ValueError, match="missing required field 'models'"):
        find_cases(["bad"], cases_dir=tmp_path)


def test_find_cases_requires_query(tmp_path: Path) -> None:
    (tmp_path / "bad.json").write_text(
        json.dumps({"models": ["m"], "default": [{"name": "missing-query"}]}),
        encoding="utf-8",
    )
    with pytest.raises(ValueError, match="missing required field 'query'"):
        find_cases(["bad"], cases_dir=tmp_path)


def test_resolve_group_path_supports_alias(tmp_path: Path) -> None:
    (tmp_path / "knowledge.json").write_text("[]", encoding="utf-8")
    path = resolve_group_path("knowledge_case", cases_dir=tmp_path)
    assert path.name == "knowledge.json"


def test_list_case_groups(tmp_path: Path) -> None:
    (tmp_path / "general.json").write_text("[]", encoding="utf-8")
    (tmp_path / "tahoe.json").write_text("[]", encoding="utf-8")
    assert list_case_groups(cases_dir=tmp_path) == ["general", "tahoe"]


@pytest.mark.asyncio
async def test_run_cases_averages_across_models(tmp_path: Path) -> None:
    payload = {
        "models": ["model-a", "model-b"],
        "default": [{"name": "arith", "query": "1+1", "answer": {}}],
    }
    (tmp_path / "general.json").write_text(json.dumps(payload), encoding="utf-8")

    scores = {"model-a": 1.0, "model-b": 0.4}

    async def factory(model_name: str):
        agent = AsyncMock()
        agent.register_secondary = lambda _o: None
        agent.clear_secondaries = lambda: None
        return agent

    async def fake_run(self, agent, *, model_name: str = ""):
        value = scores[model_name]
        return CaseResult(
            case=self,
            score=CaseScore(tool_score=value, round_score=value, answer_score=value),
            reply="",
            model_name=model_name,
        )

    monkey = pytest.MonkeyPatch()
    monkey.setattr(ToolCallCase, "run", fake_run)
    try:
        average, aggregates = await run_cases(["general"], factory, cases_dir=tmp_path)
    finally:
        monkey.undo()

    assert average == pytest.approx(0.7)
    assert len(aggregates) == 1
    assert aggregates[0].average == pytest.approx(0.7)
    assert [r.model_name for r in aggregates[0].model_results] == ["model-a", "model-b"]
    text = format_case_aggregate(aggregates[0])
    assert "case avg: 0.700" in text
    assert "model=model-a" in text

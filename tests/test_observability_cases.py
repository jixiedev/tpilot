from __future__ import annotations

import json
from pathlib import Path

import pytest
from langchain_core.messages import AIMessage

from agent.turn import AgentTurnResult
from observability.case import (
    ToolCallCase,
    _is_subsequence,
    _normalize_suites,
    find_cases,
    format_case_result,
    list_case_groups,
    resolve_group_path,
)
from observability.observe import Observer


def _case(**overrides) -> ToolCallCase:
    defaults = {
        "name": "sample",
        "case_group": "general/default",
        "query": "hello",
        "expected_tools": [],
        "total_rounds": 1,
        "answer": {},
    }
    defaults.update(overrides)
    return ToolCallCase(**defaults)


def _observer_with_tools(*names: str) -> Observer:
    observer = Observer()
    for index, name in enumerate(names):
        observer.on_tool_invoke(name, {"step": index})
        observer.on_llm_respond(
            AIMessage(content="", tool_calls=[{"name": name, "args": {}, "id": str(index)}])
        )
    return observer


def test_is_subsequence() -> None:
    assert _is_subsequence(["a", "b"], ["x", "a", "y", "b"])
    assert not _is_subsequence(["a", "b"], ["b", "a"])
    assert _is_subsequence([], ["anything"])
    assert _is_subsequence(["a"], [])


def test_score_tools_ordered_match() -> None:
    case = _case(expected_tools=["planning", "bash"])
    observer = _observer_with_tools("planning", "bash")
    score, details = case._score_tools(observer)
    assert score == 1.0
    assert details["reason"] == "ordered match"


def test_score_tools_unexpected_calls() -> None:
    case = _case(expected_tools=[])
    observer = _observer_with_tools("planning")
    score, details = case._score_tools(observer)
    assert score == 0.0
    assert details["reason"] == "no tools expected"


def test_score_tools_unordered_partial_credit() -> None:
    case = _case(expected_tools=["planning", "bash"])
    observer = _observer_with_tools("bash", "planning")
    score, details = case._score_tools(observer)
    assert score == 0.5
    assert details["reason"] == "unordered partial"


def test_score_rounds_within_budget() -> None:
    case = _case(total_rounds=2)
    observer = _observer_with_tools("planning", "bash")
    score, details = case._score_rounds(observer)
    assert score == 1.0
    assert details["actual"] == 2


def test_score_rounds_overshoot_penalty() -> None:
    case = _case(total_rounds=1)
    observer = _observer_with_tools("planning", "bash", "web_search")
    score, _details = case._score_rounds(observer)
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
    observer = Observer()
    result = case.score(AgentTurnResult(cancelled=True), observer)
    assert result.cancelled
    assert "CANCELLED" in format_case_result(result)


def test_normalize_suites_accepts_list_or_dict() -> None:
    assert _normalize_suites([{"name": "a"}]) == {"default": [{"name": "a"}]}
    assert _normalize_suites({"jira": [{"name": "b"}]}) == {"jira": [{"name": "b"}]}


def test_find_cases_loads_group_and_validates_fields(tmp_path: Path) -> None:
    payload = {
        "default": [
            {
                "name": "ok",
                "query": "hello",
                "expected_tools": ["planning"],
                "answer": {"x": "y"},
            }
        ]
    }
    (tmp_path / "general.json").write_text(json.dumps(payload), encoding="utf-8")
    cases = find_cases(["general"], cases_dir=tmp_path)
    assert len(cases) == 1
    assert cases[0].name == "ok"
    assert cases[0].expected_tools == ["planning"]


def test_find_cases_requires_query(tmp_path: Path) -> None:
    (tmp_path / "bad.json").write_text(
        json.dumps({"default": [{"name": "missing-query"}]}),
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

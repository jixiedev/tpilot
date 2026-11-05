from __future__ import annotations

import json
from pathlib import Path
from unittest.mock import AsyncMock

import pytest
from langchain_core.messages import AIMessage

from agent.turn import AgentTurnResult
from observability.case import (
    CaseLoader,
    DatabotEvalCase,
    IntentionEvalCase,
    IntentRoutingView,
    ReactEvalCase,
    ToolsSpec,
)
from observability.evaluator import AnswerMatcher, OrderedSequenceScorer
from observability.runner import EvalHarness
from observability.trace import EvalReactListener
from observability.case import FunctionalEvalSet, HarnessEvalSet, PerformanceEvalSet


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


def _write_agent_cases(root: Path, eval_set: str, agent: str, payload: dict) -> None:
    directory = root / eval_set
    directory.mkdir(parents=True, exist_ok=True)
    (directory / f"{agent}.json").write_text(json.dumps(payload), encoding="utf-8")


def test_ordered_sequence_scorer() -> None:
    scorer = OrderedSequenceScorer()
    assert scorer.is_subsequence(["a", "b"], ["x", "a", "y", "b"])
    assert not scorer.is_subsequence(["a", "b"], ["b", "a"])
    ordered = scorer.score(
        ["planning", "bash"], ["planning", "bash"], name="tools", empty_reason="x"
    )
    assert ordered.value == 1.0
    assert ordered.details["reason"] == "ordered match"
    partial = scorer.score(
        ["planning", "bash"], ["bash", "planning"], name="tools", empty_reason="x"
    )
    assert partial.value == 0.5
    empty = scorer.score([], ["planning"], name="tools", empty_reason="no tools expected")
    assert empty.value == 0.0


def test_answer_matcher() -> None:
    matcher = AnswerMatcher()
    score = matcher.score('{"result": 3}', {"result": 3})
    assert score.value == 1.0
    skipped = matcher.score("anything", {})
    assert skipped.value == 1.0
    assert skipped.details["skipped"] is True
    missing = matcher.score("TAHOE-949 in prose", {"jira_ticket": "TAHOE-949"})
    assert missing.value == 0.0
    assert missing.details["parse_error"]
    mismatch = matcher.score('{"result": "4"}', {"result": 3, "note": "ok"})
    assert mismatch.details["mismatched"] == ["result"]
    assert mismatch.details["missing"] == ["note"]
    parsed, error = matcher.extract_json_object('{"a": 1, "b": "two"}')
    assert error is None
    assert parsed == {"a": 1, "b": "two"}
    assert matcher.values_equal(3, 3.0)
    assert not matcher.values_equal(4, 3)


def test_eval_set_selects_score_dimensions() -> None:
    listener = _listener_with_tools("planning", "bash")
    turn = AgentTurnResult(state={"reply": '{"ticket": "TAHOE-949"}'})
    functional = _react_case(
        eval_set="functional",
        tools=ToolsSpec(required=["planning", "bash"], allowed=["planning", "bash"]),
        max_tool_calls=1,
        expected_output={"ticket": "TAHOE-949"},
    ).score(turn, listener)
    assert functional.score.named("tools") is not None
    assert functional.score.named("answer") is not None
    assert functional.score.named("max_tool_calls") is None

    performance = _react_case(
        eval_set="performance",
        tools=ToolsSpec(required=["planning", "bash"], allowed=["planning", "bash"]),
        max_tool_calls=2,
    ).score(turn, listener)
    assert [item.name for item in performance.score.dimensions] == ["max_tool_calls"]
    assert performance.score.value_of("max_tool_calls") == 1.0

    harness = _react_case(
        eval_set="harness",
        tools=ToolsSpec(required=["planning", "bash"], allowed=["planning", "bash"]),
        max_tool_calls=2,
        expected_output={"ticket": "TAHOE-949"},
    ).score(turn, listener)
    assert {item.name for item in harness.score.dimensions} == {
        "tools",
        "max_tool_calls",
        "answer",
    }


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

    overshoot = _react_case(max_tool_calls=1).score(
        AgentTurnResult(),
        _listener_with_tools("planning", "bash", "web_search"),
    )
    assert overshoot.score.value_of("max_tool_calls") == pytest.approx(0.0)

    answer = _react_case(expected_output={"ticket": "TAHOE-949"}).score(
        AgentTurnResult(state={"reply": '{"ticket": "TAHOE-949"}'}),
        EvalReactListener(),
    )
    assert answer.score.value_of("answer") == 1.0

    cancelled_case = _react_case(expected_output={"x": "1"})
    cancelled = cancelled_case.score(
        AgentTurnResult(cancelled=True),
        EvalReactListener(),
    )
    assert cancelled.cancelled
    assert "CANCELLED" in cancelled_case.render(cancelled)


def test_intent_routing_and_scores() -> None:
    view = IntentRoutingView()
    assert view.from_state(
        {
            "status": "published",
            "user_intentions": ["KNOWLEDGE", "DATA"],
            "route_target": "plan",
        }
    ) == {
        "status": "published",
        "intentions": ["KNOWLEDGE", "DATA"],
        "routes": ["plan"],
    }
    clarify = view.from_state(
        {
            "__interrupt__": [{"question": "DATA or KNOWLEDGE?"}],
            "user_intentions": ["DATA"],
        }
    )
    assert clarify["status"] == "clarify"
    assert view.from_state({"status": "rejected"}) == {
        "status": "rejected",
        "intentions": [],
        "routes": [],
    }

    case = IntentionEvalCase(
        agent_name="intent",
        eval_set="functional",
        name="sample",
        prompt="hello",
        expected_output={},
        expected_status="published",
        expected_intentions=["KNOWLEDGE", "DATA"],
        expected_routes=["plan"],
    )
    result = case.score(
        AgentTurnResult(
            state={
                "status": "published",
                "user_intentions": ["KNOWLEDGE", "DATA"],
                "route_target": "plan",
            }
        )
    )
    assert result.score.total == 1.0
    partial = case.score(
        AgentTurnResult(
            state={
                "status": "published",
                "user_intentions": ["DATA", "KNOWLEDGE"],
                "route_target": "databot",
            }
        )
    )
    assert partial.score.value_of("intentions") == 0.5
    assert partial.score.value_of("routes") == 0.0

    performance = IntentionEvalCase(
        agent_name="intent",
        eval_set="performance",
        name="sample",
        prompt="hello",
        expected_output={},
        expected_status="published",
        expected_intentions=["KNOWLEDGE", "DATA"],
        expected_routes=["plan"],
    ).score(
        AgentTurnResult(
            state={
                "status": "published",
                "user_intentions": ["DATA"],
                "route_target": "databot",
            }
        )
    )
    assert [item.name for item in performance.score.dimensions] == ["status"]
    assert performance.score.total == 1.0


def test_databot_case_scores_prepare_and_cards() -> None:
    prepare = _react_case(
        agent_name="databot",
        eval_set="functional",
        tools=ToolsSpec(required=["search"], allowed=["search"]),
        max_tool_calls=2,
    )
    case = DatabotEvalCase(
        agent_name="databot",
        eval_set="functional",
        name="find_dataset",
        prompt="find dau",
        expected_output={},
        prepare_eval_case=prepare,
        expected_table_cards=["analytics.users"],
    )
    result = case.score(
        AgentTurnResult(
            state={
                "committed_cards": [{"model_name": "analytics.users"}],
                "reply": "done",
            }
        ),
        _listener_with_tools("search"),
    )
    assert result.score.value_of("prepare_tools") == 1.0
    assert result.score.value_of("cards") == 1.0
    assert result.score.named("max_tool_calls") is None
    assert result.score.named("draft_tools") is None


def test_case_loader_eval_set_layout(tmp_path: Path) -> None:
    _write_agent_cases(
        tmp_path,
        "functional",
        "knowledge",
        {
            "models": ["model-a", "model-b"],
            "cases": [
                {
                    "name": "ok",
                    "query": "hello",
                    "tools": {
                        "required": ["planning"],
                        "allowed": ["planning"],
                        "forbidden": [],
                    },
                    "max_tool_calls": 1,
                    "expected_output": {"x": "y"},
                }
            ],
        },
    )
    loader = CaseLoader(tmp_path, {"knowledge": ["model-a", "model-b"]})
    loaded = loader.load({"knowledge"}, {"model-a", "model-b"}, {"functional"})
    case = loaded["knowledge"]["model-a"][0]
    assert isinstance(case, ReactEvalCase)
    assert isinstance(case.resolved_eval_set(), FunctionalEvalSet)
    assert case.tools.required == ["planning"]
    assert case.max_tool_calls == 1
    assert case.expected_output == {"x": "y"}

    _write_agent_cases(
        tmp_path,
        "functional",
        "databot",
        {
            "models": ["model-a"],
            "cases": [
                {
                    "name": "staged",
                    "query": "find table",
                    "prepare_eval_case": {
                        "tools": {
                            "required": ["search"],
                            "allowed": ["search"],
                            "forbidden": [],
                        },
                        "max_tool_calls": 3,
                    },
                    "draft_eval_case": {
                        "tools": {
                            "required": ["trino_run_query"],
                            "allowed": ["trino_run_query"],
                            "forbidden": [],
                        }
                    },
                    "expected_table_cards": ["analytics.users"],
                }
            ],
        },
    )
    staged = CaseLoader(tmp_path, {"databot": "model-a"}).load(
        {"databot"}, {"model-a"}, {"功能"}
    )["databot"]["model-a"][0]
    assert isinstance(staged, DatabotEvalCase)
    assert staged.prepare_eval_case.tools.required == ["search"]
    assert staged.draft_eval_case is not None
    assert staged.expected_table_cards == ["analytics.users"]


def test_case_loader_intent_requires_status(tmp_path: Path) -> None:
    _write_agent_cases(
        tmp_path,
        "functional",
        "intent",
        {
            "models": ["m"],
            "cases": [{"name": "missing-status", "query": "hello"}],
        },
    )
    loader = CaseLoader(tmp_path, {"intent": "m"})
    with pytest.raises(ValueError, match="expected_status"):
        loader.load({"intent"}, {"m"}, {"functional"})


def test_case_loader_unknown_eval_set(tmp_path: Path) -> None:
    loader = CaseLoader(tmp_path, {"knowledge": "m"})
    with pytest.raises(ValueError, match="unknown eval_set"):
        loader.load({"knowledge"}, {"m"}, {"general"})


def test_case_loader_reads_shipped_fixtures() -> None:
    root = Path(__file__).resolve().parents[1] / "observability" / "cases"
    loader = CaseLoader(
        root,
        {
            "databot": "MiniMax-M3",
            "intent": "MiniMax-M3",
            "knowledge": "MiniMax-M3",
        },
    )
    assert loader.list_eval_sets() == ["functional", "harness", "performance"]
    databot = loader.load({"databot"}, {"MiniMax-M3"}, {"functional"})["databot"][
        "MiniMax-M3"
    ]
    assert isinstance(databot[0], DatabotEvalCase)
    assert databot[0].prepare_eval_case.tools.required == ["search"]
    assert isinstance(databot[0].resolved_eval_set(), FunctionalEvalSet)

    harness_knowledge = loader.load({"knowledge"}, {"MiniMax-M3"}, {"harness"})[
        "knowledge"
    ]["MiniMax-M3"]
    assert {case.name for case in harness_knowledge} == {
        "arithmetic",
        "greeting",
        "create_plan_before_reply",
    }
    assert isinstance(harness_knowledge[0].resolved_eval_set(), HarnessEvalSet)

    intent = loader.load({"intent"}, {"MiniMax-M3"}, {"performance"})["intent"][
        "MiniMax-M3"
    ]
    assert isinstance(intent[0], IntentionEvalCase)
    assert isinstance(intent[0].resolved_eval_set(), PerformanceEvalSet)


def test_case_loader_list_cases(tmp_path: Path) -> None:
    _write_agent_cases(
        tmp_path,
        "functional",
        "knowledge",
        {
            "models": ["MiniMax-M3"],
            "cases": [
                {"name": "b", "query": "second", "expected_output": {}},
                {"name": "a", "query": "first", "expected_output": {}},
            ],
        },
    )
    _write_agent_cases(
        tmp_path,
        "harness",
        "knowledge",
        {
            "models": ["MiniMax-M3"],
            "cases": [{"name": "smoke", "query": "hi", "expected_output": {}}],
        },
    )
    loader = CaseLoader(tmp_path, {"knowledge": "MiniMax-M3"})
    cases = loader.list_cases({"knowledge"}, {"functional", "harness"})
    assert [case.name for case in cases] == ["a", "b", "smoke"]
    assert [case.resolved_eval_set().name for case in cases] == [
        "functional",
        "functional",
        "harness",
    ]

    from observability.runner import format_case_listing, list_cases

    lines = list_cases(
        agent_name="knowledge",
        eval_sets=["functional"],
        cases_dir=tmp_path,
    )
    assert lines == [
        "functional/knowledge/a  models=MiniMax-M3",
        "functional/knowledge/b  models=MiniMax-M3",
    ]
    assert format_case_listing(cases[0]).startswith("functional/knowledge/a")


@pytest.mark.asyncio
async def test_eval_harness_averages_across_models(tmp_path: Path) -> None:
    _write_agent_cases(
        tmp_path,
        "harness",
        "knowledge",
        {
            "models": ["model-a", "model-b"],
            "cases": [{"name": "arith", "query": "1+1", "expected_output": {}}],
        },
    )
    loader = CaseLoader(tmp_path, {"knowledge": ["model-a", "model-b"]})
    scores = {"model-a": 1.0, "model-b": 0.4}

    class Pool:
        async def get(self, agent_name: str, model_name: str):
            agent = AsyncMock()
            agent.register_secondary = lambda _o: None
            agent.clear_secondaries = lambda: None
            return agent

    async def fake_run(self, agent, *, model_name: str = ""):
        from observability.case import EvalResult
        from observability.evaluator import CaseScore, DimensionScore

        value = scores[model_name]
        return EvalResult(
            case=self,
            score=CaseScore(
                dimensions=[DimensionScore(name="answer", value=value, details={})]
            ),
            reply="",
            model_name=model_name,
        )

    monkey = pytest.MonkeyPatch()
    monkey.setattr(ReactEvalCase, "run", fake_run)
    try:
        report = await EvalHarness(loader, agents=Pool()).run(
            {"knowledge"}, {"model-a", "model-b"}, {"harness"}
        )
    finally:
        monkey.undo()

    assert report.average == pytest.approx(0.7)
    assert len(report.aggregates) == 1
    text = report.render()
    assert "case avg: 0.700" in text
    assert "model=model-a" in text

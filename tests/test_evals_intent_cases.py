from __future__ import annotations

import json
from pathlib import Path

import pytest

from agent.turn import AgentTurnResult
from evals.intent_case import (
    IntentRouterCase,
    extract_routing_outcome,
    find_intent_cases,
    format_intent_case_result,
)


def _intent_case(**overrides) -> IntentRouterCase:
    defaults = {
        "name": "sample",
        "case_group": "intent/router",
        "query": "hello",
        "expected_status": "published",
        "expected_intentions": ["DATA"],
        "expected_routes": ["databot"],
        "models": ["sensenova-6.7-flash-lite"],
    }
    defaults.update(overrides)
    return IntentRouterCase(**defaults)


def test_extract_routing_outcome_published() -> None:
    outcome = extract_routing_outcome(
        {
            "status": "published",
            "user_intentions": ["KNOWLEDGE", "DATA"],
            "route_target": "plan",
        }
    )
    assert outcome == {
        "status": "published",
        "intentions": ["KNOWLEDGE", "DATA"],
        "routes": ["plan"],
    }


def test_extract_routing_outcome_clarify_and_reject() -> None:
    clarify = extract_routing_outcome(
        {
            "__interrupt__": [{"question": "DATA or KNOWLEDGE?"}],
            "user_intentions": ["DATA"],
            "confidence": 0.4,
        }
    )
    assert clarify["status"] == "clarify"
    assert clarify["intentions"] == ["DATA"]

    reject = extract_routing_outcome({"status": "rejected"})
    assert reject == {"status": "rejected", "intentions": [], "routes": []}


def test_score_status_and_routes() -> None:
    case = _intent_case(
        expected_status="published",
        expected_intentions=["KNOWLEDGE", "DATA"],
        expected_routes=["plan"],
    )
    outcome = {
        "status": "published",
        "intentions": ["KNOWLEDGE", "DATA"],
        "routes": ["plan"],
    }
    status_score, _ = case._score_status(outcome)
    route_score, route_details = case._score_routes(outcome)
    assert status_score == 1.0
    assert route_score == 1.0
    assert route_details["reason"] == "ordered match"


def test_score_reject_case() -> None:
    case = _intent_case(
        expected_status="rejected",
        expected_intentions=[],
        expected_routes=[],
    )
    result = case.score(AgentTurnResult(state={"status": "rejected"}, cancelled=False))
    assert result.score.total == 1.0
    assert "status=1.00 intentions=1.00 routes=1.00" in format_intent_case_result(result)


def test_score_unordered_route_partial_credit() -> None:
    case = _intent_case(
        expected_intentions=["KNOWLEDGE", "DATA"],
        expected_routes=["plan"],
    )
    outcome = {
        "status": "published",
        "intentions": ["DATA", "KNOWLEDGE"],
        "routes": ["databot"],
    }
    intention_score, _ = case._score_intentions(outcome)
    route_score, route_details = case._score_routes(outcome)
    assert intention_score == 0.5
    assert route_score == 0.0
    assert route_details["reason"] == "unordered partial"


def test_find_intent_cases_requires_expected_status(tmp_path: Path) -> None:
    payload = {
        "models": ["sensenova-6.7-flash-lite"],
        "router": [
            {
                "name": "ok",
                "query": "What was GMV?",
                "expected_status": "published",
                "expected_intentions": ["DATA"],
                "expected_routes": ["databot"],
            }
        ],
    }
    (tmp_path / "intent.json").write_text(json.dumps(payload), encoding="utf-8")
    cases = find_intent_cases(["intent"], cases_dir=tmp_path)
    assert len(cases) == 1
    assert cases[0].expected_routes == ["databot"]
    assert cases[0].models == ["sensenova-6.7-flash-lite"]

    (tmp_path / "bad.json").write_text(
        json.dumps(
            {
                "models": ["m"],
                "router": [{"name": "missing-status", "query": "hello"}],
            }
        ),
        encoding="utf-8",
    )
    with pytest.raises(ValueError, match="expected_status"):
        find_intent_cases(["bad"], cases_dir=tmp_path)


async def test_run_scores_unanswered_clarification(tmp_path) -> None:
    from langgraph.checkpoint.memory import MemorySaver

    from agent.catalog import AgentCatalog, AgentCatalogSettings
    from agent.intent.orchestrator import IntentionResponse
    from memory.profile_store import FileProfileStore

    class _LowConfidenceModel:
        def with_structured_output(self, _schema):
            return self

        def invoke(self, _messages):
            return IntentionResponse(
                user_intentions=["DATA"],
                confidence=0.3,
                need_clarification="Do you want data or docs?",
            )

    agent = await AgentCatalog(
        AgentCatalogSettings.for_agent(
            "intent",
            profile_store=FileProfileStore(tmp_path),
            model=_LowConfidenceModel(),
            checkpointer=MemorySaver(),
        )
    ).create("intent")
    labelled = _intent_case(
        expected_status="clarify",
        expected_intentions=["DATA"],
        expected_routes=[],
    )
    result = await labelled.run(agent, model_name="fake")
    assert not result.cancelled
    assert result.score.total == 1.0
    assert format_intent_case_result(result).startswith("[1.00]")

    # A clarify case that lists no labels does not check the tentative one.
    unlabelled = _intent_case(
        name="greeting",
        expected_status="clarify",
        expected_intentions=[],
        expected_routes=[],
    )
    result = await unlabelled.run(agent, model_name="fake")
    assert result.score.total == 1.0

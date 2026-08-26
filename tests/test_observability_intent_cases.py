from __future__ import annotations

import json
from pathlib import Path

import pytest

from agent.turn import AgentTurnResult
from observability.intent_case import (
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
            "route_targets": ["knowledge", "databot"],
        }
    )
    assert outcome == {
        "status": "published",
        "intentions": ["KNOWLEDGE", "DATA"],
        "routes": ["knowledge", "databot"],
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
        expected_routes=["knowledge", "databot"],
    )
    outcome = {
        "status": "published",
        "intentions": ["KNOWLEDGE", "DATA"],
        "routes": ["knowledge", "databot"],
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
        expected_routes=["knowledge", "databot"],
    )
    outcome = {
        "status": "published",
        "intentions": ["DATA", "KNOWLEDGE"],
        "routes": ["databot", "knowledge"],
    }
    intention_score, _ = case._score_intentions(outcome)
    route_score, route_details = case._score_routes(outcome)
    assert intention_score == 0.5
    assert route_score == 0.5
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

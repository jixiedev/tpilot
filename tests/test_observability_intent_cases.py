from __future__ import annotations

import json
from pathlib import Path

import pytest

from agent.turn import AgentTurnResult
from observability.case import (
    CaseLoader,
    IntentionEvalCase,
    extract_routing_outcome,
)


def _intent_case(**overrides) -> IntentionEvalCase:
    values = dict(
        agent_name="intent",
        eval_set="functional",
        name="sample",
        prompt="hello",
        expected_output={},
        models=["MiniMax-M3"],
        expected_status="published",
        expected_intentions=["DATA"],
        expected_routes=["databot"],
    )
    values.update(overrides)
    return IntentionEvalCase(**values)


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
    result = case.score(
        AgentTurnResult(
            state={
                "status": "published",
                "user_intentions": ["KNOWLEDGE", "DATA"],
                "route_target": "plan",
            }
        )
    )
    assert result.score.value_of("status") == 1.0
    assert result.score.value_of("routes") == 1.0
    assert result.score.named("routes").details["reason"] == "ordered match"


def test_score_reject_case() -> None:
    case = _intent_case(
        expected_status="rejected",
        expected_intentions=[],
        expected_routes=[],
    )
    result = case.score(AgentTurnResult(state={"status": "rejected"}, cancelled=False))
    assert result.score.total == 1.0
    rendered = case.render(result)
    assert "status=1.00" in rendered
    assert "intentions=1.00" in rendered
    assert "routes=1.00" in rendered


def test_score_unordered_route_partial_credit() -> None:
    case = _intent_case(
        expected_intentions=["KNOWLEDGE", "DATA"],
        expected_routes=["plan"],
    )
    result = case.score(
        AgentTurnResult(
            state={
                "status": "published",
                "user_intentions": ["DATA", "KNOWLEDGE"],
                "route_target": "databot",
            }
        )
    )
    assert result.score.value_of("intentions") == 0.5
    assert result.score.value_of("routes") == 0.0
    assert result.score.named("routes").details["reason"] == "unordered partial"


def test_case_loader_intent_requires_expected_status(tmp_path: Path) -> None:
    directory = tmp_path / "functional"
    directory.mkdir(parents=True)
    (directory / "intent.json").write_text(
        json.dumps(
            {
                "models": ["MiniMax-M3"],
                "cases": [
                    {
                        "name": "ok",
                        "query": "What was GMV?",
                        "expected_status": "published",
                        "expected_intentions": ["DATA"],
                        "expected_routes": ["databot"],
                    }
                ],
            }
        ),
        encoding="utf-8",
    )
    cases = CaseLoader(tmp_path, {"intent": "MiniMax-M3"}).load(
        {"intent"}, {"MiniMax-M3"}, {"functional"}
    )["intent"]["MiniMax-M3"]
    assert len(cases) == 1
    assert cases[0].expected_routes == ["databot"]
    assert cases[0].models == ["MiniMax-M3"]

    (directory / "intent.json").write_text(
        json.dumps(
            {
                "models": ["m"],
                "cases": [{"name": "missing-status", "query": "hello"}],
            }
        ),
        encoding="utf-8",
    )
    with pytest.raises(ValueError, match="expected_status"):
        CaseLoader(tmp_path, {"intent": "m"}).load({"intent"}, {"m"}, {"functional"})

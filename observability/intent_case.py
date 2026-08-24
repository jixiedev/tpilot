"""Eval cases for IntentOrchestrator routing decisions."""

from __future__ import annotations

import json
import uuid
from collections.abc import Mapping
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from agent.intent.orchestrator import IntentOrchestrator, intentions_from_state
from agent.turn import AgentTurnResult
from observability.case import (
    CASES_DIR,
    _is_subsequence,
    _normalize_suites,
    resolve_group_path,
)
from observability.observe import CaseScore

INTENT_CASES_DIR = CASES_DIR


@dataclass
class IntentCaseResult:
    case: IntentRouterCase
    score: CaseScore
    outcome: dict[str, Any]
    cancelled: bool = False


class IntentRouterCase:
    def __init__(
        self,
        name: str,
        case_group: str,
        query: str,
        expected_status: str,
        expected_intentions: list[str],
        expected_routes: list[str],
    ) -> None:
        self.name = name
        self.case_group = case_group
        self.query = query
        self.expected_status = str(expected_status).strip().lower()
        self.expected_intentions = [_normalize_label(item) for item in expected_intentions]
        self.expected_routes = [str(item).strip() for item in expected_routes if str(item).strip()]

    async def run(self, agent: IntentOrchestrator) -> IntentCaseResult:
        session = f"eval-intent-{self.case_group}-{self.name}-{uuid.uuid4().hex[:8]}"
        result: AgentTurnResult = await agent.run(
            self.query,
            session=session,
            user_id="case_bot",
            print_output=False,
            execute_plan=False,
        )
        return self.score(result)

    def score(self, result: AgentTurnResult) -> IntentCaseResult:
        outcome = extract_routing_outcome(result.state)
        status_score, status_details = self._score_status(outcome)
        intention_score, intention_details = self._score_intentions(outcome)
        route_score, route_details = self._score_routes(outcome)
        case_score = CaseScore(
            tool_score=status_score,
            round_score=intention_score,
            answer_score=route_score,
            details={
                "status": status_details,
                "intentions": intention_details,
                "routes": route_details,
                "outcome": outcome,
            },
        )
        return IntentCaseResult(
            case=self,
            score=case_score,
            outcome=outcome,
            cancelled=result.cancelled,
        )

    def _score_status(self, outcome: Mapping[str, Any]) -> tuple[float, dict[str, Any]]:
        actual = str(outcome.get("status") or "").strip().lower()
        details = {"expected": self.expected_status, "actual": actual}
        if actual == self.expected_status:
            details["reason"] = "match"
            return 1.0, details
        details["reason"] = "mismatch"
        return 0.0, details

    def _score_intentions(self, outcome: Mapping[str, Any]) -> tuple[float, dict[str, Any]]:
        actual = [_normalize_label(item) for item in outcome.get("intentions") or []]
        expected = list(self.expected_intentions)
        details: dict[str, Any] = {"expected": expected, "actual": actual}
        if not expected:
            score = 1.0 if not actual else 0.0
            details["reason"] = "no intentions expected"
            return score, details
        if _is_subsequence(expected, actual):
            details["reason"] = "ordered match"
            return 1.0, details
        expected_set = set(expected)
        overlap = expected_set & set(actual)
        coverage = len(overlap) / len(expected_set)
        score = 0.5 * coverage
        details["reason"] = "unordered partial"
        details["overlap"] = sorted(overlap)
        return score, details

    def _score_routes(self, outcome: Mapping[str, Any]) -> tuple[float, dict[str, Any]]:
        actual = [str(item).strip() for item in outcome.get("routes") or [] if str(item).strip()]
        expected = list(self.expected_routes)
        details: dict[str, Any] = {"expected": expected, "actual": actual}
        if not expected:
            score = 1.0 if not actual else 0.0
            details["reason"] = "no routes expected"
            return score, details
        if _is_subsequence(expected, actual):
            details["reason"] = "ordered match"
            return 1.0, details
        expected_set = set(expected)
        overlap = expected_set & set(actual)
        coverage = len(overlap) / len(expected_set)
        score = 0.5 * coverage
        details["reason"] = "unordered partial"
        details["overlap"] = sorted(overlap)
        return score, details


def _normalize_label(value: Any) -> str:
    return str(value).strip().upper()


def extract_routing_outcome(state: Mapping[str, Any] | None) -> dict[str, Any]:
    """Normalize intent graph state into eval-friendly routing fields."""
    if not state:
        return {"status": "pending", "intentions": [], "routes": []}

    if state.get("__interrupt__"):
        return {
            "status": "clarify",
            "intentions": intentions_from_state(state),
            "routes": [],
        }

    status = str(state.get("status") or "").strip().lower()
    if status == "published":
        routes = [str(item).strip() for item in state.get("route_targets") or [] if str(item).strip()]
        if not routes:
            route_target = str(state.get("route_target") or "").strip()
            if route_target:
                routes = [route_target]
        return {
            "status": "published",
            "intentions": [_normalize_label(item) for item in state.get("user_intentions") or []],
            "routes": routes,
        }

    if status == "rejected":
        return {"status": "rejected", "intentions": [], "routes": []}

    return {
        "status": status or "pending",
        "intentions": intentions_from_state(state),
        "routes": [],
    }


def _load_intent_case(raw: dict[str, Any], *, group: str, suite_name: str) -> IntentRouterCase:
    if "name" not in raw:
        raise ValueError(f"case in {group}/{suite_name} is missing required field 'name'")
    if "query" not in raw:
        raise ValueError(
            f"case {raw.get('name', '?')!r} in {group}/{suite_name} "
            "is missing required field 'query'"
        )
    if "expected_status" not in raw:
        raise ValueError(
            f"case {raw.get('name', '?')!r} in {group}/{suite_name} "
            "is missing required field 'expected_status'"
        )
    return IntentRouterCase(
        name=str(raw["name"]),
        case_group=f"{group}/{suite_name}",
        query=str(raw["query"]),
        expected_status=str(raw["expected_status"]),
        expected_intentions=list(raw.get("expected_intentions") or []),
        expected_routes=list(raw.get("expected_routes") or []),
    )


def find_intent_cases(groups: list[str], *, cases_dir: Path | None = None) -> list[IntentRouterCase]:
    root = cases_dir or INTENT_CASES_DIR
    all_cases: list[IntentRouterCase] = []
    for group in groups:
        path = resolve_group_path(group, cases_dir=root)
        payload = json.loads(path.read_text(encoding="utf-8"))
        suites = _normalize_suites(payload)
        for suite_name, cases in suites.items():
            for raw in cases:
                if "expected_status" in raw:
                    all_cases.append(_load_intent_case(raw, group=group, suite_name=suite_name))
                else:
                    raise ValueError(
                        f"case {raw.get('name', '?')!r} in {group}/{suite_name} "
                        "must define expected_status for intent routing eval"
                    )
    return all_cases


async def run_intent_cases(
    groups: list[str],
    agent: IntentOrchestrator,
    *,
    cases_dir: Path | None = None,
) -> tuple[float, list[IntentCaseResult]]:
    cases = find_intent_cases(groups, cases_dir=cases_dir)
    if not cases:
        return 0.0, []
    results: list[IntentCaseResult] = []
    total = 0.0
    for case in cases:
        case_result = await case.run(agent)
        results.append(case_result)
        total += 0.0 if case_result.cancelled else case_result.score.total
    return total / len(cases), results


def format_intent_case_result(result: IntentCaseResult) -> str:
    case = result.case
    score = result.score
    status = "CANCELLED" if result.cancelled else f"{score.total:.2f}"
    lines = [
        f"[{status}] {case.case_group}/{case.name} "
        f"(status={score.tool_score:.2f} intentions={score.round_score:.2f} "
        f"routes={score.answer_score:.2f})",
    ]
    if result.cancelled:
        return lines[0]
    status_details = score.details.get("status") or {}
    intention_details = score.details.get("intentions") or {}
    route_details = score.details.get("routes") or {}
    if status_details.get("reason"):
        lines.append(
            f"  status: expected={status_details.get('expected')} "
            f"actual={status_details.get('actual')} ({status_details['reason']})"
        )
    if intention_details.get("reason"):
        lines.append(
            f"  intentions: expected={intention_details.get('expected')} "
            f"actual={intention_details.get('actual')} ({intention_details['reason']})"
        )
    if route_details.get("reason"):
        lines.append(
            f"  routes: expected={route_details.get('expected')} "
            f"actual={route_details.get('actual')} ({route_details['reason']})"
        )
    return "\n".join(lines)

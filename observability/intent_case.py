"""Eval cases for IntentOrchestrator routing decisions."""

from __future__ import annotations

import json
import uuid
from collections.abc import Awaitable, Callable, Mapping
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from agent.intent.orchestrator import IntentOrchestrator, intentions_from_state
from agent.turn import AgentTurnResult
from observability.case import (
    CASES_DIR,
    _is_subsequence,
    _normalize_suites,
    extract_file_default_models,
    parse_models_field,
    resolve_group_path,
)
from observability.observe import CaseScore

INTENT_CASES_DIR = CASES_DIR

IntentAgentFactory = Callable[[str], Awaitable[IntentOrchestrator]]


@dataclass
class IntentCaseResult:
    case: IntentRouterCase
    score: CaseScore
    outcome: dict[str, Any]
    cancelled: bool = False
    model_name: str = ""


@dataclass
class IntentCaseAggregate:
    case: IntentRouterCase
    model_results: list[IntentCaseResult] = field(default_factory=list)

    @property
    def average(self) -> float:
        if not self.model_results:
            return 0.0
        total = 0.0
        for result in self.model_results:
            total += 0.0 if result.cancelled else result.score.total
        return total / len(self.model_results)


class IntentRouterCase:
    def __init__(
        self,
        name: str,
        case_group: str,
        query: str,
        expected_status: str,
        expected_intentions: list[str],
        expected_routes: list[str],
        models: list[str],
    ) -> None:
        self.name = name
        self.case_group = case_group
        self.query = query
        self.expected_status = str(expected_status).strip().lower()
        self.expected_intentions = [_normalize_label(item) for item in expected_intentions]
        self.expected_routes = [str(item).strip() for item in expected_routes if str(item).strip()]
        self.models = list(models)

    async def run(
        self,
        agent: IntentOrchestrator,
        *,
        model_name: str = "",
    ) -> IntentCaseResult:
        session = f"eval-intent-{self.case_group}-{self.name}-{uuid.uuid4().hex[:8]}"
        result: AgentTurnResult = await agent.run(
            self.query,
            session=session,
            user_id="case_bot",
            print_output=False,
            handoff=False,
        )
        case_result = self.score(result)
        case_result.model_name = model_name
        return case_result

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
        route_target = str(state.get("route_target") or "").strip()
        routes = [route_target] if route_target else []
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


def _load_intent_case(
    raw: dict[str, Any],
    *,
    group: str,
    suite_name: str,
    default_models: list[str] | None,
) -> IntentRouterCase:
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
    label = f"case {raw['name']!r} in {group}/{suite_name}"
    models = parse_models_field(
        raw.get("models"),
        label=label,
        default_models=default_models,
    )
    return IntentRouterCase(
        name=str(raw["name"]),
        case_group=f"{group}/{suite_name}",
        query=str(raw["query"]),
        expected_status=str(raw["expected_status"]),
        expected_intentions=list(raw.get("expected_intentions") or []),
        expected_routes=list(raw.get("expected_routes") or []),
        models=models,
    )


def find_intent_cases(groups: list[str], *, cases_dir: Path | None = None) -> list[IntentRouterCase]:
    root = cases_dir or INTENT_CASES_DIR
    all_cases: list[IntentRouterCase] = []
    for group in groups:
        path = resolve_group_path(group, cases_dir=root)
        payload = json.loads(path.read_text(encoding="utf-8"))
        default_models = extract_file_default_models(payload)
        suites = _normalize_suites(payload)
        for suite_name, cases in suites.items():
            for raw in cases:
                if "expected_status" in raw:
                    all_cases.append(
                        _load_intent_case(
                            raw,
                            group=group,
                            suite_name=suite_name,
                            default_models=default_models,
                        )
                    )
                else:
                    raise ValueError(
                        f"case {raw.get('name', '?')!r} in {group}/{suite_name} "
                        "must define expected_status for intent routing eval"
                    )
    return all_cases


async def run_intent_cases(
    groups: list[str],
    agent_factory: IntentAgentFactory,
    *,
    cases_dir: Path | None = None,
) -> tuple[float, list[IntentCaseAggregate]]:
    cases = find_intent_cases(groups, cases_dir=cases_dir)
    if not cases:
        return 0.0, []

    agents: dict[str, IntentOrchestrator] = {}
    aggregates: list[IntentCaseAggregate] = []
    case_totals = 0.0

    for case in cases:
        aggregate = IntentCaseAggregate(case=case)
        for model_name in case.models:
            if model_name not in agents:
                agents[model_name] = await agent_factory(model_name)
            case_result = await case.run(agents[model_name], model_name=model_name)
            aggregate.model_results.append(case_result)
        aggregates.append(aggregate)
        case_totals += aggregate.average

    return case_totals / len(aggregates), aggregates


def format_intent_case_result(result: IntentCaseResult) -> str:
    case = result.case
    score = result.score
    status = "CANCELLED" if result.cancelled else f"{score.total:.2f}"
    model_bit = f" model={result.model_name}" if result.model_name else ""
    lines = [
        f"[{status}] {case.case_group}/{case.name}{model_bit} "
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


def format_intent_case_aggregate(aggregate: IntentCaseAggregate) -> str:
    lines = [format_intent_case_result(result) for result in aggregate.model_results]
    n = len(aggregate.model_results)
    lines.append(
        f"  case avg: {aggregate.average:.3f} "
        f"({n} model{'s' if n != 1 else ''}: {', '.join(aggregate.case.models)})"
    )
    return "\n".join(lines)

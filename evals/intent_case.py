"""Eval cases for IntentOrchestrator routing decisions."""

from __future__ import annotations

from collections.abc import Awaitable, Callable, Mapping
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from agent.intent.orchestrator import IntentOrchestrator
from agent.turn import AgentTurnResult
from evals.case_base import (
    CASES_DIR,
    AggregateAverageMixin,
    BaseCase,
    format_aggregate_footer,
    iter_raw_cases,
    load_base_fields,
    run_case_aggregates,
    score_sequence,
)
from evals.listeners import CaseScore

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
class IntentCaseAggregate(AggregateAverageMixin):
    case: IntentRouterCase
    model_results: list[IntentCaseResult] = field(default_factory=list)


class IntentRouterCase(BaseCase):
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
        super().__init__(name, case_group, query, models)
        self.expected_status = str(expected_status).strip().lower()
        self.expected_intentions = [_normalize_label(item) for item in expected_intentions]
        self.expected_routes = [str(item).strip() for item in expected_routes if str(item).strip()]

    async def run(
        self,
        agent: IntentOrchestrator,
        *,
        model_name: str = "",
    ) -> IntentCaseResult:
        result: AgentTurnResult = await agent.run(
            self.query,
            session=self._session_id("eval-intent"),
            user_id="case_bot",
            print_output=False,
            handoff=False,
            on_interrupt=_stop_at_clarification,
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
            # Stopping at an unanswered clarifying question is a routing
            # outcome (``clarify``), not a cancelled run.
            cancelled=result.cancelled and outcome["status"] != "clarify",
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
        if outcome.get("status") == "clarify" and not self.expected_intentions:
            # While asking, the model still emits a tentative label; a case
            # that lists none does not check it.
            return 1.0, {
                "expected": [],
                "actual": list(outcome.get("intentions") or []),
                "reason": "tentative label not checked while clarifying",
            }
        return score_sequence(
            list(self.expected_intentions),
            [_normalize_label(item) for item in outcome.get("intentions") or []],
            empty_reason="no intentions expected",
        )

    def _score_routes(self, outcome: Mapping[str, Any]) -> tuple[float, dict[str, Any]]:
        return score_sequence(
            list(self.expected_routes),
            [str(item).strip() for item in outcome.get("routes") or [] if str(item).strip()],
            empty_reason="no routes expected",
        )


async def _stop_at_clarification(_question: str) -> None:
    """Leave a clarifying question unanswered so the case scores ``clarify``."""
    return None


def _normalize_label(value: Any) -> str:
    return str(value).strip().upper()


def extract_routing_outcome(state: Mapping[str, Any] | None) -> dict[str, Any]:
    """Normalize intent graph state into eval-friendly routing fields."""
    if not state:
        return {"status": "pending", "intentions": [], "routes": []}

    if state.get("__interrupt__"):
        return {
            "status": "clarify",
            "intentions": IntentOrchestrator.intentions_from_state(state),
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
        "intentions": IntentOrchestrator.intentions_from_state(state),
        "routes": [],
    }


def _load_intent_case(
    raw: dict[str, Any],
    *,
    group: str,
    suite_name: str,
    default_models: list[str] | None,
) -> IntentRouterCase:
    base = load_base_fields(
        raw,
        group=group,
        suite_name=suite_name,
        default_models=default_models,
        extra_required=("expected_status",),
    )
    return IntentRouterCase(
        **base,
        expected_status=str(raw["expected_status"]),
        expected_intentions=list(raw.get("expected_intentions") or []),
        expected_routes=list(raw.get("expected_routes") or []),
    )


def find_intent_cases(groups: list[str], *, cases_dir: Path | None = None) -> list[IntentRouterCase]:
    all_cases: list[IntentRouterCase] = []
    for raw, group, suite_name, default_models in iter_raw_cases(
        groups, cases_dir=cases_dir or INTENT_CASES_DIR
    ):
        if "expected_status" not in raw:
            raise ValueError(
                f"case {raw.get('name', '?')!r} in {group}/{suite_name} "
                "must define expected_status for intent routing eval"
            )
        all_cases.append(
            _load_intent_case(
                raw, group=group, suite_name=suite_name, default_models=default_models
            )
        )
    return all_cases


async def run_intent_cases(
    groups: list[str],
    agent_factory: IntentAgentFactory,
    *,
    cases_dir: Path | None = None,
) -> tuple[float, list[IntentCaseAggregate]]:
    return await run_case_aggregates(
        find_intent_cases(groups, cases_dir=cases_dir),
        agent_factory,
        IntentCaseAggregate,
    )


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
    lines.append(format_aggregate_footer(aggregate))
    return "\n".join(lines)

"""Eval cases for the lead agent's first decision: answer, clarify, delegate or plan.

Specialists are replaced by stubs during a routing eval: the case checks which
specialists the lead picks and whether it plans, not what the specialists do.
Each stub returns a short ``done`` result, so the lead finishes its turn.
"""

from __future__ import annotations

from collections.abc import Awaitable, Callable, Mapping
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from langchain_core.messages import AIMessage, ToolMessage

from agent.subagent import SubagentResult, SubagentTask
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

DECISIONS = ("answer", "clarify", "delegate", "plan")

LeadAgentFactory = Callable[[str], Awaitable[Any]]


class RoutingStub:
    """Stands in for a specialist: records the task and returns a canned result."""

    def __init__(
        self,
        name: str,
        calls: list[SubagentTask],
        scripted: Mapping[str, Any] | None = None,
    ) -> None:
        self.name = name
        self._calls = calls
        #: Optional ``{"status", "summary"}`` per specialist, from the case's ``stub_results``.
        self._scripted = dict(scripted or {})

    async def run_as_subagent(self, task: SubagentTask) -> SubagentResult:
        self._calls.append(task)
        if self._scripted:
            return SubagentResult(
                agent=self.name,
                status=str(self._scripted.get("status") or "done"),  # type: ignore[arg-type]
                summary=str(self._scripted.get("summary") or ""),
            )
        return SubagentResult(
            agent=self.name,
            status="done",
            # Reads like a real, complete result so the lead moves on instead of
            # re-delegating; routing evals score the choice, not the content.
            summary=(
                f"Task complete. Result: 42 (source: eval_stub_{self.name}). "
                "Definition, tables and steps were checked; nothing is missing."
            ),
        )


@dataclass
class RoutingCaseResult:
    case: LeadRoutingCase
    score: CaseScore
    outcome: dict[str, Any]
    cancelled: bool = False
    model_name: str = ""


@dataclass
class RoutingCaseAggregate(AggregateAverageMixin):
    case: LeadRoutingCase
    model_results: list[RoutingCaseResult] = field(default_factory=list)


class LeadRoutingCase(BaseCase):
    """Scores ``decision`` (status), ``routes`` (specialists in order) and ``economy``."""

    def __init__(
        self,
        name: str,
        case_group: str,
        query: str,
        expected_decision: str | list[str],
        expected_routes: list[str],
        models: list[str],
        max_delegations: int | None = None,
        stub_results: Mapping[str, Mapping[str, Any]] | None = None,
    ) -> None:
        super().__init__(name, case_group, query, models)
        raw = expected_decision if isinstance(expected_decision, list) else [expected_decision]
        decisions = [str(item).strip().lower() for item in raw]
        if not decisions or any(d not in DECISIONS for d in decisions):
            raise ValueError(f"case {name!r}: expected_decision must be one of {DECISIONS}")
        #: Accepted first moves (a greeting reply ending in "?" may read as clarify).
        self.expected_decisions = decisions
        self.expected_decision = decisions[0]
        self.expected_routes = [str(item).strip() for item in expected_routes if str(item).strip()]
        self.max_delegations = (
            max_delegations if max_delegations is not None else len(self.expected_routes) + 1
        )
        self.stub_results = {str(k): dict(v) for k, v in (stub_results or {}).items()}

    async def run(self, agent: Any, *, model_name: str = "") -> RoutingCaseResult:
        calls: list[SubagentTask] = []

        async def stub(name: str) -> RoutingStub:
            return RoutingStub(name, calls, self.stub_results.get(name))

        agent.specialists.get_or_create = stub
        result: AgentTurnResult = await agent.run(
            self.query,
            session=self._session_id("eval-routing"),
            user_id="case_bot",
            print_output=False,
        )
        case_result = self.score(result)
        case_result.model_name = model_name
        return case_result

    def score(self, result: AgentTurnResult) -> RoutingCaseResult:
        outcome = extract_lead_outcome(result.state)
        decision = outcome["decision"]
        decision_score = 1.0 if decision in self.expected_decisions else 0.0
        route_score, route_details = score_sequence(
            list(self.expected_routes),
            list(outcome["routes"]),
            empty_reason="no delegation expected",
        )
        used = len(outcome["routes"])
        economy = 1.0 if used <= self.max_delegations else 0.0
        return RoutingCaseResult(
            case=self,
            score=CaseScore(
                tool_score=decision_score,
                round_score=economy,
                answer_score=route_score,
                details={
                    "decision": {
                        "expected": "|".join(self.expected_decisions),
                        "actual": decision,
                        "reason": "match" if decision_score else "mismatch",
                    },
                    "economy": {"max": self.max_delegations, "actual": used},
                    "routes": route_details,
                    "outcome": outcome,
                },
            ),
            outcome=outcome,
            cancelled=result.cancelled,
        )


def extract_lead_outcome(state: Mapping[str, Any] | None) -> dict[str, Any]:
    """Classify one lead turn by its first move.

    - ``plan``: the first tool batch calls ``write_plan``.
    - ``delegate``: the first tool batch delegates without a plan.
    - ``clarify``: no tools and the reply ends with a question mark.
    - ``answer``: no tools otherwise.

    ``routes`` lists every specialist delegated to this turn, in order.
    """
    messages = AgentTurnResult.current_turn_messages(state)
    first_batch = next(
        (m.tool_calls for m in messages if isinstance(m, AIMessage) and m.tool_calls), []
    )
    first_tools = [call.get("name") for call in first_batch]
    routes = [
        str(call.get("args", {}).get("agent") or "").strip().lower()
        for m in messages
        if isinstance(m, AIMessage)
        for call in (m.tool_calls or [])
        if call.get("name") == "delegate"
    ]
    reply = AgentTurnResult.last_user_visible_reply(state) or ""
    if "write_plan" in first_tools:
        decision = "plan"
    elif "delegate" in first_tools:
        decision = "delegate"
    elif routes:
        decision = "delegate"
    elif reply.rstrip().endswith(("?", "？")):
        decision = "clarify"
    else:
        decision = "answer"
    return {"decision": decision, "routes": [r for r in routes if r], "reply": reply}


def _load_routing_case(
    raw: dict[str, Any],
    *,
    group: str,
    suite_name: str,
    default_models: list[str] | None,
) -> LeadRoutingCase:
    base = load_base_fields(
        raw,
        group=group,
        suite_name=suite_name,
        default_models=default_models,
        extra_required=("expected_decision",),
    )
    return LeadRoutingCase(
        **base,
        expected_decision=raw["expected_decision"],
        expected_routes=list(raw.get("expected_routes") or []),
        max_delegations=raw.get("max_delegations"),
        stub_results=raw.get("stub_results"),
    )


def find_routing_cases(
    groups: list[str], *, cases_dir: Path | None = None
) -> list[LeadRoutingCase]:
    cases: list[LeadRoutingCase] = []
    for raw, group, suite_name, default_models in iter_raw_cases(
        groups, cases_dir=cases_dir or CASES_DIR
    ):
        if "expected_decision" not in raw:
            raise ValueError(
                f"case {raw.get('name', '?')!r} in {group}/{suite_name} "
                "must define expected_decision for a lead routing eval"
            )
        cases.append(
            _load_routing_case(raw, group=group, suite_name=suite_name, default_models=default_models)
        )
    return cases


async def run_routing_cases(
    groups: list[str],
    agent_factory: LeadAgentFactory,
    *,
    cases_dir: Path | None = None,
) -> tuple[float, list[RoutingCaseAggregate]]:
    return await run_case_aggregates(
        find_routing_cases(groups, cases_dir=cases_dir),
        agent_factory,
        RoutingCaseAggregate,
    )


def format_routing_case_result(result: RoutingCaseResult) -> str:
    case = result.case
    score = result.score
    status = "CANCELLED" if result.cancelled else f"{score.total:.2f}"
    model_bit = f" model={result.model_name}" if result.model_name else ""
    lines = [
        f"[{status}] {case.case_group}/{case.name}{model_bit} "
        f"(decision={score.tool_score:.2f} economy={score.round_score:.2f} "
        f"routes={score.answer_score:.2f})",
    ]
    if result.cancelled:
        return lines[0]
    decision = score.details.get("decision") or {}
    routes = score.details.get("routes") or {}
    economy = score.details.get("economy") or {}
    lines.append(
        f"  decision: expected={decision.get('expected')} actual={decision.get('actual')} "
        f"({decision.get('reason')})"
    )
    lines.append(
        f"  routes: expected={routes.get('expected')} actual={routes.get('actual')} "
        f"({routes.get('reason')})"
    )
    lines.append(f"  delegations: {economy.get('actual')} (max {economy.get('max')})")
    return "\n".join(lines)


def format_routing_case_aggregate(aggregate: RoutingCaseAggregate) -> str:
    lines = [format_routing_case_result(result) for result in aggregate.model_results]
    lines.append(format_aggregate_footer(aggregate))
    return "\n".join(lines)

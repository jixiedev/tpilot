"""Eval cases: load JSON fixtures, run an agent turn, score tool/answer behavior."""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from agent.react import BaseReactAgent
from agent.turn import AgentTurnResult
from evals.answer_match import score_answer
from evals.case_base import (  # noqa: F401 - re-exported for existing importers
    _FILE_META_KEYS,
    CASES_DIR,
    GROUP_ALIASES,
    AggregateAverageMixin,
    BaseCase,
    _is_subsequence,
    _normalize_suites,
    extract_file_default_models,
    format_aggregate_footer,
    iter_raw_cases,
    list_case_groups,
    load_base_fields,
    parse_models_field,
    resolve_group_path,
    run_case_aggregates,
    score_sequence,
)
from evals.listeners import CaseScore, EvalReactListener

AgentFactory = Callable[[str], Awaitable[BaseReactAgent]]


@dataclass
class CaseResult:
    case: ToolCallCase
    score: CaseScore
    reply: str
    cancelled: bool = False
    model_name: str = ""


@dataclass
class CaseAggregate(AggregateAverageMixin):
    """One case averaged across its configured models."""

    case: ToolCallCase
    model_results: list[CaseResult] = field(default_factory=list)


class ToolCallCase(BaseCase):
    def __init__(
        self,
        name: str,
        case_group: str,
        query: str,
        expected_tools: list[str],
        total_rounds: int,
        answer: dict[str, Any],
        models: list[str],
    ) -> None:
        super().__init__(name, case_group, query, models)
        self.expected_tools = list(expected_tools)
        self.total_rounds = int(total_rounds)
        self.answer = dict(answer)

    async def run(self, agent: BaseReactAgent, *, model_name: str = "") -> CaseResult:
        eval_listener = EvalReactListener()
        agent.clear_secondaries()
        agent.register_secondary(eval_listener)
        result: AgentTurnResult = await agent.run(
            self.query,
            session=self._session_id("eval"),
            user_id="case_bot",
            print_output=False,
        )
        try:
            case_result = self.score(result, eval_listener)
            case_result.model_name = model_name
            return case_result
        finally:
            agent.clear_secondaries()

    def score(self, result: AgentTurnResult, eval_listener: EvalReactListener) -> CaseResult:
        reply = AgentTurnResult.extract_output(result.state)
        tool_score, tool_details = self._score_tools(eval_listener)
        round_score, round_details = self._score_rounds(eval_listener)
        answer_score, answer_details = self._score_answer(reply)
        case_score = CaseScore(
            tool_score=tool_score,
            round_score=round_score,
            answer_score=answer_score,
            details={
                "tools": tool_details,
                "rounds": round_details,
                "answer": answer_details,
            },
        )
        return CaseResult(
            case=self,
            score=case_score,
            reply=reply,
            cancelled=result.cancelled,
        )

    def _score_tools(self, eval_listener: EvalReactListener) -> tuple[float, dict[str, Any]]:
        return score_sequence(
            list(self.expected_tools),
            eval_listener.tool_names(),
            empty_reason="no tools expected",
        )

    def _score_rounds(self, eval_listener: EvalReactListener) -> tuple[float, dict[str, Any]]:
        actual_rounds = eval_listener.reason_round_count
        expected = max(0, self.total_rounds)
        details = {"expected": expected, "actual": actual_rounds}
        if expected == 0:
            # A no-tool case: answering directly is the whole budget; any
            # tool-calling round is over budget.
            return (1.0 if actual_rounds <= 0 else 0.0), details
        if actual_rounds <= 0:
            return 0.0, details
        if actual_rounds <= expected:
            return 1.0, details
        # Soft penalty for overshooting the budgeted ReAct rounds.
        overshoot = actual_rounds - expected
        score = max(0.0, 1.0 - overshoot / expected)
        return score, details

    def _score_answer(self, reply: str) -> tuple[float, dict[str, Any]]:
        return score_answer(reply, self.answer)


def find_cases(groups: list[str], *, cases_dir: Path | None = None) -> list[ToolCallCase]:
    return [
        _load_case(raw, group=group, suite_name=suite_name, default_models=default_models)
        for raw, group, suite_name, default_models in iter_raw_cases(groups, cases_dir=cases_dir)
    ]


def _load_case(
    raw: dict[str, Any],
    *,
    group: str,
    suite_name: str,
    default_models: list[str] | None,
) -> ToolCallCase:
    base = load_base_fields(
        raw, group=group, suite_name=suite_name, default_models=default_models
    )
    expected_tools = list(raw.get("expected_tools") or [])
    raw_rounds = raw.get("total_rounds")
    # Default budget: 0 tool rounds when no tools are expected, else 1.
    # An explicit ``0`` is kept (``or 1`` used to turn it into 1).
    if raw_rounds is None:
        total_rounds = 1 if expected_tools else 0
    else:
        total_rounds = int(raw_rounds)
    return ToolCallCase(
        **base,
        expected_tools=expected_tools,
        total_rounds=total_rounds,
        answer=dict(raw.get("answer") or {}),
    )


def _require_secondary_support(agent: Any) -> None:
    if not hasattr(agent, "register_secondary"):
        raise TypeError(
            f"{type(agent).__name__} does not support secondary listeners; "
            "use a BaseReactAgent (tahoe / databot / knowledge)"
        )


async def run_cases(
    groups: list[str],
    agent_factory: AgentFactory,
    *,
    cases_dir: Path | None = None,
) -> tuple[float, list[CaseAggregate]]:
    """Run each case on every listed model; average models, then cases.

    ``agent_factory(model_name)`` must return a bound agent for that model.
    """
    return await run_case_aggregates(
        find_cases(groups, cases_dir=cases_dir),
        agent_factory,
        CaseAggregate,
        check_agent=_require_secondary_support,
    )


def format_case_result(result: CaseResult) -> str:
    """Human-readable one-model run summary for CLI output."""
    case = result.case
    score = result.score
    status = "CANCELLED" if result.cancelled else f"{score.total:.2f}"
    model_bit = f" model={result.model_name}" if result.model_name else ""
    lines = [
        f"[{status}] {case.case_group}/{case.name}{model_bit} "
        f"(tools={score.tool_score:.2f} rounds={score.round_score:.2f} "
        f"answer={score.answer_score:.2f})",
    ]
    if result.cancelled:
        return lines[0]
    tools = score.details.get("tools") or {}
    rounds = score.details.get("rounds") or {}
    answer = score.details.get("answer") or {}
    if tools.get("reason"):
        lines.append(
            f"  tools: expected={tools.get('expected')} actual={tools.get('actual')} "
            f"({tools['reason']})"
        )
    if rounds:
        lines.append(
            f"  rounds: expected={rounds.get('expected')} actual={rounds.get('actual')}"
        )
    missing = answer.get("missing") or []
    if missing:
        lines.append(f"  answer missing keys: {missing}")
    mismatched = answer.get("mismatched") or []
    if mismatched:
        lines.append(f"  answer mismatched keys: {mismatched}")
    if answer.get("skipped"):
        lines.append("  answer: skipped")
    parse_error = answer.get("parse_error")
    if parse_error:
        lines.append(f"  answer parse error: {parse_error}")
    return "\n".join(lines)


def format_case_aggregate(aggregate: CaseAggregate) -> str:
    """Print every model run, then the per-case model average."""
    lines = [format_case_result(result) for result in aggregate.model_results]
    lines.append(format_aggregate_footer(aggregate))
    return "\n".join(lines)


# Backward-compatible name used by early scaffolding.
async def run(groups: list[str], agent_factory: AgentFactory) -> float:
    average, _ = await run_cases(groups, agent_factory)
    return average

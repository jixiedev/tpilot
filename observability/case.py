"""Eval cases: load JSON fixtures, run an agent turn, score tool/answer behavior."""

from __future__ import annotations

import json
import uuid
from collections.abc import Awaitable, Callable
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from agent.react.react import BaseReactAgent
from agent.turn import AgentTurnResult, extract_turn_output
from observability.answer_match import score_answer
from observability.observe import CaseScore, Observer

CASES_DIR = Path(__file__).resolve().parent / "cases"

# Backward-compatible group keys (e.g. docs / scripts using ``knowledge_case``).
GROUP_ALIASES: dict[str, str] = {
    "knowledge_case": "knowledge",
}

# Reserved top-level JSON keys that are not suite names.
_FILE_META_KEYS = frozenset({"models"})

AgentFactory = Callable[[str], Awaitable[BaseReactAgent]]


@dataclass
class CaseResult:
    case: ToolCallCase
    score: CaseScore
    reply: str
    cancelled: bool = False
    model_name: str = ""


@dataclass
class CaseAggregate:
    """One case averaged across its configured models."""

    case: ToolCallCase
    model_results: list[CaseResult] = field(default_factory=list)

    @property
    def average(self) -> float:
        if not self.model_results:
            return 0.0
        total = 0.0
        for result in self.model_results:
            total += 0.0 if result.cancelled else result.score.total
        return total / len(self.model_results)


class ToolCallCase:
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
        self.name = name
        self.case_group = case_group
        self.query = query
        self.expected_tools = list(expected_tools)
        self.total_rounds = int(total_rounds)
        self.answer = dict(answer)
        self.models = list(models)

    async def run(self, agent: BaseReactAgent, *, model_name: str = "") -> CaseResult:
        observer = Observer(completion_tool_name=agent.completion_tool_name)
        agent.clear_observers()
        agent.register_observer(observer)
        session = f"eval-{self.case_group}-{self.name}-{uuid.uuid4().hex[:8]}"
        result: AgentTurnResult = await agent.run(
            self.query,
            session=session,
            user_id="case_bot",
            print_output=False,
        )
        try:
            case_result = self.score(result, observer)
            case_result.model_name = model_name
            return case_result
        finally:
            agent.clear_observers()

    def score(self, result: AgentTurnResult, observer: Observer) -> CaseResult:
        reply = extract_turn_output(
            result.state,
            completion_tool_name=observer.completion_tool_name,
        )
        tool_score, tool_details = self._score_tools(observer)
        round_score, round_details = self._score_rounds(observer)
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

    def _score_tools(self, observer: Observer) -> tuple[float, dict[str, Any]]:
        actual = observer.tool_names(include_completion=False)
        expected = list(self.expected_tools)
        details: dict[str, Any] = {"expected": expected, "actual": actual}
        if not expected:
            score = 1.0 if not actual else 0.0
            details["reason"] = "no tools expected"
            return score, details
        if _is_subsequence(expected, actual):
            details["reason"] = "ordered match"
            return 1.0, details
        expected_set = set(expected)
        actual_set = set(actual)
        overlap = expected_set & actual_set
        if not expected_set:
            return 0.0, details
        # Partial credit when the right tools appear but order is wrong.
        coverage = len(overlap) / len(expected_set)
        score = 0.5 * coverage
        details["reason"] = "unordered partial"
        details["overlap"] = sorted(overlap)
        return score, details

    def _score_rounds(self, observer: Observer) -> tuple[float, dict[str, Any]]:
        actual_rounds = observer.llm_round_count
        expected = max(1, self.total_rounds)
        details = {"expected": expected, "actual": actual_rounds}
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


def _is_subsequence(expected: list[str], actual: list[str]) -> bool:
    if not expected:
        return True
    index = 0
    for name in actual:
        if name == expected[index]:
            index += 1
            if index == len(expected):
                return True
    return False


def list_case_groups(*, cases_dir: Path | None = None) -> list[str]:
    """Return sorted group keys derived from ``*.json`` files under ``cases/``."""
    root = cases_dir or CASES_DIR
    return sorted(path.stem for path in root.glob("*.json"))


def resolve_group_path(group: str, *, cases_dir: Path | None = None) -> Path:
    root = cases_dir or CASES_DIR
    candidates = [group]
    alias = GROUP_ALIASES.get(group)
    if alias and alias not in candidates:
        candidates.append(alias)
    for name in candidates:
        path = root / f"{name}.json"
        if path.is_file():
            return path
    tried = ", ".join(f"{name}.json" for name in candidates)
    raise FileNotFoundError(f"case group file not found for {group!r} (tried: {tried})")


def parse_models_field(
    raw: Any,
    *,
    label: str,
    default_models: list[str] | None = None,
) -> list[str]:
    """Normalize a case/file ``models`` value to a non-empty list of names."""
    if raw is None:
        if default_models:
            return list(default_models)
        raise ValueError(
            f"{label} is missing required field 'models' "
            "(list of names from models/models.toml)"
        )
    if isinstance(raw, str):
        names = [raw.strip()] if raw.strip() else []
    elif isinstance(raw, list):
        names = [str(item).strip() for item in raw if str(item).strip()]
    else:
        raise ValueError(f"{label} field 'models' must be a string or list of strings")
    if not names:
        raise ValueError(f"{label} field 'models' must be a non-empty list")
    return names


def extract_file_default_models(payload: Any) -> list[str] | None:
    """Optional top-level ``models`` shared by every case in the file."""
    if not isinstance(payload, dict) or "models" not in payload:
        return None
    return parse_models_field(payload["models"], label="case file")


def find_cases(groups: list[str], *, cases_dir: Path | None = None) -> list[ToolCallCase]:
    root = cases_dir or CASES_DIR
    all_cases: list[ToolCallCase] = []
    for group in groups:
        path = resolve_group_path(group, cases_dir=root)
        payload = json.loads(path.read_text(encoding="utf-8"))
        default_models = extract_file_default_models(payload)
        suites = _normalize_suites(payload)
        for suite_name, cases in suites.items():
            for raw in cases:
                all_cases.append(
                    _load_case(
                        raw,
                        group=group,
                        suite_name=suite_name,
                        default_models=default_models,
                    )
                )
    return all_cases


def _load_case(
    raw: dict[str, Any],
    *,
    group: str,
    suite_name: str,
    default_models: list[str] | None,
) -> ToolCallCase:
    if "name" not in raw:
        raise ValueError(f"case in {group}/{suite_name} is missing required field 'name'")
    if "query" not in raw:
        raise ValueError(
            f"case {raw.get('name', '?')!r} in {group}/{suite_name} "
            "is missing required field 'query'"
        )
    label = f"case {raw['name']!r} in {group}/{suite_name}"
    models = parse_models_field(
        raw.get("models"),
        label=label,
        default_models=default_models,
    )
    return ToolCallCase(
        name=str(raw["name"]),
        case_group=f"{group}/{suite_name}",
        query=str(raw["query"]),
        expected_tools=list(raw.get("expected_tools") or []),
        total_rounds=int(raw.get("total_rounds") or 1),
        answer=dict(raw.get("answer") or {}),
        models=models,
    )


def _normalize_suites(payload: Any) -> dict[str, list[dict[str, Any]]]:
    if isinstance(payload, list):
        return {"default": payload}
    if isinstance(payload, dict):
        suites: dict[str, list[dict[str, Any]]] = {}
        for key, value in payload.items():
            if key in _FILE_META_KEYS:
                continue
            if not isinstance(value, list):
                raise ValueError(f"case suite {key!r} must be a list")
            suites[str(key)] = value
        return suites
    raise ValueError("case file must be a list or an object of named suites")


async def run_cases(
    groups: list[str],
    agent_factory: AgentFactory,
    *,
    cases_dir: Path | None = None,
) -> tuple[float, list[CaseAggregate]]:
    """Run each case on every listed model; average models, then cases.

    ``agent_factory(model_name)`` must return a bound agent for that model.
    """
    cases = find_cases(groups, cases_dir=cases_dir)
    if not cases:
        return 0.0, []

    agents: dict[str, BaseReactAgent] = {}
    aggregates: list[CaseAggregate] = []
    case_totals = 0.0

    for case in cases:
        aggregate = CaseAggregate(case=case)
        for model_name in case.models:
            if model_name not in agents:
                agent = await agent_factory(model_name)
                if not hasattr(agent, "register_observer"):
                    raise TypeError(
                        f"{type(agent).__name__} does not support observers; "
                        "use a BaseReactAgent (tahoe / databot / knowledge)"
                    )
                agents[model_name] = agent
            case_result = await case.run(agents[model_name], model_name=model_name)
            aggregate.model_results.append(case_result)
        aggregates.append(aggregate)
        case_totals += aggregate.average

    return case_totals / len(aggregates), aggregates


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
    n = len(aggregate.model_results)
    lines.append(
        f"  case avg: {aggregate.average:.3f} "
        f"({n} model{'s' if n != 1 else ''}: {', '.join(aggregate.case.models)})"
    )
    return "\n".join(lines)


# Backward-compatible name used by early scaffolding.
async def run(groups: list[str], agent_factory: AgentFactory) -> float:
    average, _ = await run_cases(groups, agent_factory)
    return average

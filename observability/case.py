"""Eval cases: load JSON fixtures, run an agent turn, score tool/answer behavior."""

from __future__ import annotations

import json
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from agent.react.react import BaseReactAgent
from agent.turn import AgentTurnResult, extract_turn_output
from observability.observe import CaseScore, Observer

CASES_DIR = Path(__file__).resolve().parent / "cases"


@dataclass
class CaseResult:
    case: ToolCallCase
    score: CaseScore
    reply: str
    cancelled: bool = False


class ToolCallCase:
    def __init__(
        self,
        name: str,
        case_group: str,
        query: str,
        expected_tools: list[str],
        total_rounds: int,
        answer: dict[str, Any],
    ) -> None:
        self.name = name
        self.case_group = case_group
        self.query = query
        self.expected_tools = list(expected_tools)
        self.total_rounds = int(total_rounds)
        self.answer = dict(answer)

    async def run(self, agent: BaseReactAgent) -> CaseResult:
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
            return self.score(result, observer)
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
        if not self.answer:
            return 1.0, {"matched": [], "missing": []}
        haystack = reply.casefold()
        matched: list[str] = []
        missing: list[str] = []
        for key, value in self.answer.items():
            needle = str(value).strip()
            if not needle:
                matched.append(key)
                continue
            if needle.casefold() in haystack:
                matched.append(key)
            else:
                missing.append(key)
        score = len(matched) / len(self.answer)
        return score, {"matched": matched, "missing": missing, "reply_preview": reply[:240]}


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


def find_cases(groups: list[str], *, cases_dir: Path | None = None) -> list[ToolCallCase]:
    root = cases_dir or CASES_DIR
    all_cases: list[ToolCallCase] = []
    for group in groups:
        path = root / f"{group}.json"
        if not path.is_file():
            raise FileNotFoundError(f"case group file not found: {path}")
        payload = json.loads(path.read_text(encoding="utf-8"))
        suites = _normalize_suites(payload)
        for suite_name, cases in suites.items():
            for raw in cases:
                all_cases.append(
                    ToolCallCase(
                        name=str(raw["name"]),
                        case_group=f"{group}/{suite_name}",
                        query=str(raw["query"]),
                        expected_tools=list(raw.get("expected_tools") or []),
                        total_rounds=int(raw.get("total_rounds") or 1),
                        answer=dict(raw.get("answer") or {}),
                    )
                )
    return all_cases


def _normalize_suites(payload: Any) -> dict[str, list[dict[str, Any]]]:
    if isinstance(payload, list):
        return {"default": payload}
    if isinstance(payload, dict):
        suites: dict[str, list[dict[str, Any]]] = {}
        for key, value in payload.items():
            if not isinstance(value, list):
                raise ValueError(f"case suite {key!r} must be a list")
            suites[str(key)] = value
        return suites
    raise ValueError("case file must be a list or an object of named suites")


async def run_cases(
    groups: list[str],
    agent: BaseReactAgent,
    *,
    cases_dir: Path | None = None,
) -> tuple[float, list[CaseResult]]:
    if not hasattr(agent, "register_observer"):
        raise TypeError(
            f"{type(agent).__name__} does not support observers; "
            "use a BaseReactAgent (tahoe / databot / knowledge)"
        )
    cases = find_cases(groups, cases_dir=cases_dir)
    if not cases:
        return 0.0, []
    results: list[CaseResult] = []
    total = 0.0
    for case in cases:
        case_result = await case.run(agent)
        results.append(case_result)
        total += 0.0 if case_result.cancelled else case_result.score.total
    return total / len(cases), results


# Backward-compatible name used by early scaffolding.
async def run(groups: list[str], agent: BaseReactAgent) -> float:
    average, _ = await run_cases(groups, agent)
    return average

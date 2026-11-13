"""EvalScorer: turn an ``EvalRunResult`` into a per-dimension ``EvalScore``."""

from __future__ import annotations

import json
from collections.abc import Callable
from dataclasses import dataclass, field
from typing import Any, ClassVar

from agent.intent.orchestrator import intentions_from_state
from observability.case import (
    DatabotEvalCase,
    IntentEvalCase,
    ReactEvalCase,
    ToolPathEvalCase,
    ToolsSpec,
)
from observability.runner import EvalRunResult


@dataclass
class DimensionScore:
    name: str
    value: float
    details: dict[str, Any] = field(default_factory=dict)

    def render(self) -> list[str]:
        """Detail lines explaining this score in a report."""
        details = self.details
        if self.name == "answer":
            lines = [
                f"  expected_output {key} keys: {details[key]}"
                for key in ("missing", "mismatched")
                if details.get(key)
            ]
            if "parse_error" in details:
                lines.append(f"  expected_output parse error: {details['parse_error']}")
            if details.get("reason") == "mismatch":
                lines.append(
                    f"  expected_output: expected={details['expected']} actual={details['actual']}"
                )
            return lines
        if "required" in details:
            return [
                f"  {self.name}: required={details['required']} allowed={details['allowed']} "
                f"actual={details['actual']} ({details['reason']})"
            ]
        reason = f" ({details['reason']})" if "reason" in details else ""
        return [f"  {self.name}: expected={details['expected']} actual={details['actual']}{reason}"]


@dataclass
class EvalScore:
    dimensions: list[DimensionScore] = field(default_factory=list)
    cancelled: bool = False

    @property
    def total(self) -> float:
        if self.cancelled:
            return 0.0
        return sum(item.value for item in self.dimensions) / len(self.dimensions)

    def named(self, name: str) -> DimensionScore | None:
        return next((item for item in self.dimensions if item.name == name), None)

    def value_of(self, name: str) -> float:
        return self.named(name).value

    def summary(self) -> str:
        return " ".join(f"{item.name}={item.value:.2f}" for item in self.dimensions)


class EvalScorer:
    """Score the dimensions a case's eval set owns (see ``DIMENSIONS``)."""

    DIMENSIONS: ClassVar[dict[str, dict[str, tuple[str, ...]]]] = {
        "functional": {
            "react": ("tools", "answer"),
            "databot": ("tools", "draft_tools", "cards", "sql_runs", "answer"),
            "intent": ("status", "intentions", "routes"),
        },
        "performance": {
            "react": ("max_tool_calls",),
            "databot": ("max_tool_calls",),
            "intent": ("status",),
        },
        "harness": {
            "react": ("tools", "max_tool_calls", "answer"),
            "databot": ("tools", "max_tool_calls", "sql_runs", "answer"),
            "intent": ("status", "intentions", "routes"),
        },
    }
    CARD_KEYS: ClassVar[tuple[str, ...]] = ("approved_cards", "review_cards", "committed_cards")

    def __init__(self) -> None:
        self._dimensions_by_kind: dict[str, Callable[[Any, EvalRunResult], dict[str, DimensionScore]]] = {
            ReactEvalCase.kind: self._react_dimensions,
            DatabotEvalCase.kind: self._databot_dimensions,
            IntentEvalCase.kind: self._intent_dimensions,
        }

    def score(self, result: EvalRunResult) -> EvalScore:
        case = result.case
        produced = self._dimensions_by_kind[case.kind](case, result)
        wanted = self.DIMENSIONS[case.eval_set][case.kind]
        return EvalScore(
            dimensions=[produced[name] for name in wanted if name in produced],
            cancelled=result.cancelled,
        )

    # --- per-workload dimensions ------------------------------------------------

    def _tool_path_dimensions(
        self, case: ToolPathEvalCase, result: EvalRunResult
    ) -> dict[str, DimensionScore]:
        return {
            "tools": self.score_tools(case.tools, result.tool_names),
            "max_tool_calls": self.score_budget(case.max_tool_calls, len(result.tool_calls)),
        }

    def _react_dimensions(
        self, case: ReactEvalCase, result: EvalRunResult
    ) -> dict[str, DimensionScore]:
        produced = self._tool_path_dimensions(case, result)
        if case.expected_output:
            produced["answer"] = self.score_json_answer(result.reply, case.expected_output)
        return produced

    def _databot_dimensions(
        self, case: DatabotEvalCase, result: EvalRunResult
    ) -> dict[str, DimensionScore]:
        produced = self._tool_path_dimensions(case, result)
        if case.expected_output:
            produced["answer"] = self.score_text_answer(result.reply, case.expected_output)
        if case.draft_tools:
            produced["draft_tools"] = self.score_tools(
                case.draft_tools, result.tool_names, name="draft_tools"
            )
        if case.expected_table_cards:
            produced["cards"] = self.score_sequence(
                case.expected_table_cards, self.card_names(result.state), name="cards"
            )
        produced["sql_runs"] = self.score_sql_runs(result.state)
        return produced

    def _intent_dimensions(
        self, case: IntentEvalCase, result: EvalRunResult
    ) -> dict[str, DimensionScore]:
        outcome = self.intent_outcome(result.state)
        return {
            "status": self.score_exact(case.expected_status, outcome["status"], name="status"),
            "intentions": self.score_sequence(
                case.expected_intentions, outcome["intentions"], name="intentions"
            ),
            "routes": self.score_sequence(case.expected_routes, outcome["routes"], name="routes"),
        }

    # --- dimension rules --------------------------------------------------------

    def score_sequence(self, expected: list[str], actual: list[str], *, name: str) -> DimensionScore:
        """Ordered subsequence → 1.0; otherwise 0.5 × set coverage. Nothing expected → nothing allowed."""
        details: dict[str, Any] = {"expected": expected, "actual": actual}
        if not expected:
            details["reason"] = "nothing expected"
            return DimensionScore(name, 0.0 if actual else 1.0, details)
        remaining = iter(actual)
        if all(item in remaining for item in expected):
            details["reason"] = "ordered match"
            return DimensionScore(name, 1.0, details)
        overlap = set(expected) & set(actual)
        details.update(reason="unordered partial", overlap=sorted(overlap))
        return DimensionScore(name, 0.5 * len(overlap) / len(set(expected)), details)

    def score_tools(
        self, spec: ToolsSpec, actual: list[str], *, name: str = "tools"
    ) -> DimensionScore:
        details: dict[str, Any] = {
            "required": spec.required,
            "allowed": spec.allowed,
            "forbidden": spec.forbidden,
            "actual": actual,
        }
        forbidden = [tool for tool in actual if tool in spec.forbidden]
        disallowed = [tool for tool in actual if spec.allowed and tool not in spec.allowed]
        if forbidden:
            details.update(reason="forbidden tool used", forbidden_hits=forbidden)
            return DimensionScore(name, 0.0, details)
        if disallowed:
            details.update(reason="disallowed tool used", disallowed=disallowed)
            return DimensionScore(name, 0.0, details)
        if spec.allowed and not spec.required:
            details["reason"] = "allowed-only match"
            return DimensionScore(name, 1.0, details)
        sequence = self.score_sequence(spec.required, actual, name=name)
        details.update({k: v for k, v in sequence.details.items() if k in ("reason", "overlap")})
        return DimensionScore(name, sequence.value, details)

    def score_budget(self, budget: int, actual: int, *, name: str = "max_tool_calls") -> DimensionScore:
        """Within budget → 1.0; each call over costs ``1 / budget``."""
        details = {"expected": budget, "actual": actual}
        if actual <= budget:
            return DimensionScore(name, 1.0, details)
        value = max(0.0, 1.0 - (actual - budget) / budget) if budget else 0.0
        return DimensionScore(name, value, details)

    def score_sql_runs(self, state: dict[str, Any], *, name: str = "sql_runs") -> DimensionScore:
        """Did Databot's approved SQL execute? Reads ``execution_result`` from the final
        state; a turn that never reached the execute node scores 0."""
        execution = state.get("execution_result", {})
        if not execution:
            details = {"expected": "executed", "actual": "not executed", "reason": "turn ended before execute_sql"}
            return DimensionScore(name, 0.0, details)
        ok = execution["ok"]
        details = {
            "expected": "executed",
            "actual": "executed" if ok else "failed",
            "reason": f"{execution.get('row_count', 0)} row(s)" if ok else execution["error"],
            "sql": execution.get("sql", ""),
        }
        return DimensionScore(name, float(ok), details)

    def score_exact(self, expected: str, actual: str, *, name: str) -> DimensionScore:
        match = expected == actual
        details = {"expected": expected, "actual": actual, "reason": "match" if match else "mismatch"}
        return DimensionScore(name, float(match), details)

    def score_json_answer(
        self, reply: str, expected: dict[str, Any], *, name: str = "answer"
    ) -> DimensionScore:
        """The whole reply must be one JSON object; score = fraction of ``expected``
        fields whose values are exactly equal. Fences, prose, or a non-object reply
        score 0: the case prompt asks for the bare object."""
        details: dict[str, Any] = {"reply_preview": reply[:240]}
        try:
            parsed = json.loads(reply)
            matched = [key for key, value in expected.items() if parsed.get(key) == value]
        except (json.JSONDecodeError, AttributeError) as exc:
            details.update(parse_error=f"reply is not a bare JSON object: {exc}", missing=list(expected))
            return DimensionScore(name, 0.0, details)
        details.update(
            parsed=parsed,
            matched=matched,
            missing=[key for key in expected if key not in parsed],
            mismatched=[key for key in expected if key in parsed and key not in matched],
        )
        return DimensionScore(name, len(matched) / len(expected), details)

    def score_text_answer(self, reply: str, expected: str, *, name: str = "answer") -> DimensionScore:
        """The reply, minus surrounding whitespace, must equal ``expected`` exactly.
        Extra words, markdown, or a differently qualified name score 0: the case
        prompt asks for the bare value."""
        actual = reply.strip()
        match = actual == expected
        details = {"expected": expected, "actual": actual, "reason": "exact match" if match else "mismatch"}
        return DimensionScore(name, float(match), details)

    def card_names(self, state: dict[str, Any]) -> list[str]:
        """Card names from the furthest Databot stage reached: approved, review, then committed."""
        for key in self.CARD_KEYS:
            if state.get(key):
                return [card["name"] for card in state[key]]
        return []

    def intent_outcome(self, state: dict[str, Any]) -> dict[str, Any]:
        """Normalize intent-graph state into ``status`` / ``intentions`` / ``routes``."""
        if state.get("__interrupt__"):
            return {"status": "clarify", "intentions": intentions_from_state(state), "routes": []}
        status = state.get("status") or "pending"
        if status == "published":
            return {
                "status": status,
                "intentions": intentions_from_state(state),
                "routes": [state["route_target"]],
            }
        if status == "rejected":
            return {"status": status, "intentions": [], "routes": []}
        return {"status": status, "intentions": intentions_from_state(state), "routes": []}

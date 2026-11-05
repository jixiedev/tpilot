"""Scorers and expected-output matching for eval cases."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from typing import Any

_JSON_FENCE_RE = re.compile(
    r"```(?:json)?\s*(?P<body>\{.*?\})\s*```",
    re.DOTALL | re.IGNORECASE,
)
_TABLE_RE = re.compile(r"\b([A-Za-z_][\w]*)\.([A-Za-z_][\w]*)\b")


@dataclass
class DimensionScore:
    name: str
    value: float
    details: dict[str, Any] = field(default_factory=dict)


@dataclass
class CaseScore:
    dimensions: list[DimensionScore] = field(default_factory=list)

    @property
    def total(self) -> float:
        if not self.dimensions:
            return 0.0
        return sum(item.value for item in self.dimensions) / len(self.dimensions)

    def named(self, name: str) -> DimensionScore | None:
        for item in self.dimensions:
            if item.name == name:
                return item
        return None

    def value_of(self, name: str) -> float:
        item = self.named(name)
        return 0.0 if item is None else item.value

    def summary(self) -> str:
        parts = [f"{item.name}={item.value:.2f}" for item in self.dimensions]
        return " ".join(parts)


def score_max_tool_calls(
    max_tool_calls: int,
    actual_tool_calls: int,
) -> tuple[float, dict[str, Any]]:
    """Score actual tool-call count against a budget (soft overshoot penalty)."""
    budget = max(0, int(max_tool_calls))
    actual = max(0, int(actual_tool_calls))
    details = {"expected": budget, "actual": actual}
    if actual <= budget:
        return 1.0, details
    if budget == 0:
        return 0.0, details
    overshoot = actual - budget
    return max(0.0, 1.0 - overshoot / budget), details


def score_answer(
    reply: str,
    answer: dict[str, Any] | str | None,
) -> tuple[float, dict[str, Any]]:
    """Backward-compatible alias for :func:`score_expected_output`."""
    return score_expected_output(reply, answer)


def score_expected_output(
    reply: str,
    expected_output: dict[str, Any] | str | None,
) -> tuple[float, dict[str, Any]]:
    """Compare a model reply to ``expected_output``.

    - Empty / missing expected → skip (score 1.0)
    - ``dict`` → parse a JSON object from the reply and compare fields
    - ``str`` → require a ``database.table`` token (or exact text) to match
    """
    if expected_output is None or expected_output == {} or expected_output == "":
        return 1.0, {"matched": [], "missing": [], "skipped": True}

    if isinstance(expected_output, str):
        return _score_table_or_text(reply, expected_output)

    if not isinstance(expected_output, dict):
        raise TypeError("expected_output must be a dict, string, or empty")

    parsed, parse_error = extract_json_object(reply)
    matched: list[str] = []
    missing: list[str] = []
    mismatched: list[str] = []
    details: dict[str, Any] = {"reply_preview": reply[:240], "skipped": False}

    if parsed is None:
        details["parse_error"] = parse_error or "no JSON object found"
        return 0.0, {
            **details,
            "matched": [],
            "missing": list(expected_output),
            "mismatched": [],
        }

    details["parsed"] = parsed
    for key, expected in expected_output.items():
        if key not in parsed:
            missing.append(key)
            continue
        if values_equal(parsed[key], expected):
            matched.append(key)
        else:
            mismatched.append(key)

    score = len(matched) / len(expected_output)
    return score, {
        **details,
        "matched": matched,
        "missing": missing,
        "mismatched": mismatched,
    }


def _score_table_or_text(reply: str, expected: str) -> tuple[float, dict[str, Any]]:
    expected_text = expected.strip()
    details: dict[str, Any] = {
        "reply_preview": reply[:240],
        "skipped": False,
        "expected": expected_text,
    }
    text = reply.strip()
    if not text:
        details["reason"] = "empty reply"
        return 0.0, details

    if values_equal(text, expected_text):
        details["reason"] = "exact match"
        details["actual"] = text
        return 1.0, details

    tables = [f"{match.group(1)}.{match.group(2)}" for match in _TABLE_RE.finditer(text)]
    details["tables_found"] = tables
    if expected_text in tables or (
        tables and any(values_equal(item, expected_text) for item in tables)
    ):
        details["reason"] = "table match"
        details["actual"] = expected_text
        return 1.0, details

    details["reason"] = "mismatch"
    details["actual"] = tables[0] if tables else text
    return 0.0, details


def extract_json_object(reply: str) -> tuple[dict[str, Any] | None, str | None]:
    text = reply.strip()
    if not text:
        return None, "empty reply"

    candidates: list[str] = []
    fence = _JSON_FENCE_RE.search(text)
    if fence:
        candidates.append(fence.group("body"))
    if text.startswith("{"):
        candidates.append(text)

    brace = re.search(r"\{.*\}", text, flags=re.DOTALL)
    if brace:
        candidates.append(brace.group(0))

    seen: set[str] = set()
    last_error = "no JSON object found"
    for candidate in candidates:
        candidate = candidate.strip()
        if not candidate or candidate in seen:
            continue
        seen.add(candidate)
        try:
            payload = json.loads(candidate)
        except json.JSONDecodeError as exc:
            last_error = str(exc)
            continue
        if isinstance(payload, dict):
            return payload, None
        last_error = "parsed JSON is not an object"
    return None, last_error


def values_equal(actual: Any, expected: Any) -> bool:
    if isinstance(expected, (int, float)) and isinstance(actual, (int, float)):
        return float(actual) == float(expected)
    if isinstance(expected, (int, float)) and isinstance(actual, str):
        try:
            return float(actual.strip()) == float(expected)
        except ValueError:
            pass
    if isinstance(actual, (int, float)) and isinstance(expected, str):
        try:
            return float(actual) == float(expected.strip())
        except ValueError:
            pass
    expected_text = str(expected).strip()
    if not expected_text:
        return True
    return str(actual).strip().casefold() == expected_text.casefold()


def parse_expected_output(raw: Any) -> dict[str, Any] | str:
    """Normalize case JSON ``expected_output`` / legacy ``answer``."""
    if raw is None:
        return {}
    if isinstance(raw, str):
        return raw.strip()
    if isinstance(raw, dict):
        return dict(raw)
    raise ValueError("expected_output must be a JSON object, string, or omitted")


class OrderedSequenceScorer:
    """Score an expected sequence against actual items (order-aware, with partial credit)."""

    def is_subsequence(self, expected: list[str], actual: list[str]) -> bool:
        if not expected:
            return True
        index = 0
        for name in actual:
            if name == expected[index]:
                index += 1
                if index == len(expected):
                    return True
        return False

    def score(
        self,
        expected: list[str],
        actual: list[str],
        *,
        name: str,
        empty_reason: str,
    ) -> DimensionScore:
        details: dict[str, Any] = {"expected": list(expected), "actual": list(actual)}
        if not expected:
            details["reason"] = empty_reason
            return DimensionScore(
                name=name,
                value=1.0 if not actual else 0.0,
                details=details,
            )
        if self.is_subsequence(expected, actual):
            details["reason"] = "ordered match"
            return DimensionScore(name=name, value=1.0, details=details)
        overlap = set(expected) & set(actual)
        coverage = len(overlap) / len(set(expected))
        details["reason"] = "unordered partial"
        details["overlap"] = sorted(overlap)
        return DimensionScore(name=name, value=0.5 * coverage, details=details)


class RoundBudgetScorer:
    """Score tool-call count against ``max_tool_calls`` (soft overshoot penalty)."""

    def score(
        self,
        expected: int,
        actual: int,
        *,
        name: str = "max_tool_calls",
    ) -> DimensionScore:
        value, details = score_max_tool_calls(expected, actual)
        return DimensionScore(name=name, value=value, details=details)


class ExactMatchScorer:
    def score(self, expected: str, actual: str, *, name: str) -> DimensionScore:
        details = {"expected": expected, "actual": actual}
        if actual == expected:
            details["reason"] = "match"
            return DimensionScore(name=name, value=1.0, details=details)
        details["reason"] = "mismatch"
        return DimensionScore(name=name, value=0.0, details=details)


class AnswerMatcher:
    """Compare a model reply to ``expected_output`` (JSON object or table string)."""

    def score(
        self,
        reply: str,
        expected: dict[str, Any] | str | None,
        *,
        name: str = "answer",
    ) -> DimensionScore:
        value, details = score_expected_output(reply, expected)
        return DimensionScore(name=name, value=value, details=details)

    def extract_json_object(self, reply: str) -> tuple[dict[str, Any] | None, str | None]:
        return extract_json_object(reply)

    def values_equal(self, actual: Any, expected: Any) -> bool:
        return values_equal(actual, expected)

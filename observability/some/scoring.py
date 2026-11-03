"""Instance scorers and score value objects for eval cases."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from typing import Any


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
            return DimensionScore(name=name, value=1.0 if not actual else 0.0, details=details)
        if self.is_subsequence(expected, actual):
            details["reason"] = "ordered match"
            return DimensionScore(name=name, value=1.0, details=details)
        overlap = set(expected) & set(actual)
        coverage = len(overlap) / len(set(expected))
        details["reason"] = "unordered partial"
        details["overlap"] = sorted(overlap)
        return DimensionScore(name=name, value=0.5 * coverage, details=details)


class RoundBudgetScorer:
    """Score ReAct rounds against a budget, with a soft overshoot penalty."""

    def score(self, expected: int, actual: int) -> DimensionScore:
        budget = max(1, int(expected))
        details = {"expected": budget, "actual": actual}
        if actual <= 0:
            return DimensionScore(name="rounds", value=0.0, details=details)
        if actual <= budget:
            return DimensionScore(name="rounds", value=1.0, details=details)
        overshoot = actual - budget
        value = max(0.0, 1.0 - overshoot / budget)
        return DimensionScore(name="rounds", value=value, details=details)


class ExactMatchScorer:
    def score(self, expected: str, actual: str, *, name: str) -> DimensionScore:
        details = {"expected": expected, "actual": actual}
        if actual == expected:
            details["reason"] = "match"
            return DimensionScore(name=name, value=1.0, details=details)
        details["reason"] = "mismatch"
        return DimensionScore(name=name, value=0.0, details=details)


class AnswerMatcher:
    """Parse JSON from a model reply and compare fields to an expected object."""

    _JSON_FENCE_RE = re.compile(
        r"```(?:json)?\s*(?P<body>\{.*?\})\s*```",
        re.DOTALL | re.IGNORECASE,
    )

    def score(self, reply: str, expected: dict[str, Any]) -> DimensionScore:
        if not expected:
            return DimensionScore(
                name="answer",
                value=1.0,
                details={"matched": [], "missing": [], "skipped": True},
            )

        parsed, parse_error = self.extract_json_object(reply)
        details: dict[str, Any] = {
            "reply_preview": reply[:240],
            "skipped": False,
            "matched": [],
            "missing": [],
            "mismatched": [],
        }
        if parsed is None:
            details["parse_error"] = parse_error or "no JSON object found"
            details["missing"] = list(expected)
            return DimensionScore(name="answer", value=0.0, details=details)

        details["parsed"] = parsed
        matched: list[str] = []
        missing: list[str] = []
        mismatched: list[str] = []
        for key, wanted in expected.items():
            if key not in parsed:
                missing.append(key)
                continue
            if self.values_equal(parsed[key], wanted):
                matched.append(key)
            else:
                mismatched.append(key)
        details["matched"] = matched
        details["missing"] = missing
        details["mismatched"] = mismatched
        return DimensionScore(
            name="answer",
            value=len(matched) / len(expected),
            details=details,
        )

    def extract_json_object(self, reply: str) -> tuple[dict[str, Any] | None, str | None]:
        text = reply.strip()
        if not text:
            return None, "empty reply"

        candidates: list[str] = []
        fence = self._JSON_FENCE_RE.search(text)
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

    def values_equal(self, actual: Any, expected: Any) -> bool:
        if isinstance(expected, (int, float)) and isinstance(actual, (int, float)):
            return float(actual) == float(expected)
        expected_text = str(expected).strip()
        if not expected_text:
            return True
        return str(actual).strip().casefold() == expected_text.casefold()

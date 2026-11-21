"""JSON answer matching for eval cases."""

from __future__ import annotations

from typing import Any

from tahoepilot.agent.graph.messages import extract_json_object

__all__ = ["extract_json_object", "score_answer", "values_equal"]



def score_answer(reply: str, answer: dict[str, Any]) -> tuple[float, dict[str, Any]]:
    """Parse JSON from the model reply and compare fields to ``answer``."""
    if not answer:
        return 1.0, {"matched": [], "missing": [], "skipped": True}

    parsed, parse_error = extract_json_object(reply)
    matched: list[str] = []
    missing: list[str] = []
    mismatched: list[str] = []
    details: dict[str, Any] = {"reply_preview": reply[:240], "skipped": False}

    if parsed is None:
        details["parse_error"] = parse_error or "no JSON object found"
        return 0.0, {**details, "matched": [], "missing": list(answer), "mismatched": []}

    details["parsed"] = parsed
    for key, expected in answer.items():
        if key not in parsed:
            missing.append(key)
            continue
        if values_equal(parsed[key], expected):
            matched.append(key)
        else:
            mismatched.append(key)

    score = len(matched) / len(answer)
    return score, {
        **details,
        "matched": matched,
        "missing": missing,
        "mismatched": mismatched,
    }


_NULL_TEXTS = {"", "null", "none"}


def values_equal(actual: Any, expected: Any) -> bool:
    """Whether a reply value satisfies an expected value.

    - ``None`` expected: the reply must be ``null`` (or empty / "null" / "none").
    - A list expected and a list in the reply: every expected item must be in the
      reply (order-free; extra items are allowed, e.g. more upstream tables).
    - A list expected and a scalar in the reply: the scalar must be one of the
      items (several answers are acceptable, e.g. any of three models).
    - Otherwise numbers compare as floats and the rest as stripped, case-folded
      strings; an empty expected string matches any value.
    """
    if expected is None:
        return actual is None or str(actual).strip().casefold() in _NULL_TEXTS
    if isinstance(expected, list):
        if isinstance(actual, list):
            return all(any(values_equal(a, e) for a in actual) for e in expected)
        return any(values_equal(actual, e) for e in expected)
    if isinstance(expected, (int, float)) and isinstance(actual, (int, float)):
        return float(actual) == float(expected)
    if actual is None:
        return not str(expected).strip()
    expected_text = str(expected).strip()
    if not expected_text:
        return True
    return str(actual).strip().casefold() == expected_text.casefold()

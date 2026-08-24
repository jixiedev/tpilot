"""JSON answer matching for eval cases."""

from __future__ import annotations

import json
import re
from typing import Any

_JSON_FENCE_RE = re.compile(
    r"```(?:json)?\s*(?P<body>\{.*?\})\s*```",
    re.DOTALL | re.IGNORECASE,
)


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
    expected_text = str(expected).strip()
    if not expected_text:
        return True
    return str(actual).strip().casefold() == expected_text.casefold()

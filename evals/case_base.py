"""Shared plumbing for eval case types: case-file loading, scoring and the run loop."""

from __future__ import annotations

import json
import uuid
from collections.abc import Awaitable, Callable, Iterator
from pathlib import Path
from typing import Any, Protocol

CASES_DIR = Path(__file__).resolve().parent / "cases"

# Backward-compatible group keys (e.g. docs / scripts using ``knowledge_case``).
GROUP_ALIASES: dict[str, str] = {
    "knowledge_case": "knowledge",
}

# Reserved top-level JSON keys that are not suite names.
_FILE_META_KEYS = frozenset({"models"})


class BaseCase:
    """Fields every eval case carries, whatever it scores."""

    def __init__(self, name: str, case_group: str, query: str, models: list[str]) -> None:
        self.name = name
        self.case_group = case_group
        self.query = query
        self.models = list(models)

    def _session_id(self, prefix: str) -> str:
        return f"{prefix}-{self.case_group}-{self.name}-{uuid.uuid4().hex[:8]}"


class _ScoredResult(Protocol):
    cancelled: bool
    score: Any


class AggregateAverageMixin:
    """``average`` over ``model_results``; cancelled runs count as 0."""

    model_results: list[_ScoredResult]

    @property
    def average(self) -> float:
        if not self.model_results:
            return 0.0
        total = 0.0
        for result in self.model_results:
            total += 0.0 if result.cancelled else result.score.total
        return total / len(self.model_results)


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


def score_sequence(
    expected: list[str],
    actual: list[str],
    *,
    empty_reason: str,
) -> tuple[float, dict[str, Any]]:
    """Ordered match = 1.0; right items in the wrong order = 0.5 * coverage."""
    details: dict[str, Any] = {"expected": expected, "actual": actual}
    if not expected:
        details["reason"] = empty_reason
        return (1.0 if not actual else 0.0), details
    if _is_subsequence(expected, actual):
        details["reason"] = "ordered match"
        return 1.0, details
    expected_set = set(expected)
    overlap = expected_set & set(actual)
    details["reason"] = "unordered partial"
    details["overlap"] = sorted(overlap)
    return 0.5 * len(overlap) / len(expected_set), details


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


def iter_raw_cases(
    groups: list[str],
    *,
    cases_dir: Path | None = None,
) -> Iterator[tuple[dict[str, Any], str, str, list[str] | None]]:
    """Yield ``(raw_case, group, suite_name, file_default_models)`` for each group file."""
    root = cases_dir or CASES_DIR
    for group in groups:
        path = resolve_group_path(group, cases_dir=root)
        payload = json.loads(path.read_text(encoding="utf-8"))
        default_models = extract_file_default_models(payload)
        for suite_name, cases in _normalize_suites(payload).items():
            for raw in cases:
                yield raw, group, suite_name, default_models


def require_case_field(raw: dict[str, Any], field_name: str, *, group: str, suite_name: str) -> None:
    if field_name in raw:
        return
    if field_name == "name":
        raise ValueError(f"case in {group}/{suite_name} is missing required field 'name'")
    raise ValueError(
        f"case {raw.get('name', '?')!r} in {group}/{suite_name} "
        f"is missing required field {field_name!r}"
    )


def load_base_fields(
    raw: dict[str, Any],
    *,
    group: str,
    suite_name: str,
    default_models: list[str] | None,
    extra_required: tuple[str, ...] = (),
) -> dict[str, Any]:
    """Validate required keys and return the ``BaseCase`` constructor kwargs."""
    for field_name in ("name", "query", *extra_required):
        require_case_field(raw, field_name, group=group, suite_name=suite_name)
    models = parse_models_field(
        raw.get("models"),
        label=f"case {raw['name']!r} in {group}/{suite_name}",
        default_models=default_models,
    )
    return {
        "name": str(raw["name"]),
        "case_group": f"{group}/{suite_name}",
        "query": str(raw["query"]),
        "models": models,
    }


async def run_case_aggregates(
    cases: list[Any],
    agent_factory: Callable[[str], Awaitable[Any]],
    make_aggregate: Callable[[Any], Any],
    *,
    check_agent: Callable[[Any], None] | None = None,
) -> tuple[float, list[Any]]:
    """Run each case on every listed model (one agent per model); average models, then cases."""
    if not cases:
        return 0.0, []

    agents: dict[str, Any] = {}
    aggregates: list[Any] = []
    case_totals = 0.0

    for case in cases:
        aggregate = make_aggregate(case)
        for model_name in case.models:
            if model_name not in agents:
                agent = await agent_factory(model_name)
                if check_agent is not None:
                    check_agent(agent)
                agents[model_name] = agent
            case_result = await case.run(agents[model_name], model_name=model_name)
            aggregate.model_results.append(case_result)
        aggregates.append(aggregate)
        case_totals += aggregate.average

    return case_totals / len(aggregates), aggregates


def format_aggregate_footer(aggregate: Any) -> str:
    n = len(aggregate.model_results)
    return (
        f"  case avg: {aggregate.average:.3f} "
        f"({n} model{'s' if n != 1 else ''}: {', '.join(aggregate.case.models)})"
    )

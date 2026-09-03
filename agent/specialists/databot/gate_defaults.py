"""Default per-option copy for Databot human gates."""

from __future__ import annotations

from typing import Literal

DEFAULT_CARDS_GATE_REASONS: dict[str, str] = {
    "approve": "The committed models and metrics match the user's question.",
    "deny-comments": "Request different models, metrics, or filters before SQL.",
    "deny-halt": "Stop this turn without running SQL.",
    "dryrun": "Preview only — no profile artifact will be saved.",
}

DEFAULT_SQL_GATE_REASONS: dict[str, str] = {
    "approve": "The drafted SQL matches the approved models and answers the question.",
    "deny-comments": "Request SQL changes — different metrics, filters, joins, or grain.",
    "deny-halt": "Stop this turn without executing SQL.",
    "dryrun": "Preview only — no query execution or profile artifact will be saved.",
}

_GATE_DEFAULTS: dict[Literal["cards", "sql"], dict[str, str]] = {
    "cards": DEFAULT_CARDS_GATE_REASONS,
    "sql": DEFAULT_SQL_GATE_REASONS,
}


def default_gate_reasons(gate: Literal["cards", "sql"]) -> dict[str, str]:
    """Return a fresh copy of the fallback reasons for ``gate``."""
    return dict(_GATE_DEFAULTS[gate])


def merge_gate_reasons(
    gate: Literal["cards", "sql"],
    reasons: dict[str, str] | None,
) -> dict[str, str]:
    """Overlay non-empty ``reasons`` onto gate defaults."""
    merged = default_gate_reasons(gate)
    if not reasons:
        return merged
    for key in merged:
        value = reasons.get(key)
        if isinstance(value, str) and value.strip():
            merged[key] = value.strip()
    return merged

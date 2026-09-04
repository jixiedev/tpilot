"""Default per-option copy for Databot human gates."""

from __future__ import annotations

from typing import Any, Literal

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


def _card_pick_line(card: dict[str, Any]) -> str:
    name = str(card.get("name") or "").strip()
    if not name:
        return ""
    metrics = ", ".join(
        str(m).strip()
        for m in (card.get("selected_metrics") or [])
        if str(m).strip()
    )[:80]
    dims = ", ".join(
        str(d).strip()
        for d in (card.get("selected_dimensions") or [])
        if str(d).strip()
    )[:80]
    note = str(card.get("selection_notes") or "").strip()
    parts: list[str] = []
    if metrics:
        parts.append(f"metrics: {metrics}")
    if dims:
        parts.append(f"dims: {dims}")
    if note:
        if parts:
            return f"{name} ({'; '.join(parts)}) — {note[:120]}"
        return f"{name} — {note[:160]}"
    if parts:
        return f"{name} ({'; '.join(parts)})"
    return name


def build_cards_selection_summary(review_cards: list[dict[str, Any]]) -> str:
    """Factual summary of committed models (not gate option persuasion copy)."""
    picks = [
        line
        for card in (review_cards or [])
        if isinstance(card, dict)
        for line in [_card_pick_line(card)]
        if line
    ]
    if not picks:
        return ""
    if len(picks) == 1:
        summary = picks[0]
    else:
        summary = "; ".join(picks[:3])
        if len(picks) > 3:
            summary += f"; +{len(picks) - 3} more"
    if len(summary) > 280:
        summary = summary[:277] + "…"
    return summary


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

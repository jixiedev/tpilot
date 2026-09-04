"""Staging → candidate card lifecycle for the Databot fetch stage.

``fetch_related_models`` writes full ``TableCard`` dicts into
``state.staging_cards`` (each with a unique ``staging_id``). The LLM
commits a subset via ``commit_cards`` using ``staging_id`` plus
``selected_dimensions`` / ``selected_metrics``; only then do cards land in
``committed_cards``; the outer graph copies them to ``review_cards`` before the gate.
"""

from __future__ import annotations

import re
import uuid
from typing import Any


_STAGING_ID_SUFFIX_RE = re.compile(r"_[0-9a-f]{8}$", re.IGNORECASE)


def new_staging_id(model_name: str) -> str:
    """Mint a stable-enough id for one staged card row."""
    slug = re.sub(r"[^a-zA-Z0-9_]+", "_", (model_name or "card").strip())[:40]
    slug = slug.strip("_") or "card"
    return f"{slug}_{uuid.uuid4().hex[:8]}"


def staging_entry_from_card(card: dict[str, Any]) -> dict[str, Any]:
    """Attach ``staging_id`` to a ``TableCard``-shaped dict."""
    entry = dict(card)
    entry["staging_id"] = new_staging_id(str(entry.get("name") or "card"))
    return entry


def merge_staging_cards(
    existing: list[dict[str, Any]],
    new_entries: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """Append freshly fetched staging rows (each fetch gets new ids)."""
    merged = list(existing or [])
    for entry in new_entries:
        if isinstance(entry, dict) and entry.get("staging_id"):
            merged.append(entry)
    return merged


def _column_names(card: dict[str, Any]) -> list[str]:
    names: list[str] = []
    for col in card.get("columns") or []:
        if isinstance(col, dict) and col.get("name"):
            names.append(str(col["name"]))
    return names


def _metric_names(card: dict[str, Any]) -> list[str]:
    names: list[str] = []
    for metric in card.get("metrics") or []:
        if isinstance(metric, dict) and metric.get("name"):
            names.append(str(metric["name"]))
    return names


def compact_staging_refs(staging_cards: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Lightweight refs returned to the LLM after a fetch (saves tokens)."""
    refs: list[dict[str, Any]] = []
    for card in staging_cards or []:
        if not isinstance(card, dict):
            continue
        columns = _column_names(card)
        metrics = _metric_names(card)
        refs.append(
            {
                "staging_id": card.get("staging_id", ""),
                "name": card.get("name", ""),
                "score": card.get("score"),
                "matched_chunk_type": card.get("matched_chunk_type", ""),
                "description": (card.get("description") or "")[:240],
                "physical_tables": list(card.get("physical_tables") or [])[:5],
                "columns": columns[:24],
                "metrics": metrics[:24],
            }
        )
    return refs


def parse_card_selection(item: Any) -> dict[str, Any] | None:
    """Normalize one ``commit_cards`` selection from the LLM."""
    if isinstance(item, str):
        text = item.strip()
        if not text:
            return None
        return {
            "staging_id": text,
            "selected_dimensions": [],
            "selected_metrics": [],
            "selection_notes": "",
        }
    if not isinstance(item, dict):
        return None
    staging_id = str(
        item.get("staging_id") or item.get("card_id") or item.get("id") or ""
    ).strip()
    if not staging_id:
        return None
    dims_raw = (
        item.get("selected_dimensions")
        or item.get("dimensions")
        or item.get("dimension_names")
        or []
    )
    metrics_raw = (
        item.get("selected_metrics")
        or item.get("metrics")
        or item.get("metric_names")
        or []
    )
    dims = [str(d).strip() for d in dims_raw if str(d).strip()] if isinstance(dims_raw, list) else []
    metrics = (
        [str(m).strip() for m in metrics_raw if str(m).strip()]
        if isinstance(metrics_raw, list)
        else []
    )
    notes = str(
        item.get("selection_notes") or item.get("notes") or item.get("rationale") or ""
    ).strip()
    return {
        "staging_id": staging_id,
        "selected_dimensions": dims,
        "selected_metrics": metrics,
        "selection_notes": notes,
    }


def _staging_index(cards: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    index: dict[str, dict[str, Any]] = {}
    for card in cards or []:
        if isinstance(card, dict):
            sid = card.get("staging_id")
            if sid:
                index[str(sid)] = card
    return index


def _name_from_staging_id(staging_id: str) -> str:
    sid = (staging_id or "").strip()
    if _STAGING_ID_SUFFIX_RE.search(sid):
        return _STAGING_ID_SUFFIX_RE.sub("", sid)
    return sid


def _latest_card_named(
    cards: list[dict[str, Any]], name: str
) -> dict[str, Any] | None:
    if not name:
        return None
    match: dict[str, Any] | None = None
    for card in cards or []:
        if isinstance(card, dict) and str(card.get("name") or "") == name:
            match = card
    return match


def resolve_staged_card(
    staging_id: str,
    *,
    staging_cards: list[dict[str, Any]],
    committed_cards: list[dict[str, Any]],
    approved_cards: list[dict[str, Any]] | None = None,
) -> dict[str, Any] | None:
    """Resolve a commit selection: this-turn staging, then committed, then approved."""
    sid = (staging_id or "").strip()
    if not sid:
        return None
    staging = list(staging_cards or [])
    committed = list(committed_cards or [])
    approved = list(approved_cards or [])
    names = (_name_from_staging_id(sid), sid)

    for group in (staging, committed):
        by_id = _staging_index(group)
        if sid in by_id:
            return by_id[sid]
    for name in names:
        found = _latest_card_named(staging, name)
        if found is not None:
            return found
    by_approved = _staging_index(approved)
    if sid in by_approved:
        return by_approved[sid]
    for group in (committed, approved):
        for name in names:
            found = _latest_card_named(group, name)
            if found is not None:
                return found
    return None


def apply_add_card_selections(
    *,
    staging_cards: list[dict[str, Any]],
    committed_cards: list[dict[str, Any]],
    selections: list[Any],
    approved_cards: list[dict[str, Any]] | None = None,
) -> tuple[list[dict[str, Any]], str]:
    """Resolve selections against staging/approved and merge into ``committed_cards``."""
    updated = list(committed_cards or [])
    index_by_id = {
        str(c.get("staging_id")): i
        for i, c in enumerate(updated)
        if isinstance(c, dict) and c.get("staging_id")
    }

    committed = 0
    issues: list[str] = []
    for raw in selections or []:
        parsed = parse_card_selection(raw)
        if parsed is None:
            issues.append(f"invalid selection {raw!r}")
            continue
        sid = parsed["staging_id"]
        base = resolve_staged_card(
            sid,
            staging_cards=staging_cards,
            committed_cards=committed_cards,
            approved_cards=approved_cards,
        )
        if base is None:
            issues.append(f"unknown staging_id {sid!r}")
            continue

        resolved_sid = str(base.get("staging_id") or sid)
        candidate: dict[str, Any] = {
            k: v for k, v in base.items() if k != "staging_id"
        }
        candidate["staging_id"] = resolved_sid
        candidate["selected_dimensions"] = list(parsed["selected_dimensions"])
        candidate["selected_metrics"] = list(parsed["selected_metrics"])
        candidate["selection_notes"] = parsed.get("selection_notes") or ""

        if resolved_sid in index_by_id:
            updated[index_by_id[resolved_sid]] = candidate
        else:
            updated.append(candidate)
            index_by_id[resolved_sid] = len(updated) - 1
        committed += 1

    names = [
        str(c.get("name") or "").strip()
        for c in updated
        if isinstance(c, dict) and str(c.get("name") or "").strip()
    ]
    note = f"committed {committed} card(s) to committed_cards"
    if names:
        note += f": {', '.join(names)}"
    if issues:
        note += f"; {'; '.join(issues)}"
    return updated, note


def selections_from_tool_payload(cards: list[Any]) -> list[Any]:
    """Normalize ``commit_cards`` selection payloads from the LLM."""
    if not cards:
        return []
    out: list[Any] = []
    for item in cards:
        if isinstance(item, dict) and (
            item.get("staging_id") or item.get("card_id") or item.get("id")
        ):
            out.append(item)
        elif isinstance(item, str):
            out.append(item)
        # Full card dicts without a staging id cannot be resolved — skip them.
    return out

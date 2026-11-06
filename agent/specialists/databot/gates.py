"""Databot human-gate nodes (cards + SQL) using ``langgraph.types.interrupt``."""

from __future__ import annotations

import json
import logging
import re
from collections.abc import Callable
from typing import Any, Literal, Union

from langgraph.types import interrupt

from agent.specialists.databot.state import (
    PHASE_EXECUTE_SQL,
    PHASE_PREPARE_SQL,
    PHASE_SUMMARY,
)
from agent.specialists.databot.state import (
    DatabotState,
    GateAuditEntry,
    GateDecision,
)
from agent.specialists.databot.ui_actions import apply_cards_gate_redraft, apply_sql_gate_redraft
from graph.messages import is_internal_assistant_narration, strip_think_blocks

logger = logging.getLogger(__name__)

GATE_OPTIONS: list[GateDecision] = ["approve", "deny-comments", "deny-halt", "dryrun"]
DEFAULT_GATE_DECISION: GateDecision = "dryrun"

DEFAULT_CARDS_GATE_REASONS: dict[str, str] = {
    "approve": "The committed models and metrics match the user's question.",
    "deny-comments": "Request different models, metrics, or filters before SQL.",
    "deny-halt": "Stop this turn without running SQL.",
    "dryrun": "Continue like approve, but do not save this retrieval to history.",
}

DEFAULT_SQL_GATE_REASONS: dict[str, str] = {
    "approve": "The drafted SQL matches the approved models and answers the question.",
    "deny-comments": "Request SQL changes — different metrics, filters, joins, or grain.",
    "deny-halt": "Stop this turn without executing SQL.",
    "dryrun": "Run the query like approve, but do not save this retrieval to history.",
}

_GATE_DEFAULTS: dict[Literal["cards", "sql"], dict[str, str]] = {
    "cards": DEFAULT_CARDS_GATE_REASONS,
    "sql": DEFAULT_SQL_GATE_REASONS,
}


# ---------------------------------------------------------------------------
# Cards and SQL human gates: prompts, resume parsing, and reason text.
# ---------------------------------------------------------------------------

def default_reasons(gate: Literal["cards", "sql"]) -> dict[str, str]:
    """Copy of the built-in reason for each gate option."""
    return dict(_GATE_DEFAULTS[gate])


def merge_reasons(
    gate: Literal["cards", "sql"],
    reasons: dict[str, str] | None,
) -> dict[str, str]:
    """Fill missing or blank options with the built-in reasons."""
    merged = default_reasons(gate)
    if not reasons:
        return merged
    for key in merged:
        value = reasons.get(key)
        if isinstance(value, str) and value.strip():
            merged[key] = value.strip()
    return merged


def cards_selection_summary(review_cards: list[dict[str, Any]]) -> str:
    """One short line naming the models, metrics, and dimensions under review."""
    picks: list[str] = []
    for card in review_cards or []:
        if not isinstance(card, dict):
            continue
        name = str(card.get("name") or "").strip()
        if not name:
            continue
        metrics = ", ".join(
            str(m).strip() for m in (card.get("selected_metrics") or []) if str(m).strip()
        )[:80]
        dims = ", ".join(
            str(d).strip() for d in (card.get("selected_dimensions") or []) if str(d).strip()
        )[:80]
        note = str(card.get("selection_notes") or "").strip()
        parts: list[str] = []
        if metrics:
            parts.append(f"metrics: {metrics}")
        if dims:
            parts.append(f"dims: {dims}")
        if note:
            line = f"{name} ({'; '.join(parts)}) — {note[:120]}" if parts else f"{name} — {note[:160]}"
        elif parts:
            line = f"{name} ({'; '.join(parts)})"
        else:
            line = name
        picks.append(line)
    if not picks:
        return ""
    summary = picks[0] if len(picks) == 1 else "; ".join(picks[:3])
    if len(picks) > 3:
        summary += f"; +{len(picks) - 3} more"
    return summary[:277] + "…" if len(summary) > 280 else summary


def parse_resume(payload: Any) -> tuple[GateDecision | None, str]:
    """Read a gate resume into ``(decision, comments)``.

    A reply that does not name one of ``GATE_OPTIONS`` returns
    ``(None, text)``, including an empty reply: the gate must ask again rather
    than guess, because every non-deny decision continues the pipeline (at the
    SQL gate, an accidental Enter would otherwise run the query).
    """
    if payload is None:
        return None, ""
    if isinstance(payload, dict):
        decision = str(payload.get("decision") or "").strip().lower()
        comments = str(payload.get("comments") or "").strip()
        if decision in GATE_OPTIONS:
            return decision, comments  # type: ignore[return-value]
        return None, comments
    text = str(payload).strip()
    if not text:
        return None, ""
    if text[0] in "{[":
        try:
            parsed = json.loads(text)
        except (ValueError, TypeError):
            parsed = None
        if isinstance(parsed, dict):
            decision = str(parsed.get("decision") or "").strip().lower()
            comments = str(parsed.get("comments") or "").strip()
            if decision in GATE_OPTIONS:
                return decision, comments  # type: ignore[return-value]
            return None, comments or text
    lowered = text.lower()
    if lowered in GATE_OPTIONS:
        return lowered, ""  # type: ignore[return-value]
    return None, text


def unrecognized_resume_note(payload: Any) -> str:
    """Short re-ask note shown when a gate reply named no valid option."""
    if isinstance(payload, dict):
        shown = json.dumps(payload, ensure_ascii=False)
    else:
        shown = str(payload)
    shown = shown.strip()
    if len(shown) > 80:
        shown = shown[:77] + "..."
    options = ", ".join(GATE_OPTIONS)
    return (
        f"Your reply {shown!r} was not understood, so nothing was run. "
        f"Reply with one of: {options} "
        '(or JSON {"decision": "<option>", "comments": "..."}).'
    )


def prompt(
    state: DatabotState,
    gate: Literal["cards", "sql"],
    *,
    note: str = "",
) -> dict[str, Any]:
    """Interrupt payload: question, the four options with reasons, and card summaries.

    ``note`` (a re-ask after an unrecognized reply) is prepended to the
    question and also sent as its own ``note`` field.
    """
    reasons_key = f"{gate}_reasons"
    raw_reasons = state.get(reasons_key) or {}
    state_reasons: dict[str, str] = raw_reasons if isinstance(raw_reasons, dict) else {}
    reasons = merge_reasons(gate, state_reasons)

    if gate == "cards":
        cards = state.get("review_cards") or []
        card_summaries = [
            {
                "name": c.get("name", ""),
                "description": (c.get("description", "") or "")[:280],
            }
            for c in cards
            if isinstance(c, dict)
        ]
        name_list = [
            str(c.get("name") or "").strip()
            for c in cards
            if isinstance(c, dict) and str(c.get("name") or "").strip()
        ]
        name_str = ", ".join(name_list) if name_list else "see Cards tab"
        question = f"Review {len(cards)} model(s) for this question: {name_str}."
    else:
        sql_preview = (state.get("draft_sql") or "").strip()
        snippet = sql_preview if len(sql_preview) <= 280 else sql_preview[:277] + "..."
        question = (
            "Databot drafted the SQL below.\n\n"
            "What I need from you:\n"
            "1. Open the SQL tab on the right — read or edit the query if needed.\n"
            "2. In the gate panel, choose Approve (run the query), Request changes "
            "(describe fixes in the feedback box), Halt, or Dry-run (run the query "
            "without saving it to history).\n\n"
            f"```sql\n{snippet}\n```"
        )
    if note:
        question = f"{note}\n\n{question}"
    payload: dict[str, Any] = {
        "question": question,
        "options": [
            {"id": opt, "label": opt, "reason": reasons.get(opt, "")}
            for opt in GATE_OPTIONS
        ],
        "default": DEFAULT_GATE_DECISION,
        "gate": gate,
    }
    if note:
        payload["note"] = note
    if gate == "cards":
        payload["review_cards"] = card_summaries
        selection_summary = str(state.get("cards_selection_summary") or "").strip()
        if not selection_summary:
            selection_summary = cards_selection_summary(
                [c for c in cards if isinstance(c, dict)]
            )
        if selection_summary:
            payload["selection_summary"] = selection_summary
    return payload


def interrupt_kwargs(
    state: DatabotState,
    gate: Literal["cards", "sql"],
    *,
    note: str = "",
) -> dict[str, Any]:
    """``interrupt`` kwargs whose message is the JSON gate prompt."""
    payload = prompt(state, gate, note=note)
    return {
        "id": f"databot-{gate}-gate",
        "reason": payload["question"][:120],
        "message": json.dumps(payload, ensure_ascii=False),
    }


def ask_gate(
    state: DatabotState, gate: Literal["cards", "sql"]
) -> tuple[GateDecision, str, dict[str, Any]]:
    """Interrupt until the reply names a valid option.

    Returns ``(decision, comments, kwargs)`` where ``kwargs`` is the prompt
    that was answered. An unrecognized reply interrupts again with a note;
    on resume LangGraph replays the earlier answers in order, so each
    ``interrupt`` call here consumes one reply.
    """
    kwargs = interrupt_kwargs(state, gate)
    while True:
        resume = interrupt(kwargs)
        decision, comments = parse_resume(resume)
        if decision is not None:
            return decision, comments, kwargs
        logger.info("databot: unrecognized %s gate reply %r; asking again", gate, resume)
        kwargs = interrupt_kwargs(state, gate, note=unrecognized_resume_note(resume))


def append_audit(
    state: DatabotState,
    *,
    gate: Literal["cards", "sql"],
    decision: GateDecision,
    comments: str,
    reasons: dict[str, str],
) -> list[GateAuditEntry]:
    """Append one gate verdict without mutating the existing audit list."""
    audit = list(state.get("gate_decisions") or [])
    entry: GateAuditEntry = {
        "gate": gate,
        "decision": decision,
        "comments": comments,
        "reasons": dict(reasons),
    }
    audit.append(entry)
    return audit


def _cards_gate_update(
    state: DatabotState,
    *,
    cards: list[dict[str, Any]],
    decision: GateDecision,
    comments: str,
    reasons: dict[str, str],
) -> dict[str, Any]:
    audit = append_audit(
        state,
        gate="cards",
        decision=decision,
        comments=comments,
        reasons=reasons,
    )

    if decision == "deny-halt":
        return {
            "gate_decisions": audit,
            "stage": PHASE_SUMMARY,
            "halt_reason": comments or "user halted at cards gate",
        }

    if decision == "deny-comments":
        return {
            "gate_decisions": audit,
            **apply_cards_gate_redraft(comments),
        }

    return {
        "gate_decisions": audit,
        "approved_cards": list(cards),
        "review_cards": list(cards),
        "stage": PHASE_PREPARE_SQL,
        "dryrun": decision == "dryrun",
    }

def _sql_gate_update(
    state: DatabotState,
    *,
    decision: GateDecision,
    comments: str,
    reasons: dict[str, str],
) -> dict[str, Any]:
    audit = append_audit(
        state,
        gate="sql",
        decision=decision,
        comments=comments,
        reasons=reasons,
    )

    if decision == "deny-halt":
        return {
            "gate_decisions": audit,
            "stage": PHASE_SUMMARY,
            "halt_reason": comments or "user halted at sql gate",
        }

    if decision == "deny-comments":
        return {
            "gate_decisions": audit,
            **apply_sql_gate_redraft(comments),
        }

    return {
        "gate_decisions": audit,
        "approved_sql": state.get("draft_sql") or "",
        "stage": PHASE_EXECUTE_SQL,
        "dryrun": decision == "dryrun",
    }

def cards_node(*, enabled: bool = True) -> Callable[[DatabotState], dict[str, Any]]:
    """Cards gate: approve moves to SQL, comments re-fetch, halt ends the turn."""
    def gate_cards(state: DatabotState) -> dict[str, Any]:
        cards = [
            dict(c)
            for c in (state.get("review_cards") or [])
            if isinstance(c, dict)
        ]
        raw_reasons = state.get("cards_reasons") or {}
        state_reasons = raw_reasons if isinstance(raw_reasons, dict) else {}
        reasons = merge_reasons("cards", state_reasons)

        if not enabled:
            logger.info("databot: cards gate disabled in config; auto-approving")
            return _cards_gate_update(
                state,
                cards=cards,
                decision="approve",
                comments="",
                reasons=reasons,
            )

        decision, comments, kwargs = ask_gate(state, "cards")
        try:
            prompt = json.loads(kwargs.get("message") or "{}")
        except (ValueError, TypeError):
            prompt = {"options": []}
        reasons = {}
        for opt in prompt.get("options", []) or []:
            if isinstance(opt, dict) and "id" in opt:
                reasons[opt["id"]] = opt.get("reason", "")

        return _cards_gate_update(
            state,
            cards=cards,
            decision=decision,
            comments=comments,
            reasons=reasons,
        )

    return gate_cards


def sql_node(*, enabled: bool = True) -> Callable[[DatabotState], dict[str, Any]]:
    """SQL gate: approve runs the query, comments regenerate SQL, halt ends the turn."""
    def gate_sql(state: DatabotState) -> dict[str, Any]:
        raw_reasons = state.get("sql_reasons") or {}
        state_reasons = raw_reasons if isinstance(raw_reasons, dict) else {}
        reasons = merge_reasons("sql", state_reasons)

        if not enabled:
            logger.info("databot: sql gate disabled in config; auto-approving")
            return _sql_gate_update(
                state,
                decision="approve",
                comments="",
                reasons=reasons,
            )

        decision, comments, kwargs = ask_gate(state, "sql")
        try:
            prompt = json.loads(kwargs.get("message") or "{}")
        except (ValueError, TypeError):
            prompt = {"options": []}
        reasons = {
            opt["id"]: opt.get("reason", "")
            for opt in (prompt.get("options") or [])
            if isinstance(opt, dict) and "id" in opt
        }

        return _sql_gate_update(
            state,
            decision=decision,
            comments=comments,
            reasons=reasons,
        )

    return gate_sql

def _json_value(text: str) -> Any:
    """Parse a JSON value, including one buried after think tags or fences."""
    stripped = strip_think_blocks(text).strip()
    if stripped.startswith("```"):
        stripped = re.sub(r"^```(?:json)?\s*", "", stripped, count=1, flags=re.IGNORECASE)
        stripped = re.sub(r"\s*```$", "", stripped)
        stripped = stripped.strip()
    try:
        return json.loads(stripped)
    except json.JSONDecodeError:
        pass
    for opener, closer in (("[", "]"), ("{", "}")):
        start = stripped.find(opener)
        end = stripped.rfind(closer)
        if start < 0 or end <= start:
            continue
        try:
            return json.loads(stripped[start : end + 1])
        except json.JSONDecodeError:
            continue
    return None

def _reason_usable(text: str) -> bool:
    """Reject planning dumps that must never appear as gate option copy."""
    cleaned = strip_think_blocks(text).strip()
    if not cleaned or "<think>" in cleaned.lower():
        return False
    if cleaned.lower() in {"context:", "context"}:
        return False
    if cleaned.startswith("- ") and (
        cleaned.lower().startswith("- user asked")
        or "committed card:" in cleaned.lower()
    ):
        return False
    return not is_internal_assistant_narration(cleaned)

def coerce_reasons(
    raw: Union[dict[GateDecision, str], list[str], str, None],
) -> dict[str, str]:
    """Normalize LLM gate-reason text into ``{option: reason}``."""
    cleaned: dict[str, str] = {}
    if isinstance(raw, str):
        text = raw.strip()
        if not text:
            return {}
        parsed = _json_value(text)
        if parsed is None:
            return {}
        return coerce_reasons(parsed)
    if isinstance(raw, dict):
        for opt, text in raw.items():
            key = str(opt).strip()
            if key in GATE_OPTIONS and text is not None:
                value = str(text).strip()
                if _reason_usable(value):
                    cleaned[key] = value
        return cleaned
    if isinstance(raw, list):
        for index, opt in enumerate(GATE_OPTIONS):
            if index >= len(raw):
                break
            value = raw[index]
            if value is None:
                continue
            text = str(value).strip()
            if not text:
                continue
            if ":" in text:
                head, _, tail = text.partition(":")
                if head.strip() in GATE_OPTIONS:
                    text = tail.strip()
            if _reason_usable(text):
                cleaned[opt] = text
        return cleaned
    return cleaned

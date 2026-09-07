"""Databot human-gate nodes (cards + SQL) using ``langgraph.types.interrupt``."""

from __future__ import annotations

import json
import logging
from collections.abc import Callable
from typing import Any, Literal

from langgraph.types import interrupt

from agent.specialists.databot._constants import STAGE_DONE, STAGE_EXECUTE, STAGE_SQL
from agent.specialists.databot.gate_defaults import (
    build_cards_selection_summary,
    merge_gate_reasons,
)
from agent.specialists.databot.ui_actions import (
    apply_cards_gate_redraft,
    apply_sql_gate_redraft,
)

from agent.specialists.databot.state import (
    DatabotState,
    GateAuditEntry,
    GateDecision,
)

logger = logging.getLogger(__name__)

GATE_OPTIONS: list[GateDecision] = ["approve", "deny-comments", "deny-halt", "dryrun"]
DEFAULT_GATE_DECISION: GateDecision = "dryrun"


def _safe_json_loads(payload: Any) -> dict[str, Any] | None:
    if not isinstance(payload, str):
        return None
    text = payload.strip()
    if not text or text[0] not in "[{":
        return None
    try:
        parsed = json.loads(text)
    except (ValueError, TypeError):
        return None
    return parsed if isinstance(parsed, dict) else None


def _parse_resume(payload: Any) -> tuple[GateDecision, str]:
    """Normalize whatever the CLI resumes with into (decision, comments).

    Accepts:
    - bare token string: "approve" / "deny-comments" / "deny-halt" / "dryrun"
    - JSON object string: {"decision": "...", "comments": "..."}
    - dict payload (AG-UI / CopilotKit resume objects)
    - None or empty → default (``dryrun``)
    """
    if payload is None:
        return DEFAULT_GATE_DECISION, ""
    if isinstance(payload, dict):
        decision = str(payload.get("decision") or "").strip().lower()
        comments = str(payload.get("comments") or "").strip()
        if decision in GATE_OPTIONS:
            return decision, comments  # type: ignore[return-value]
        return DEFAULT_GATE_DECISION, comments
    text = str(payload).strip()
    if not text:
        return DEFAULT_GATE_DECISION, ""
    # JSON object form first.
    parsed = _safe_json_loads(text)
    if isinstance(parsed, dict):
        decision = str(parsed.get("decision") or "").strip().lower()
        comments = str(parsed.get("comments") or "").strip()
        if decision in GATE_OPTIONS:
            return decision, comments  # type: ignore[return-value]
        # Unknown decision — treat as default with the comments captured.
        return DEFAULT_GATE_DECISION, comments or text
    # Bare token.
    lowered = text.lower()
    if lowered in GATE_OPTIONS:
        return lowered, ""  # type: ignore[return-value]
    return DEFAULT_GATE_DECISION, text


def _gate_prompt(state: DatabotState, gate: Literal["cards", "sql"]) -> dict[str, Any]:
    """Build the prompt payload for ``interrupt``.

    The CLI surfaces this as an ``ask_user`` card. ``options`` carries the
    four gate verdicts with the LLM-generated reason text from state. The
    CLI maps each option to its reason on display.

    For AG-UI frontends (CopilotKit v2), the standard ``Interrupt`` shape
    is ``{id, reason, message?, ...}``. We serialize this rich prompt as
    a JSON string in ``message`` so the v2 frontend can deserialize and
    render the same payload the CLI sees.
    """
    reasons_key = f"{gate}_reasons"
    raw_reasons = state.get(reasons_key) or {}
    state_reasons: dict[str, str] = raw_reasons if isinstance(raw_reasons, dict) else {}
    reasons = merge_gate_reasons(gate, state_reasons)
    payload_sql = ""

    if gate == "cards":
        cards = state.get("review_cards") or []
        # Surface the actual card list (not just the count) so the
        # AG-UI frontend can render each model's name / catalog /
        # description alongside the gate options. Without this the
        # frontend has no way to know *which* dbt models were picked
        # beyond the count in the question string.
        card_summaries = []
        for c in cards:
            if not isinstance(c, dict):
                continue
            card_summaries.append(
                {
                    "name": c.get("name", ""),
                    "description": (c.get("description", "") or "")[:280],
                    "physical_tables": list(c.get("physical_tables") or [])[:6],
                    "selection_notes": (c.get("selection_notes") or "")[:240],
                }
            )
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
            "(describe fixes in the feedback box), Halt, or Dry-run.\n\n"
            f"```sql\n{snippet}\n```"
        )
        payload_sql = sql_preview
    payload: dict[str, Any] = {
        "question": question,
        "options": [
            {"id": opt, "label": opt, "reason": reasons.get(opt, "")}
            for opt in GATE_OPTIONS
        ],
        "default": DEFAULT_GATE_DECISION,
        "gate": gate,
    }
    if gate == "sql" and payload_sql:
        payload["draft_sql"] = payload_sql
    if gate == "cards":
        payload["review_cards"] = card_summaries
        selection_summary = str(state.get("cards_selection_summary") or "").strip()
        if not selection_summary:
            selection_summary = build_cards_selection_summary(
                [c for c in cards if isinstance(c, dict)]
            )
        if selection_summary:
            payload["selection_summary"] = selection_summary
    return payload


def _gate_interrupt_kwargs(
    state: DatabotState, gate: Literal["cards", "sql"]
) -> dict[str, Any]:
    """Build the full kwargs to pass to ``langgraph.types.interrupt``.

    AG-UI v2's standard ``Interrupt`` only carries flat fields
    (``id``, ``reason``, ``message``). To preserve the rich prompt
    structure (question, per-option reason, default decision), we
    serialize the dict into ``message`` as JSON. CLI / Studio clients
    that understand the legacy ``event.value`` shape still work because
    ``_parse_resume`` reads the resume payload, not the interrupt
    payload.
    """
    payload = _gate_prompt(state, gate)
    return {
        # ``id`` is required; make it stable across retries for the
        # same gate. ``reason`` is a human-readable summary; the full
        # payload lives in ``message``.
        "id": f"databot-{gate}-gate",
        "reason": payload["question"][:120],
        "message": json.dumps(payload, ensure_ascii=False),
    }


def _append_audit(
    state: DatabotState,
    *,
    gate: Literal["cards", "sql"],
    decision: GateDecision,
    comments: str,
    reasons: dict[str, str],
) -> list[GateAuditEntry]:
    audit = list(state.get("gate_decisions") or [])
    entry: GateAuditEntry = {
        "gate": gate,
        "decision": decision,
        "comments": comments,
        "reasons": dict(reasons),
    }
    audit.append(entry)
    return audit


def make_cards_gate_node() -> Callable[[DatabotState], dict[str, Any]]:
    """Gate node for the card selection (between fetch and sql stages)."""

    def gate_cards(state: DatabotState) -> dict[str, Any]:
        cards = [
            dict(c)
            for c in (state.get("review_cards") or [])
            if isinstance(c, dict)
        ]
        kwargs = _gate_interrupt_kwargs(state, "cards")
        resume = interrupt(kwargs)
        decision, comments = _parse_resume(resume)
        try:
            prompt = json.loads(kwargs.get("message") or "{}")
        except (ValueError, TypeError):
            prompt = {"options": []}
        reasons: dict[str, str] = {}
        for opt in prompt.get("options", []) or []:
            if isinstance(opt, dict) and "id" in opt:
                reasons[opt["id"]] = opt.get("reason", "")

        audit = _append_audit(
            state,
            gate="cards",
            decision=decision,
            comments=comments,
            reasons=reasons,
        )

        if decision == "deny-halt":
            return {
                "gate_decisions": audit,
                "stage": STAGE_DONE,
                "halt_reason": comments or "user halted at cards gate",
            }

        # ``approved_cards`` is set to ``review_cards`` on approve/dryrun.
        # ``deny-with-comments`` routes back to the fetch stage to re-pick.
        if decision == "deny-comments":
            return {
                "gate_decisions": audit,
                **apply_cards_gate_redraft(comments),
            }

        return {
            "gate_decisions": audit,
            "approved_cards": list(cards),
            "review_cards": list(cards),
            "stage": STAGE_SQL,
            "dryrun": decision == "dryrun",
        }

    return gate_cards


def make_sql_gate_node() -> Callable[[DatabotState], dict[str, Any]]:
    """Gate node for the drafted SQL (between sql and execute stages)."""

    def gate_sql(state: DatabotState) -> dict[str, Any]:
        kwargs = _gate_interrupt_kwargs(state, "sql")
        resume = interrupt(kwargs)
        decision, comments = _parse_resume(resume)
        try:
            prompt = json.loads(kwargs.get("message") or "{}")
        except (ValueError, TypeError):
            prompt = {"options": []}
        reasons: dict[str, str] = {
            opt["id"]: opt.get("reason", "")
            for opt in (prompt.get("options") or [])
            if isinstance(opt, dict) and "id" in opt
        }

        audit = _append_audit(
            state,
            gate="sql",
            decision=decision,
            comments=comments,
            reasons=reasons,
        )

        if decision == "deny-halt":
            return {
                "gate_decisions": audit,
                "stage": STAGE_DONE,
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
            "stage": STAGE_EXECUTE,
            "dryrun": decision == "dryrun",
        }

    return gate_sql

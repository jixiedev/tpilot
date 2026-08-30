"""Databot human-gate nodes (cards + SQL) using ``langgraph.types.interrupt``.

Each gate is a thin node function. It:

1. Reads the LLM-generated "reasons" for the four options (approve /
   deny-with-comments / deny-and-halt / dryrun) that the previous ReAct
   stage is required to write to state under a known key.
2. Calls ``interrupt(...)`` to pause the graph. The CLI
   ``_cli_on_interrupt`` handler drives the user prompt and replies with
   one of the four decision tokens (or "cancel" for halt). The AG-UI v2
   frontend reads the standard ``Interrupt.message`` JSON payload.
3. On resume, parses the decision and appends an audit entry to
   ``gate_decisions``. It then sets ``stage`` to the next stage and either
   routes the next conditional edge, or (for ``deny-halt``) routes to
   ``end_with_refusal``.

Default if the user just hits enter / timeout: ``dryrun`` (per thought 1).

Resume payload contract: a JSON string the CLI builds from the user's
selection. We accept either a plain token (``"approve"``) or a richer
object string (``{"decision": "approve", "comments": "..."}``).
"""

from __future__ import annotations

import json
import logging
from collections.abc import Callable
from typing import Any, Literal

from langgraph.types import interrupt

from agent.react.databot.state import (
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
    - JSON object: {"decision": "...", "comments": "..."}
    - None or empty → default (``dryrun``)
    """
    if payload is None:
        return DEFAULT_GATE_DECISION, ""
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


def _extract_cards_from_recent_message(state: DatabotState) -> list[dict[str, Any]]:
    """Best-effort fallback when both ``state.selected_cards`` and the
    ``mark_cards_selected`` ToolMessage artifact come up empty.

    Walks ``state.messages`` in reverse, looks for the most recent
    ``AIMessage``, and pulls ``dbt model`` references out of the text
    using the canonical table name pattern
    ``[catalog.][schema.]table_name``. Returns a list of minimal
    card-shaped dicts so the gate UI can at least list the models the
    LLM said it picked.
    """
    import re
    from langchain_core.messages import AIMessage

    pattern = re.compile(
        r"`?(?:[a-zA-Z_][\w]*\.)?(?:[a-zA-Z_][\w]*\.)?([a-zA-Z_][\w]*)`?"
    )
    # We deliberately keep this conservative: only single-segment or
    # two-segment dotted identifiers inside backticks, plus anything
    # whose name starts with ``fct_`` / ``dim_`` / ``stg_`` / ``int_``
    # (common dbt layer prefixes).
    candidate_names: list[str] = []
    for msg in reversed(state.get("messages") or []):
        if not isinstance(msg, AIMessage):
            continue
        content = msg.content
        if isinstance(content, list):
            content = "".join(
                p.get("text", "") if isinstance(p, dict) else str(p)
                for p in content
            )
        if not isinstance(content, str):
            continue
        for m in re.finditer(r"`([a-zA-Z_][\w]*(?:\.[a-zA-Z_][\w]*){0,2})`", content):
            name = m.group(1)
            base = name.split(".")[-1]
            if base.startswith(("fct_", "dim_", "stg_", "int_", "agg_")) and base not in candidate_names:
                candidate_names.append(base)
            elif "_" in base and base.lower() == base and base not in candidate_names:
                # snake_case identifiers - likely a dbt model
                candidate_names.append(base)
        if candidate_names:
            break
    return [{"name": n} for n in candidate_names]


def _extract_sql_from_recent_message(state: DatabotState) -> str:
    """Best-effort fallback when ``state.draft_sql`` is empty.

    Walks ``state.messages`` in reverse, looks for the most recent
    ``AIMessage``, and pulls the first ``SELECT`` / ``WITH`` / ``INSERT``
    / ``MERGE`` block (greedily: from the keyword to the next ``;`` or
    triple-backtick fence close). Returns ``""`` if nothing plausible
    is found.
    """
    import re
    from langchain_core.messages import AIMessage

    sql_keywords = ("SELECT", "WITH", "INSERT", "UPDATE", "MERGE", "CREATE")
    # Inline flags (?is) can only appear at the start of a regex pattern;
    # a second (?is) after the ``|`` is a parse error on Python 3.11+
    # ("global flags not at the start of the expression at position N").
    # We precompile the keyword branch and the fenced branch as
    # separate patterns and OR them via alternation in code rather
    # than in the regex itself.
    keyword_branch = re.compile(
        r"\b(" + "|".join(sql_keywords) + r")\b.*?;",
        re.IGNORECASE | re.DOTALL,
    )
    fenced_branch = re.compile(
        r"```sql\s*(.*?)```",
        re.IGNORECASE | re.DOTALL,
    )
    for msg in reversed(state.get("messages") or []):
        if not isinstance(msg, AIMessage):
            continue
        content = msg.content
        if isinstance(content, list):
            # ``AIMessage.content`` is sometimes a list of content parts
            # (text / tool calls). Concatenate the text parts.
            content = "".join(
                p.get("text", "") if isinstance(p, dict) else str(p)
                for p in content
            )
        if not isinstance(content, str):
            continue
        # Prefer fenced ```sql blocks first.
        fenced = re.search(r"```sql\s*(.*?)```", content, re.DOTALL | re.IGNORECASE)
        if fenced:
            return fenced.group(1).strip()
        m = keyword_branch.search(content)
        if m:
            # The keyword branch puts the whole match in group(0);
            # the fenced branch is handled above. Trim the trailing
            # semicolon because the SQL executor rejects multi-statement
            # queries.
            candidate = m.group(0).rstrip(";").strip()
            if candidate:
                return candidate
    return ""


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
    reasons: dict[str, str] = raw_reasons if isinstance(raw_reasons, dict) else {}

    if gate == "cards":
        cards = state.get("selected_cards") or []
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
                    "catalog": (
                        c.get("physical_tables", [None])[0]
                        if isinstance(c.get("physical_tables"), list) and c.get("physical_tables")
                        else c.get("catalog", c.get("database", ""))
                    ),
                    "schema": c.get("schema", ""),
                    "description": (c.get("description", "") or "")[:200],
                }
            )
        question = (
            f"Databot picked {len(cards)} candidate dbt model(s). "
            "Approve, request changes, halt, or preview-only (dryrun)?"
        )
    else:
        # ``draft_sql`` is normally written by the ``propose_sql`` tool
        # call earlier in the SQL stage. If it's empty — usually because
        # the LLM never invoked the tool (e.g. the upstream
        # ``add_card_to_state`` failed and the stage ran with no
        # approved cards, so the LLM went straight to ``chat_completion``
        # or never produced SQL) — fall back to scanning the latest
        # assistant message for a ``SELECT`` / ``WITH`` block. Without
        # this fallback the gate UI shows an empty SQL section, which
        # makes the gate meaningless.
        sql_preview = (state.get("draft_sql") or "").strip()
        if not sql_preview:
            sql_preview = _extract_sql_from_recent_message(state)
        snippet = sql_preview if len(sql_preview) <= 280 else sql_preview[:277] + "..."
        question = (
            "Databot drafted the SQL below. Approve, request changes, halt, "
            f"or preview-only (dryrun)?\n\n```sql\n{snippet}\n```"
        )
    payload: dict[str, Any] = {
        "question": question,
        "options": [
            {"id": opt, "label": opt, "reason": reasons.get(opt, "")}
            for opt in GATE_OPTIONS
        ],
        "default": DEFAULT_GATE_DECISION,
        "gate": gate,
    }
    if gate == "cards":
        payload["selected_cards"] = card_summaries
    return payload


def _gate_interrupt_kwargs(
    state: DatabotState, gate: Literal["cards", "sql", "chart"]
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
    payload: dict[str, Any]
    if gate == "chart":
        # ``chart_question`` is structurally different from the human
        # gates (only two options, no per-option reason). Build it
        # directly instead of routing through ``_gate_prompt``.
        payload = {
            "question": "Query returned results. Emit a chart to Superset?",
            "options": [
                {"id": "skip", "label": "no, end the turn", "reason": "results are enough"},
                {"id": "chart", "label": "yes, generate a chart", "reason": "visualization helps"},
            ],
            "default": "skip",
            "gate": "chart",
        }
    else:
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
        # The ``fetch_cards`` subgraph writes ``selected_cards`` to a
        # ``SessionAgentState`` (its own schema), not the outer
        # ``DatabotState``. LangGraph only propagates keys declared in
        # both schemas, so the ``Command(update={"selected_cards": ...})``
        # the tool emits never reaches us here — ``state.selected_cards``
        # is always ``None`` / empty when this node runs.
        #
        # Workaround: ``mark_cards_selected`` now also stashes the
        # chosen cards in the ToolMessage.artifact field. We recover
        # them by reverse-scanning ``state.messages`` for the most
        # recent artifact of that shape. If neither that nor the outer
        # ``state.selected_cards`` produced anything, we fall back to
        # the cards the LLM mentioned in its last assistant text —
        # better to surface something than the broken "0 candidate
        # dbt model(s)" UI.
        from langchain_core.messages import AIMessage, ToolMessage
        cards = state.get("selected_cards") or []
        if not cards:
            for msg in reversed(state.get("messages") or []):
                if not isinstance(msg, ToolMessage):
                    continue
                artifact = getattr(msg, "artifact", None)
                if (
                    isinstance(artifact, dict)
                    and artifact.get("event") == "mark_cards_selected"
                    and artifact.get("cards")
                ):
                    cards = list(artifact["cards"])
                    break
        if not cards:
            cards = _extract_cards_from_recent_message(state)
        if not isinstance(cards, list):
            cards = []
        # Persist the recovered cards back to DatabotState so the
        # rest of the graph (write_cards_artifact, generate_sql
        # subgraph) sees them.
        state_payload = {"selected_cards": cards} if cards else {}
        import sys
        print(
            f"[DEBUG gate_cards] recovered {len(cards)} cards from "
            f"({'state' if state.get('selected_cards') else 'message-artifact' if cards else 'NONE'})",
            file=sys.stderr,
            flush=True,
        )
        # Build the interrupt payload using the recovered cards.
        # _gate_prompt reads state.selected_cards; we synthesise a
        # throwaway state-like dict to feed it.
        state_for_prompt = dict(state) | state_payload
        kwargs = _gate_interrupt_kwargs(state_for_prompt, "cards")
        resume = interrupt(kwargs)
        decision, comments = _parse_resume(resume)
        # Reasons for the audit trail come from the rich payload the
        # LLM wrote; we re-parse the JSON message we put on the
        # interrupt to stay consistent with what the user saw.
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
                "stage": "done",
                "halt_reason": comments or "user halted at cards gate",
            }

        # ``approved_cards`` is set to ``selected_cards`` on approve/dryrun.
        # ``deny-with-comments`` routes back to the fetch stage to re-pick.
        if decision == "deny-comments":
            return {
                "gate_decisions": audit,
                "stage": "fetch",
                "deny_feedback": comments,
            }

        # approve | dryrun: keep selected_cards, advance to SQL stage.
        # The profile write happens only on approve, in the next node.
        # Use the recovered ``cards`` list (not ``state.selected_cards``)
        # so the SQL stage actually sees what the LLM picked, even
        # though the inner subgraph's write was lost.
        return {
            "gate_decisions": audit,
            "approved_cards": list(cards),
            "selected_cards": list(cards),
            "stage": "sql",
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
                "stage": "done",
                "halt_reason": comments or "user halted at sql gate",
            }

        if decision == "deny-comments":
            return {
                "gate_decisions": audit,
                "stage": "sql",
                "deny_feedback": comments,
            }

        # approve | dryrun: lock in the SQL. dryrun still executes (read-only
        # SQL on preview is harmless), but skips the profile write. The
        # execute node reads ``approved_sql``.
        return {
            "gate_decisions": audit,
            "approved_sql": state.get("draft_sql") or "",
            "stage": "execute",
            "dryrun": decision == "dryrun",
        }

    return gate_sql


def make_chart_question_node() -> Callable[[DatabotState], dict[str, Any]]:
    """Optional post-execute gate: ask whether to emit a Superset chart.

    This corresponds to thought 1 line 33: "(option) ask user whether to
    generate a graph and emit to superset". It is not implemented as a
    human-gate interrupt (no LLM stage precedes it); the chart emit itself
    is a TODO and will be wired when the Superset integration lands.
    """

    def chart_question(state: DatabotState) -> dict[str, Any]:
        kwargs = _gate_interrupt_kwargs(state, "chart")
        resume = interrupt(kwargs)
        decision, _ = _parse_resume(resume)
        # Map the AG-UI decision back to chart semantics: anything that
        # isn't a clean "approve" (= "yes, generate a chart") ends the
        # turn without emitting. The chart emit itself is still TODO.
        if decision == "approve":
            return {"stage": "done", "chart_requested": True}
        return {"stage": "done", "chart_requested": False}

    return chart_question

"""Unit tests for the Databot v2 human-gate decision parsing.

The state machine itself is exercised by an end-to-end graph smoke
test (see test_databot_graph.py). Here we cover the smaller piece:
how the CLI's resume payload is normalized into a (decision, comments)
pair, plus the default-when-empty behavior.
"""

from __future__ import annotations

import pytest

from agent.specialists.databot.gates import (
    DEFAULT_GATE_DECISION,
    GATE_OPTIONS,
    _parse_resume,
)


@pytest.mark.parametrize("token", list(GATE_OPTIONS))
def test_parse_resume_accepts_bare_tokens(token: str) -> None:
    decision, comments = _parse_resume(token)
    assert decision == token
    assert comments == ""


def test_parse_resume_defaults_to_dryrun_on_empty() -> None:
    decision, comments = _parse_resume("")
    assert decision == DEFAULT_GATE_DECISION == "dryrun"
    assert comments == ""


def test_parse_resume_defaults_to_dryrun_on_none() -> None:
    decision, _ = _parse_resume(None)
    assert decision == "dryrun"


def test_parse_resume_accepts_json_object() -> None:
    decision, comments = _parse_resume(
        '{"decision": "deny-comments", "comments": "use a different table"}'
    )
    assert decision == "deny-comments"
    assert comments == "use a different table"


def test_parse_resume_keeps_comments_when_decision_unknown() -> None:
    decision, comments = _parse_resume(
        '{"decision": "banana", "comments": "please clarify the metric"}'
    )
    assert decision == "dryrun"  # safe default
    assert comments == "please clarify the metric"


def test_parse_resume_preserves_freeform_text_as_comments() -> None:
    # Freeform text without a recognized token — we default to dryrun and
    # keep the user's text as a comment for the audit log.
    decision, comments = _parse_resume("approve with notes: prefer last 7 days")
    assert decision == "dryrun"
    assert "approve with notes" in comments


def test_parse_resume_handles_non_string_payload() -> None:
    decision, comments = _parse_resume(42)  # type: ignore[arg-type]
    assert decision == "dryrun"
    assert comments == "42"  # coerced to string


def test_parse_resume_accepts_dict_payload() -> None:
    decision, comments = _parse_resume(
        {"decision": "deny-comments", "comments": "use dt not payment_received_time"},
    )
    assert decision == "deny-comments"
    assert comments == "use dt not payment_received_time"


def test_gate_options_includes_all_thought1_verdicts() -> None:
    """thought 1 lists exactly these four verdicts."""
    assert set(GATE_OPTIONS) == {"approve", "deny-comments", "deny-halt", "dryrun"}


def test_gate_prompt_sql_uses_default_reasons_when_state_empty() -> None:
    from agent.specialists.databot.gate_defaults import DEFAULT_SQL_GATE_REASONS
    from agent.specialists.databot.gates import _gate_prompt

    payload = _gate_prompt(
        {
            "draft_sql": "SELECT 1",
            "sql_reasons": {},
        },
        "sql",
    )
    reasons_by_id = {opt["id"]: opt["reason"] for opt in payload["options"]}
    assert reasons_by_id == DEFAULT_SQL_GATE_REASONS
    assert payload["draft_sql"] == "SELECT 1"


def test_gate_prompt_cards_preserves_llm_reasons_over_defaults() -> None:
    from agent.specialists.databot.gates import _gate_prompt

    payload = _gate_prompt(
        {
            "review_cards": [{"name": "orders_daily"}],
            "cards_reasons": {"approve": "orders_daily — daily order grain"},
        },
        "cards",
    )
    reasons_by_id = {opt["id"]: opt["reason"] for opt in payload["options"]}
    assert reasons_by_id["approve"] == "orders_daily — daily order grain"
    assert reasons_by_id["dryrun"]
    assert "orders_daily" in payload["question"]


def test_build_cards_selection_summary_from_card_payload() -> None:
    from agent.specialists.databot.gate_defaults import build_cards_selection_summary

    summary = build_cards_selection_summary(
        [
            {
                "name": "fct_orders",
                "selected_metrics": ["gmv"],
                "selected_dimensions": ["order_date"],
                "selection_notes": "covers yesterday GMV",
            }
        ]
    )
    assert "fct_orders" in summary
    assert "gmv" in summary
    assert "yesterday GMV" in summary


def test_gate_prompt_cards_includes_selection_summary() -> None:
    from agent.specialists.databot.gates import _gate_prompt

    payload = _gate_prompt(
        {
            "review_cards": [{"name": "orders_daily"}],
            "cards_reasons": {"approve": "Pick approve — orders_daily matches your question."},
            "cards_selection_summary": "orders_daily (metrics: order_count) — daily grain",
        },
        "cards",
    )
    reasons_by_id = {opt["id"]: opt["reason"] for opt in payload["options"]}
    assert reasons_by_id["approve"] == "Pick approve — orders_daily matches your question."
    assert payload["selection_summary"] == "orders_daily (metrics: order_count) — daily grain"
    assert "orders_daily" in payload["question"]


# ---------------------------------------------------------------------------
# Stage tool schema coercion (regression: LLM passed reasons as a list
# instead of a dict; the tool now accepts both shapes).
# ---------------------------------------------------------------------------

from agent.specialists.databot.stage_tools import _coerce_gate_reasons  # noqa: E402


def test_coerce_gate_reasons_dict_form() -> None:
    out = _coerce_gate_reasons({
        "approve": "card matches",
        "deny-comments": "maybe stale",
        "deny-halt": "no",
        "dryrun": "safe",
    })
    assert out == {
        "approve": "card matches",
        "deny-comments": "maybe stale",
        "deny-halt": "no",
        "dryrun": "safe",
    }


def test_coerce_gate_reasons_list_positional() -> None:
    out = _coerce_gate_reasons([
        "approve: card matches",          # prefix gets stripped
        "deny-comments: maybe stale",
        "deny-halt: no",
        "dryrun: safe",
    ])
    assert out == {
        "approve": "card matches",
        "deny-comments": "maybe stale",
        "deny-halt": "no",
        "dryrun": "safe",
    }


def test_coerce_gate_reasons_list_short() -> None:
    out = _coerce_gate_reasons(["only one reason"])
    assert out == {"approve": "only one reason"}


def test_coerce_gate_reasons_unknown_keys_dropped() -> None:
    out = _coerce_gate_reasons({
        "approve": "ok",
        "banana": "no",
        "DENY-COMMENTS": "uppercase ok",  # not in lowercase set → dropped
    })
    assert out == {"approve": "ok"}


def test_coerce_gate_reasons_empty_and_garbage() -> None:
    assert _coerce_gate_reasons(None) == {}
    assert _coerce_gate_reasons("just a string") == {}
    assert _coerce_gate_reasons([]) == {}
    assert _coerce_gate_reasons({}) == {}


def test_coerce_gate_reasons_list_with_prefixed_and_bare() -> None:
    out = _coerce_gate_reasons([
        "approve: matches",
        "no prefix here",
    ])
    assert out["approve"] == "matches"
    assert out["deny-comments"] == "no prefix here"


def test_coerce_gate_reasons_rejects_think_dump() -> None:
    dump = (
        "<think>The user wants me to write gate option copy for the reviewer.\n"
        "Context:\n"
        "- User asked for Wish's last month's GMV by country\n"
        "- Committed card: fct_transaction_variations with dimensions shipping_country"
    )
    assert _coerce_gate_reasons(dump) == {}
    assert _coerce_gate_reasons(dump.splitlines()) == {}


def test_coerce_gate_reasons_extracts_json_after_think() -> None:
    raw = (
        '<think>planning</think>\n'
        '["Approve these models to draft SQL.", '
        '"Request changes if the grain is wrong.", '
        '"Halt if this question cannot be answered from these models.", '
        '"Dry-run if you only want a preview."]'
    )
    out = _coerce_gate_reasons(raw)
    assert "draft SQL" in out["approve"]
    assert "grain" in out["deny-comments"]

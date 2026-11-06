"""Unit tests for the Databot v2 human-gate decision parsing.

The state machine itself is exercised by an end-to-end graph smoke
test (see test_databot_graph.py). Here we cover the smaller piece:
how the CLI's resume payload is normalized into a (decision, comments)
pair, plus the default-when-empty behavior.
"""

from __future__ import annotations

import pytest

from agent.specialists.databot.gates import DEFAULT_GATE_DECISION, GATE_OPTIONS
from agent.specialists.databot import gates as human_gates


@pytest.mark.parametrize("token", list(GATE_OPTIONS))
def test_parse_resume_accepts_bare_tokens(token: str) -> None:
    decision, comments = human_gates.parse_resume(token)
    assert decision == token
    assert comments == ""


@pytest.mark.parametrize("payload", ["", "   ", None])
def test_parse_resume_empty_reply_asks_again(payload) -> None:
    """A blank Enter must not continue: at the SQL gate it would run the query."""
    decision, comments = human_gates.parse_resume(payload)
    assert decision is None
    assert comments == ""
    # The payload still advertises a default for UIs that preselect a button.
    assert DEFAULT_GATE_DECISION == "dryrun"


def test_parse_resume_accepts_json_object() -> None:
    decision, comments = human_gates.parse_resume(
        '{"decision": "deny-comments", "comments": "use a different table"}'
    )
    assert decision == "deny-comments"
    assert comments == "use a different table"


def test_parse_resume_keeps_comments_when_decision_unknown() -> None:
    decision, comments = human_gates.parse_resume(
        '{"decision": "banana", "comments": "please clarify the metric"}'
    )
    # Unknown decisions never proceed: the gate re-asks.
    assert decision is None
    assert comments == "please clarify the metric"


def test_parse_resume_freeform_text_is_unrecognized() -> None:
    # Free text without a recognized token is not a decision; the gate re-asks.
    decision, comments = human_gates.parse_resume("approve with notes: prefer last 7 days")
    assert decision is None
    assert "approve with notes" in comments


def test_parse_resume_handles_non_string_payload() -> None:
    decision, comments = human_gates.parse_resume(42)  # type: ignore[arg-type]
    assert decision is None
    assert comments == "42"  # coerced to string


def test_parse_resume_accepts_dict_payload() -> None:
    decision, comments = human_gates.parse_resume(
        {"decision": "deny-comments", "comments": "use dt not payment_received_time"},
    )
    assert decision == "deny-comments"
    assert comments == "use dt not payment_received_time"


def test_gate_options_includes_all_thought1_verdicts() -> None:
    """thought 1 lists exactly these four verdicts."""
    assert set(GATE_OPTIONS) == {"approve", "deny-comments", "deny-halt", "dryrun"}


def test_gate_prompt_sql_uses_default_reasons_when_state_empty() -> None:
    from agent.specialists.databot.gates import DEFAULT_SQL_GATE_REASONS

    payload = human_gates.prompt(
        {
            "draft_sql": "SELECT 1",
            "sql_reasons": {},
        },
        "sql",
    )
    reasons_by_id = {opt["id"]: opt["reason"] for opt in payload["options"]}
    assert reasons_by_id == DEFAULT_SQL_GATE_REASONS


def test_gate_prompt_cards_preserves_llm_reasons_over_defaults() -> None:
    payload = human_gates.prompt(
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
    summary = human_gates.cards_selection_summary(
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
    payload = human_gates.prompt(
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



def test_coerce_gate_reasons_dict_form() -> None:
    out = human_gates.coerce_reasons({
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
    out = human_gates.coerce_reasons([
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
    out = human_gates.coerce_reasons(["only one reason"])
    assert out == {"approve": "only one reason"}


def test_coerce_gate_reasons_unknown_keys_dropped() -> None:
    out = human_gates.coerce_reasons({
        "approve": "ok",
        "banana": "no",
        "DENY-COMMENTS": "uppercase ok",  # not in lowercase set → dropped
    })
    assert out == {"approve": "ok"}


def test_coerce_gate_reasons_empty_and_garbage() -> None:
    assert human_gates.coerce_reasons(None) == {}
    assert human_gates.coerce_reasons("just a string") == {}
    assert human_gates.coerce_reasons([]) == {}
    assert human_gates.coerce_reasons({}) == {}


def test_coerce_gate_reasons_list_with_prefixed_and_bare() -> None:
    out = human_gates.coerce_reasons([
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
    assert human_gates.coerce_reasons(dump) == {}
    assert human_gates.coerce_reasons(dump.splitlines()) == {}


def test_coerce_gate_reasons_extracts_json_after_think() -> None:
    raw = (
        '<think>planning</think>\n'
        '["Approve these models to draft SQL.", '
        '"Request changes if the grain is wrong.", '
        '"Halt if this question cannot be answered from these models.", '
        '"Dry-run if you only want a preview."]'
    )
    out = human_gates.coerce_reasons(raw)
    assert "draft SQL" in out["approve"]
    assert "grain" in out["deny-comments"]


@pytest.mark.parametrize(
    "payload",
    [
        "use commission_revenue not gmv",
        "aprove",
        {"decision": "banana"},
        '{"decision": "yes", "comments": "go"}',
    ],
)
def test_parse_resume_unrecognized_reply_never_proceeds(payload) -> None:
    decision, _ = human_gates.parse_resume(payload)
    assert decision is None


def test_unrecognized_resume_note_lists_valid_options() -> None:
    note = human_gates.unrecognized_resume_note("use gmv")
    assert "use gmv" in note
    for option in GATE_OPTIONS:
        assert option in note


def test_default_dryrun_reasons_match_behavior() -> None:
    """Dry-run runs the query like approve and only skips retrieval history."""
    sql_text = human_gates.DEFAULT_SQL_GATE_REASONS["dryrun"].lower()
    cards_text = human_gates.DEFAULT_CARDS_GATE_REASONS["dryrun"].lower()
    assert "no query execution" not in sql_text
    assert "run the query" in sql_text
    assert "history" in sql_text and "history" in cards_text
    assert "profile" not in sql_text and "profile" not in cards_text

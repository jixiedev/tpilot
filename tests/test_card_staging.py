"""Tests for staging → candidate card lifecycle."""

from __future__ import annotations

from agent.specialists.databot.card_staging import (
    apply_add_card_selections,
    merge_staging_cards,
    new_staging_id,
    parse_card_selection,
    selections_from_tool_payload,
    staging_entry_from_card,
)


def test_staging_entry_gets_unique_id() -> None:
    card = {"name": "fct_orders", "columns": [], "metrics": []}
    a = staging_entry_from_card(card)
    b = staging_entry_from_card(card)
    assert a["staging_id"] != b["staging_id"]
    assert a["name"] == "fct_orders"


def test_add_card_selections_resolves_from_staging() -> None:
    sid = new_staging_id("fct_orders")
    staging = [
        {
            "staging_id": sid,
            "name": "fct_orders",
            "description": "orders fact",
            "columns": [{"name": "order_date", "dimension": {"type": "time"}}],
            "metrics": [{"name": "gmv", "type": "simple"}],
        }
    ]
    updated, note = apply_add_card_selections(
        staging_cards=staging,
        committed_cards=[],
        selections=[
            {
                "staging_id": sid,
                "selected_dimensions": ["order_date"],
                "selected_metrics": ["gmv"],
                "selection_notes": "primary fact for revenue",
            }
        ],
    )
    assert "committed 1" in note
    assert len(updated) == 1
    assert updated[0]["staging_id"] == sid
    assert updated[0]["selected_dimensions"] == ["order_date"]
    assert updated[0]["selected_metrics"] == ["gmv"]
    assert updated[0]["name"] == "fct_orders"


def test_merge_staging_appends() -> None:
    first = staging_entry_from_card({"name": "a"})
    second = staging_entry_from_card({"name": "b"})
    merged = merge_staging_cards([first], [second])
    assert len(merged) == 2


def test_selections_from_tool_payload_skips_legacy_card_dict() -> None:
    sid = new_staging_id("fct_orders")
    selections = selections_from_tool_payload(
        [
            {"staging_id": sid, "selected_metrics": ["gmv"]},
            {"name": "fct_orders", "metrics": [{"name": "gmv"}]},
            "legacy_staging_id_string",
        ]
    )
    assert selections == [
        {"staging_id": sid, "selected_metrics": ["gmv"]},
        "legacy_staging_id_string",
    ]


def test_parse_card_selection_accepts_aliases() -> None:
    parsed = parse_card_selection(
        {
            "card_id": "x_123",
            "dimensions": ["dt"],
            "metrics": ["revenue"],
        }
    )
    assert parsed is not None
    assert parsed["staging_id"] == "x_123"
    assert parsed["selected_dimensions"] == ["dt"]
    assert parsed["selected_metrics"] == ["revenue"]

from __future__ import annotations

from observability.evaluator import (
    extract_json_object,
    score_answer,
    score_expected_output,
    values_equal,
)


def test_score_answer_matches_json_fields() -> None:
    score, details = score_answer('{"result": 3}', {"result": 3})
    assert score == 1.0
    assert details["matched"] == ["result"]


def test_score_answer_matches_numeric_string() -> None:
    score, details = score_expected_output('{"result": "3"}', {"result": 3})
    assert score == 1.0
    assert details["matched"] == ["result"]


def test_score_answer_skips_when_expected_empty() -> None:
    score, details = score_answer("anything", {})
    assert score == 1.0
    assert details["skipped"] is True


def test_score_answer_requires_json_object() -> None:
    score, details = score_answer("TAHOE-949 in prose", {"jira_ticket": "TAHOE-949"})
    assert score == 0.0
    assert details["parse_error"]


def test_score_answer_reports_missing_and_mismatched() -> None:
    score, details = score_answer('{"result": "4"}', {"result": 3, "note": "ok"})
    assert score == 0.0
    assert details["mismatched"] == ["result"]
    assert details["missing"] == ["note"]


def test_score_table_identity() -> None:
    score, details = score_expected_output(
        "analytics.daily_active_users",
        "analytics.daily_active_users",
    )
    assert score == 1.0
    assert details["reason"] == "exact match"
    score_embed, details_embed = score_expected_output(
        "Use analytics.daily_active_users for DAU.",
        "analytics.daily_active_users",
    )
    assert score_embed == 1.0
    assert details_embed["reason"] == "table match"


def test_extract_json_object_from_plain_body() -> None:
    parsed, error = extract_json_object('{"a": 1, "b": "two"}')
    assert error is None
    assert parsed == {"a": 1, "b": "two"}


def test_values_equal_normalizes_numbers() -> None:
    assert values_equal(3, 3.0)
    assert values_equal("3", 3)
    assert not values_equal(4, 3)

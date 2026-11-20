from __future__ import annotations

from evals.answer_match import extract_json_object, score_answer, values_equal


def test_score_answer_matches_json_fields() -> None:
    score, details = score_answer('{"result": "3"}', {"result": "3"})
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
    score, details = score_answer('{"result": "4"}', {"result": "3", "note": "ok"})
    assert score == 0.0
    assert details["mismatched"] == ["result"]
    assert details["missing"] == ["note"]


def test_extract_json_object_from_plain_body() -> None:
    parsed, error = extract_json_object('{"a": 1, "b": "two"}')
    assert error is None
    assert parsed == {"a": 1, "b": "two"}


def test_values_equal_normalizes_numbers() -> None:
    assert values_equal(3, 3.0)
    assert not values_equal(4, 3)


def test_expected_list_accepts_any_listed_scalar():
    from evals.answer_match import values_equal

    accepted = ["fct_transaction_variations", "fact_trans_detail"]
    assert values_equal("FACT_TRANS_DETAIL", accepted)
    assert not values_equal("fct_dau", accepted)


def test_expected_list_against_list_needs_every_item():
    from evals.answer_match import values_equal

    expected = ["core_data.fct_dau", "core_data.fct_refund"]
    assert values_equal(["core_data.fct_refund", "core_data.fct_dau", "core_data.other"], expected)
    assert not values_equal(["core_data.fct_dau"], expected)


def test_expected_null_needs_null():
    from evals.answer_match import values_equal

    assert values_equal(None, None)
    assert values_equal("null", None)
    assert not values_equal("fct_dau", None)
    assert not values_equal(None, "fct_dau")

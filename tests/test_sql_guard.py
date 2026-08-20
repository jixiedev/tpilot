from __future__ import annotations

import pytest

from tools.data.sql_guard import validate_read_only_sql


def test_allows_select_and_with() -> None:
    assert validate_read_only_sql("SELECT 1") == "SELECT 1"
    assert (
        validate_read_only_sql("WITH t AS (SELECT 1) SELECT * FROM t")
        == "WITH t AS (SELECT 1) SELECT * FROM t"
    )


def test_allows_show_describe_explain() -> None:
    assert validate_read_only_sql("SHOW TABLES").startswith("SHOW")
    assert validate_read_only_sql("DESCRIBE hive.default.t").startswith("DESCRIBE")
    assert validate_read_only_sql("EXPLAIN SELECT 1").startswith("EXPLAIN")


def test_rejects_write_statements() -> None:
    with pytest.raises(ValueError, match="read-only"):
        validate_read_only_sql("DELETE FROM t")
    with pytest.raises(ValueError, match="read-only"):
        validate_read_only_sql("INSERT INTO t VALUES (1)")
    with pytest.raises(ValueError, match="read-only"):
        validate_read_only_sql("DROP TABLE t")


def test_rejects_multiple_statements() -> None:
    with pytest.raises(ValueError, match="Multiple"):
        validate_read_only_sql("SELECT 1; SELECT 2")


def test_strips_leading_comments() -> None:
    assert validate_read_only_sql("-- note\nSELECT 1") == "SELECT 1"

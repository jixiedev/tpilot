from __future__ import annotations

import pytest

from tahoepilot.tools.data.sql_guard import validate_read_only_sql


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


@pytest.mark.parametrize(
    "sql",
    [
        "EXPLAIN ANALYZE INSERT INTO t SELECT 1",
        "EXPLAIN ANALYZE DELETE FROM t",
        "explain analyze verbose update t set a = 1",
        "EXPLAIN (TYPE DISTRIBUTED) DROP TABLE t",
        "EXPLAIN INSERT INTO t VALUES (1)",
        "EXPLAIN /* hide */ CREATE TABLE t AS SELECT 1",
        "EXPLAIN EXPLAIN ANALYZE DELETE FROM t",
        "EXPLAIN",
    ],
)
def test_explain_must_wrap_read_only_statement(sql: str) -> None:
    """EXPLAIN ANALYZE executes the wrapped statement, so it must be read-only."""
    with pytest.raises(ValueError):
        validate_read_only_sql(sql)


@pytest.mark.parametrize(
    "sql",
    [
        "EXPLAIN SELECT 1",
        "EXPLAIN ANALYZE SELECT count(*) FROM t",
        "EXPLAIN ANALYZE VERBOSE SELECT 1",
        "EXPLAIN (TYPE LOGICAL, FORMAT TEXT) WITH x AS (SELECT 1) SELECT * FROM x",
        "explain show tables",
    ],
)
def test_explain_of_read_only_statement_is_allowed(sql: str) -> None:
    assert validate_read_only_sql(sql) == sql


@pytest.mark.parametrize(
    "sql",
    [
        "ANALYZE SELECT 1",  # becomes EXPLAIN ANALYZE, which executes the query
        "/* c */ analyze select 1",
        "EXPLAIN ANALYZE SELECT 1",
        "EXPLAIN SELECT 1",
        "EXPLAIN (TYPE IO) SELECT 1",
        "SHOW TABLES",
        "DELETE FROM t",
        "SELECT 1; SELECT 2",
    ],
)
def test_plan_only_refuses_anything_that_could_execute(sql: str) -> None:
    from tahoepilot.tools.data.sql_guard import validate_plan_only_sql

    with pytest.raises(ValueError):
        validate_plan_only_sql(sql)


def test_plan_only_wraps_select_and_with() -> None:
    from tahoepilot.tools.data.sql_guard import validate_plan_only_sql

    assert validate_plan_only_sql("SELECT 1;") == "EXPLAIN SELECT 1"
    assert validate_plan_only_sql("WITH a AS (SELECT 1) SELECT * FROM a").startswith("EXPLAIN WITH")


def test_trino_explain_never_sends_analyze(monkeypatch) -> None:
    from tahoepilot.tools.data import trino

    sent: list[str] = []
    monkeypatch.setattr(trino, "_execute_query", lambda sql, limit: sent.append(sql) or {"rows": []})
    result = trino.trino_explain.func("ANALYZE SELECT 1") if hasattr(trino.trino_explain, "func") else trino.trino_explain("ANALYZE SELECT 1")
    assert result["ok"] is False
    assert sent == []

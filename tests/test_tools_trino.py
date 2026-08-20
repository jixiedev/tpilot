from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from unittest.mock import MagicMock, patch

import pytest

from tools.data.trino import (
    DEFAULT_ROW_LIMIT,
    _execute_query,
    _rows_to_dicts,
    _serialize_value,
    trino_desc_table,
    trino_list_catalogs,
    trino_list_schemas,
    trino_list_tables,
    trino_run_query,
)


@pytest.mark.parametrize(
    ("value", "expected"),
    [
        (None, None),
        ("text", "text"),
        (42, 42),
        (3.14, 3.14),
        (True, True),
        (datetime(2026, 1, 1), "2026-01-01 00:00:00"),
        (Decimal("1.5"), "1.5"),
    ],
)
def test_serialize_value(value: object, expected: object) -> None:
    assert _serialize_value(value) == expected


def test_rows_to_dicts_maps_columns() -> None:
    cursor = MagicMock()
    cursor.description = [("id",), ("name",)]

    rows = _rows_to_dicts(cursor, [(1, "alice"), (2, "bob")])

    assert rows == [{"id": 1, "name": "alice"}, {"id": 2, "name": "bob"}]


def _mock_cursor(
    *,
    description: list[tuple[str]] | None,
    rows: list[tuple],
) -> MagicMock:
    cursor = MagicMock()
    cursor.description = description
    cursor.fetchmany.return_value = rows
    return cursor


@patch("tools.data.trino.get_connection")
def test_execute_query_no_result_set(mock_get_connection: MagicMock) -> None:
    cursor = _mock_cursor(description=None, rows=[])
    conn = MagicMock()
    conn.cursor.return_value = cursor
    mock_get_connection.return_value = conn

    result = _execute_query("CREATE TABLE t (id int)")

    assert result == {"columns": [], "rows": [], "row_count": 0}
    cursor.execute.assert_called_once_with("CREATE TABLE t (id int)")


@patch("tools.data.trino.get_connection")
def test_execute_query_truncates_at_limit(mock_get_connection: MagicMock) -> None:
    cursor = _mock_cursor(
        description=[("n",)],
        rows=[(i,) for i in range(DEFAULT_ROW_LIMIT + 1)],
    )
    conn = MagicMock()
    conn.cursor.return_value = cursor
    mock_get_connection.return_value = conn

    result = _execute_query("SELECT n FROM t", limit=2)

    cursor.fetchmany.assert_called_once_with(3)
    assert result["row_count"] == 2
    assert result["truncated"] is True
    assert result["rows"] == [{"n": 0}, {"n": 1}]


@patch("tools.data.trino.get_connection")
def test_execute_query_returns_full_page(mock_get_connection: MagicMock) -> None:
    cursor = _mock_cursor(description=[("catalog",)], rows=[("hive",), ("iceberg",)])
    conn = MagicMock()
    conn.cursor.return_value = cursor
    mock_get_connection.return_value = conn

    result = _execute_query("SHOW CATALOGS")

    assert result["columns"] == ["catalog"]
    assert result["rows"] == [{"catalog": "hive"}, {"catalog": "iceberg"}]
    assert result["row_count"] == 2
    assert result["truncated"] is False


@patch("tools.data.trino._execute_query")
def test_trino_run_query_delegates(mock_execute: MagicMock) -> None:
    payload = {"columns": ["x"], "rows": [{"x": 1}], "row_count": 1, "truncated": False}
    mock_execute.return_value = payload

    assert trino_run_query.invoke({"sql": "SELECT 1", "limit": 10}) == payload
    mock_execute.assert_called_once_with("SELECT 1", 10)


@patch("tools.data.trino._execute_query")
def test_trino_run_query_rejects_mutating_sql(mock_execute: MagicMock) -> None:
    with pytest.raises(ValueError, match="read-only"):
        trino_run_query.invoke({"sql": "DELETE FROM t"})
    mock_execute.assert_not_called()


@patch("tools.data.trino._execute_query")
def test_trino_list_catalogs(mock_execute: MagicMock) -> None:
    mock_execute.return_value = {"rows": [{"Catalog": "hive"}]}

    assert trino_list_catalogs.invoke({}) == [{"Catalog": "hive"}]
    mock_execute.assert_called_once_with("SHOW CATALOGS")


@patch("tools.data.trino._execute_query")
def test_trino_list_schemas(mock_execute: MagicMock) -> None:
    mock_execute.return_value = {"rows": [{"Schema": "default"}]}

    assert trino_list_schemas.invoke({"catalog": "hive"}) == [{"Schema": "default"}]
    mock_execute.assert_called_once_with("SHOW SCHEMAS FROM hive")


@patch("tools.data.trino._execute_query")
def test_trino_list_tables(mock_execute: MagicMock) -> None:
    mock_execute.return_value = {"rows": [{"Table": "users"}]}

    result = trino_list_tables.invoke({"catalog": "hive", "schema_name": "analytics"})
    assert result == [{"Table": "users"}]
    mock_execute.assert_called_once_with("SHOW TABLES FROM hive.analytics")


@patch("tools.data.trino._execute_query")
def test_trino_list_tables_uses_config_defaults(mock_execute: MagicMock) -> None:
    mock_execute.return_value = {"rows": [{"Table": "t"}]}

    result = trino_list_tables.invoke({})
    assert result == [{"Table": "t"}]
    mock_execute.assert_called_once_with("SHOW TABLES FROM hive.default")


@patch("tools.data.trino._execute_query")
def test_trino_desc_table(mock_execute: MagicMock) -> None:
    mock_execute.return_value = {"rows": [{"Column": "id", "Type": "bigint"}]}

    result = trino_desc_table.invoke(
        {"catalog": "hive", "schema_name": "analytics", "table": "users"}
    )
    assert result == [{"Column": "id", "Type": "bigint"}]
    mock_execute.assert_called_once_with("DESCRIBE hive.analytics.users")

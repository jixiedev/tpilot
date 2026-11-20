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


@pytest.mark.parametrize(
    ("args", "expected"),
    [
        ({"table": "core_data.fct_transaction_variations"}, "DESCRIBE hive.core_data.fct_transaction_variations"),
        ({"table": "hive.bi.order_level"}, "DESCRIBE hive.bi.order_level"),
        ({"table": "bi.order_level", "schema_name": "ignored"}, "DESCRIBE hive.bi.order_level"),
        ({"table": '"wish"."dim_all_products"', "catalog": "hive"}, "DESCRIBE hive.wish.dim_all_products"),
    ],
)
@patch("tools.data.trino._execute_query")
def test_trino_desc_table_accepts_qualified_names(mock_execute: MagicMock, args, expected) -> None:
    """A qualified name used to become hive.<default>.schema.table and fail."""
    mock_execute.return_value = {"rows": []}
    with patch("tools.data.trino.tool_config") as cfg:
        cfg.trino.catalog = "hive"
        cfg.trino.schema_name = "default"
        trino_desc_table.invoke(args)
    mock_execute.assert_called_once_with(expected)


@patch("tools.data.trino._execute_query")
def test_trino_desc_table_rejects_malformed_names(mock_execute: MagicMock) -> None:
    for bad in ("a.b.c.d", "schema.", ""):
        with pytest.raises(Exception):
            trino_desc_table.invoke({"table": bad, "catalog": "hive", "schema_name": "x"})
    mock_execute.assert_not_called()


# ------------------------------------------------------------- impersonation

import pytest  # noqa: E402
from langchain_core.runnables import RunnableLambda  # noqa: E402

from settings.tool_config import TrinoToolConfig  # noqa: E402
from tools.data import trino as trino_mod  # noqa: E402


@pytest.fixture
def trino_cfg(monkeypatch):
    monkeypatch.setenv("TRINO_USER", "svc")
    monkeypatch.setenv("TRINO_PASSWORD", "pw")
    cfg = TrinoToolConfig(
        host="trino.test", port=8443, user_env="TRINO_USER", password_env="TRINO_PASSWORD",
        user_identity="impersonate",
    )
    monkeypatch.setattr(trino_mod.tool_config, "trino", cfg)
    calls: list[dict] = []
    monkeypatch.setattr(trino_mod, "connect", lambda **kw: calls.append(kw) or MagicMock(name=kw["user"]))
    return cfg, calls


def _in_run(user: str, fn):
    return RunnableLambda(lambda _: fn()).invoke(None, {"configurable": {"user_id": user}})


def test_impersonates_the_run_user(trino_cfg):
    _, calls = trino_cfg
    _in_run("alice", trino_mod.get_connection)
    assert calls[-1]["user"] == "alice"
    auth = calls[-1]["auth"]
    assert (auth._username, auth._password) == ("svc", "pw")  # service account authenticates
    assert calls[-1]["source"] == "tahoepilot"


def test_service_user_outside_a_run(trino_cfg):
    _, calls = trino_cfg
    trino_mod.get_connection()
    assert calls[-1]["user"] == "svc"


def test_one_connection_per_user(trino_cfg):
    _, calls = trino_cfg
    a1 = _in_run("alice", trino_mod.get_connection)
    b = _in_run("bob", trino_mod.get_connection)
    a2 = _in_run("alice", trino_mod.get_connection)
    assert a1 is a2 and a1 is not b
    assert [c["user"] for c in calls] == ["alice", "bob"]


def test_service_mode_ignores_the_run_user(trino_cfg, monkeypatch):
    cfg, calls = trino_cfg
    monkeypatch.setattr(trino_mod.tool_config, "trino", cfg.model_copy(update={"user_identity": "service"}))
    _in_run("alice", trino_mod.get_connection)
    assert calls[-1]["user"] == "svc"


def test_connection_cache_is_bounded(trino_cfg, monkeypatch):
    _, calls = trino_cfg
    monkeypatch.setattr(trino_mod, "MAX_CONNECTIONS_PER_THREAD", 2)
    first = _in_run("u1", trino_mod.get_connection)
    _in_run("u2", trino_mod.get_connection)
    _in_run("u3", trino_mod.get_connection)
    first.close.assert_called_once()
    assert list(trino_mod._thread_local.conns) == ["u2", "u3"]

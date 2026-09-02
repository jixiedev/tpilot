from __future__ import annotations

from threading import local
from typing import Any

from langchain.tools import tool
from trino.auth import BasicAuthentication
from trino.dbapi import connect

from config.tool_config import tool_config, trino_password
from tools.common import alternative_tool, bind_tool_to_agent
from tools.data.sql_guard import validate_read_only_sql
from tools.data.trino_errors import register_trino_exception_mappings

register_trino_exception_mappings()

_thread_local = local()
DEFAULT_ROW_LIMIT = 100


def get_connection():
    conn = getattr(_thread_local, "conn", None)
    if conn is None:
        cfg = tool_config.trino
        conn = connect(
            host=cfg.host,
            port=cfg.port,
            user=cfg.user,
            auth=BasicAuthentication(cfg.user, trino_password(cfg)),
            catalog=cfg.catalog,
            schema=cfg.schema_name,
            http_scheme=cfg.http_scheme,
        )
        _thread_local.conn = conn
    return conn


def _serialize_value(value: Any) -> Any:
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    return str(value)


def _rows_to_dicts(cursor, rows: list[tuple]) -> list[dict[str, Any]]:
    columns = [desc[0] for desc in cursor.description]
    return [
        {col: _serialize_value(val) for col, val in zip(columns, row)}
        for row in rows
    ]


def _execute_query(sql: str, limit: int = DEFAULT_ROW_LIMIT) -> dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(sql)
    if cursor.description is None:
        return {"columns": [], "rows": [], "row_count": 0}
    rows = cursor.fetchmany(limit + 1)
    truncated = len(rows) > limit
    if truncated:
        rows = rows[:limit]
    return {
        "columns": [desc[0] for desc in cursor.description],
        "rows": _rows_to_dicts(cursor, rows),
        "row_count": len(rows),
        "truncated": truncated,
    }


@bind_tool_to_agent("databot,default")
@bind_tool_to_agent("databot,execute")
@bind_tool_to_agent("diagnostic,default")
@bind_tool_to_agent("data_analysis,default")
@tool
def trino_run_query(sql: str, limit: int = DEFAULT_ROW_LIMIT) -> dict[str, Any]:
    """Execute a read-only Trino SQL query and return rows (may truncate).

    Only SELECT/WITH/SHOW/DESCRIBE/EXPLAIN are allowed; multiple statements are rejected.
    """
    return _execute_query(validate_read_only_sql(sql), limit)


@bind_tool_to_agent("databot,default")
@bind_tool_to_agent("databot,sql")
@bind_tool_to_agent("diagnostic,default")
@bind_tool_to_agent("data_analysis,default")
@tool
def trino_explain(sql: str) -> dict[str, Any]:
    """Validate a read-only SQL by running ``EXPLAIN`` (no rows executed).

    Returns ``{"ok": True, "plan": [...]}`` on success or
    ``{"ok": False, "error": "<message>", "sql": "<as-rendered>"}`` on failure.
    Designed for the SQL-draft stage to confirm a drafted query parses and
    resolves against the live catalog before the human gate. The SQL
    guard rejects non-read-only statements before they reach Trino, so
    callers cannot accidentally use this as a side-effecting execute.

    Security note: the guard only inspects the *first* token, so a
    crafted ``EXPLAIN INSERT ...`` slips past it. Trino's ``EXPLAIN``
    itself is parse-only and does not execute the wrapped statement, so
    there is no write risk in practice — the same loophole already
    exists in ``trino_run_query``. Tighten the guard in a follow-up if
    you want defence in depth.
    """
    cleaned = (sql or "").strip()
    if not cleaned:
        return {"ok": False, "error": "empty SQL", "sql": cleaned}
    # Strip a single trailing semicolon so ``EXPLAIN WITH ...;`` still
    # parses; the guard also rejects multi-statement inputs.
    rendered = cleaned.rstrip(";").rstrip()
    explain_sql = f"EXPLAIN {rendered}"
    try:
        # ``EXPLAIN`` does not execute the query, so the default row
        # limit is irrelevant — we only read the plan rows.
        result = _execute_query(validate_read_only_sql(explain_sql), limit=DEFAULT_ROW_LIMIT)
    except Exception as exc:  # noqa: BLE001 - we want to surface the trino/guard error verbatim
        return {"ok": False, "error": str(exc), "sql": rendered}
    plan_rows = result.get("rows") or []
    return {"ok": True, "plan": plan_rows, "row_count": len(plan_rows), "sql": rendered}


@bind_tool_to_agent("databot,default")
@bind_tool_to_agent("diagnostic,default")
@bind_tool_to_agent("data_analysis,default")
@tool
def trino_list_catalogs() -> list[dict[str, Any]]:
    """List all Trino catalogs."""
    return _execute_query("SHOW CATALOGS")["rows"]


@bind_tool_to_agent("databot,default")
@bind_tool_to_agent("diagnostic,default")
@bind_tool_to_agent("data_analysis,default")
@tool
def trino_list_schemas(catalog: str = "") -> list[dict[str, Any]]:
    """List schemas in a Trino catalog (defaults to ``[trino].catalog`` in tools.toml)."""
    cfg = tool_config.trino
    cat = (catalog or "").strip() or cfg.catalog
    return _execute_query(f"SHOW SCHEMAS FROM {cat}")["rows"]


@bind_tool_to_agent("databot,default")
@bind_tool_to_agent("diagnostic,default")
@bind_tool_to_agent("data_analysis,default")
@tool
@alternative_tool("hive_list_tables")
def trino_list_tables(catalog: str = "", schema_name: str = "") -> list[dict[str, Any]]:
    """List tables in a Trino catalog and schema.

    ``catalog`` / ``schema_name`` default to ``[trino].catalog`` and
    ``[trino].schema_name`` in tools.toml when omitted (useful after a Hive HMS failure).
    """
    cfg = tool_config.trino
    cat = (catalog or "").strip() or cfg.catalog
    schema = (schema_name or "").strip() or cfg.schema_name
    if not cat or not schema:
        raise ValueError(
            "catalog and schema_name are required "
            "(pass them explicitly or set [trino] catalog/schema_name in tools.toml)"
        )
    return _execute_query(f"SHOW TABLES FROM {cat}.{schema}")["rows"]


@bind_tool_to_agent("databot,default")
@bind_tool_to_agent("databot,sql")
@bind_tool_to_agent("diagnostic,default")
@bind_tool_to_agent("data_analysis,default")
@tool
@alternative_tool("hive_desc_table")
def trino_desc_table(
    table: str,
    catalog: str = "",
    schema_name: str = "",
) -> list[dict[str, Any]]:
    """Describe columns of a Trino table.

    ``catalog`` / ``schema_name`` default to tools.toml ``[trino]`` when omitted.
    """
    cfg = tool_config.trino
    cat = (catalog or "").strip() or cfg.catalog
    schema = (schema_name or "").strip() or cfg.schema_name
    table_name = (table or "").strip()
    if not table_name:
        raise ValueError("table is required")
    if not cat or not schema:
        raise ValueError(
            "catalog and schema_name are required "
            "(pass them explicitly or set [trino] catalog/schema_name in tools.toml)"
        )
    return _execute_query(f"DESCRIBE {cat}.{schema}.{table_name}")["rows"]


TOOLS = [
    trino_run_query,
    trino_explain,
    trino_list_catalogs,
    trino_list_schemas,
    trino_list_tables,
    trino_desc_table,
]

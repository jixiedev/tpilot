from threading import local

from langchain.tools import tool
from trino.dbapi import connect

from config.tool_config import tool_config

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
            catalog=cfg.catalog,
            schema=cfg.schema_name,
            http_scheme=cfg.http_scheme,
        )
        _thread_local.conn = conn
    return conn


def _serialize_value(value):
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    return str(value)


def _rows_to_dicts(cursor, rows):
    columns = [desc[0] for desc in cursor.description]
    return [
        {col: _serialize_value(val) for col, val in zip(columns, row)}
        for row in rows
    ]


def _execute_query(sql: str, limit: int = DEFAULT_ROW_LIMIT):
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


@tool
def run_query(sql: str, limit: int = DEFAULT_ROW_LIMIT):
    """Execute a Trino SQL query and return the result rows."""
    return _execute_query(sql, limit)


@tool
def list_catalogs():
    """List all Trino catalogs."""
    return _execute_query("SHOW CATALOGS")["rows"]


@tool
def list_schemas(catalog: str):
    """List schemas in a Trino catalog."""
    return _execute_query(f"SHOW SCHEMAS FROM {catalog}")["rows"]


@tool
def list_tables(catalog: str, schema_name: str):
    """List tables in a Trino catalog and schema."""
    return _execute_query(f"SHOW TABLES FROM {catalog}.{schema_name}")["rows"]


@tool
def desc_table(catalog: str, schema_name: str, table: str):
    """Describe columns of a Trino table."""
    return _execute_query(f"DESCRIBE {catalog}.{schema_name}.{table}")["rows"]

TOOLS = [run_query, list_catalogs, list_schemas, list_tables, desc_table]
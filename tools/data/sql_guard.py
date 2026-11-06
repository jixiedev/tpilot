"""Read-only SQL guard for warehouse query tools."""

from __future__ import annotations

import re

_LEADING_COMMENTS = re.compile(r"^(?:\s|--[^\n]*\n|/\*[\s\S]*?\*/)*", re.MULTILINE)

# ``EXPLAIN [ANALYZE] [VERBOSE] [( option [, ...] )]`` prefix. ``EXPLAIN ANALYZE``
# executes the wrapped statement, so the statement itself must be read-only.
_EXPLAIN_PREFIX = re.compile(
    r"^EXPLAIN\b(?:\s+ANALYZE\b)?(?:\s+VERBOSE\b)?(?:\s*\([^)]*\))?",
    re.IGNORECASE,
)

_ALLOWED_FIRST_TOKEN = frozenset({"SELECT", "WITH", "SHOW", "DESCRIBE", "DESC", "EXPLAIN"})
_FORBIDDEN_FIRST_TOKEN = frozenset(
    {
        "INSERT",
        "UPDATE",
        "DELETE",
        "MERGE",
        "CREATE",
        "DROP",
        "ALTER",
        "TRUNCATE",
        "GRANT",
        "REVOKE",
        "CALL",
        "SET",
        "RESET",
        "PREPARE",
        "DEALLOCATE",
        "EXECUTE",
    }
)


def validate_read_only_sql(sql: str) -> str:
    """Return stripped SQL if it is a single read-only statement; otherwise raise ValueError."""
    if sql is None or not str(sql).strip():
        raise ValueError("SQL must not be blank")
    normalized = _LEADING_COMMENTS.sub("", str(sql).strip()).strip()
    if not normalized:
        raise ValueError("SQL must not be blank")

    first_token = _first_token(normalized)
    if first_token is None:
        raise ValueError("Could not parse SQL")
    upper = first_token.upper()
    if upper in _FORBIDDEN_FIRST_TOKEN or upper not in _ALLOWED_FIRST_TOKEN:
        raise ValueError(
            "Only read-only queries are allowed (SELECT/WITH/SHOW/DESCRIBE/EXPLAIN); "
            f"got statement starting with {first_token}"
        )
    without_trailing = re.sub(r";\s*$", "", normalized)
    if ";" in without_trailing:
        raise ValueError("Multiple SQL statements are not allowed")
    if upper == "EXPLAIN":
        _validate_explained_statement(normalized)
    return normalized


def _validate_explained_statement(sql: str) -> None:
    """Require the statement wrapped by ``EXPLAIN`` to be read-only too."""
    match = _EXPLAIN_PREFIX.match(sql)
    inner = sql[match.end():] if match else ""
    inner = _LEADING_COMMENTS.sub("", inner.strip()).strip()
    if not inner:
        raise ValueError("EXPLAIN must wrap a statement")
    first = _first_token(inner)
    if first is not None and first.upper() == "EXPLAIN":
        raise ValueError("Nested EXPLAIN is not allowed")
    try:
        validate_read_only_sql(inner)
    except ValueError as exc:
        raise ValueError(f"EXPLAIN wraps a non-read-only statement: {exc}") from exc


def _first_token(sql: str) -> str | None:
    stripped = sql.lstrip()
    if not stripped:
        return None
    token = stripped.split(None, 1)[0]
    return token or None

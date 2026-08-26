"""Trino SDK exception → ToolErrorType mappings (owned by the Trino tool module)."""

from __future__ import annotations

from tools.errors import ToolErrorType, register_exception


def _trino_exception_message(exc: BaseException) -> str:
    message = getattr(exc, "message", None)
    if isinstance(message, str) and message.strip():
        error_name = getattr(exc, "error_name", None)
        if isinstance(error_name, str) and error_name.strip():
            return f"{error_name}: {message}"
        return message
    return str(exc)


def _classify_trino_user_error(exc: BaseException) -> tuple[ToolErrorType, bool, str] | None:
    message = _trino_exception_message(exc)
    error_name = (getattr(exc, "error_name", None) or "").upper()

    if any(token in error_name for token in ("PERMISSION", "ACCESS_DENIED", "NOT_AUTHORIZED")):
        return ToolErrorType.PERMISSION, False, message
    if any(token in error_name for token in ("NOT_FOUND", "MISSING")):
        return ToolErrorType.NOT_FOUND, False, message
    if any(token in error_name for token in ("SYNTAX", "MISMATCH", "TYPE_MISMATCH")):
        return ToolErrorType.SYNTAX, False, message
    return ToolErrorType.SYNTAX, False, message


def _classify_trino_external_error(exc: BaseException) -> tuple[ToolErrorType, bool, str] | None:
    message = _trino_exception_message(exc)
    lower = message.lower()
    if "timeout" in lower or "timed out" in lower:
        return ToolErrorType.TIMEOUT, True, message
    return ToolErrorType.CONNECTION, True, message


def _classify_trino_query_error(exc: BaseException) -> tuple[ToolErrorType, bool, str] | None:
    message = _trino_exception_message(exc)
    lower = message.lower()
    if any(token in lower for token in ("syntax", "parse error", "mismatched", "invalid query")):
        return ToolErrorType.SYNTAX, False, message
    if any(
        token in lower
        for token in ("does not exist", "not found", "unknown table", "unknown database", "no such")
    ):
        return ToolErrorType.NOT_FOUND, False, message
    if any(token in lower for token in ("permission", "denied", "not authorized", "access denied")):
        return ToolErrorType.PERMISSION, False, message
    return ToolErrorType.UNKNOWN, False, message


def register_trino_exception_mappings() -> None:
    """Register Trino client exceptions. No-op when ``trino`` is not installed."""
    try:
        from trino.exceptions import (
            Http502Error,
            Http503Error,
            Http504Error,
            OperationalError,
            TrinoConnectionError,
            TrinoExternalError,
            TrinoInternalError,
            TrinoQueryError,
            TrinoUserError,
        )
    except ImportError:
        return

    register_exception(
        TrinoConnectionError,
        Http502Error,
        Http503Error,
        Http504Error,
        OperationalError,
        error_type=ToolErrorType.CONNECTION,
        retryable=True,
        message=_trino_exception_message,
    )
    register_exception(
        TrinoUserError,
        classifier=_classify_trino_user_error,
        message=_trino_exception_message,
    )
    register_exception(
        TrinoExternalError,
        classifier=_classify_trino_external_error,
        message=_trino_exception_message,
    )
    register_exception(
        TrinoInternalError,
        error_type=ToolErrorType.UNKNOWN,
        retryable=True,
        message=_trino_exception_message,
    )
    register_exception(
        TrinoQueryError,
        classifier=_classify_trino_query_error,
        message=_trino_exception_message,
    )


register_trino_exception_mappings()

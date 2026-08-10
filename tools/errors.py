"""Structured tool error types and classification for data-plane tools."""

from __future__ import annotations

import json
from dataclasses import dataclass
from enum import StrEnum
from typing import Any

from tools.common import lookup_alternative_tool


class ToolErrorType(StrEnum):
    CONNECTION = "connection"
    TIMEOUT = "timeout"
    SYNTAX = "syntax"
    NOT_FOUND = "not_found"
    PERMISSION = "permission"
    UNKNOWN = "unknown"


def _message_error_type(message: str) -> ToolErrorType | None:
    lower = message.lower()
    if any(token in lower for token in ("syntax", "parse error", "mismatched", "invalid query")):
        return ToolErrorType.SYNTAX
    if any(
        token in lower
        for token in ("does not exist", "not found", "unknown table", "unknown database", "no such")
    ):
        return ToolErrorType.NOT_FOUND
    if any(token in lower for token in ("permission", "denied", "not authorized", "access denied")):
        return ToolErrorType.PERMISSION
    if any(token in lower for token in ("timeout", "timed out")):
        return ToolErrorType.TIMEOUT
    if any(
        token in lower
        for token in ("connection", "connect", "refused", "unreachable", "502", "503", "504")
    ):
        return ToolErrorType.CONNECTION
    return None


def _trino_exception_message(exc: Exception) -> str:
    message = getattr(exc, "message", None)
    if isinstance(message, str) and message.strip():
        error_name = getattr(exc, "error_name", None)
        if isinstance(error_name, str) and error_name.strip():
            return f"{error_name}: {message}"
        return message
    return str(exc)


def _classify_trino_exception(exc: Exception) -> tuple[ToolErrorType, bool, str] | None:
    """Map Trino SDK exceptions to (error_type, retryable, message)."""
    try:
        from tools.data.trino import (
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
        return None

    message = _trino_exception_message(exc)
    error_name = (getattr(exc, "error_name", None) or "").upper()

    if isinstance(exc, (TrinoConnectionError, Http502Error, Http503Error, Http504Error)):
        return ToolErrorType.CONNECTION, True, message

    if isinstance(exc, TrinoUserError):
        if any(token in error_name for token in ("PERMISSION", "ACCESS_DENIED", "NOT_AUTHORIZED")):
            return ToolErrorType.PERMISSION, False, message
        if any(token in error_name for token in ("NOT_FOUND", "MISSING")):
            return ToolErrorType.NOT_FOUND, False, message
        if any(token in error_name for token in ("SYNTAX", "MISMATCH", "TYPE_MISMATCH")):
            return ToolErrorType.SYNTAX, False, message
        hinted = _message_error_type(message)
        return (hinted or ToolErrorType.SYNTAX), False, message

    if isinstance(exc, TrinoExternalError):
        hinted = _message_error_type(message)
        if hinted is ToolErrorType.TIMEOUT:
            return ToolErrorType.TIMEOUT, True, message
        return ToolErrorType.CONNECTION, True, message

    if isinstance(exc, TrinoInternalError):
        return ToolErrorType.UNKNOWN, True, message

    if isinstance(exc, TrinoQueryError):
        hinted = _message_error_type(message)
        return (hinted or ToolErrorType.UNKNOWN), False, message

    if isinstance(exc, OperationalError):
        return ToolErrorType.CONNECTION, True, message

    return None


def _hint_for(
    error_type: ToolErrorType,
    *,
    tool: str | None = None,
    fallback_tool: str | None = None,
    exhausted_fallback: bool = False,
) -> str:
    if exhausted_fallback and tool and fallback_tool:
        return (
            f"`{tool}` failed, and plan-B `{fallback_tool}` already failed this turn. "
            f"Do not call `{tool}` or `{fallback_tool}` again; "
            "explain the failure to the user via `chat_completion`."
        )

    if error_type is ToolErrorType.CONNECTION:
        base = (
            f"`{tool}` failed with a connection error. "
            "Do not repeat the same call; fix connectivity or try another approach."
            if tool
            else "Check network connectivity and data-source host/port, then retry."
        )
    elif error_type is ToolErrorType.TIMEOUT:
        base = (
            f"`{tool}` timed out. Do not repeat identical arguments; "
            "narrow the query or choose a different approach."
            if tool
            else "Retry with a narrower query or smaller scope."
        )
    elif error_type is ToolErrorType.SYNTAX:
        base = "Fix SQL or identifiers; confirm table and column names from metadata tools."
    elif error_type is ToolErrorType.NOT_FOUND:
        base = "List catalogs, schemas, or tables before retrying the query."
    elif error_type is ToolErrorType.PERMISSION:
        base = "Tell the user which resource is blocked and what access is required."
    else:
        base = (
            "Adjust the tool arguments or choose a different tool — "
            "do not repeat the identical call."
        )

    if tool and fallback_tool:
        base = (
            f"{base} Optional plan B: `{fallback_tool}` may cover the same need — "
            f"you decide whether to switch; do not call `{tool}` again for the same need."
        )
    return base


@dataclass(frozen=True)
class StructuredToolError:
    """Canonical tool-failure payload used by ToolNode recovery and the LLM."""

    MARKER = "=== TOOL ERROR ==="

    error_type: ToolErrorType
    tool: str
    message: str
    retryable: bool = False
    fallback_tool: str | None = None
    hint: str = ""

    @property
    def is_transient(self) -> bool:
        return self.retryable and self.error_type in {
            ToolErrorType.CONNECTION,
            ToolErrorType.TIMEOUT,
        }

    def to_dict(self) -> dict[str, Any]:
        return {
            "error_type": self.error_type.value,
            "tool": self.tool,
            "message": self.message,
            "retryable": self.retryable,
            "fallback_tool": self.fallback_tool,
            "hint": self.hint,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> StructuredToolError:
        return cls(
            error_type=ToolErrorType(data["error_type"]),
            tool=str(data["tool"]),
            message=str(data["message"]),
            retryable=bool(data.get("retryable", False)),
            fallback_tool=data.get("fallback_tool"),
            hint=str(data.get("hint", "")),
        )

    def to_message_content(self) -> str:
        """Serialize for ToolMessage content: marker + JSON (machine + model readable)."""
        return f"{self.MARKER}\n{json.dumps(self.to_dict(), ensure_ascii=False, indent=2)}"

    @classmethod
    def from_message_content(cls, content: str) -> StructuredToolError | None:
        """Parse ToolMessage content produced by ``to_message_content``."""
        text = content.strip()
        if not text:
            return None

        if text.startswith(cls.MARKER):
            text = text[len(cls.MARKER) :].strip()

        try:
            data = json.loads(text)
        except json.JSONDecodeError:
            start = text.find("{")
            end = text.rfind("}")
            if start < 0 or end <= start:
                return None
            try:
                data = json.loads(text[start : end + 1])
            except json.JSONDecodeError:
                return None

        if not isinstance(data, dict) or "error_type" not in data or "tool" not in data:
            return None
        try:
            return cls.from_dict(data)
        except (KeyError, TypeError, ValueError):
            return None

    def with_failed_tool(self, tool_name: str) -> StructuredToolError:
        """Return a copy that names the tool that just failed (and its plan B, if any)."""
        if self.tool and self.tool != "unknown":
            return self
        fallback = lookup_alternative_tool(tool_name)
        return StructuredToolError(
            error_type=self.error_type,
            tool=tool_name,
            message=self.message,
            retryable=self.retryable,
            fallback_tool=fallback,
            hint=_hint_for(
                self.error_type,
                tool=tool_name,
                fallback_tool=fallback,
            ),
        )

    def against_prior_failures(self, prior_failed: list[str] | tuple[str, ...] | set[str]) -> StructuredToolError:
        """Drop plan-B suggestions when the peer tool already failed this turn."""
        prior = {name for name in prior_failed if name}
        if not self.fallback_tool or self.fallback_tool not in prior:
            return self
        return StructuredToolError(
            error_type=self.error_type,
            tool=self.tool,
            message=self.message,
            retryable=self.retryable,
            fallback_tool=None,
            hint=_hint_for(
                self.error_type,
                tool=self.tool,
                fallback_tool=self.fallback_tool,
                exhausted_fallback=True,
            ),
        )

    @classmethod
    def from_exception(cls, tool_name: str, exc: Exception) -> StructuredToolError:
        """Map a tool exception to a structured, model-facing error payload."""
        trino = _classify_trino_exception(exc)
        if trino is not None:
            error_type, retryable, message = trino
        else:
            retryable = False
            error_type = ToolErrorType.UNKNOWN
            message = str(exc)

            if isinstance(exc, TimeoutError):
                error_type = ToolErrorType.TIMEOUT
                retryable = True
            elif isinstance(exc, ConnectionError):
                error_type = ToolErrorType.CONNECTION
                retryable = True
            elif isinstance(exc, OSError):
                error_type = ToolErrorType.CONNECTION
                retryable = True

            hinted = _message_error_type(message)
            if hinted is not None:
                error_type = hinted
                retryable = retryable or hinted in {
                    ToolErrorType.CONNECTION,
                    ToolErrorType.TIMEOUT,
                }

        fallback = lookup_alternative_tool(tool_name)
        return cls(
            error_type=error_type,
            tool=tool_name,
            message=message,
            retryable=retryable,
            fallback_tool=fallback,
            hint=_hint_for(error_type, tool=tool_name, fallback_tool=fallback),
        )

"""Structured tool errors and per-exception classification registry."""

from __future__ import annotations

import json
from collections.abc import Callable
from dataclasses import dataclass
from enum import StrEnum
from typing import Any

from tools.common import lookup_alternative_tool

ExceptionClassifier = Callable[[BaseException], tuple["ToolErrorType", bool, str] | None]
ExceptionMessageFn = Callable[[BaseException], str]


class ToolErrorType(StrEnum):
    CONNECTION = "connection"
    TIMEOUT = "timeout"
    SYNTAX = "syntax"
    NOT_FOUND = "not_found"
    PERMISSION = "permission"
    UNKNOWN = "unknown"


@dataclass(frozen=True)
class _ExceptionRule:
    """Static mapping and/or a classifier for one exception type."""

    error_type: ToolErrorType | None = None
    retryable: bool = False
    classifier: ExceptionClassifier | None = None
    message: ExceptionMessageFn | None = None


_EXCEPTION_RULES: dict[type[BaseException], _ExceptionRule] = {}
_BUILTIN_EXCEPTION_TYPES: frozenset[type[BaseException]] = frozenset()


def register_exception(
    *exc_types: type[BaseException],
    error_type: ToolErrorType | None = None,
    retryable: bool = False,
    classifier: ExceptionClassifier | None = None,
    message: ExceptionMessageFn | None = None,
) -> None:
    """Register how an exception type maps to ``ToolErrorType`` / retryability.

    Prefer a static ``error_type`` when the whole class shares one outcome.
    Prefer ``classifier`` when subclasses or attributes need finer mapping
    (e.g. Trino ``error_name``). Classifier results win when non-``None``;
    otherwise the static ``error_type`` is used when set.
    """
    if error_type is None and classifier is None:
        raise ValueError("register_exception requires error_type and/or classifier")
    rule = _ExceptionRule(
        error_type=error_type,
        retryable=retryable,
        classifier=classifier,
        message=message,
    )
    for exc_type in exc_types:
        _EXCEPTION_RULES[exc_type] = rule


def clear_exception_mappings(*, keep_builtins: bool = True) -> None:
    """Clear registered mappings (tests). Builtins stay unless ``keep_builtins=False``."""
    if not keep_builtins:
        _EXCEPTION_RULES.clear()
        return
    for exc_type in list(_EXCEPTION_RULES):
        if exc_type not in _BUILTIN_EXCEPTION_TYPES:
            del _EXCEPTION_RULES[exc_type]


def resolve_exception(exc: BaseException) -> tuple[ToolErrorType, bool, str]:
    """Look up the most specific registered mapping for ``exc``."""
    for cls in type(exc).mro():
        if cls is BaseException:
            break
        rule = _EXCEPTION_RULES.get(cls)
        if rule is None:
            continue
        if rule.classifier is not None:
            classified = rule.classifier(exc)
            if classified is not None:
                return classified
        if rule.error_type is not None:
            msg_fn = rule.message or (lambda e: str(e))
            return rule.error_type, rule.retryable, msg_fn(exc)
    return ToolErrorType.UNKNOWN, False, str(exc)


def _register_builtin_exception_mappings() -> None:
    """Infrastructure exceptions shared by all tools (not product-specific)."""
    global _BUILTIN_EXCEPTION_TYPES
    register_exception(TimeoutError, error_type=ToolErrorType.TIMEOUT, retryable=True)
    register_exception(ConnectionError, error_type=ToolErrorType.CONNECTION, retryable=True)
    _BUILTIN_EXCEPTION_TYPES = frozenset({TimeoutError, ConnectionError})


_register_builtin_exception_mappings()


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
        if fallback_tool == "trino_list_tables":
            base = (
                f"{base} For `trino_list_tables`, pass `catalog` and `schema_name`, "
                "or omit them to use tools.toml `[trino]` defaults "
                "(do not invent a catalog name like `tahoe`)."
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
        """Map a tool exception via the exception-type registry (no product hardcoding)."""
        error_type, retryable, message = resolve_exception(exc)
        fallback = lookup_alternative_tool(tool_name)
        return cls(
            error_type=error_type,
            tool=tool_name,
            message=message,
            retryable=retryable,
            fallback_tool=fallback,
            hint=_hint_for(error_type, tool=tool_name, fallback_tool=fallback),
        )

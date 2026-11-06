"""DataHub GraphQL HTTP client: auth, read-only guard, and error classification."""

from __future__ import annotations

import json
import re
import urllib.error
import urllib.request
from typing import Any

from config.tool_config import DataHubToolConfig, datahub_graphql_url, datahub_token, tool_config
from tools.errors import ToolErrorType, register_exception

_MUTATION_RE = re.compile(r"\b(mutation|subscription)\b", re.IGNORECASE)


class DataHubGraphQLError(RuntimeError):
    """Raised when a DataHub GraphQL request fails or returns GraphQL errors."""


def _classify_datahub_graphql_error(exc: BaseException) -> tuple[ToolErrorType, bool, str] | None:
    message = str(exc)
    lower = message.lower()
    if any(token in lower for token in ("timeout", "timed out")):
        return ToolErrorType.TIMEOUT, True, message
    if any(
        token in lower
        for token in ("connection", "connect", "refused", "unreachable", "urlerror")
    ):
        return ToolErrorType.CONNECTION, True, message
    return ToolErrorType.UNKNOWN, False, message


register_exception(DataHubGraphQLError, classifier=_classify_datahub_graphql_error)


def _normalize_variables(variables: dict[str, Any] | str | None) -> dict[str, Any]:
    if variables is None or variables == "":
        return {}
    if isinstance(variables, dict):
        return variables
    text = str(variables).strip()
    if not text:
        return {}
    parsed = json.loads(text)
    if not isinstance(parsed, dict):
        raise ValueError("variables must be a JSON object")
    return parsed


def _assert_query_only(query: str) -> None:
    text = (query or "").strip()
    if not text:
        raise ValueError("GraphQL query must be a non-empty string")
    without_block = re.sub(r"/\*.*?\*/", "", text, flags=re.DOTALL)
    without_comments = re.sub(r"#.*?$", "", without_block, flags=re.MULTILINE)
    if _MUTATION_RE.search(without_comments):
        raise ValueError(
            "datahub_graphql_query is read-only; mutation/subscription operations are not allowed"
        )


def execute_graphql(
    query: str,
    variables: dict[str, Any] | str | None = None,
    *,
    cfg: DataHubToolConfig | None = None,
) -> dict[str, Any]:
    """POST a GraphQL query to DataHub ``/api/graphql`` (Bearer auth)."""
    _assert_query_only(query)
    config = cfg or tool_config.datahub
    payload = {
        "query": query.strip(),
        "variables": _normalize_variables(variables),
    }
    body = json.dumps(payload).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": f"Bearer {datahub_token(config)}",
    }
    request = urllib.request.Request(
        datahub_graphql_url(config),
        data=body,
        headers=headers,
        method="POST",
    )
    timeout = float(config.timeout_seconds)
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            raw = response.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace") if exc.fp else ""
        message = f"DataHub GraphQL HTTP {exc.code}: {detail or exc.reason}"
        raise DataHubGraphQLError(message) from exc
    except urllib.error.URLError as exc:
        raise DataHubGraphQLError(f"DataHub GraphQL connection failed: {exc.reason}") from exc

    try:
        parsed = json.loads(raw) if raw else {}
    except json.JSONDecodeError as exc:
        raise DataHubGraphQLError(f"DataHub GraphQL returned non-JSON body: {raw[:500]}") from exc

    if not isinstance(parsed, dict):
        raise DataHubGraphQLError(f"unexpected GraphQL response type: {type(parsed)!r}")

    errors = parsed.get("errors")
    if errors:
        raise DataHubGraphQLError(f"DataHub GraphQL errors: {json.dumps(errors, ensure_ascii=False)}")

    return {
        "data": parsed.get("data"),
        "extensions": parsed.get("extensions"),
    }

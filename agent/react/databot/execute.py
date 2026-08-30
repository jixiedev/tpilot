"""Execute the approved SQL after the second human gate.

This is a pure node: no LLM call. It reads ``approved_sql`` from state,
runs ``trino_run_query`` once, and writes the result back to
``execution_result``. The same Trino tools used everywhere enforce the
read-only SQL guard, so an accidentally approved ``DELETE`` is still
rejected by the warehouse layer.
"""

from __future__ import annotations

import logging
from collections.abc import Callable
from typing import Any

from agent.react.databot.state import DatabotState

logger = logging.getLogger(__name__)

DEFAULT_ROW_LIMIT = 100


def make_execute_sql_node(
    trino_run_query,
    row_limit: int = DEFAULT_ROW_LIMIT,
) -> Callable[[DatabotState], dict[str, Any]]:
    """Build the post-gate SQL execution node.

    ``trino_run_query`` is optional — if Trino is not configured the
    node records a no-warehouse error and still moves on to the
    ``chart`` stage so the rest of the pipeline keeps working.
    """

    def execute_sql(state: DatabotState) -> dict[str, Any]:
        sql = (state.get("approved_sql") or "").strip()
        if not sql:
            logger.warning("execute_sql called with empty approved_sql")
            return {
                "execution_result": {
                    "ok": False,
                    "error": "no approved SQL in state",
                },
                "stage": "chart",
            }
        if trino_run_query is None:
            return {
                "execution_result": {
                    "ok": False,
                    "error": "trino_run_query tool not available this turn",
                    "sql": sql,
                },
                "stage": "chart",
            }
        try:
            result = trino_run_query.invoke(
                {"sql": sql, "limit": row_limit}
            )
        except Exception as exc:  # tool-level guard or Trino failure
            logger.warning("trino_run_query failed: %s", exc)
            return {
                "execution_result": {
                    "ok": False,
                    "error": str(exc),
                    "sql": sql,
                },
                "stage": "chart",
            }
        if not isinstance(result, dict):
            result = {"ok": True, "raw": result}
        return {
            "execution_result": {**result, "ok": True, "sql": sql},
            "stage": "chart",
        }

    return execute_sql

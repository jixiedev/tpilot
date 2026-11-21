"""Warehouse gate tools: ``request_sql_approval`` (human review) and ``run_sql``.

The review is enforced here, not in the prompt. ``request_sql_approval``
pauses the run with a LangGraph ``interrupt`` and, on approval, records a
fingerprint of the exact SQL in ``approved_sql``. ``run_sql`` refuses any SQL
whose fingerprint is not there, so a model that skips the review, or edits the
SQL after it, cannot run anything.

Interrupt payload (the ``message`` is JSON, like databot's gates)::

    {"gate": "warehouse_sql", "question": ..., "sql": ..., "explanation": ...,
     "tables": [...], "options": ["approve", "revise", "stop"], "default": "approve"}

Resume value: ``{"decision": "approve" | "revise" | "stop", "sql": <edited>?,
"comments": ...?}`` or the decision as a plain string.
"""

from __future__ import annotations

import hashlib
import json
import logging
import re
from collections.abc import Callable
from typing import Any

from langchain_core.messages import AIMessage, ToolMessage
from langchain_core.tools import BaseTool, tool
from langgraph.prebuilt import ToolRuntime
from langgraph.types import Command, interrupt

from tahoepilot.tools.data.sql_guard import validate_select_sql

logger = logging.getLogger(__name__)

REQUEST_APPROVAL_TOOL = "request_sql_approval"
RUN_SQL_TOOL = "run_sql"
SQL_GATE = "warehouse_sql"
GATE_DECISIONS = ("approve", "revise", "stop")

#: Rows and characters of a result the model sees (the UI gets every fetched row).
MODEL_PREVIEW_ROWS = 50
MODEL_PREVIEW_CHARS = 8_000

QueryRunner = Callable[[str, int], dict[str, Any]]


def normalize_sql(sql: str) -> str:
    """SQL as it is approved and run: trimmed, no trailing semicolon."""
    return (sql or "").strip().rstrip(";").strip()


def sql_fingerprint(sql: str) -> str:
    """Identity of a query for approval: whitespace runs collapsed, otherwise exact."""
    canonical = re.sub(r"\s+", " ", normalize_sql(sql))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()[:20]


def _reply(tool_call_id: str, text: str, *, name: str, **update: Any) -> Command:
    message = ToolMessage(content=text, tool_call_id=tool_call_id, name=name)
    return Command(update={"messages": [message], **update})


def _state(runtime: ToolRuntime | None) -> dict[str, Any]:
    state = runtime.state if runtime is not None else {}
    return state if isinstance(state, dict) else {}


def _batch_calls(state: dict[str, Any]) -> list[dict[str, Any]]:
    for message in reversed(list(state.get("messages") or [])):
        if isinstance(message, AIMessage):
            return list(message.tool_calls or [])
    return []


def parse_gate_resume(resume: Any) -> tuple[str, str, str]:
    """``(decision, edited_sql, comments)`` from a resume value; unknown → ``revise``."""
    if isinstance(resume, str):
        text = resume.strip()
        if text.lower() in GATE_DECISIONS:
            return text.lower(), "", ""
        try:
            parsed = json.loads(text)
        except ValueError:
            # Free text is read as change requests.
            return "revise", "", text
        return parse_gate_resume(parsed) if not isinstance(parsed, str) else ("revise", "", parsed)
    if isinstance(resume, dict):
        decision = str(resume.get("decision") or "").strip().lower()
        if decision not in GATE_DECISIONS:
            decision = "revise"
        return decision, str(resume.get("sql") or ""), str(resume.get("comments") or "").strip()
    return "revise", "", ""


def gate_interrupt_value(sql: str, explanation: str, tables: list[str]) -> dict[str, Any]:
    payload = {
        "gate": SQL_GATE,
        "question": "Run this SQL against the warehouse?",
        "sql": sql,
        "explanation": explanation.strip(),
        "tables": tables,
        "options": list(GATE_DECISIONS),
        "default": "approve",
    }
    return {
        "id": "warehouse-sql-gate",
        "reason": "Review the SQL before it runs",
        "message": json.dumps(payload, ensure_ascii=False),
    }


def make_request_sql_approval_tool(*, gate_enabled: bool) -> BaseTool:
    @tool(REQUEST_APPROVAL_TOOL)
    def request_sql_approval(
        sql: str,
        explanation: str,
        tables: list[str] | None = None,
        runtime: ToolRuntime = None,  # type: ignore[assignment]
    ) -> Command:
        """Ask the user to review one read-only SQL query before it runs.

        ``sql``: the final SELECT/WITH query. ``explanation``: what it computes,
        from which tables, for which time range, in plain words for the
        reviewer. ``tables``: fully qualified tables used. Call this tool alone
        in its step. On approval, run exactly the approved SQL with ``run_sql``.
        """
        tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"
        state = _state(runtime)
        if len(_batch_calls(state)) > 1:
            return _reply(
                tool_call_id,
                "Not sent for review: call `request_sql_approval` alone in its step.",
                name=REQUEST_APPROVAL_TOOL,
            )
        try:
            query = validate_select_sql(normalize_sql(sql))
        except ValueError as exc:
            return _reply(tool_call_id, f"Not sent for review: {exc}", name=REQUEST_APPROVAL_TOOL)
        table_list = [str(t).strip() for t in (tables or []) if str(t).strip()]

        if gate_enabled:
            resume = interrupt(gate_interrupt_value(query, explanation or "", table_list))
            decision, edited, comments = parse_gate_resume(resume)
        else:
            decision, edited, comments = "approve", "", ""

        review = {"sql": query, "explanation": explanation or "", "tables": table_list}
        if decision == "stop":
            review.update(status="stopped", comments=comments)
            return _reply(
                tool_call_id,
                "The reviewer stopped this query. Do not run any SQL. Tell the user what "
                "you prepared and stop." + (f" Reviewer note: {comments}" if comments else ""),
                name=REQUEST_APPROVAL_TOOL,
                sql_review=review,
            )
        if decision == "revise":
            review.update(status="revise", comments=comments)
            return _reply(
                tool_call_id,
                "The reviewer asked for changes: "
                + (comments or "(no comment)")
                + "\nRevise the SQL and call `request_sql_approval` again.",
                name=REQUEST_APPROVAL_TOOL,
                sql_review=review,
            )

        final = query
        if edited.strip() and normalize_sql(edited) != query:
            try:
                final = validate_select_sql(normalize_sql(edited))
            except ValueError as exc:
                review.update(status="revise", comments=f"edited SQL rejected: {exc}")
                return _reply(
                    tool_call_id,
                    f"The reviewer's edited SQL is not a read-only query ({exc}). "
                    "Revise and request approval again.",
                    name=REQUEST_APPROVAL_TOOL,
                    sql_review=review,
                )
        approved = [*(state.get("approved_sql") or []), sql_fingerprint(final)]
        review.update(status="approved", sql=final, edited=final != query, comments=comments)
        note = " The reviewer edited it; use their version." if final != query else ""
        return _reply(
            tool_call_id,
            f"Approved.{note} Call `run_sql` with exactly this SQL:\n```sql\n{final}\n```"
            + (f"\nReviewer note: {comments}" if comments else ""),
            name=REQUEST_APPROVAL_TOOL,
            approved_sql=approved,
            sql_review=review,
        )

    return request_sql_approval


def _preview_text(result: dict[str, Any]) -> str:
    rows = list(result.get("rows") or [])
    shown: list[Any] = []
    used = 0
    for row in rows[:MODEL_PREVIEW_ROWS]:
        size = len(json.dumps(row, ensure_ascii=False, default=str))
        if shown and used + size > MODEL_PREVIEW_CHARS:
            break
        shown.append(row)
        used += size
    payload = {
        "columns": result.get("columns") or [],
        "row_count": result.get("row_count", len(rows)),
        "truncated": bool(result.get("truncated")),
        "rows": shown,
    }
    text = json.dumps(payload, ensure_ascii=False, default=str)
    if len(shown) < len(rows):
        text += f"\n(showing {len(shown)} of {len(rows)} fetched rows; the user sees all of them)"
    return text


def _default_runner(sql: str, limit: int) -> dict[str, Any]:
    from tahoepilot.tools.data.trino import _execute_query

    return _execute_query(sql, limit)


def make_run_sql_tool(*, row_limit: int, runner: QueryRunner | None = None) -> BaseTool:
    execute = runner or _default_runner

    @tool(RUN_SQL_TOOL)
    def run_sql(
        sql: str,
        runtime: ToolRuntime = None,  # type: ignore[assignment]
    ) -> Command:
        """Run SQL that the reviewer approved with ``request_sql_approval``.

        Pass exactly the approved SQL; any other SQL is refused.
        """
        tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"
        state = _state(runtime)
        query = normalize_sql(sql)
        if sql_fingerprint(query) not in set(state.get("approved_sql") or []):
            return _reply(
                tool_call_id,
                "Not run: this exact SQL has not been approved. Call "
                "`request_sql_approval` first; any edit needs a new approval.",
                name=RUN_SQL_TOOL,
            )
        try:
            result = execute(validate_select_sql(query), row_limit)
        except Exception as exc:  # noqa: BLE001 - the model fixes the SQL and asks again
            logger.info("warehouse run_sql failed: %s", exc)
            error = f"{type(exc).__name__}: {exc}"
            return _reply(
                tool_call_id,
                f"SQL failed: {error}\nFix the query and request approval again.",
                name=RUN_SQL_TOOL,
                execution={"sql": query, "error": error},
            )
        execution = {
            "sql": query,
            "columns": list(result.get("columns") or []),
            "rows": list(result.get("rows") or []),
            "row_count": int(result.get("row_count") or 0),
            "truncated": bool(result.get("truncated")),
        }
        return _reply(tool_call_id, _preview_text(result), name=RUN_SQL_TOOL, execution=execution)

    return run_sql

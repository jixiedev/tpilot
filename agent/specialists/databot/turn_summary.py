"""Final user-facing turn summary after the Databot pipeline completes."""

from __future__ import annotations

import json
import logging
import re
from collections.abc import Callable
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

from agent.listener import CliReactListener
from agent.specialists.databot._constants import STAGE_DONE
from agent.specialists.databot.prompts.turn_summary import TURN_SUMMARY_SYSTEM_PROMPT
from agent.specialists.databot.state import DatabotState
from agent.specialists.databot.ui_actions import user_question_from_messages
from graph.error_recovery import invoke_with_transient_retry
from graph.messages import (
    is_internal_assistant_narration,
    message_content_to_str,
    strip_think_blocks,
)

logger = logging.getLogger(__name__)

_MAX_ROWS_PREVIEW = 5


def _gate_revision_comments(audit: list[Any]) -> list[str]:
    comments: list[str] = []
    for entry in audit or []:
        if not isinstance(entry, dict):
            continue
        if entry.get("decision") != "deny-comments":
            continue
        text = str(entry.get("comments") or "").strip()
        if text:
            comments.append(text)
    return comments


def _card_names(cards: list[Any]) -> list[str]:
    names: list[str] = []
    for card in cards or []:
        if isinstance(card, dict) and card.get("name"):
            names.append(str(card["name"]))
    return names


def _execution_preview(result: dict[str, Any]) -> dict[str, Any]:
    if not result:
        return {}
    preview = dict(result)
    rows = preview.get("rows")
    if isinstance(rows, list) and len(rows) > _MAX_ROWS_PREVIEW:
        preview["rows"] = rows[:_MAX_ROWS_PREVIEW]
        preview["rows_truncated"] = True
    return preview


def build_turn_summary_context(state: DatabotState) -> str:
    """Serialize turn artifacts for the summary LLM call."""
    audit = state.get("gate_decisions") or []
    gate_lines = [
        (
            f"{entry.get('gate')}: {entry.get('decision')}"
            + (f" ({entry.get('comments')})" if entry.get("comments") else "")
        )
        for entry in audit
        if isinstance(entry, dict)
    ]
    payload = {
        "dryrun_preview_only": bool(state.get("dryrun")),
        "approved_models": _card_names(state.get("approved_cards") or []),
        "metric_conflicts": state.get("metric_conflicts") or [],
        "approved_sql": (state.get("approved_sql") or "").strip(),
        "sql_validated": bool(state.get("sql_validated")),
        "execution_result": _execution_preview(state.get("execution_result") or {}),
        "gate_decisions": gate_lines,
        "gate_revision_comments": _gate_revision_comments(audit),
    }
    return json.dumps(payload, ensure_ascii=False, indent=2)


def _looks_like_user_summary(text: str) -> bool:
    cleaned = strip_think_blocks(text)
    if not cleaned:
        return False
    if is_internal_assistant_narration(cleaned):
        return False
    if "<think>" in cleaned.lower():
        return False
    return True


def _extract_summary_text(response: AIMessage) -> str:
    """Prefer the user-facing channel; thinking models often leave ``content`` empty."""
    visible = strip_think_blocks(CliReactListener.message_text_content(response.content))
    if _looks_like_user_summary(visible):
        return visible

    reasoning = strip_think_blocks(CliReactListener.message_reasoning(response))
    if _looks_like_user_summary(reasoning):
        return reasoning
    return ""


def _row_count(result: dict[str, Any]) -> int | None:
    rows = result.get("rows")
    if isinstance(rows, list):
        return len(rows)
    for key in ("row_count", "n_rows", "total_rows"):
        value = result.get(key)
        if isinstance(value, int):
            return value
    return None


def build_fallback_turn_summary(state: DatabotState, question: str) -> str:
    """Artifact-based close when the summary model returns no user-facing prose."""
    chinese = bool(re.search(r"[\u4e00-\u9fff]", question))
    models = _card_names(state.get("approved_cards") or [])
    model_label = ", ".join(models) if models else ("所选模型" if chinese else "the selected models")
    result = state.get("execution_result") or {}
    ok = bool(result.get("ok"))
    error = str(result.get("error") or "").strip()
    n_rows = _row_count(result)
    dryrun = bool(state.get("dryrun"))

    if chinese:
        lines = [f"已根据你的问题跑完查询，使用模型：{model_label}。"]
        if dryrun:
            lines.append("这是预览，没有写入 profile。")
        if ok and n_rows is not None:
            lines.append(f"结果共 {n_rows} 行，请看右侧 Results。")
        elif ok:
            lines.append("查询已执行，请看右侧 Results。")
        elif error:
            lines.append(f"查询没有跑成：{error}")
        else:
            lines.append("本轮没有可展示的查询结果。")
        return "\n".join(lines)

    lines = [f"I finished the query using {model_label}."]
    if dryrun:
        lines.append("This was a preview; no profile artifact was saved.")
    if ok and n_rows is not None:
        lines.append(f"{n_rows} row(s) are in the Results tab.")
    elif ok:
        lines.append("The query ran; see the Results tab.")
    elif error:
        lines.append(f"The query did not run: {error}")
    else:
        lines.append("This turn has no query result to show.")
    return "\n".join(lines)


def make_turn_summary_node(
    model: BaseChatModel,
) -> Callable[[DatabotState], dict[str, Any]]:
    """Build the graph node that writes the final user-visible turn summary."""

    def end_with_summary(state: DatabotState) -> dict[str, Any]:
        messages = list(state.get("messages") or [])
        question = user_question_from_messages(messages)
        context = build_turn_summary_context(state)
        prompt_messages = [
            SystemMessage(content=TURN_SUMMARY_SYSTEM_PROMPT),
            HumanMessage(
                content=(
                    f"User question:\n{question or '(not found in messages)'}\n\n"
                    f"Turn artifacts (JSON):\n{context}"
                )
            ),
        ]
        text = ""
        try:
            response = invoke_with_transient_retry(lambda: model.invoke(prompt_messages))
            if isinstance(response, AIMessage):
                text = _extract_summary_text(response)
            else:
                text = strip_think_blocks(
                    message_content_to_str(getattr(response, "content", response))
                )
                if not _looks_like_user_summary(text):
                    text = ""
        except Exception as exc:
            logger.warning("turn summary LLM call failed: %s", exc)

        if not text:
            text = build_fallback_turn_summary(state, question)

        return {
            "messages": [AIMessage(content=text)],
            "stage": STAGE_DONE,
        }

    return end_with_summary

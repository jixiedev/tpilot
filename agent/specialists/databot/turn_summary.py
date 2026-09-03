"""Final user-facing turn summary after the Databot pipeline completes."""

from __future__ import annotations

import json
import logging
from collections.abc import Callable
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

from agent.specialists.databot._constants import STAGE_DONE
from agent.specialists.databot.prompts.turn_summary import TURN_SUMMARY_SYSTEM_PROMPT
from agent.specialists.databot.state import DatabotState
from graph.error_recovery import invoke_with_transient_retry
from graph.messages import message_content_to_str

logger = logging.getLogger(__name__)

_MAX_ROWS_PREVIEW = 5


def _last_user_question(messages: list[Any]) -> str:
    for msg in reversed(messages or []):
        if isinstance(msg, HumanMessage):
            text = message_content_to_str(msg.content)
            if text:
                return text
        if isinstance(msg, dict) and msg.get("type") == "human":
            text = message_content_to_str(msg.get("content", ""))
            if text:
                return text
    return ""


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
    }
    return json.dumps(payload, ensure_ascii=False, indent=2)


def _summary_already_delivered(messages: list[Any]) -> bool:
    if not messages:
        return False
    last = messages[-1]
    if isinstance(last, AIMessage) and not getattr(last, "tool_calls", None):
        return bool(message_content_to_str(last.content))
    return False


def _extract_summary_text(response: AIMessage) -> str:
    tool_calls = getattr(response, "tool_calls", None) or []
    for call in tool_calls:
        if call.get("name") == "chat_completion":
            reply = call.get("args", {}).get("reply")
            if reply is not None:
                return message_content_to_str(reply)
    return message_content_to_str(response.content)


def make_turn_summary_node(
    model: BaseChatModel,
) -> Callable[[DatabotState], dict[str, Any]]:
    """Build the graph node that writes the final user-visible turn summary."""

    def end_with_summary(state: DatabotState) -> dict[str, Any]:
        messages = list(state.get("messages") or [])
        if _summary_already_delivered(messages):
            return {"stage": STAGE_DONE}

        question = _last_user_question(messages)
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
        try:
            response = invoke_with_transient_retry(lambda: model.invoke(prompt_messages))
        except Exception as exc:
            logger.warning("turn summary LLM call failed: %s", exc)
            return {"stage": STAGE_DONE}

        if not isinstance(response, AIMessage):
            text = message_content_to_str(getattr(response, "content", response))
        else:
            text = _extract_summary_text(response)

        if not text:
            return {"stage": STAGE_DONE}

        return {"messages": [AIMessage(content=text)], "stage": STAGE_DONE}

    return end_with_summary

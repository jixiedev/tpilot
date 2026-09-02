"""Outer-graph nodes between stage subgraphs and human gates."""

from __future__ import annotations

import logging
from collections.abc import Callable
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import AIMessage, BaseMessage, SystemMessage

from agent.react.databot._constants import STAGE_GATE_CARDS
from agent.react.databot.gate_defaults import default_gate_reasons, merge_gate_reasons
from agent.react.databot.prompts.gate_prep import PREPARE_CARDS_FOR_GATE_PROMPT
from agent.react.databot.stage_tools import _coerce_gate_reasons
from agent.react.databot.state import DatabotState
from graph.error_recovery import invoke_with_transient_retry
from graph.messages import message_content_to_str, sanitize_messages_for_strict_tool_providers

logger = logging.getLogger(__name__)


def _parse_reasons_from_response(response: AIMessage) -> dict[str, str]:
    tool_calls = getattr(response, "tool_calls", None) or []
    for call in tool_calls:
        if call.get("name") == "chat_completion":
            reply = call.get("args", {}).get("reply")
            if reply is not None:
                text = message_content_to_str(reply)
                if text:
                    coerced = _coerce_gate_reasons(text)
                    if coerced:
                        return coerced

    text = message_content_to_str(response.content)
    if not text:
        return {}
    coerced = _coerce_gate_reasons(text)
    if coerced:
        return coerced
    if "\n" in text:
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        coerced = _coerce_gate_reasons(lines)
        if coerced:
            return coerced
    return _coerce_gate_reasons(text)


def _review_cards_from_committed(state: DatabotState) -> list[dict[str, Any]]:
    return [
        dict(card)
        for card in (state.get("committed_cards") or [])
        if isinstance(card, dict)
    ]


def make_prepare_cards_for_gate_node(
    model: BaseChatModel,
) -> Callable[[DatabotState], dict[str, Any]]:
    """Copy committed cards and ask the model for cards-gate reasons using full history."""

    def prepare_cards_for_gate(state: DatabotState) -> dict[str, Any]:
        review = _review_cards_from_committed(state)
        history: list[BaseMessage] = list(state.get("messages") or [])
        prompt_messages = sanitize_messages_for_strict_tool_providers(
            history + [SystemMessage(content=PREPARE_CARDS_FOR_GATE_PROMPT)]
        )

        reasons = default_gate_reasons("cards")
        try:
            response = invoke_with_transient_retry(lambda: model.invoke(prompt_messages))
            if isinstance(response, AIMessage):
                parsed = _parse_reasons_from_response(response)
                reasons = merge_gate_reasons("cards", parsed)
        except Exception as exc:
            logger.warning("prepare_cards_for_gate LLM call failed: %s", exc)

        return {
            "review_cards": review,
            "deny_feedback": "",
            "cards_reasons": reasons,
            "stage": STAGE_GATE_CARDS,
        }

    return prepare_cards_for_gate

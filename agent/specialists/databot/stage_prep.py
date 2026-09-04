"""Outer-graph nodes between stage subgraphs and human gates."""

from __future__ import annotations

import json
import logging
from collections.abc import Callable
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

from agent.specialists.databot._constants import STAGE_GATE_CARDS
from agent.specialists.databot.gate_defaults import (
    build_cards_selection_summary,
    default_gate_reasons,
    merge_gate_reasons,
)
from agent.specialists.databot.prompts.gate_prep import PREPARE_CARDS_FOR_GATE_PROMPT
from agent.specialists.databot.stage_tools import _coerce_gate_reasons
from agent.specialists.databot.state import DatabotState
from agent.specialists.databot.ui_actions import user_question_from_messages
from graph.error_recovery import invoke_with_transient_retry
from graph.messages import message_content_to_str

logger = logging.getLogger(__name__)


def _parse_reasons_from_response(response: AIMessage) -> dict[str, str]:
    text = message_content_to_str(response.content)
    if not text:
        return {}
    return _coerce_gate_reasons(text)


def _review_cards_from_committed(state: DatabotState) -> list[dict[str, Any]]:
    return [
        dict(card)
        for card in (state.get("committed_cards") or [])
        if isinstance(card, dict)
    ]


def _cards_gate_brief(state: DatabotState, review: list[dict[str, Any]]) -> str:
    """Compact facts for gate-copy generation — not the full chat history."""
    cards: list[dict[str, Any]] = []
    for card in review:
        cards.append(
            {
                "name": card.get("name"),
                "selected_metrics": card.get("selected_metrics") or [],
                "selected_dimensions": card.get("selected_dimensions") or [],
                "selection_notes": (card.get("selection_notes") or "")[:240],
            }
        )
    payload = {
        "user_question": user_question_from_messages(state.get("messages") or []),
        "committed_models": cards,
        "metric_conflicts": state.get("metric_conflicts") or [],
        "gate_redraft_feedback": (state.get("deny_feedback") or "").strip(),
    }
    return json.dumps(payload, ensure_ascii=False, indent=2)


def make_prepare_cards_for_gate_node(
    model: BaseChatModel,
) -> Callable[[DatabotState], dict[str, Any]]:
    """Copy committed cards and ask the model for per-option gate persuasion copy."""

    def prepare_cards_for_gate(state: DatabotState) -> dict[str, Any]:
        review = _review_cards_from_committed(state)
        prompt_messages = [
            SystemMessage(content=PREPARE_CARDS_FOR_GATE_PROMPT),
            HumanMessage(
                content=(
                    "Write the four gate-option reasons for this selection.\n\n"
                    f"{_cards_gate_brief(state, review)}"
                )
            ),
        ]

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
            "cards_selection_summary": build_cards_selection_summary(review),
            "stage": STAGE_GATE_CARDS,
        }

    return prepare_cards_for_gate

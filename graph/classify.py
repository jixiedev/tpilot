"""Per-turn task classification for optional ReAct graph routing."""

from __future__ import annotations

import logging
from collections.abc import Callable
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel, Field

from graph.error_recovery import invoke_with_transient_retry
from state.state import DEFAULT_TURN_TASK_TYPE, SessionAgentState, TurnTaskType

logger = logging.getLogger(__name__)

DEFAULT_MIN_CLASSIFY_CONFIDENCE = 0.5


class TurnClassification(BaseModel):
    """Structured label for the current user request."""

    turn_task_type: TurnTaskType
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)


def latest_human_text(state: SessionAgentState) -> str | None:
    """Return text from the most recent human message, if any."""
    for message in reversed(state.get("messages") or []):
        if getattr(message, "type", None) != "human":
            continue
        content = message.content
        if isinstance(content, str):
            text = content.strip()
            return text or None
        if isinstance(content, list):
            parts: list[str] = []
            for block in content:
                if isinstance(block, str) and block.strip():
                    parts.append(block.strip())
                elif isinstance(block, dict) and block.get("text"):
                    parts.append(str(block["text"]).strip())
            text = "\n".join(p for p in parts if p)
            return text or None
        text = str(content).strip()
        return text or None
    return None


def resolve_turn_task_type(
    result: TurnClassification,
    *,
    min_confidence: float = DEFAULT_MIN_CLASSIFY_CONFIDENCE,
) -> TurnTaskType:
    """Map model output to a stored type; low confidence becomes unclear."""
    if result.confidence < min_confidence:
        return DEFAULT_TURN_TASK_TYPE
    return result.turn_task_type


def make_classify_task_node(
    classify_prompt: str,
    model: BaseChatModel,
    *,
    min_confidence: float = DEFAULT_MIN_CLASSIFY_CONFIDENCE,
) -> Callable[[SessionAgentState], dict[str, Any]]:
    """Classify the latest user request; writes ``turn_task_type`` only (no messages)."""

    structured_model = model.with_structured_output(TurnClassification)

    def classify_task(state: SessionAgentState) -> dict[str, Any]:
        user_text = latest_human_text(state)
        if not user_text:
            logger.warning("no human message to classify; defaulting to %s", DEFAULT_TURN_TASK_TYPE)
            return {"turn_task_type": DEFAULT_TURN_TASK_TYPE}

        messages = [
            SystemMessage(content=classify_prompt),
            HumanMessage(content=user_text),
        ]
        result = invoke_with_transient_retry(lambda: structured_model.invoke(messages))
        if not isinstance(result, TurnClassification):
            # Some providers return a dict when structured parsing is partial.
            result = TurnClassification.model_validate(result)
        turn_task_type = resolve_turn_task_type(result, min_confidence=min_confidence)
        logger.info(
            "classified turn_task_type=%s confidence=%.2f",
            turn_task_type,
            result.confidence,
        )
        return {"turn_task_type": turn_task_type}

    return classify_task

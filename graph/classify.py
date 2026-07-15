"""Per-turn task classification for optional ReAct graph routing."""

from __future__ import annotations

import json
import logging
import re
from collections.abc import Callable
from typing import Any, TypeAlias

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel, Field, ValidationError

from graph.error_recovery import invoke_with_transient_retry
from state.state import DEFAULT_TURN_TASK_TYPE, SessionAgentState, TurnTaskType

logger = logging.getLogger(__name__)

DEFAULT_MIN_CLASSIFY_CONFIDENCE = 0.5

VALID_TURN_TASK_TYPES: frozenset[str] = frozenset(
    {"table_meta", "metric_def", "data_query", "anomaly", "other", "unclear"}
)

ClassifyTaskListener: TypeAlias = Callable[
    [TurnTaskType, float | None, TurnTaskType | None],
    None,
]


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


def _normalize_turn_task_type(raw: str) -> TurnTaskType:
    label = raw.strip().lower()
    if label in VALID_TURN_TASK_TYPES:
        return label  # type: ignore[return-value]
    for candidate in VALID_TURN_TASK_TYPES:
        if candidate in label:
            return candidate  # type: ignore[return-value]
    return DEFAULT_TURN_TASK_TYPE


def _parse_confidence(raw: str) -> float:
    try:
        value = float(raw.strip())
    except ValueError:
        return 1.0
    return max(0.0, min(1.0, value))


def coerce_turn_classification(raw: Any) -> TurnClassification:
    """Parse structured, dict, JSON, or loose text (e.g. ``data_query\\n1``) payloads."""
    if isinstance(raw, TurnClassification):
        return raw
    if isinstance(raw, dict):
        return TurnClassification.model_validate(raw)
    if hasattr(raw, "content"):
        return coerce_turn_classification(getattr(raw, "content"))

    if not isinstance(raw, str):
        raise TypeError(f"unsupported classification payload: {type(raw)!r}")

    text = raw.strip()
    if not text:
        raise ValueError("empty classification text")

    if text.startswith("{"):
        return TurnClassification.model_validate(json.loads(text))

    # JSON embedded in prose or markdown fences.
    fence_match = re.search(r"\{[^{}]*\}", text, flags=re.DOTALL)
    if fence_match:
        try:
            return TurnClassification.model_validate(json.loads(fence_match.group(0)))
        except (json.JSONDecodeError, ValidationError):
            pass

    lines = [line.strip() for line in text.splitlines() if line.strip()]
    label_source = lines[0] if lines else text
    confidence = 1.0
    if len(lines) > 1:
        confidence = _parse_confidence(lines[1])
    else:
        tokens = label_source.split()
        if len(tokens) >= 2 and _normalize_turn_task_type(tokens[0]) != DEFAULT_TURN_TASK_TYPE:
            label_source = tokens[0]
            confidence = _parse_confidence(tokens[1])

    return TurnClassification(
        turn_task_type=_normalize_turn_task_type(label_source),
        confidence=confidence,
    )


def resolve_turn_task_type(
    result: TurnClassification,
    *,
    min_confidence: float = DEFAULT_MIN_CLASSIFY_CONFIDENCE,
) -> TurnTaskType:
    """Map model output to a stored type; low confidence becomes unclear."""
    if result.confidence < min_confidence:
        return DEFAULT_TURN_TASK_TYPE
    return result.turn_task_type


def _invoke_classification(
    model: BaseChatModel,
    messages: list,
) -> TurnClassification:
    """Call the model; tolerate providers that return loose text instead of JSON."""
    structured_model = model.with_structured_output(TurnClassification)
    try:
        result = invoke_with_transient_retry(lambda: structured_model.invoke(messages))
        return coerce_turn_classification(result)
    except (ValidationError, json.JSONDecodeError, TypeError, ValueError) as exc:
        logger.warning("structured turn classification failed (%s); falling back to plain parse", exc)

    response = invoke_with_transient_retry(lambda: model.invoke(messages))
    return coerce_turn_classification(response)


def _notify_classify(
    listener: ClassifyTaskListener | None,
    *,
    resolved: TurnTaskType,
    confidence: float | None = None,
    model_label: TurnTaskType | None = None,
) -> None:
    if listener is None:
        return
    listener(resolved, confidence, model_label)


def make_classify_task_node(
    classify_prompt: str,
    model: BaseChatModel,
    *,
    min_confidence: float = DEFAULT_MIN_CLASSIFY_CONFIDENCE,
    on_classify: ClassifyTaskListener | None = None,
) -> Callable[[SessionAgentState], dict[str, Any]]:
    """Classify the latest user request; writes ``turn_task_type`` only (no messages)."""

    json_hint = (
        'Respond with JSON only: {"turn_task_type": "<label>", "confidence": <0.0-1.0>}.'
    )
    system_prompt = f"{classify_prompt.strip()}\n\n{json_hint}"

    def classify_task(state: SessionAgentState) -> dict[str, Any]:
        user_text = latest_human_text(state)
        if not user_text:
            logger.warning("no human message to classify; defaulting to %s", DEFAULT_TURN_TASK_TYPE)
            _notify_classify(on_classify, resolved=DEFAULT_TURN_TASK_TYPE)
            return {"turn_task_type": DEFAULT_TURN_TASK_TYPE}

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_text),
        ]
        try:
            result = _invoke_classification(model, messages)
        except Exception as exc:
            logger.warning("turn classification failed (%s); defaulting to %s", exc, DEFAULT_TURN_TASK_TYPE)
            _notify_classify(on_classify, resolved=DEFAULT_TURN_TASK_TYPE)
            return {"turn_task_type": DEFAULT_TURN_TASK_TYPE}

        turn_task_type = resolve_turn_task_type(result, min_confidence=min_confidence)
        model_label = result.turn_task_type if turn_task_type != result.turn_task_type else None
        logger.info(
            "classified turn_task_type=%s confidence=%.2f",
            turn_task_type,
            result.confidence,
        )
        _notify_classify(
            on_classify,
            resolved=turn_task_type,
            confidence=result.confidence,
            model_label=model_label,
        )
        return {"turn_task_type": turn_task_type}

    return classify_task

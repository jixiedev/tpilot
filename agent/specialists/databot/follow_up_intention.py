"""Follow-up intention classification for the Databot outer graph."""

from __future__ import annotations

import json
import logging
import re
from collections.abc import Callable
from typing import Any, Literal

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel, Field, ValidationError

from agent.specialists.databot._constants import (
    FOLLOW_UP_INTENTION_KNOWLEDGE,
    FOLLOW_UP_INTENTION_REQUERY,
    STAGE_FETCH,
)
from agent.specialists.databot.prompts.follow_up import CLASSIFY_FOLLOW_UP_SYSTEM_PROMPT
from agent.specialists.databot.state import DatabotState, fresh_pipeline_state_defaults
from graph.error_recovery import invoke_with_transient_retry
from state.state import latest_human_text, message_text

logger = logging.getLogger(__name__)

FollowUpIntention = Literal["knowledge", "requery"]


class FollowUpIntentionResponse(BaseModel):
    intention: FollowUpIntention
    reason: str = Field(default="")


def _conversation_context(messages: list[Any], *, max_turns: int = 6) -> str:
    """Serialize recent human/AI turns for the classifier."""
    lines: list[str] = []
    for message in messages or []:
        msg_type = getattr(message, "type", None)
        if isinstance(message, dict):
            msg_type = message.get("type")
        if msg_type not in {"human", "ai"}:
            continue
        role = "User" if msg_type == "human" else "Assistant"
        text = message_text(
            message.get("content") if isinstance(message, dict) else getattr(message, "content", "")
        )
        if text:
            lines.append(f"{role}: {text}")
    if len(lines) > max_turns * 2:
        lines = lines[-(max_turns * 2) :]
    return "\n".join(lines) if lines else "(no prior messages)"


def _parse_follow_up_intention(text: str) -> FollowUpIntentionResponse:
    stripped = text.strip()
    if stripped.startswith("{"):
        return FollowUpIntentionResponse.model_validate(json.loads(stripped))
    fence = re.search(r"\{[^{}]*\}", stripped, flags=re.DOTALL)
    if fence:
        try:
            return FollowUpIntentionResponse.model_validate(json.loads(fence.group(0)))
        except (json.JSONDecodeError, ValidationError):
            pass
    lower = stripped.lower()
    if "knowledge" in lower:
        return FollowUpIntentionResponse(intention=FOLLOW_UP_INTENTION_KNOWLEDGE, reason=stripped)
    if "requery" in lower:
        return FollowUpIntentionResponse(intention=FOLLOW_UP_INTENTION_REQUERY, reason=stripped)
    raise ValueError(f"could not parse follow-up intention from: {text!r}")


def coerce_follow_up_intention(raw: Any) -> FollowUpIntentionResponse:
    if isinstance(raw, FollowUpIntentionResponse):
        return raw
    if isinstance(raw, dict):
        return FollowUpIntentionResponse.model_validate(raw)
    if hasattr(raw, "content"):
        return coerce_follow_up_intention(getattr(raw, "content"))
    if isinstance(raw, str):
        return _parse_follow_up_intention(raw)
    raise TypeError(f"unsupported follow-up intention payload: {type(raw)!r}")


def make_classify_follow_up_node(
    model: BaseChatModel,
) -> Callable[[DatabotState], dict[str, Any]]:
    """Classify a follow-up turn as knowledge clarification or a fresh data query."""

    def classify_follow_up(state: DatabotState) -> dict[str, Any]:
        if not state.get("follow_up_turn"):
            return {"follow_up_intention": FOLLOW_UP_INTENTION_REQUERY}

        question = latest_human_text(state) or ""
        if not question.strip():
            return {
                "follow_up_intention": FOLLOW_UP_INTENTION_REQUERY,
                "follow_up_turn": False,
            }
        context = _conversation_context(state.get("messages") or [])
        prompt_messages = [
            SystemMessage(content=CLASSIFY_FOLLOW_UP_SYSTEM_PROMPT),
            HumanMessage(
                content=(
                    f"Recent conversation:\n{context}\n\n"
                    f"Latest user message to classify:\n{question}"
                )
            ),
        ]
        try:
            response = invoke_with_transient_retry(lambda: model.invoke(prompt_messages))
            parsed = coerce_follow_up_intention(response)
            intention = parsed.intention
        except Exception as exc:
            logger.warning("follow-up intention classification failed: %s", exc)
            intention = FOLLOW_UP_INTENTION_REQUERY

        patch: dict[str, Any] = {"follow_up_intention": intention}
        if intention == FOLLOW_UP_INTENTION_REQUERY:
            patch.update(fresh_pipeline_state_defaults(stage=STAGE_FETCH))
        return patch

    return classify_follow_up

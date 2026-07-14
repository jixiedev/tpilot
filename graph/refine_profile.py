"""End-of-turn user profile refinement node."""

from __future__ import annotations

import logging
from collections.abc import Callable
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage

from graph.classify import latest_human_text
from graph.error_recovery import invoke_with_transient_retry
from memory.profile import UserProfile, coerce_user_profile, merge_user_profile
from state.state import SessionAgentState

logger = logging.getLogger(__name__)


def _latest_chat_completion_reply(state: SessionAgentState) -> str | None:
    for message in reversed(state.get("messages") or []):
        if isinstance(message, ToolMessage) and message.name == "chat_completion":
            content = message.content
            if isinstance(content, str):
                return content
            return str(content)
    return None


def make_refine_user_profile_node(
    refine_prompt: str,
    model: BaseChatModel,
) -> Callable[[SessionAgentState], dict[str, Any]]:
    """After a finished turn, extract profile updates; writes ``user_profile`` only."""

    structured_model = model.with_structured_output(UserProfile)

    def refine_user_profile(state: SessionAgentState) -> dict[str, Any]:
        current = coerce_user_profile(state.get("user_profile"))
        user_text = latest_human_text(state) or ""
        reply = _latest_chat_completion_reply(state) or ""

        messages = [
            SystemMessage(content=refine_prompt),
            HumanMessage(
                content=(
                    "Current user profile JSON:\n"
                    f"{current.model_dump_json(indent=2)}\n\n"
                    f"Latest user request:\n{user_text}\n\n"
                    f"Assistant final reply this turn:\n{reply}\n\n"
                    "Return an updated UserProfile. Fill only fields supported by evidence "
                    "in this turn; leave unknown fields empty so existing values are kept."
                )
            ),
        ]
        raw = invoke_with_transient_retry(lambda: structured_model.invoke(messages))
        update = raw if isinstance(raw, UserProfile) else UserProfile.model_validate(raw)
        merged = merge_user_profile(current, update)
        logger.info(
            "refined user_profile user_id=%s role=%s metrics=%s",
            merged.user_id,
            merged.role,
            merged.favorite_metrics,
        )
        return {"user_profile": merged}

    return refine_user_profile

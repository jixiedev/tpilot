"""End-of-turn user profile refinement for ReAct agents."""

from __future__ import annotations

import getpass
import json
import logging
from collections.abc import Callable
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
from pydantic import ValidationError

from graph.error_recovery import invoke_with_transient_retry
from memory.profile import UserProfile, merge_user_profile, parse_user_profile_update
from memory.profile_store import ProfileStore
from state.state import SessionAgentState, latest_human_text

logger = logging.getLogger(__name__)

_PROFILE_JSON_HINT = (
    "Respond with JSON only: a single UserProfile object with keys matching the schema "
    "(no markdown fences or commentary)."
)


def _latest_completion_reply(
    state: SessionAgentState,
    *,
    completion_tool_name: str,
) -> str | None:
    for message in reversed(state.get("messages") or []):
        if isinstance(message, ToolMessage) and message.name == completion_tool_name:
            content = message.content
            if isinstance(content, str):
                return content
            return str(content)
    return None


def _session_user_id(state: SessionAgentState) -> str:
    user_id = state.get("user_id", "")
    return user_id.strip() if isinstance(user_id, str) and user_id.strip() else getpass.getuser()


def _invoke_profile_update(model: BaseChatModel, messages: list) -> UserProfile:
    """Call the model; tolerate providers that return fenced or loose JSON."""
    structured_model = model.with_structured_output(UserProfile)
    try:
        result = invoke_with_transient_retry(lambda: structured_model.invoke(messages))
        return parse_user_profile_update(result)
    except (ValidationError, json.JSONDecodeError, TypeError, ValueError) as exc:
        logger.warning("structured profile refine failed (%s); falling back to plain parse", exc)

    response = invoke_with_transient_retry(lambda: model.invoke(messages))
    return parse_user_profile_update(response)


def make_refine_user_profile_node(
    refine_prompt: str,
    model: BaseChatModel,
    profile_store: ProfileStore,
    *,
    completion_tool_name: str = "chat_completion",
) -> Callable[[SessionAgentState], dict[str, Any]]:
    """After a finished turn, merge profile updates into ``ProfileStore`` (not session state).

    Profile refinement is best-effort: parse or persistence failures are logged and the
    turn still completes so the completion-tool reply remains visible to the user.
    """

    system_prompt = f"{refine_prompt.strip()}\n\n{_PROFILE_JSON_HINT}"

    def refine_user_profile(state: SessionAgentState) -> dict[str, Any]:
        user_id = _session_user_id(state)
        current = profile_store.load(user_id)
        user_text = latest_human_text(state) or ""
        reply = _latest_completion_reply(
            state,
            completion_tool_name=completion_tool_name,
        ) or ""

        messages = [
            SystemMessage(content=system_prompt),
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
        try:
            update = _invoke_profile_update(model, messages)
            merged = merge_user_profile(current, update)
            profile_store.save(user_id, merged)
            logger.info(
                "refined user_profile user_id=%s role=%s metrics=%s",
                merged.user_id,
                merged.role,
                merged.favorite_metrics,
            )
        except Exception as exc:
            logger.warning("user profile refine skipped (%s)", exc)
        return {}

    return refine_user_profile

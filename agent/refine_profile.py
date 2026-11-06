"""End-of-turn user profile refinement for ReAct agents."""

from __future__ import annotations

import json
import logging
from collections.abc import Callable
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import ValidationError

from agent.turn import AgentTurnResult
from graph.error_recovery import invoke_with_transient_retry
from memory.profile import UserProfile, merge_user_profile, parse_user_profile_update
from memory.profile_store import ProfileStore
from graph.state import SessionAgentState, latest_human_text

logger = logging.getLogger(__name__)

_PROFILE_JSON_HINT = (
    "Respond with JSON only: a single UserProfile object with keys matching the schema "
    "(no markdown fences or commentary)."
)


class UserProfileRefiner:
    """Best-effort profile merge after a finished turn."""

    def __init__(
        self,
        refine_prompt: str,
        model: BaseChatModel,
        profile_store: ProfileStore,
    ) -> None:
        self._refine_prompt = refine_prompt
        self._model = model
        self._profile_store = profile_store

    def _invoke_update(self, messages: list) -> UserProfile:
        structured_model = self._model.with_structured_output(UserProfile)
        try:
            result = invoke_with_transient_retry(lambda: structured_model.invoke(messages))
            return parse_user_profile_update(result)
        except (ValidationError, json.JSONDecodeError, TypeError, ValueError) as exc:
            logger.warning("structured profile refine failed (%s); falling back to plain parse", exc)

        response = invoke_with_transient_retry(lambda: self._model.invoke(messages))
        return parse_user_profile_update(response)

    def run(self, state: SessionAgentState) -> None:
        """Merge evidence from this turn into the stored user profile."""
        system_prompt = f"{self._refine_prompt.strip()}\n\n{_PROFILE_JSON_HINT}"
        user_id = self._profile_store.resolve_user_id(prior=state.get("user_id"))
        current = self._profile_store.load(user_id)
        user_text = latest_human_text(state) or ""
        reply = AgentTurnResult.last_user_visible_reply(state) or ""

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
            update = self._invoke_update(messages)
            merged = merge_user_profile(current, update)
            self._profile_store.save(user_id, merged)
            logger.info(
                "refined user_profile user_id=%s role=%s metrics=%s",
                merged.user_id,
                merged.role,
                merged.favorite_metrics,
            )
        except Exception as exc:
            logger.warning("user profile refine skipped (%s)", exc)

    def as_node(self) -> Callable[[SessionAgentState], dict[str, Any]]:
        """LangGraph node wrapper around ``run``."""

        def refine_user_profile(state: SessionAgentState) -> dict[str, Any]:
            self.run(state)
            return {}

        return refine_user_profile

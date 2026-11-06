"""Intent orchestrator: classify a request and route it to one registered agent.

Every routable agent (specialists and Plan) declares an ``intention`` label in
its config; the classifier picks one label and the request is handed to that
agent. Plan is chosen like any specialist, for requests that need several.
"""

from __future__ import annotations

import json
import logging
import re
from collections.abc import Callable, Sequence
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import CompiledStateGraph
from langgraph.types import interrupt
from pydantic import BaseModel, Field, field_validator, model_validator, ValidationError

from agent.agent import BaseAgent
from agent.catalog import AgentCatalog, AgentCatalogSettings
from agent.intent.prompt import IntentSystemPrompt
from agent.listener import AgentListener, ListenerHub
from agent.turn_messages import DefaultTurnMessagePolicy
from config.agent_config import IntentAgentConfig
from agent.session import SpecialistSession
from agent.turn import AgentTurnResult, OnInterrupt
from graph.error_recovery import invoke_with_transient_retry
from memory.session_runtime import SessionRuntime
from graph.state import (
    DEFAULT_INTENTION_STATUS,
    DEFAULT_USER_INTENTION,
    IntentionState,
    latest_human_text,
)

logger = logging.getLogger(__name__)

PLAN_INTENTION = "PLAN"
"""Label Plan declares; used when the classifier returns several labels."""


class IntentionResponse(BaseModel):
    """Structured LLM output for intent detection."""

    user_intentions: list[str] = Field(default_factory=list)
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    need_clarification: str = ""

    @model_validator(mode="before")
    @classmethod
    def _coerce_legacy_fields(cls, data: Any) -> Any:
        if not isinstance(data, dict):
            return data
        payload = dict(data)
        if "user_intentions" not in payload and "user_intention" in payload:
            raw = payload.pop("user_intention")
            if isinstance(raw, str):
                text = raw.strip()
                payload["user_intentions"] = [text] if text else []
            elif isinstance(raw, list):
                payload["user_intentions"] = raw
        intentions = payload.get("user_intentions")
        if isinstance(intentions, str):
            text = intentions.strip()
            payload["user_intentions"] = [text] if text else []
        return payload

    @field_validator("user_intentions")
    @classmethod
    def _normalize_intentions(cls, value: list[str]) -> list[str]:
        normalized: list[str] = []
        for item in value or []:
            label = str(item).strip().upper()
            if label:
                normalized.append(label)
        return normalized

    @property
    def user_intention(self) -> str:
        """Primary intention (first label) for display and legacy callers."""
        return self.user_intentions[0] if self.user_intentions else DEFAULT_USER_INTENTION

    @classmethod
    def parse_text(cls, text: str, allowed: frozenset[str]) -> IntentionResponse:
        if text.startswith("{"):
            return cls.model_validate(json.loads(text))

        fence_match = re.search(r"\{[^{}]*\}", text, flags=re.DOTALL)
        if fence_match:
            try:
                return cls.model_validate(json.loads(fence_match.group(0)))
            except (json.JSONDecodeError, ValidationError):
                pass

        upper = text.upper()
        for label in sorted(allowed, key=len, reverse=True):
            if re.search(rf"\b{re.escape(label)}\b", upper):
                return cls(
                    user_intentions=[label],
                    confidence=0.5,
                    need_clarification="",
                )
        raise ValueError(f"could not parse intention from: {text!r}")

    @classmethod
    def coerce(
        cls,
        raw: Any,
        *,
        allowed: frozenset[str] | None = None,
    ) -> IntentionResponse:
        """Parse structured, dict, JSON, or loose text intention payloads."""
        if allowed is None:
            allowed = AgentCatalog.routable_intentions()

        if isinstance(raw, cls):
            result = raw
        elif isinstance(raw, dict):
            result = cls.model_validate(raw)
        elif hasattr(raw, "content"):
            return cls.coerce(getattr(raw, "content"), allowed=allowed)
        elif isinstance(raw, str):
            text = raw.strip()
            if not text:
                raise ValueError("empty intention text")
            result = cls.parse_text(text, allowed)
        else:
            raise TypeError(f"unsupported intention payload: {type(raw)!r}")

        if not result.user_intentions:
            raise ValueError("user_intentions must be a non-empty array")

        unknown = [label for label in result.user_intentions if label not in allowed]
        if unknown:
            raise ValueError(
                f"intention(s) {unknown!r} are not routable; allowed={sorted(allowed)}"
            )
        return result


class IntentOrchestrator(BaseAgent):
    """Detect intentions, publish a route target, hand off to one agent.

    Example intent-session ``messages``::

        Turn 1::

            [SYS]   intent persona (first turn)
            [HUMAN] user question
            [HUMAN] clarification (optional)

        Turn 2::

            ┌─ Turn 1 ────────────────────────────────────────────
            │ …
            ├─ Turn 2 ────────────────────────────────────────────
            │ [SYS]   turn boundary
            │ [HUMAN] q2
            └─ …

    ``detect_node`` uses a local detect system prompt (not checkpointed). Handoff
    specialists run in a separate session checkpoint.
    """

    CLARIFICATION_THRESHOLD = 0.85
    MAX_CLARIFICATION_ROUNDS = 2

    def __init__(
        self,
        *,
        model: BaseChatModel,
        checkpointer: BaseCheckpointSaver,
        session_runtime: SessionRuntime,
        agent_config: IntentAgentConfig,
        listener: AgentListener | ListenerHub | None = None,
    ) -> None:
        catalog = AgentCatalog.intention_catalog()
        clarification_threshold = agent_config.run_float(
            "clarification_threshold",
            self.CLARIFICATION_THRESHOLD,
        )
        max_clarification_rounds = agent_config.run_int(
            "max_clarification_rounds",
            self.MAX_CLARIFICATION_ROUNDS,
        )
        super().__init__(
            model=model,
            checkpointer=checkpointer,
            session_runtime=session_runtime,
            prompt_assembler=IntentSystemPrompt(agent_config),
            turn_message_policy=DefaultTurnMessagePolicy(),
            agent_config=agent_config,
            listener=listener or AgentListener(),
        )
        self.clarification_threshold = clarification_threshold
        self.max_clarification_rounds = max_clarification_rounds
        self._intention_catalog = catalog
        self._handoff_max_tool_calls = agent_config.run_int("max_tool_calls", 30)
        self._print_progress = False
        self._catalog = AgentCatalog(
            AgentCatalogSettings(
                profile_store=session_runtime,
                run_overrides={"max_tool_calls": self._handoff_max_tool_calls},
                model=model,
                checkpointer=checkpointer,
            )
        )

    async def _handoff(
        self,
        intent_state: dict[str, Any],
        *,
        session: str,
        user_id: str | None,
        on_interrupt: OnInterrupt | None,
        print_output: bool,
    ) -> AgentTurnResult:
        route_target = str(intent_state.get("route_target") or "").strip()
        if not route_target:
            return AgentTurnResult(state=intent_state, cancelled=False)

        question = str(intent_state.get("user_question") or "").strip()
        target = await self._catalog.get_or_create(route_target)

        if print_output:
            print(f"Status> Handing off to {route_target}…", flush=True)

        result = await target.run(
            question,
            session=SpecialistSession.id(session, route_target, kind="route"),
            user_id=user_id,
            on_interrupt=on_interrupt,
        )
        if result.cancelled:
            return AgentTurnResult(state=result.state or intent_state, cancelled=True)

        final_state = dict(result.state)
        final_state["user_question"] = question
        final_state["user_intention"] = intent_state.get("user_intention")
        final_state["user_intentions"] = list(intent_state.get("user_intentions") or [])
        final_state["status"] = intent_state.get("status")
        final_state["route_target"] = route_target
        final_state["confidence"] = intent_state.get("confidence")
        return AgentTurnResult(state=final_state, cancelled=False)

    async def run(
        self,
        user_prompt: str,
        *,
        session: str,
        user_id: str | None = None,
        on_interrupt: OnInterrupt | None = None,
        print_output: bool = True,
        handoff: bool = True,
        execute_plan: bool | None = None,
    ) -> AgentTurnResult:
        """Detect intentions, publish a route, then optionally hand off to the target agent."""
        if execute_plan is not None:
            handoff = execute_plan
        self._print_progress = print_output
        try:
            result = await super().run(
                user_prompt,
                session=session,
                user_id=user_id,
                on_interrupt=on_interrupt,
                print_output=print_output,
            )
            if result.cancelled or not handoff:
                return result

            status = str(result.state.get("status") or "").strip().lower()
            route_target = str(result.state.get("route_target") or "").strip()
            if status != "published" or not route_target:
                return result

            return await self._handoff(
                result.state,
                session=session,
                user_id=user_id,
                on_interrupt=on_interrupt,
                print_output=print_output,
            )
        finally:
            self._print_progress = False

    def _invoke_intention(self, model: BaseChatModel, messages: list) -> IntentionResponse:
        allowed = AgentCatalog.routable_intentions()
        structured_model = model.with_structured_output(IntentionResponse)
        try:
            result = invoke_with_transient_retry(lambda: structured_model.invoke(messages))
            return IntentionResponse.coerce(result, allowed=allowed)
        except (ValidationError, json.JSONDecodeError, TypeError, ValueError) as exc:
            logger.warning(
                "structured intention detection failed (%s); falling back to plain parse",
                exc,
            )

        response = invoke_with_transient_retry(lambda: model.invoke(messages))
        return IntentionResponse.coerce(response, allowed=allowed)

    def build_detect_node(
        self,
        model: BaseChatModel,
    ) -> Callable[[IntentionState], dict[str, Any]]:
        clarify_fallback = IntentSystemPrompt.clarification_question(self._intention_catalog)

        def detect_node(state: IntentionState) -> dict[str, Any]:
            user_text = (state.get("user_question") or "").strip() or latest_human_text(state)
            if not user_text:
                logger.warning("no user text to detect intention; rejecting")
                return {
                    "user_intention": DEFAULT_USER_INTENTION,
                    "user_intentions": [],
                    "confidence": 0.0,
                    "need_clarification": "",
                    "status": DEFAULT_INTENTION_STATUS,
                    "route_target": "",
                }

            system_prompt = self.session_turn_processor.system_prompt_assembler.build().strip()
            messages: list = [SystemMessage(content=system_prompt)]
            history = list(state.get("messages") or [])
            while history and getattr(history[0], "type", None) == "system":
                history = history[1:]
            if history:
                messages.extend(history)
            else:
                messages.append(HumanMessage(content=user_text))

            if self._print_progress:
                print("Status> Intent routing…", flush=True)

            try:
                result = self._invoke_intention(model, messages)
            except Exception as exc:
                logger.warning("intention detection failed (%s); defaulting to UNCLEAR", exc)
                return {
                    "user_intention": DEFAULT_USER_INTENTION,
                    "user_intentions": [],
                    "confidence": 0.0,
                    "need_clarification": clarify_fallback,
                    "status": DEFAULT_INTENTION_STATUS,
                    "route_target": "",
                }

            clarification = (result.need_clarification or "").strip()
            if result.confidence >= self.clarification_threshold:
                clarification = ""

            logger.info(
                "detected intentions=%s confidence=%.2f clarification=%s",
                result.user_intentions,
                result.confidence,
                bool(clarification),
            )
            return {
                "user_intention": result.user_intention,
                "user_intentions": list(result.user_intentions),
                "confidence": result.confidence,
                "need_clarification": clarification,
                "user_question": user_text,
                "status": DEFAULT_INTENTION_STATUS,
                "route_target": "",
            }

        return detect_node

    @staticmethod
    def intentions_from_state(state: IntentionState | dict[str, Any]) -> list[str]:
        raw = state.get("user_intentions")
        if isinstance(raw, list) and raw:
            return [str(item).strip().upper() for item in raw if str(item).strip()]
        single = str(state.get("user_intention") or "").strip().upper()
        if single and single != DEFAULT_USER_INTENTION:
            return [single]
        return []

    @staticmethod
    def resolve_publish_target(intentions: Sequence[str]) -> str:
        """Map detected intentions to the one agent that handles the request.

        The classifier is asked for exactly one label, ``PLAN`` included. When
        it still returns several (a composite request split by specialist), the
        request needs more than one specialist, so it goes to Plan.
        """
        labels = [str(item).strip().upper() for item in intentions if str(item).strip()]
        if not labels:
            return ""
        if len(labels) > 1:
            return AgentCatalog.resolve_route_target(PLAN_INTENTION)
        return AgentCatalog.resolve_route_target(labels[0])

    def route_after_review(self, state: IntentionState) -> str:
        """Choose clarify / publish / reject from detection fields."""
        return IntentOrchestrator.route_from_state(
            state,
            clarification_threshold=self.clarification_threshold,
            max_clarification_rounds=self.max_clarification_rounds,
        )

    @staticmethod
    def route_from_state(
        state: IntentionState,
        *,
        clarification_threshold: float,
        max_clarification_rounds: int,
    ) -> str:
        confidence = float(state.get("confidence") or 0.0)
        intentions = IntentOrchestrator.intentions_from_state(state)
        clarification = (state.get("need_clarification") or "").strip()
        rounds = int(state.get("clarification_rounds") or 0)

        if intentions and all(AgentCatalog.is_routable_intention(label) for label in intentions):
            if confidence >= clarification_threshold:
                return "publish"

        if (
            clarification
            and rounds < max_clarification_rounds
            and confidence < clarification_threshold
        ):
            return "clarify"

        return "reject"

    @staticmethod
    def clarification_pending(state: IntentionState | dict[str, Any]) -> bool:
        """True when the last run stopped at ``clarify`` without an answer.

        ``publish`` sets status ``published`` and ``reject`` sets ``rejected``;
        only an unanswered clarification interrupt leaves a ``pending`` status
        with a clarifying question and the question being clarified.
        """
        return bool(
            str(state.get("status") or "") == DEFAULT_INTENTION_STATUS
            and (state.get("need_clarification") or "").strip()
            and (state.get("user_question") or "").strip()
        )

    @staticmethod
    def begin_turn_node(state: IntentionState) -> dict[str, Any]:
        """Per-turn reset, run once per graph invocation (never on interrupt resume).

        A clarifying answer normally arrives as ``Command(resume=...)`` and
        continues at ``clarify``, so it does not pass through here. A new turn
        therefore starts a new question: ``user_question`` and
        ``clarification_rounds`` are cleared so ``detect`` reads the new human
        message and clarification is available again.

        Exception: when the previous run was left waiting at ``clarify`` (the
        caller cancelled the interrupt) the new human message is taken as the
        answer to that question; the original ``user_question`` is kept and the
        answer counts as one clarification round.
        """
        if IntentOrchestrator.clarification_pending(state):
            return {
                "clarification_rounds": int(state.get("clarification_rounds") or 0) + 1,
                "need_clarification": "",
            }
        return {
            "user_question": "",
            "clarification_rounds": 0,
            "need_clarification": "",
        }

    @staticmethod
    def review_node(state: IntentionState) -> dict[str, Any]:
        """Passthrough marker node; routing is decided by ``route_after_review``."""
        del state
        return {}

    @staticmethod
    def publish_node(state: IntentionState) -> dict[str, Any]:
        intentions = IntentOrchestrator.intentions_from_state(state)
        route_target = IntentOrchestrator.resolve_publish_target(intentions)
        if not route_target:
            return {
                "user_intention": DEFAULT_USER_INTENTION,
                "user_intentions": [],
                "status": "rejected",
                "route_target": "",
            }

        if len(intentions) == 1:
            display_intention = intentions[0]
        else:
            display_intention = " → ".join(intentions)

        return {
            "user_intention": display_intention,
            "user_intentions": intentions,
            "status": "published",
            "route_target": route_target,
            "need_clarification": "",
        }

    @staticmethod
    def reject_node(state: IntentionState) -> dict[str, Any]:
        del state
        return {
            "user_intention": DEFAULT_USER_INTENTION,
            "user_intentions": [],
            "status": "rejected",
            "route_target": "",
        }

    @staticmethod
    def clarify_node(state: IntentionState) -> dict[str, Any]:
        """Pause for a clarifying answer, then append it for another detect pass."""
        question = (
            (state.get("need_clarification") or "").strip()
            or IntentSystemPrompt.clarification_question()
        )
        answer = interrupt(
            {
                "type": "intent_clarification",
                "question": question,
            }
        )
        text = str(answer).strip()
        rounds = int(state.get("clarification_rounds") or 0) + 1
        update: dict[str, Any] = {
            "clarification_rounds": rounds,
            "need_clarification": "",
        }
        if text:
            update["messages"] = [HumanMessage(content=text)]
        return update

    def build_graph(self, **kwargs: Any) -> CompiledStateGraph:
        if self.graph is not None:
            return self.graph
        builder = StateGraph(IntentionState)
        builder.add_node("begin_turn", self.begin_turn_node)
        builder.add_node("detect", self.build_detect_node(self.model))
        builder.add_node("review", self.review_node)
        builder.add_node("clarify", self.clarify_node)
        builder.add_node("publish", self.publish_node)
        builder.add_node("reject", self.reject_node)

        builder.add_edge(START, "begin_turn")
        builder.add_edge("begin_turn", "detect")
        builder.add_edge("detect", "review")
        builder.add_conditional_edges(
            "review",
            self.route_after_review,
            {
                "publish": "publish",
                "clarify": "clarify",
                "reject": "reject",
            },
        )
        builder.add_edge("clarify", "detect")
        builder.add_edge("publish", END)
        builder.add_edge("reject", END)
        compiled = builder.compile(checkpointer=self.checkpointer)
        self.graph = compiled
        return compiled

    def on_turn_output(self, state: IntentionState) -> None:
        status = state.get("status") or DEFAULT_INTENTION_STATUS
        intentions = self.intentions_from_state(state)
        intention = (
            " → ".join(intentions)
            if intentions
            else (state.get("user_intention") or DEFAULT_USER_INTENTION)
        )
        confidence = float(state.get("confidence") or 0.0)
        route = (state.get("route_target") or "").strip()
        if status == "published":
            suffix = f" → {route}" if route else ""
            print(f"Intent> {intention} (confidence={confidence:.2f}){suffix}", flush=True)
            return
        if status == "rejected":
            print(f"Intent> UNCLEAR (rejected; confidence={confidence:.2f})", flush=True)
            return
        print(f"Intent> {intention} (status={status}; confidence={confidence:.2f})", flush=True)


__all__ = [
    "IntentOrchestrator",
    "IntentionResponse",
    "PLAN_INTENTION",
]

"""Intent orchestrator: classify intentions and route to one specialist or Plan."""

from __future__ import annotations

import getpass
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
from agent.intent.prompt import build_intention_system_prompt, default_clarification_question
from agent.session import specialist_session_id
from agent.turn import AgentTurnResult, OnInterrupt
from graph.error_recovery import invoke_with_transient_retry
from memory.profile_store import ProfileStore
from state.state import (
    DEFAULT_INTENTION_STATUS,
    DEFAULT_USER_INTENTION,
    IntentionState,
    latest_human_text,
)

logger = logging.getLogger(__name__)

PLAN_AGENT_NAME = "plan"


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


def _parse_intention_from_text(text: str, allowed: frozenset[str]) -> IntentionResponse:
    if text.startswith("{"):
        return IntentionResponse.model_validate(json.loads(text))

    fence_match = re.search(r"\{[^{}]*\}", text, flags=re.DOTALL)
    if fence_match:
        try:
            return IntentionResponse.model_validate(json.loads(fence_match.group(0)))
        except (json.JSONDecodeError, ValidationError):
            pass

    upper = text.upper()
    for label in sorted(allowed, key=len, reverse=True):
        if re.search(rf"\b{re.escape(label)}\b", upper):
            return IntentionResponse(
                user_intentions=[label],
                confidence=0.5,
                need_clarification="",
            )
    raise ValueError(f"could not parse intention from: {text!r}")


def coerce_intention_response(
    raw: Any,
    *,
    allowed: frozenset[str] | None = None,
) -> IntentionResponse:
    """Parse structured, dict, JSON, or loose text intention payloads."""
    if allowed is None:
        from agent.registry import routable_intentions

        allowed = routable_intentions()

    if isinstance(raw, IntentionResponse):
        result = raw
    elif isinstance(raw, dict):
        result = IntentionResponse.model_validate(raw)
    elif hasattr(raw, "content"):
        return coerce_intention_response(getattr(raw, "content"), allowed=allowed)
    elif isinstance(raw, str):
        text = raw.strip()
        if not text:
            raise ValueError("empty intention text")
        result = _parse_intention_from_text(text, allowed)
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


def intentions_from_state(state: IntentionState | dict[str, Any]) -> list[str]:
    raw = state.get("user_intentions")
    if isinstance(raw, list) and raw:
        return [str(item).strip().upper() for item in raw if str(item).strip()]
    single = str(state.get("user_intention") or "").strip().upper()
    if single and single != DEFAULT_USER_INTENTION:
        return [single]
    return []


def resolve_publish_target(intentions: Sequence[str]) -> str:
    """Map detected intentions to a single agent name (Plan for composite requests)."""
    from agent.registry import resolve_route_target

    labels = [str(item).strip().upper() for item in intentions if str(item).strip()]
    if not labels:
        return ""
    if len(labels) > 1:
        return PLAN_AGENT_NAME
    return resolve_route_target(labels[0])


def make_route_after_review(
    *,
    clarification_threshold: float,
    max_clarification_rounds: int,
) -> Callable[[IntentionState], str]:
    """Choose clarify / publish / reject from detection fields."""

    def route_after_review(state: IntentionState) -> str:
        from agent.registry import is_routable_intention

        confidence = float(state.get("confidence") or 0.0)
        intentions = intentions_from_state(state)
        clarification = (state.get("need_clarification") or "").strip()
        rounds = int(state.get("clarification_rounds") or 0)

        if intentions and all(is_routable_intention(label) for label in intentions):
            if confidence >= clarification_threshold:
                return "publish"

        if (
            clarification
            and rounds < max_clarification_rounds
            and confidence < clarification_threshold
        ):
            return "clarify"

        return "reject"

    return route_after_review


def review_node(state: IntentionState) -> dict[str, Any]:
    """Passthrough marker node; routing is decided by ``route_after_review``."""
    return {}


def publish_node(state: IntentionState) -> dict[str, Any]:
    intentions = intentions_from_state(state)
    route_target = resolve_publish_target(intentions)
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


def reject_node(state: IntentionState) -> dict[str, Any]:
    return {
        "user_intention": DEFAULT_USER_INTENTION,
        "user_intentions": [],
        "status": "rejected",
        "route_target": "",
    }


def clarify_node(state: IntentionState) -> dict[str, Any]:
    """Pause for a clarifying answer, then append it for another detect pass."""
    from agent.registry import intention_catalog

    question = (state.get("need_clarification") or "").strip() or default_clarification_question(
        intention_catalog()
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


class IntentOrchestrator(BaseAgent):
    """Detect intentions, publish a route target, hand off to one agent."""

    CLARIFICATION_THRESHOLD = 0.85
    MAX_CLARIFICATION_ROUNDS = 2

    def __init__(
        self,
        system_prompt: str | None = None,
        *,
        clarification_threshold: float = CLARIFICATION_THRESHOLD,
        max_clarification_rounds: int = MAX_CLARIFICATION_ROUNDS,
        **kwargs: Any,
    ) -> None:
        from agent.registry import intention_catalog

        catalog = intention_catalog()
        if system_prompt is None:
            prompt = build_intention_system_prompt(
                catalog,
                clarification_threshold=clarification_threshold,
            )
        else:
            prompt = system_prompt.strip()
        super().__init__(prompt, **kwargs)
        self.clarification_threshold = clarification_threshold
        self.max_clarification_rounds = max_clarification_rounds
        self._intention_catalog = catalog
        self._handoff_profile_store: ProfileStore | None = None
        self._handoff_max_tool_calls: int = 30
        self._targets: dict[str, BaseAgent] = {}
        self._print_progress = False

    @classmethod
    async def create(cls, **kwargs: Any) -> IntentOrchestrator:
        system_prompt = kwargs.pop("system_prompt", None)
        clarification_threshold = kwargs.pop(
            "clarification_threshold",
            cls.CLARIFICATION_THRESHOLD,
        )
        max_clarification_rounds = kwargs.pop(
            "max_clarification_rounds",
            cls.MAX_CLARIFICATION_ROUNDS,
        )
        profile_store = kwargs.pop("profile_store", None)
        max_tool_calls = int(kwargs.pop("max_tool_calls", 30) or 30)
        for key in (
            "max_idle_rounds",
            "enable_compression_tools",
            "react_listener",
            "run_context",
            "router_config",
        ):
            kwargs.pop(key, None)
        agent = cls(
            system_prompt=system_prompt,
            clarification_threshold=clarification_threshold,
            max_clarification_rounds=max_clarification_rounds,
        )
        agent._handoff_profile_store = profile_store
        agent._handoff_max_tool_calls = max_tool_calls
        return agent

    async def _get_target_agent(self, agent_name: str) -> BaseAgent:
        from agent.registry import get_agent

        name = agent_name.strip().lower()
        if name in self._targets:
            return self._targets[name]
        if self._model is None or self._checkpointer is None:
            raise RuntimeError(
                "IntentOrchestrator.bind() must be called before specialist handoff"
            )

        spec = get_agent(name)
        specialist = await spec.create_agent(
            profile_store=self._handoff_profile_store,
            max_tool_calls=self._handoff_max_tool_calls,
        )
        await specialist.bind(self._model, self._checkpointer, **self._bind_kwargs)
        self._targets[name] = specialist
        return specialist

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
        target = await self._get_target_agent(route_target)

        if print_output:
            print(f"Status> Handing off to {route_target}…", flush=True)

        result = await target.run(
            question,
            session=specialist_session_id(session, route_target, kind="route"),
            user_id=user_id,
            on_interrupt=on_interrupt,
            print_output=print_output,
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

    def _detection_system_prompt(self) -> str:
        content = self.system_prompt
        if callable(content):
            content = build_intention_system_prompt(
                self._intention_catalog,
                clarification_threshold=self.clarification_threshold,
            )
        return str(content).strip()

    def _invoke_intention(self, model: BaseChatModel, messages: list) -> IntentionResponse:
        from agent.registry import routable_intentions

        allowed = routable_intentions()
        structured_model = model.with_structured_output(IntentionResponse)
        try:
            result = invoke_with_transient_retry(lambda: structured_model.invoke(messages))
            return coerce_intention_response(result, allowed=allowed)
        except (ValidationError, json.JSONDecodeError, TypeError, ValueError) as exc:
            logger.warning(
                "structured intention detection failed (%s); falling back to plain parse",
                exc,
            )

        response = invoke_with_transient_retry(lambda: model.invoke(messages))
        return coerce_intention_response(response, allowed=allowed)

    def build_detect_node(
        self,
        model: BaseChatModel,
    ) -> Callable[[IntentionState], dict[str, Any]]:
        system_prompt = self._detection_system_prompt()
        clarify_fallback = default_clarification_question(self._intention_catalog)

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

            messages: list = [SystemMessage(content=system_prompt)]
            history = list(state.get("messages") or [])
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

    async def build_graph(
        self,
        model: BaseChatModel,
        checkpointer: BaseCheckpointSaver,
        **kwargs: Any,
    ) -> CompiledStateGraph:
        builder = StateGraph(IntentionState)
        builder.add_node("detect", self.build_detect_node(model))
        builder.add_node("review", review_node)
        builder.add_node("clarify", clarify_node)
        builder.add_node("publish", publish_node)
        builder.add_node("reject", reject_node)

        builder.add_edge(START, "detect")
        builder.add_edge("detect", "review")
        builder.add_conditional_edges(
            "review",
            make_route_after_review(
                clarification_threshold=self.clarification_threshold,
                max_clarification_rounds=self.max_clarification_rounds,
            ),
            {
                "publish": "publish",
                "clarify": "clarify",
                "reject": "reject",
            },
        )
        builder.add_edge("clarify", "detect")
        builder.add_edge("publish", END)
        builder.add_edge("reject", END)
        return builder.compile(checkpointer=checkpointer)

    @staticmethod
    def graph_config(session: str) -> dict:
        return {"configurable": {"thread_id": session}}

    async def prepare_turn_input(
        self,
        graph: CompiledStateGraph,
        session: str,
        user_prompt: str,
        *,
        user_id: str | None = None,
    ) -> IntentionState:
        resolved_user = (user_id or "").strip() or getpass.getuser()
        text = user_prompt.strip()
        turn_input: IntentionState = {
            "messages": [HumanMessage(content=text)],
            "user_id": resolved_user,
            "user_question": text,
            "user_intention": DEFAULT_USER_INTENTION,
            "user_intentions": [],
            "confidence": 0.0,
            "need_clarification": "",
            "status": DEFAULT_INTENTION_STATUS,
            "route_target": "",
            "clarification_rounds": 0,
        }
        self.session_state = turn_input
        return turn_input

    def on_turn_output(self, state: IntentionState) -> None:
        status = state.get("status") or DEFAULT_INTENTION_STATUS
        intentions = intentions_from_state(state)
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

    def render_system_prompt(self, state: IntentionState) -> str:
        return build_intention_system_prompt(
            self._intention_catalog,
            clarification_threshold=self.clarification_threshold,
        )


__all__ = [
    "IntentOrchestrator",
    "IntentionResponse",
    "PLAN_AGENT_NAME",
    "coerce_intention_response",
    "intentions_from_state",
    "make_route_after_review",
    "publish_node",
    "reject_node",
    "review_node",
    "clarify_node",
    "resolve_publish_target",
]

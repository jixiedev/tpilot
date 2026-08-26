"""Intent orchestrator: classify intentions, plan a specialist chain, execute it."""

from __future__ import annotations

import getpass
import json
import logging
import re
from collections.abc import Callable, Mapping, Sequence
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import CompiledStateGraph
from langgraph.types import interrupt
from pydantic import BaseModel, Field, field_validator, model_validator, ValidationError

from agent.agent import BaseAgent
from agent.chain import PlanStep, PlannedAgentChain
from agent.intent.prompt import build_intention_system_prompt, default_clarification_question
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


class PlanStepResponse(BaseModel):
    """One planned specialist assignment from the intent model."""

    intention: str
    task: str = ""

    @field_validator("intention")
    @classmethod
    def _normalize_intention(cls, value: str) -> str:
        return str(value).strip().upper()

    @field_validator("task")
    @classmethod
    def _normalize_task(cls, value: str) -> str:
        return str(value or "").strip()


class IntentionResponse(BaseModel):
    """Structured LLM output for intent detection and planning."""

    user_intentions: list[str] = Field(default_factory=list)
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    need_clarification: str = ""
    plan: list[PlanStepResponse] = Field(default_factory=list)

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


def normalize_plan_steps(
    intentions: Sequence[str],
    plan: Sequence[PlanStepResponse] | Sequence[Mapping[str, Any]] | None,
    *,
    user_question: str,
) -> list[PlanStepResponse]:
    """Ensure plan length/order align with intentions; synthesize tasks if missing."""
    labels = [str(item).strip().upper() for item in intentions if str(item).strip()]
    if not labels:
        return []

    raw_steps: list[PlanStepResponse] = []
    for item in plan or []:
        if isinstance(item, PlanStepResponse):
            raw_steps.append(item)
        else:
            raw_steps.append(PlanStepResponse.model_validate(item))

    if len(raw_steps) == len(labels) and all(
        step.intention == label for step, label in zip(raw_steps, labels)
    ):
        steps = list(raw_steps)
    elif len(raw_steps) == len(labels):
        steps = [
            PlanStepResponse(intention=label, task=step.task)
            for label, step in zip(labels, raw_steps)
        ]
    else:
        steps = [PlanStepResponse(intention=label, task="") for label in labels]

    question = (user_question or "").strip()
    filled: list[PlanStepResponse] = []
    for index, step in enumerate(steps):
        task = step.task.strip()
        if not task:
            if len(steps) == 1:
                task = question or f"Handle the {step.intention} request."
            else:
                task = (
                    f"Complete the {step.intention} portion of the request"
                    + (f" ({question})" if question else "")
                    + f" (step {index + 1}/{len(steps)})."
                )
        filled.append(PlanStepResponse(intention=step.intention, task=task))
    return filled


def build_execution_plan(
    plan_steps: Sequence[PlanStepResponse],
) -> list[dict[str, Any]]:
    """Resolve plan steps to registry agent names for AgentChain."""
    from agent.registry import resolve_route_target

    execution: list[dict[str, Any]] = []
    for index, step in enumerate(plan_steps):
        agent = resolve_route_target(step.intention)
        if not agent:
            return []
        execution.append(
            {
                "step_index": index,
                "intention": step.intention,
                "agent": agent,
                "task": step.task,
            }
        )
    return execution


def intentions_from_state(state: IntentionState | dict[str, Any]) -> list[str]:
    raw = state.get("user_intentions")
    if isinstance(raw, list) and raw:
        return [str(item).strip().upper() for item in raw if str(item).strip()]
    single = str(state.get("user_intention") or "").strip().upper()
    if single and single != DEFAULT_USER_INTENTION:
        return [single]
    return []


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
    question = str(state.get("user_question") or "").strip()
    draft = state.get("plan_draft")
    plan_steps = normalize_plan_steps(
        intentions,
        draft if isinstance(draft, list) else None,
        user_question=question,
    )
    execution_plan = build_execution_plan(plan_steps)
    if not execution_plan:
        return {
            "user_intention": DEFAULT_USER_INTENTION,
            "user_intentions": [],
            "status": "rejected",
            "route_target": "",
            "route_targets": [],
            "plan_draft": [],
            "execution_plan": [],
        }

    primary = execution_plan[0]
    return {
        "user_intention": str(primary.get("intention") or intentions[0]),
        "user_intentions": intentions,
        "status": "published",
        "route_target": str(primary.get("agent") or ""),
        "route_targets": [str(item.get("agent") or "") for item in execution_plan],
        "plan_draft": [],
        "execution_plan": execution_plan,
        "need_clarification": "",
    }


def reject_node(state: IntentionState) -> dict[str, Any]:
    return {
        "user_intention": DEFAULT_USER_INTENTION,
        "user_intentions": [],
        "status": "rejected",
        "route_target": "",
        "route_targets": [],
        "plan_draft": [],
        "execution_plan": [],
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
    """Detect intentions, publish an execution plan, run specialists via AgentChain."""

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
        self._specialists: dict[str, BaseAgent] = {}
        self._print_progress = False

    @classmethod
    async def create(cls, **kwargs: Any) -> IntentOrchestrator:
        # Accept ReAct-oriented kwargs for specialist handoff; ignore the rest.
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
            "agent_prompt_config",
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

    async def _get_specialist(self, agent_name: str) -> BaseAgent:
        from agent.registry import get_routable_agent

        if agent_name in self._specialists:
            return self._specialists[agent_name]
        if self._model is None or self._checkpointer is None:
            raise RuntimeError(
                "IntentOrchestrator.bind() must be called before specialist handoff"
            )

        spec = get_routable_agent(agent_name)
        specialist = await spec.create_agent(
            profile_store=self._handoff_profile_store,
            max_tool_calls=self._handoff_max_tool_calls,
        )
        await specialist.bind(self._model, self._checkpointer, **self._bind_kwargs)
        self._specialists[agent_name] = specialist
        return specialist

    async def _execute_plan(
        self,
        intent_state: dict[str, Any],
        *,
        session: str,
        user_id: str | None,
        on_interrupt: OnInterrupt | None,
        print_output: bool,
    ) -> AgentTurnResult:
        plan = list(intent_state.get("execution_plan") or [])
        if not plan:
            return AgentTurnResult(state=intent_state, cancelled=False)

        question = str(intent_state.get("user_question") or "").strip()
        chain = PlannedAgentChain.from_execution_plan(plan, user_question=question)
        for index, step in enumerate(chain.plan_steps):
            specialist = await self._get_specialist(step.agent_name)
            chain.register_agent(index, specialist)

        if print_output:
            agents = " → ".join(step.agent_name for step in chain.plan_steps)
            print(f"Plan> {agents}", flush=True)

        chain_result = await chain.execute(
            session=session,
            user_id=user_id,
            on_interrupt=on_interrupt,
            print_output=print_output,
        )
        if chain_result.cancelled:
            return AgentTurnResult(state=chain_result.last_state or intent_state, cancelled=True)

        # Workflow result is the last specialist's state; keep plan metadata for callers.
        final_state = dict(chain_result.last_state)
        final_state["user_question"] = question
        final_state["user_intention"] = intent_state.get("user_intention")
        final_state["user_intentions"] = list(intent_state.get("user_intentions") or [])
        final_state["status"] = intent_state.get("status")
        final_state["route_target"] = intent_state.get("route_target")
        final_state["route_targets"] = list(intent_state.get("route_targets") or [])
        final_state["execution_plan"] = plan
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
        execute_plan: bool = True,
    ) -> AgentTurnResult:
        """Detect intentions, publish a plan, then optionally execute specialists."""
        self._print_progress = print_output
        try:
            result = await super().run(
                user_prompt,
                session=session,
                user_id=user_id,
                on_interrupt=on_interrupt,
                print_output=print_output,
            )
            if result.cancelled or not execute_plan:
                return result

            status = str(result.state.get("status") or "").strip().lower()
            plan = list(result.state.get("execution_plan") or [])
            if status != "published" or not plan:
                return result

            return await self._execute_plan(
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
                    "plan_draft": [],
                    "execution_plan": [],
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
                    "plan_draft": [],
                    "execution_plan": [],
                }

            clarification = (result.need_clarification or "").strip()
            if result.confidence >= self.clarification_threshold:
                clarification = ""

            plan_steps = normalize_plan_steps(
                result.user_intentions,
                result.plan,
                user_question=user_text,
            )
            draft = [step.model_dump() for step in plan_steps]

            logger.info(
                "detected intentions=%s confidence=%.2f steps=%d clarification=%s",
                result.user_intentions,
                result.confidence,
                len(plan_steps),
                bool(clarification),
            )
            return {
                "user_intention": result.user_intention,
                "user_intentions": list(result.user_intentions),
                "confidence": result.confidence,
                "need_clarification": clarification,
                "user_question": user_text,
                "status": DEFAULT_INTENTION_STATUS,
                "plan_draft": draft,
                "execution_plan": [],
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
            "route_targets": [],
            "plan_draft": [],
            "execution_plan": [],
            "clarification_rounds": 0,
        }
        self.session_state = turn_input
        return turn_input

    def print_turn_output(self, state: IntentionState) -> None:
        status = state.get("status") or DEFAULT_INTENTION_STATUS
        intentions = intentions_from_state(state)
        intention = (
            " → ".join(intentions)
            if intentions
            else (state.get("user_intention") or DEFAULT_USER_INTENTION)
        )
        confidence = float(state.get("confidence") or 0.0)
        plan = list(state.get("execution_plan") or [])
        if status == "published":
            if plan:
                route = " → ".join(
                    f"{item.get('agent')}({item.get('intention')})" for item in plan
                )
            else:
                route = (state.get("route_target") or "").strip()
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
    "PlanStep",
    "PlanStepResponse",
    "build_execution_plan",
    "coerce_intention_response",
    "make_route_after_review",
    "normalize_plan_steps",
    "publish_node",
    "reject_node",
    "review_node",
    "clarify_node",
]

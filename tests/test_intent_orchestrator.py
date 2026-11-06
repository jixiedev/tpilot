from __future__ import annotations

from typing import Any

from langchain_core.messages import HumanMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command

from agent.intent.orchestrator import (
    IntentOrchestrator,
    IntentionResponse,
)
from agent.session import session_graph_config
from graph.state import DEFAULT_USER_INTENTION


class _FakeStructuredModel:
    def __init__(self, result: IntentionResponse | dict | Exception):
        self._result = result
        self.invoke_calls: list[list] = []

    def invoke(self, messages):
        self.invoke_calls.append(messages)
        if isinstance(self._result, Exception):
            raise self._result
        return self._result


class _FakeChatModel:
    def __init__(self, result: IntentionResponse | dict | Exception):
        self.structured = _FakeStructuredModel(result)

    def with_structured_output(self, _schema):
        return self.structured


def test_coerce_intention_response_from_json_and_loose_text() -> None:
    parsed = IntentionResponse.coerce(
        '{"user_intention": "DATA", "confidence": 0.9, "need_clarification": ""}'
    )
    assert parsed.user_intentions == ["DATA"]
    assert parsed.user_intention == "DATA"
    assert parsed.confidence == 0.9

    array_form = IntentionResponse.coerce(
        {
            "user_intentions": ["KNOWLEDGE", "DATA"],
            "confidence": 0.91,
        }
    )
    assert array_form.user_intentions == ["KNOWLEDGE", "DATA"]

    loose = IntentionResponse.coerce("I think this is KNOWLEDGE related")
    assert loose.user_intention == "KNOWLEDGE"


def test_resolve_publish_target() -> None:
    assert IntentOrchestrator.resolve_publish_target(["DATA"]) == "databot"
    assert IntentOrchestrator.resolve_publish_target(["PLAN"]) == "plan"
    assert IntentOrchestrator.resolve_publish_target(["DIAGNOSTIC"]) == "diagnostic"
    assert IntentOrchestrator.resolve_publish_target(["SWE"]) == "swe"
    assert IntentOrchestrator.resolve_publish_target(["ANALYSIS"]) == "data_analysis"
    # Several labels despite the one-label rule: the request needs several
    # specialists, so it still goes to Plan.
    assert IntentOrchestrator.resolve_publish_target(["KNOWLEDGE", "DATA"]) == "plan"
    assert IntentOrchestrator.resolve_publish_target([]) == ""


def test_route_after_review_publish_clarify_reject() -> None:
    def route(state):
        return IntentOrchestrator.route_from_state(
            state,
            clarification_threshold=0.85,
            max_clarification_rounds=2,
        )

    assert (
        route(
            {
                "user_intentions": ["DATA"],
                "confidence": 0.9,
                "need_clarification": "",
                "clarification_rounds": 0,
            }
        )
        == "publish"
    )
    assert (
        route(
            {
                "user_intentions": ["KNOWLEDGE", "DATA"],
                "confidence": 0.92,
                "need_clarification": "",
                "clarification_rounds": 0,
            }
        )
        == "publish"
    )
    assert (
        route(
            {
                "user_intention": "DATA",
                "confidence": 0.4,
                "need_clarification": "DATA or KNOWLEDGE?",
                "clarification_rounds": 0,
            }
        )
        == "clarify"
    )
    assert (
        route(
            {
                "user_intention": "DATA",
                "confidence": 0.4,
                "need_clarification": "DATA or KNOWLEDGE?",
                "clarification_rounds": 2,
            }
        )
        == "reject"
    )


def test_publish_and_reject_nodes() -> None:
    published = IntentOrchestrator.publish_node({"user_intention": "KNOWLEDGE", "user_question": "docs?"})
    assert published["status"] == "published"
    assert published["route_target"] == "knowledge"
    assert published["user_intentions"] == ["KNOWLEDGE"]

    composite = IntentOrchestrator.publish_node(
        {
            "user_intentions": ["KNOWLEDGE", "DATA"],
            "user_question": "GMV?",
        }
    )
    assert composite["status"] == "published"
    assert composite["route_target"] == "plan"
    assert composite["user_intention"] == "KNOWLEDGE → DATA"

    rejected = IntentOrchestrator.reject_node({})
    assert rejected["status"] == "rejected"
    assert rejected["user_intention"] == DEFAULT_USER_INTENTION
    assert rejected["route_target"] == ""


from agent.catalog import AgentCatalog, AgentCatalogSettings
from memory.profile_store import FileProfileStore
from tests.minimal_chat_model import MinimalChatModel


async def _intent_agent(
    tmp_path,
    *,
    model: Any | None = None,
) -> IntentOrchestrator:
    catalog = AgentCatalog(
        AgentCatalogSettings.for_agent(
            "intent",
            profile_store=FileProfileStore(tmp_path),
            model=model or MinimalChatModel(),
            checkpointer=MemorySaver(),
        )
    )
    return await catalog.create("intent")


async def test_intent_orchestrator_publishes_high_confidence_data(tmp_path) -> None:
    model = _FakeChatModel(
        IntentionResponse(user_intention="DATA", confidence=0.95, need_clarification="")
    )
    agent = await _intent_agent(tmp_path, model=model)
    graph = agent.build_graph()
    turn = (await agent.accept_user_request("What was GMV yesterday?", "s1")).state
    state = await graph.ainvoke(turn, session_graph_config("s1"))

    assert state["status"] == "published"
    assert state["user_intention"] == "DATA"
    assert state["user_intentions"] == ["DATA"]
    assert state["route_target"] == "databot"
    assert not state.get("__interrupt__")


async def test_intent_orchestrator_routes_plan_label_to_plan(tmp_path) -> None:
    model = _FakeChatModel(IntentionResponse(user_intentions=["PLAN"], confidence=0.93))
    agent = await _intent_agent(tmp_path, model=model)
    graph = agent.build_graph()
    turn = (
        await agent.accept_user_request(
            "Find the GMV definition in our docs, then query yesterday's GMV", "s-plan-label"
        )
    ).state
    state = await graph.ainvoke(turn, session_graph_config("s-plan-label"))

    assert state["status"] == "published"
    assert state["user_intentions"] == ["PLAN"]
    assert state["route_target"] == "plan"


def test_intent_prompt_lists_plan_and_every_specialist() -> None:
    from agent.intent.prompt import IntentSystemPrompt

    prompt = IntentSystemPrompt().build()
    for label in ("ANALYSIS", "DATA", "DIAGNOSTIC", "KNOWLEDGE", "PLAN", "SWE"):
        assert f"- {label}:" in prompt
    assert "Emit exactly one intention." in prompt


async def test_intent_orchestrator_publishes_composite_to_plan(tmp_path) -> None:
    model = _FakeChatModel(
        IntentionResponse(
            user_intentions=["KNOWLEDGE", "DATA"],
            confidence=0.93,
        )
    )
    agent = await _intent_agent(tmp_path, model=model)
    graph = agent.build_graph()
    turn = (
        await agent.accept_user_request(
            "GMV yesterday using our definition", "s-plan"
        )
    ).state
    state = await graph.ainvoke(turn, session_graph_config("s-plan"))

    assert state["status"] == "published"
    assert state["user_intentions"] == ["KNOWLEDGE", "DATA"]
    assert state["route_target"] == "plan"


async def test_intent_orchestrator_clarifies_then_publishes(tmp_path) -> None:
    class _SequenceModel:
        def __init__(self) -> None:
            self._i = 0
            self._results = [
                IntentionResponse(
                    user_intention="DATA",
                    confidence=0.4,
                    need_clarification="Is this about warehouse data or team docs?",
                ),
                IntentionResponse(
                    user_intention="KNOWLEDGE",
                    confidence=0.92,
                    need_clarification="",
                ),
            ]

        def with_structured_output(self, _schema):
            return self

        def invoke(self, _messages):
            result = self._results[min(self._i, len(self._results) - 1)]
            self._i += 1
            return result

    agent = await _intent_agent(tmp_path, model=_SequenceModel())
    graph = agent.build_graph()
    config = session_graph_config("s2")
    turn = (await agent.accept_user_request("How does tahoe deploy?", "s2")).state

    paused = await graph.ainvoke(turn, config)
    assert paused.get("__interrupt__")

    done = await graph.ainvoke(Command(resume="team docs / knowledge"), config)
    assert done["status"] == "published"
    assert done["user_intention"] == "KNOWLEDGE"
    assert done["route_target"] == "knowledge"
    assert done["clarification_rounds"] == 1
    assert any(
        isinstance(message, HumanMessage) and "knowledge" in str(message.content).lower()
        for message in done["messages"]
    )

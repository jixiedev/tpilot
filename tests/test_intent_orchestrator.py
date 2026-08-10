from __future__ import annotations

from typing import Any

from langchain_core.messages import HumanMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command

from agent.intent.orchestrator import (
    IntentOrchestrator,
    IntentionResponse,
    PlanStepResponse,
    build_execution_plan,
    coerce_intention_response,
    make_route_after_review,
    normalize_plan_steps,
    publish_node,
    reject_node,
)
from state.state import DEFAULT_USER_INTENTION


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
    parsed = coerce_intention_response(
        '{"user_intention": "DATA", "confidence": 0.9, "need_clarification": ""}'
    )
    assert parsed.user_intentions == ["DATA"]
    assert parsed.user_intention == "DATA"
    assert parsed.confidence == 0.9

    array_form = coerce_intention_response(
        {
            "user_intentions": ["KNOWLEDGE", "DATA"],
            "confidence": 0.91,
            "plan": [
                {"intention": "KNOWLEDGE", "task": "Find GMV definition"},
                {"intention": "DATA", "task": "Query GMV"},
            ],
        }
    )
    assert array_form.user_intentions == ["KNOWLEDGE", "DATA"]
    assert len(array_form.plan) == 2

    loose = coerce_intention_response("I think this is KNOWLEDGE related")
    assert loose.user_intention == "KNOWLEDGE"


def test_normalize_and_build_execution_plan() -> None:
    steps = normalize_plan_steps(
        ["KNOWLEDGE", "DATA"],
        [
            PlanStepResponse(intention="KNOWLEDGE", task="Look up metric docs"),
            PlanStepResponse(intention="DATA", task="Run the SQL"),
        ],
        user_question="What is GMV?",
    )
    plan = build_execution_plan(steps)
    assert [item["agent"] for item in plan] == ["knowledge", "databot"]
    assert plan[0]["task"] == "Look up metric docs"


def test_route_after_review_publish_clarify_reject() -> None:
    route = make_route_after_review(
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
    published = publish_node({"user_intention": "KNOWLEDGE", "user_question": "docs?"})
    assert published["status"] == "published"
    assert published["route_target"] == "knowledge"
    assert published["user_intentions"] == ["KNOWLEDGE"]
    assert len(published["execution_plan"]) == 1

    composite = publish_node(
        {
            "user_intentions": ["KNOWLEDGE", "DATA"],
            "user_question": "GMV?",
            "plan_draft": [
                {"intention": "KNOWLEDGE", "task": "Define GMV"},
                {"intention": "DATA", "task": "Query warehouse"},
            ],
        }
    )
    assert composite["status"] == "published"
    assert composite["route_targets"] == ["knowledge", "databot"]
    assert [step["task"] for step in composite["execution_plan"]] == [
        "Define GMV",
        "Query warehouse",
    ]

    rejected = reject_node({})
    assert rejected["status"] == "rejected"
    assert rejected["user_intention"] == DEFAULT_USER_INTENTION
    assert rejected["execution_plan"] == []


async def test_intent_orchestrator_publishes_high_confidence_data() -> None:
    agent = await IntentOrchestrator.create()
    model = _FakeChatModel(
        IntentionResponse(user_intention="DATA", confidence=0.95, need_clarification="")
    )
    graph = await agent.build_graph(model, checkpointer=MemorySaver())
    turn = await agent.prepare_turn_input(graph, "s1", "What was GMV yesterday?")
    state = await graph.ainvoke(turn, IntentOrchestrator.graph_config("s1"))

    assert state["status"] == "published"
    assert state["user_intention"] == "DATA"
    assert state["user_intentions"] == ["DATA"]
    assert state["route_target"] == "databot"
    assert state["execution_plan"][0]["agent"] == "databot"
    assert not state.get("__interrupt__")


async def test_intent_orchestrator_publishes_composite_plan() -> None:
    agent = await IntentOrchestrator.create()
    model = _FakeChatModel(
        IntentionResponse(
            user_intentions=["KNOWLEDGE", "DATA"],
            confidence=0.93,
            plan=[
                PlanStepResponse(intention="KNOWLEDGE", task="Find GMV definition in docs"),
                PlanStepResponse(intention="DATA", task="Query GMV with that definition"),
            ],
        )
    )
    graph = await agent.build_graph(model, checkpointer=MemorySaver())
    turn = await agent.prepare_turn_input(graph, "s-plan", "GMV yesterday using our definition")
    state = await graph.ainvoke(turn, IntentOrchestrator.graph_config("s-plan"))

    assert state["status"] == "published"
    assert state["user_intentions"] == ["KNOWLEDGE", "DATA"]
    assert state["route_targets"] == ["knowledge", "databot"]
    assert state["execution_plan"][0]["task"] == "Find GMV definition in docs"


async def test_intent_orchestrator_clarifies_then_publishes() -> None:
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

    agent = await IntentOrchestrator.create()
    graph = await agent.build_graph(_SequenceModel(), checkpointer=MemorySaver())
    config = IntentOrchestrator.graph_config("s2")
    turn = await agent.prepare_turn_input(graph, "s2", "How does tahoe deploy?")

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

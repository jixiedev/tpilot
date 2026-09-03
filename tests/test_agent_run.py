from __future__ import annotations

from typing import Any

from langchain_core.messages import HumanMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from typing_extensions import TypedDict

from agent.agent import BaseAgent
from graph.builder import static_system_prompt
from agent.intent.orchestrator import IntentOrchestrator, IntentionResponse
from agent.turn import AgentTurnResult, ainvoke_resolving_interrupts, interrupt_question
from langgraph.types import interrupt


class _State(TypedDict):
    messages: list
    value: str


def _interrupt_graph():
    def ask(state: _State) -> dict[str, Any]:
        answer = interrupt({"question": "confirm?"})
        return {"value": str(answer)}

    g = StateGraph(_State)
    g.add_node("ask", ask)
    g.add_edge(START, "ask")
    g.add_edge("ask", END)
    return g.compile(checkpointer=MemorySaver())


async def test_ainvoke_resolving_interrupts_resumes() -> None:
    graph = _interrupt_graph()
    config = {"configurable": {"thread_id": "t-interrupt"}}

    async def on_interrupt(question: str) -> str:
        assert question == "confirm?"
        return "yes"

    result = await ainvoke_resolving_interrupts(
        graph,
        {"messages": [], "value": ""},
        config,
        on_interrupt=on_interrupt,
    )
    assert result.ok
    assert result.state["value"] == "yes"


async def test_ainvoke_resolving_interrupts_cancelled() -> None:
    graph = _interrupt_graph()
    config = {"configurable": {"thread_id": "t-cancel"}}

    async def on_interrupt(_question: str) -> str | None:
        return None

    result = await ainvoke_resolving_interrupts(
        graph,
        {"messages": [], "value": ""},
        config,
        on_interrupt=on_interrupt,
    )
    assert result.cancelled
    assert interrupt_question(result.state) == "confirm?"


async def test_intent_orchestrator_run_publishes_without_handoff_target_when_rejected() -> None:
    class _Model:
        def with_structured_output(self, _schema):
            return self

        def invoke(self, _messages):
            return IntentionResponse(
                user_intention="DATA",
                confidence=0.2,
                need_clarification="",
            )

    agent = await IntentOrchestrator.create()
    await agent.bind(_Model(), MemorySaver())
    result = await agent.run(
        "ambiguous",
        session="s-run",
        user_id="u1",
        print_output=False,
    )
    assert isinstance(result, AgentTurnResult)
    assert result.ok
    assert result.state["status"] == "rejected"


async def test_intent_orchestrator_run_hands_off_composite_to_plan() -> None:
    from langgraph.graph import END, START, StateGraph

    class _Model:
        def with_structured_output(self, _schema):
            return self

        def invoke(self, _messages):
            return IntentionResponse(
                user_intentions=["KNOWLEDGE", "DATA"],
                confidence=0.95,
            )

    class _PlanWorker(BaseAgent):
        def __init__(self) -> None:
            super().__init__(system_prompt=static_system_prompt("plan"))
            self.prompts: list[str] = []

        async def build_graph(self, model, checkpointer, **_kwargs):
            def node(state: _State) -> dict[str, Any]:
                return {"value": "planned"}

            g = StateGraph(_State)
            g.add_node("n", node)
            g.add_edge(START, "n")
            g.add_edge("n", END)
            return g.compile(checkpointer=checkpointer)

        async def prepare_turn_input(self, graph, session, user_prompt, *, user_id):
            self.prompts.append(user_prompt)
            return {"messages": [HumanMessage(content=user_prompt)], "value": ""}

    plan = _PlanWorker()
    await plan.bind(object(), MemorySaver())  # type: ignore[arg-type]

    agent = await IntentOrchestrator.create()
    await agent.bind(_Model(), MemorySaver())

    async def _get_target_agent(name: str) -> BaseAgent:
        assert name == "plan"
        return plan

    agent._get_target_agent = _get_target_agent  # type: ignore[method-assign]

    result = await agent.run(
        "GMV yesterday with official definition",
        session="s-plan-run",
        user_id="u1",
        print_output=False,
    )
    assert result.ok
    assert result.state["value"] == "planned"
    assert result.state["route_target"] == "plan"
    assert plan.prompts == ["GMV yesterday with official definition"]


async def test_base_agent_run_requires_bind() -> None:
    class _Tiny(BaseAgent):
        @classmethod
        async def create(cls, **_kwargs):
            return cls("sys")

        async def build_graph(self, model, checkpointer, **_kwargs):
            g = StateGraph(_State)
            g.add_node("n", lambda s: {"value": "ok"})
            g.add_edge(START, "n")
            g.add_edge("n", END)
            return g.compile(checkpointer=checkpointer)

        async def prepare_turn_input(self, graph, session, user_prompt, *, user_id):
            return {"messages": [HumanMessage(content=user_prompt)], "value": ""}

    agent = await _Tiny.create()
    try:
        _ = agent.graph
        raise AssertionError("expected RuntimeError")
    except RuntimeError:
        pass

    await agent.bind(object(), MemorySaver())  # type: ignore[arg-type]
    result = await agent.run("hi", session="s", print_output=False)
    assert result.ok
    assert result.state["value"] == "ok"

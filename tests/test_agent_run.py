from __future__ import annotations

from typing import Any

from langchain_core.messages import HumanMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from typing_extensions import TypedDict

from agent.agent import BaseAgent
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


async def test_intent_orchestrator_run_executes_plan_and_returns_last_output() -> None:
    from agent.intent.orchestrator import PlanStepResponse

    class _Model:
        def with_structured_output(self, _schema):
            return self

        def invoke(self, _messages):
            return IntentionResponse(
                user_intentions=["KNOWLEDGE", "DATA"],
                confidence=0.95,
                plan=[
                    PlanStepResponse(intention="KNOWLEDGE", task="Define metric"),
                    PlanStepResponse(intention="DATA", task="Query metric"),
                ],
            )

    class _Worker(BaseAgent):
        def __init__(self, name: str, reply: str) -> None:
            super().__init__(system_prompt="w")
            self.name = name
            self.reply = reply
            self.prompts: list[str] = []

        async def build_graph(self, model, checkpointer, **_kwargs):
            reply = self.reply

            def node(state: _State) -> dict[str, Any]:
                return {"value": reply}

            g = StateGraph(_State)
            g.add_node("n", node)
            g.add_edge(START, "n")
            g.add_edge("n", END)
            return g.compile(checkpointer=checkpointer)

        async def prepare_turn_input(self, graph, session, user_prompt, *, user_id):
            self.prompts.append(user_prompt)
            return {"messages": [HumanMessage(content=user_prompt)], "value": ""}

    knowledge = _Worker("knowledge", "def=GMV")
    databot = _Worker("databot", "answer=100")
    await knowledge.bind(object(), MemorySaver())  # type: ignore[arg-type]
    await databot.bind(object(), MemorySaver())  # type: ignore[arg-type]

    agent = await IntentOrchestrator.create()
    await agent.bind(_Model(), MemorySaver())

    async def _get_specialist(name: str) -> BaseAgent:
        return knowledge if name == "knowledge" else databot

    agent._get_specialist = _get_specialist  # type: ignore[method-assign]

    result = await agent.run(
        "GMV yesterday with official definition",
        session="s-plan-run",
        user_id="u1",
        print_output=False,
    )
    assert result.ok
    assert result.state["value"] == "answer=100"
    assert result.state["execution_plan"]
    assert "Define metric" in knowledge.prompts[0]
    assert "def=GMV" in databot.prompts[0]
    assert "last step" in databot.prompts[0].lower()


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

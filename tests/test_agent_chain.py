from __future__ import annotations

from typing import Any

from langchain_core.messages import HumanMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from typing_extensions import TypedDict

from agent.agent import BaseAgent
from agent.chain import (
    AgentChain,
    PlannedAgentChain,
    StaticAgentChain,
    StatusRoutedAgentChain,
)
from agent.turn import extract_turn_output


class _State(TypedDict, total=False):
    messages: list
    value: str
    user_question: str
    status: str
    route_target: str


class _StubAgent(BaseAgent):
    def __init__(self, name: str, *, payload: dict[str, Any] | None = None) -> None:
        super().__init__(system_prompt="stub")
        self.name = name
        self.payload = payload or {}
        self.calls: list[str] = []

    @classmethod
    async def create(cls, **_kwargs: Any) -> _StubAgent:
        return cls("factory")

    async def build_graph(self, model, checkpointer, **_kwargs):
        agent_name = self.name
        payload = dict(self.payload)

        def node(state: _State) -> dict[str, Any]:
            return {"value": f"{agent_name}:{state.get('user_question', '')}", **payload}

        g = StateGraph(_State)
        g.add_node("n", node)
        g.add_edge(START, "n")
        g.add_edge("n", END)
        return g.compile(checkpointer=checkpointer)

    async def prepare_turn_input(self, graph, session, user_prompt, *, user_id):
        self.calls.append(user_prompt)
        return {
            "messages": [HumanMessage(content=user_prompt)],
            "user_question": user_prompt,
            "value": "",
        }


async def _bound(agent: _StubAgent) -> _StubAgent:
    await agent.bind(object(), MemorySaver())  # type: ignore[arg-type]
    return agent


async def test_static_chain_runs_in_order() -> None:
    a0 = await _bound(_StubAgent("a0"))
    a1 = await _bound(_StubAgent("a1"))
    chain = StaticAgentChain({0: 1})
    chain.register_agent(0, a0)
    chain.register_agent(1, a1)

    result = await chain.run(0, "hello", session="s1", print_output=False)
    assert result.ok
    assert [step.agent_id for step in result.steps] == [0, 1]
    assert a0.calls == ["hello"]
    assert "hello" in a1.calls[0] or a1.calls[0].startswith("a0:")
    assert result.last_output


async def test_static_chain_stops_without_edge() -> None:
    a0 = await _bound(_StubAgent("only"))
    chain = StaticAgentChain({})
    chain.register_agent(0, a0)
    result = await chain.run(0, "x", session="s2", print_output=False)
    assert result.ok
    assert len(result.steps) == 1


async def test_status_routed_chain_follows_route_target() -> None:
    intent = await _bound(
        _StubAgent(
            "intent",
            payload={"status": "published", "route_target": "databot"},
        )
    )
    databot = await _bound(_StubAgent("databot"))
    knowledge = await _bound(_StubAgent("knowledge"))

    chain = StatusRoutedAgentChain(targets={"databot": 1, "knowledge": 2})
    chain.register_agent(0, intent)
    chain.register_agent(1, databot)
    chain.register_agent(2, knowledge)

    result = await chain.run(0, "gmv?", session="s3", print_output=False)
    assert result.ok
    assert [step.agent_id for step in result.steps] == [0, 1]
    assert knowledge.calls == []


async def test_status_routed_chain_stops_when_not_published() -> None:
    intent = await _bound(
        _StubAgent(
            "intent",
            payload={"status": "rejected", "route_target": "databot"},
        )
    )
    databot = await _bound(_StubAgent("databot"))
    chain = StatusRoutedAgentChain(targets={"databot": 1})
    chain.register_agent(0, intent)
    chain.register_agent(1, databot)

    result = await chain.run(0, "?", session="s4", print_output=False)
    assert result.ok
    assert [step.agent_id for step in result.steps] == [0]
    assert databot.calls == []


async def test_planned_chain_passes_upstream_and_downstream_context() -> None:
    knowledge = await _bound(_StubAgent("knowledge", payload={"value": "GMV=gross merchandise value"}))
    databot = await _bound(_StubAgent("databot", payload={"value": "final:42"}))

    chain = PlannedAgentChain.from_execution_plan(
        [
            {
                "agent": "knowledge",
                "intention": "KNOWLEDGE",
                "task": "Define GMV from docs",
            },
            {
                "agent": "databot",
                "intention": "DATA",
                "task": "Query GMV using the definition",
            },
        ],
        user_question="What was GMV yesterday?",
    )
    chain.register_agent(0, knowledge)
    chain.register_agent(1, databot)

    result = await chain.execute(session="s-plan", print_output=False)
    assert result.ok
    assert [step.agent_name for step in result.steps] == ["knowledge", "databot"]
    assert "Task background" in knowledge.calls[0]
    assert "Define GMV from docs" in knowledge.calls[0]
    assert "You are the first step" in knowledge.calls[0] or "none" in knowledge.calls[0].lower()
    assert "Next agent: databot" in knowledge.calls[0]

    assert "Upstream result" in databot.calls[0]
    assert "GMV=gross merchandise value" in databot.calls[0]
    assert "last step" in databot.calls[0].lower()
    assert result.last_output == "final:42"

    # Ephemeral sessions: two distinct thread prefixes, not a shared specialist history id.
    assert knowledge.calls and databot.calls


async def test_extract_turn_output_prefers_value() -> None:
    assert extract_turn_output({"value": "x"}) == "x"


async def test_receive_and_determine_contract() -> None:
    class _Fixed(AgentChain):
        def determine_next_agent(self, last_agent_id: int) -> int | None:
            return None

    chain = _Fixed()
    chain.receive_agent_status(7, {"user_question": "q", "status": "published"})
    assert chain.agent_status[7]["user_question"] == "q"
    assert chain.determine_next_agent(7) is None

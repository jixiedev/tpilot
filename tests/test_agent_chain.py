from __future__ import annotations

from typing import Any

from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from typing_extensions import TypedDict

from pathlib import Path
import tempfile

from agent.agent import BaseAgent
from agent.listener import AgentListener
from agent.prompt import SystemPromptAssembler
from agent.turn_messages import DefaultTurnMessagePolicy
from config.agent_config import AgentConfig, agent_config_path
from memory.session_runtime import SessionRuntime
from tests.minimal_chat_model import MinimalChatModel
from agent.chain import (
    AgentChain,
    StaticAgentChain,
    StatusRoutedAgentChain,
)
from agent.turn import AgentTurnResult
from memory.profile_store import FileProfileStore
from graph.state import latest_human_text

_STUB_PROFILE_ROOT = Path(tempfile.gettempdir()) / "tpilot-chain-stub-profiles"


class _State(TypedDict, total=False):
    messages: list
    value: str
    user_question: str
    status: str
    route_target: str


class _StubAgent(BaseAgent):
    def __init__(self, name: str, *, payload: dict[str, Any] | None = None) -> None:
        model = MinimalChatModel()
        checkpointer = MemorySaver()
        super().__init__(
            model=model,
            checkpointer=checkpointer,
            session_runtime=SessionRuntime(FileProfileStore(_STUB_PROFILE_ROOT)),
            prompt_assembler=SystemPromptAssembler(AgentConfig(agent_config_path("base"))),
            turn_message_policy=DefaultTurnMessagePolicy(),
            agent_config=AgentConfig(agent_config_path("base")),
            listener=AgentListener(),
        )
        self.name = name
        self.payload = payload or {}
        self.calls: list[str] = []

    @classmethod
    async def create(cls, **_kwargs: Any) -> _StubAgent:
        return cls("factory")

    def build_graph(self, **_kwargs):
        agent_name = self.name
        payload = dict(self.payload)

        def node(state: _State) -> dict[str, Any]:
            question = latest_human_text(state) or ""
            return {"value": f"{agent_name}:{question}", **payload}

        g = StateGraph(_State)
        g.add_node("n", node)
        g.add_edge(START, "n")
        g.add_edge("n", END)
        self.graph = g.compile(checkpointer=self.checkpointer)
        return self.graph

    async def run(self, user_prompt, session, user_id=None, on_interrupt=None, **kwargs):
        del kwargs
        self.calls.append(user_prompt)
        return await super().run(user_prompt, session, user_id, on_interrupt)


async def _bound(agent: _StubAgent) -> _StubAgent:
    agent.build_graph()
    return agent


async def test_static_chain_runs_in_order() -> None:
    a0 = await _bound(_StubAgent("a0"))
    a1 = await _bound(_StubAgent("a1"))
    chain = StaticAgentChain({0: 1})
    chain.register_agent(0, a0)
    chain.register_agent(1, a1)

    result = await chain.run(0, "hello", session="s1", print_output=False)
    assert not result.cancelled
    assert [step.agent_id for step in result.steps] == [0, 1]
    assert a0.calls == ["hello"]
    assert "hello" in a1.calls[0] or a1.calls[0].startswith("a0:")
    assert result.last_output


async def test_static_chain_stops_without_edge() -> None:
    a0 = await _bound(_StubAgent("only"))
    chain = StaticAgentChain({})
    chain.register_agent(0, a0)
    result = await chain.run(0, "x", session="s2", print_output=False)
    assert not result.cancelled
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
    assert not result.cancelled
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
    assert not result.cancelled
    assert [step.agent_id for step in result.steps] == [0]
    assert databot.calls == []


async def test_extract_turn_output_prefers_value() -> None:
    assert AgentTurnResult.extract_output({"value": "x"}) == "x"


def test_extract_turn_output_ignores_prior_reply() -> None:
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "messages": [
            HumanMessage(content="q1"),
            AIMessage(content="answer-1"),
            HumanMessage(content="q2"),
            AIMessage(content="idle reply for q2"),
        ]
    }
    assert AgentTurnResult.extract_output(state) == "idle reply for q2"


def test_extract_turn_output_prefers_current_reply() -> None:
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "messages": [
            HumanMessage(content="q1"),
            AIMessage(content="answer-1"),
            HumanMessage(content="q2"),
            AIMessage(content="answer-2"),
        ]
    }
    assert AgentTurnResult.extract_output(state) == "answer-2"


def test_extract_turn_output_empty_when_no_current_reply() -> None:
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "messages": [
            HumanMessage(content="q1"),
            AIMessage(content="answer-1"),
            HumanMessage(content="q2"),
        ]
    }
    assert AgentTurnResult.extract_output(state) == ""


async def test_receive_and_determine_contract() -> None:
    class _Fixed(AgentChain):
        def determine_next_agent(self, last_agent_id: int) -> int | None:
            return None

    chain = _Fixed()
    chain.receive_agent_status(7, {"user_question": "q", "status": "published"})
    assert chain.agent_status[7]["user_question"] == "q"
    assert chain.determine_next_agent(7) is None

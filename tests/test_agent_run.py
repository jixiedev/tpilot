from __future__ import annotations

from typing import Any

from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from typing_extensions import TypedDict

from tahoepilot.agent.agent import BaseAgent
from tahoepilot.agent.listener import AgentListener
from tahoepilot.agent.prompt import SystemPromptAssembler
from tahoepilot.agent.turn_messages import DefaultTurnMessagePolicy
from tahoepilot.settings.agent_config import AgentConfig, agent_config_path
from tahoepilot.agent.turn import AgentTurnResult
from langgraph.types import interrupt
from tahoepilot.memory.profile import UserProfile
from tahoepilot.memory.profile_store import FileProfileStore
from tahoepilot.memory.session_runtime import SessionRuntime
from tahoepilot.agent.session import SessionUserRequest
from tests.minimal_chat_model import MinimalChatModel


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


def _user_request(session: str, state: dict[str, Any]) -> SessionUserRequest:
    return SessionUserRequest(
        session,
        "u1",
        "hi",
        UserProfile(user_id="u1"),
        state,  # type: ignore[arg-type]
    )


async def test_ainvoke_resolving_interrupts_resumes() -> None:
    graph = _interrupt_graph()

    async def on_interrupt(question: str) -> str:
        assert question == "confirm?"
        return "yes"

    result = await AgentTurnResult.ainvoke(
        graph,
        _user_request("t-interrupt", {"messages": [], "value": ""}),
        on_interrupt=on_interrupt,
    )
    assert not result.cancelled
    assert result.state["value"] == "yes"


async def test_ainvoke_resolving_interrupts_cancelled() -> None:
    graph = _interrupt_graph()

    async def on_interrupt(_question: str) -> str | None:
        return None

    result = await AgentTurnResult.ainvoke(
        graph,
        _user_request("t-cancel", {"messages": [], "value": ""}),
        on_interrupt=on_interrupt,
    )
    assert result.cancelled
    assert AgentTurnResult.interrupt_question(result.state) == "confirm?"



async def test_base_agent_run_builds_graph_on_demand(tmp_path) -> None:
    from langgraph.checkpoint.memory import MemorySaver

    class _Tiny(BaseAgent):
        @classmethod
        async def create(cls, **_kwargs):
            model = MinimalChatModel()
            checkpointer = MemorySaver()
            return cls(
                model=model,
                checkpointer=checkpointer,
                session_runtime=SessionRuntime(FileProfileStore(tmp_path)),
                prompt_assembler=SystemPromptAssembler(AgentConfig(agent_config_path("base"))),
                turn_message_policy=DefaultTurnMessagePolicy(),
                agent_config=AgentConfig(agent_config_path("base")),
                listener=AgentListener(),
            )

        def build_graph(self, **_kwargs):
            g = StateGraph(_State)
            g.add_node("n", lambda s: {"value": "ok"})
            g.add_edge(START, "n")
            g.add_edge("n", END)
            self.graph = g.compile(checkpointer=self.checkpointer)
            return self.graph

    agent = await _Tiny.create()
    result = await agent.run("hi", session="s")
    assert not result.cancelled
    assert result.state["value"] == "ok"

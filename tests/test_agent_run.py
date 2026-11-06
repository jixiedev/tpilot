from __future__ import annotations

from typing import Any

from langchain_core.messages import HumanMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from typing_extensions import TypedDict

from agent.agent import BaseAgent
from agent.catalog import AgentCatalog, AgentCatalogSettings
from agent.listener import AgentListener
from agent.prompt import SystemPromptAssembler
from agent.turn_messages import DefaultTurnMessagePolicy
from config.agent_config import AgentConfig, agent_config_path
from agent.intent.orchestrator import IntentOrchestrator, IntentionResponse
from agent.turn import AgentTurnResult
from langgraph.types import interrupt
from memory.profile import UserProfile
from memory.profile_store import FileProfileStore
from memory.session_runtime import SessionRuntime
from agent.session import SessionUserRequest
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


async def test_intent_orchestrator_run_publishes_without_handoff_target_when_rejected(
    tmp_path,
) -> None:
    class _Model:
        def with_structured_output(self, _schema):
            return self

        def bind_tools(self, tools, **kwargs):
            return self

        def invoke(self, _messages):
            return IntentionResponse(
                user_intention="DATA",
                confidence=0.2,
                need_clarification="",
            )

    catalog = AgentCatalog(
        AgentCatalogSettings.for_agent(
            "intent",
            profile_store=FileProfileStore(tmp_path),
            model=_Model(),
            checkpointer=MemorySaver(),
        )
    )
    agent = await catalog.create("intent")
    result = await agent.run(
        "ambiguous",
        session="s-run",
        user_id="u1",
        print_output=False,
    )
    assert isinstance(result, AgentTurnResult)
    assert not result.cancelled
    assert result.state["status"] == "rejected"


async def test_intent_orchestrator_run_hands_off_composite_to_plan(tmp_path) -> None:
    from langgraph.graph import END, START, StateGraph

    class _Model:
        def with_structured_output(self, _schema):
            return self

        def bind_tools(self, tools, **kwargs):
            return self

        def invoke(self, _messages):
            return IntentionResponse(
                user_intentions=["KNOWLEDGE", "DATA"],
                confidence=0.95,
            )

    class _PlanWorker(BaseAgent):
        def __init__(self, profile_store: FileProfileStore) -> None:
            model = MinimalChatModel()
            checkpointer = MemorySaver()
            super().__init__(
                model=model,
                checkpointer=checkpointer,
                session_runtime=SessionRuntime(profile_store),
                prompt_assembler=SystemPromptAssembler(AgentConfig(agent_config_path("base"))),
                turn_message_policy=DefaultTurnMessagePolicy(),
                agent_config=AgentConfig(agent_config_path("base")),
                listener=AgentListener(),
            )
            self.prompts: list[str] = []

        def build_graph(self, **_kwargs):
            def node(state: _State) -> dict[str, Any]:
                return {"value": "planned"}

            g = StateGraph(_State)
            g.add_node("n", node)
            g.add_edge(START, "n")
            g.add_edge("n", END)
            self.graph = g.compile(checkpointer=self.checkpointer)
            return self.graph

        async def accept_user_request(self, user_prompt, session, user_id=None):
            request = await super().accept_user_request(user_prompt, session, user_id)
            self.prompts.append(user_prompt)
            return request

    plan = _PlanWorker(FileProfileStore(tmp_path))
    plan.build_graph()

    catalog = AgentCatalog(
        AgentCatalogSettings.for_agent(
            "intent",
            profile_store=FileProfileStore(tmp_path),
            model=_Model(),
            checkpointer=MemorySaver(),
        )
    )
    agent = await catalog.create("intent")

    async def _get_plan(_name: str) -> BaseAgent:
        assert _name == "plan"
        return plan

    agent._catalog.get_or_create = _get_plan  # type: ignore[method-assign]

    result = await agent.run(
        "GMV yesterday with official definition",
        session="s-plan-run",
        user_id="u1",
        print_output=False,
    )
    assert not result.cancelled
    assert result.state["value"] == "planned"
    assert result.state["route_target"] == "plan"
    assert plan.prompts == ["GMV yesterday with official definition"]


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

"""Lead agent: delegation, gate interrupts through the lead, plan bookkeeping."""

from __future__ import annotations

import uuid
from typing import Any

import pytest
from langchain_core.messages import AIMessage, ToolMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import interrupt

from tahoepilot.agent.agent import BaseAgent
from tahoepilot.agent.catalog import AgentCatalog, AgentCatalogSettings
from tahoepilot.agent.lead.prompt import delegatable_agents, lead_step_prompt
from tahoepilot.agent.lead.state import mark_step, normalize_steps, turn_finish, turn_start
from tahoepilot.agent.listener import AgentListener
from tahoepilot.agent.subagent import SubagentResult, SubagentTask, compact_work_record
from tahoepilot.agent.turn_messages import DefaultTurnMessagePolicy
from tahoepilot.agent.prompt import SystemPromptAssembler
from tahoepilot.agent.graph.state import SessionAgentState
from tahoepilot.memory.profile_store import FileProfileStore

GATEBOT = "gatebot"


class _ScriptedModel:
    """Returns scripted AI messages in order; records the prompts it was given."""

    def __init__(self, responses: list[AIMessage]) -> None:
        self._responses = responses
        self.calls = 0
        self.prompts: list[list[Any]] = []

    def bind_tools(self, tools, **kwargs):
        return self

    def invoke(self, messages, *args, **kwargs):
        self.prompts.append(list(messages))
        response = self._responses[min(self.calls, len(self._responses) - 1)]
        self.calls += 1
        return response


def _call(name: str, args: dict[str, Any]) -> AIMessage:
    return AIMessage(
        content="",
        tool_calls=[{"name": name, "args": args, "id": f"call-{uuid.uuid4().hex[:8]}"}],
    )


class _GateBot(BaseAgent):
    """Specialist with one human gate between a work node and the answer."""

    runs: dict[str, int] = {"work": 0, "gate": 0}
    seen_prompts: list[str] = []

    def __init__(self, **kwargs: Any) -> None:
        config = kwargs["agent_config"]
        super().__init__(
            model=kwargs["model"],
            checkpointer=kwargs["checkpointer"],
            session_runtime=kwargs["session_runtime"],
            prompt_assembler=SystemPromptAssembler(config),
            turn_message_policy=DefaultTurnMessagePolicy(),
            agent_config=config,
            listener=AgentListener(),
        )

    def build_graph(self, **kwargs: Any):
        if self.graph is not None:
            return self.graph

        def work(state):
            type(self).runs["work"] += 1
            type(self).seen_prompts.append(state["messages"][-1].content)
            return {}

        def gate(state):
            type(self).runs["gate"] += 1
            decision = interrupt({"id": "gatebot-gate", "question": "approve the query?"})
            if decision != "approve":
                return {"messages": [AIMessage(content="")]}
            return {"messages": [AIMessage(content="There were 42 orders.")]}

        graph = StateGraph(SessionAgentState)
        graph.add_node("work", work)
        graph.add_node("gate", gate)
        graph.add_edge(START, "work")
        graph.add_edge("work", "gate")
        graph.add_edge("gate", END)
        self.graph = graph.compile(checkpointer=self.checkpointer)
        return self.graph

    def result_from_state(self, state) -> SubagentResult:
        result = super().result_from_state(state)
        result.artifacts = {"row_count": 42}
        result.ui_state = {"stage": "summary"}
        return result


@pytest.fixture
def gatebot():
    async def factory(**kwargs: Any) -> BaseAgent:
        return AgentCatalog._new_agent(_GateBot, **kwargs)

    AgentCatalog.register(GATEBOT, factory, config=AgentCatalog.config("knowledge"))
    _GateBot.runs = {"work": 0, "gate": 0}
    _GateBot.seen_prompts = []
    try:
        yield
    finally:
        AgentCatalog.unregister(GATEBOT)


async def _lead(tmp_path, model: _ScriptedModel):
    catalog = AgentCatalog(
        AgentCatalogSettings(
            profile_store=FileProfileStore(tmp_path),
            model=model,  # type: ignore[arg-type]
            checkpointer=MemorySaver(),
        )
    )
    return await catalog.create("lead", listener=AgentListener())


async def test_gate_interrupt_passes_through_lead_and_resumes(tmp_path, gatebot) -> None:
    model = _ScriptedModel(
        [
            _call("delegate", {"agent": GATEBOT, "task": "Count EU orders in October 2026"}),
            AIMessage(content="42 EU orders in October 2026 (from gatebot)."),
        ]
    )
    lead = await _lead(tmp_path, model)
    questions: list[str] = []

    async def on_interrupt(question: str) -> str:
        questions.append(question)
        return "approve"

    result = await lead.run(
        "how many EU orders last month?", session="s1", on_interrupt=on_interrupt
    )

    assert questions == ["approve the query?"]
    # The specialist resumed at its gate: the work node ran once, the gate twice
    # (first run + resume), as LangGraph re-runs only the interrupted node.
    assert _GateBot.runs == {"work": 1, "gate": 2}
    assert "The user asked:\nhow many EU orders last month?" in _GateBot.seen_prompts[0]
    assert "Count EU orders in October 2026" in _GateBot.seen_prompts[0]

    state = result.state
    assert state["messages"][-1].content.startswith("42 EU orders")
    tool = next(m for m in state["messages"] if isinstance(m, ToolMessage))
    assert tool.name == "delegate" and '"status": "done"' in tool.content
    [entry] = state["work_record"]
    assert entry["agent"] == GATEBOT
    assert entry["artifacts"] == {"row_count": 42}
    assert entry["turn"] == 1
    assert state["active_subagent"] == {"name": GATEBOT, "state": {"stage": "summary"}}
    assert state["turn_delegations"] == 1


async def test_halted_gate_is_reported_and_record_survives_next_turn(tmp_path, gatebot) -> None:
    model = _ScriptedModel(
        [
            _call("delegate", {"agent": GATEBOT, "task": "Count orders"}),
            AIMessage(content="You stopped the query."),
            AIMessage(content="Hello again."),
        ]
    )
    lead = await _lead(tmp_path, model)

    async def deny(question: str) -> str:
        return "deny"

    first = await lead.run("count orders", session="s2", on_interrupt=deny)
    assert first.state["work_record"][0]["status"] == "failed"  # empty answer → failed

    second = await lead.run("hi", session="s2", on_interrupt=deny)
    assert second.state["turn_index"] == 2
    assert second.state["turn_delegations"] == 0
    assert len(second.state["work_record"]) == 1
    # The step prompt shows the record from the earlier turn.
    last_prompt = "\n".join(str(m.content) for m in model.prompts[-1])
    assert "Work record" in last_prompt and GATEBOT in last_prompt


async def test_unknown_agent_and_budget_are_tool_errors(tmp_path, gatebot) -> None:
    model = _ScriptedModel(
        [
            _call("delegate", {"agent": "nobody", "task": "x"}),
            AIMessage(content="done"),
        ]
    )
    lead = await _lead(tmp_path, model)
    result = await lead.run("x", session="s3")
    tool = next(m for m in result.state["messages"] if isinstance(m, ToolMessage))
    assert "Unknown agent 'nobody'" in tool.content
    assert result.state["work_record"] == []


async def test_plan_steps_are_marked_by_delegate_and_leftovers_skipped(tmp_path, gatebot) -> None:
    model = _ScriptedModel(
        [
            _call(
                "write_plan",
                {
                    "steps": [
                        {"text": "count orders", "agent": GATEBOT},
                        {"text": "explain the trend", "agent": "knowledge"},
                    ]
                },
            ),
            _call("delegate", {"agent": GATEBOT, "task": "count orders"}),
            AIMessage(content="42 orders; I skipped the trend step."),
        ]
    )
    lead = await _lead(tmp_path, model)

    async def approve(question: str) -> str:
        return "approve"

    result = await lead.run("count and explain", session="s4", on_interrupt=approve)
    plan = result.state["plan"]
    assert [s["status"] for s in plan] == ["done", "skipped"]
    assert result.state["work_record"][0]["step"] == 1
    # After the delegate returned, the step prompt showed the plan and the pending step.
    prompt = "\n".join(str(m.content) for m in model.prompts[2])
    assert "A specialist just returned" in prompt
    assert "Steps 2 are still pending" in prompt


def test_write_plan_validation() -> None:
    agents = frozenset({"databot", "knowledge"})
    assert normalize_steps([{"text": "a", "agent": "DataBot"}], known_agents=agents) == [
        {"text": "a", "agent": "databot", "status": "pending"}
    ]
    with pytest.raises(ValueError, match="at least one step"):
        normalize_steps([], known_agents=agents)
    with pytest.raises(ValueError, match="unknown agent"):
        normalize_steps([{"text": "a", "agent": "x"}], known_agents=agents)
    with pytest.raises(ValueError, match="unknown status"):
        normalize_steps([{"text": "a", "status": "later"}], known_agents=agents)


def test_mark_step_matches_explicit_then_agent_then_appends() -> None:
    plan = [
        {"text": "a", "agent": "knowledge", "status": "pending"},
        {"text": "b", "agent": "databot", "status": "pending"},
    ]
    marked, step = mark_step(plan, step=None, agent="databot", task="b", result_status="done")
    assert step == 2 and marked[1]["status"] == "done"
    marked, step = mark_step(marked, step=1, agent="databot", task="a", result_status="halted")
    assert step == 1 and marked[0]["status"] == "blocked"
    marked, step = mark_step(marked, step=None, agent="swe", task="c", result_status="failed")
    assert step == 3 and marked[2] == {"text": "c", "agent": "swe", "status": "failed", "added": True}
    assert mark_step([], step=None, agent="swe", task="c", result_status="done") == ([], None)


def test_turn_start_and_finish() -> None:
    record = [{"agent": "databot", "summary": "x" * 500, "artifacts": {"sql": "s"}}] * 30
    from langchain_core.messages import HumanMessage

    started = turn_start({"messages": [HumanMessage(content="q")], "turn_index": 2, "work_record": record})
    assert started["user_question"] == "q"
    assert started["turn_index"] == 3
    assert started["plan"] == [] and started["turn_delegations"] == 0
    assert len(started["work_record"]) == 20
    assert started["work_record"][0]["artifacts"] == {}
    assert started["work_record"][-1]["artifacts"] == {"sql": "s"}
    assert turn_finish({"plan": [{"status": "done"}, {"status": "pending"}]}) == {
        "plan": [{"status": "done"}, {"status": "skipped"}]
    }
    assert turn_finish({"plan": [{"status": "done"}]}) == {}


def test_step_prompt_nudges_plan_after_repeated_delegations() -> None:
    prompt = lead_step_prompt({"messages": [], "turn_delegations": 2})
    assert "without a plan" in prompt
    assert "without a plan" not in lead_step_prompt({"messages": [], "turn_delegations": 1})


def test_subagent_task_prompt_and_compaction() -> None:
    task = SubagentTask(agent="databot", task="Count orders", context="Use fct_orders", user_question="orders?")
    text = task.prompt()
    assert text.index("The user asked") < text.index("Your task") < text.index("Context")
    same = SubagentTask(agent="databot", task="orders?", user_question="orders?")
    assert "The user asked" not in same.prompt()
    assert compact_work_record([{"summary": "s"}], keep=5) == [{"summary": "s"}]


def test_delegatable_agents_exclude_lead() -> None:
    names = delegatable_agents()
    assert "lead" not in names and "warehouse" in names
    # Front agents talk to the user on their own page; the lead never delegates to them.
    assert "databot" not in names


async def test_parallel_delegations_run_one_at_a_time(tmp_path, gatebot) -> None:
    both = AIMessage(
        content="",
        tool_calls=[
            {"name": "delegate", "args": {"agent": GATEBOT, "task": "a"}, "id": "first"},
            {"name": "delegate", "args": {"agent": GATEBOT, "task": "b"}, "id": "second"},
        ],
    )
    model = _ScriptedModel([both, AIMessage(content="done")])
    lead = await _lead(tmp_path, model)

    async def approve(question: str) -> str:
        return "approve"

    result = await lead.run("a and b", session="s5", on_interrupt=approve)
    tools = {m.tool_call_id: m.content for m in result.state["messages"] if isinstance(m, ToolMessage)}
    assert '"status": "done"' in tools["first"]
    assert "Only one delegation runs per step" in tools["second"]
    assert _GateBot.runs["work"] == 1


class _LayerState(SessionAgentState, total=False):
    note: str


class _LayeredBot(_GateBot):
    """Gate inside a declared layer subgraph, like databot's gates."""

    def build_graph(self, **kwargs: Any):
        if self.graph is not None:
            return self.graph

        def gate(state):
            decision = interrupt({"id": "layer-gate", "question": "ok?"})
            return {"messages": [AIMessage(content=f"{decision}: {state.get('note')}")]}

        inner = StateGraph(_LayerState)
        inner.add_node("gate", gate)
        inner.add_edge(START, "gate")
        inner.add_edge("gate", END)
        layer = inner.compile(checkpointer=self.checkpointer)

        def seed(state):
            return {"note": "draft"}

        outer = StateGraph(_LayerState)
        outer.add_node("seed", seed)
        outer.add_node("layer", layer)
        outer.add_edge(START, "seed")
        outer.add_edge("seed", "layer")
        outer.add_edge("layer", END)
        self.graph = outer.compile(checkpointer=self.checkpointer)
        return self.graph

    def ui_view(self, state):
        return {"note": state.get("note")}

    def result_from_state(self, state) -> SubagentResult:
        return BaseAgent.result_from_state(self, state)

    async def aget_active_snapshot(self, config):
        from tahoepilot.agent.specialists.databot.graph import DatabotGraphBuilder

        return await DatabotGraphBuilder.aget_active_state(self.build_graph(), config)


async def test_paused_specialist_view_and_patch_inside_layer(tmp_path) -> None:
    from langgraph.types import Command

    from tahoepilot.agent.lead.paused import (
        active_snapshot,
        find_paused_delegation,
        live_subagent_view,
        patch_paused_state,
    )

    async def factory(**kwargs: Any) -> BaseAgent:
        return AgentCatalog._new_agent(_LayeredBot, **kwargs)

    AgentCatalog.register("layerbot", factory, config=AgentCatalog.config("knowledge"))
    try:
        model = _ScriptedModel(
            [
                _call("delegate", {"agent": "layerbot", "task": "do it"}),
                AIMessage(content="finished"),
            ]
        )
        lead = await _lead(tmp_path, model)
        graph = lead.build_graph()
        config = {"configurable": {"thread_id": "paused-1"}}
        request = await lead.accept_user_request("go", "paused-1")
        first = await graph.ainvoke(request.state, config)
        assert first["__interrupt__"][0].value["id"] == "layer-gate"

        # Root snapshot surfaces the specialist's interrupt (AG-UI reads it here).
        root = await graph.aget_state(config)
        assert [i.value["id"] for t in root.tasks for i in t.interrupts] == ["layer-gate"]

        assert await live_subagent_view(lead, config) == {
            "name": "layerbot",
            "state": {"note": "draft"},
            "paused": True,
        }
        paused = await find_paused_delegation(lead, config)
        assert paused is not None
        snapshot = await active_snapshot(paused)
        await patch_paused_state(paused, snapshot, {"note": "edited"})
        assert (await live_subagent_view(lead, config))["state"] == {"note": "edited"}

        final = await graph.ainvoke(Command(resume="approve"), config)
        tool = next(m for m in final["messages"] if isinstance(m, ToolMessage))
        assert "approve: edited" in tool.content
        assert final["active_subagent"] == {"name": "layerbot", "state": {"note": "edited"}}
        assert await live_subagent_view(lead, config) is None
    finally:
        AgentCatalog.unregister("layerbot")


async def test_write_plan_and_delegate_in_one_batch(tmp_path, gatebot) -> None:
    batch = AIMessage(
        content="",
        tool_calls=[
            {"name": "write_plan", "args": {"steps": [{"text": "count", "agent": GATEBOT}]}, "id": "p1"},
            {"name": "write_plan", "args": {"steps": [{"text": "other"}]}, "id": "p2"},
            {"name": "delegate", "args": {"agent": GATEBOT, "task": "count"}, "id": "d1"},
        ],
    )
    model = _ScriptedModel(
        [batch, _call("delegate", {"agent": GATEBOT, "task": "count", "step": 1}), AIMessage(content="42")]
    )
    lead = await _lead(tmp_path, model)

    async def approve(question: str) -> str:
        return "approve"

    result = await lead.run("count", session="s6", on_interrupt=approve)
    tools = {m.tool_call_id: m.content for m in result.state["messages"] if isinstance(m, ToolMessage)}
    assert tools["p1"].startswith("Plan saved")
    assert "only one `write_plan` per step" in tools["p2"]
    assert "`write_plan` is in the same step" in tools["d1"]
    assert [s["status"] for s in result.state["plan"]] == ["done"]
    assert _GateBot.runs["work"] == 1


class _ToolLoopModel:
    """Fake chat model for a ReAct specialist: N tool rounds, then a final answer."""

    def __init__(self, rounds: int) -> None:
        self.rounds = rounds
        self.calls = 0

    def bind_tools(self, tools, **kwargs):
        return self

    def invoke(self, messages, *args, **kwargs):
        self.calls += 1
        if self.calls <= self.rounds:
            return _call("describe", {"table": f"t{self.calls}"})
        return AIMessage(content="final answer")


class _BigState(SessionAgentState, total=False):
    tool_call_count: int
    idle_reason_rounds: int
    failed_tools: list
    cards: list


def _make_loopbot(rounds: int, state_bytes: int = 0):
    from langchain_core.tools import tool

    from tahoepilot.agent.router import CompletionToolRouter
    from tahoepilot.agent.graph.builder import ReactLoopSpec, ReactStateSpec, build_react_graph

    @tool
    def describe(table: str) -> str:
        """Describe a table."""
        return "col_a varchar, col_b integer"

    class _LoopBot(_GateBot):
        def build_graph(self, **kwargs: Any):
            if self.graph is None:
                def init(state):
                    return {"cards": ["x" * state_bytes], "tool_call_count": 0, "idle_reason_rounds": 0}

                self.graph = build_react_graph(
                    _ToolLoopModel(rounds),  # type: ignore[arg-type]
                    [describe],
                    checkpointer=self.checkpointer,
                    router=CompletionToolRouter({"max_tool_calls": 100}),
                    loop=ReactLoopSpec(next_step_prompt="go", max_tool_calls=100),
                    state=ReactStateSpec(state_class=_BigState, turn_init=init),
                )
            return self.graph

        def result_from_state(self, state) -> SubagentResult:
            return BaseAgent.result_from_state(self, state)

    return _LoopBot


async def test_nested_specialist_is_not_capped_by_default_recursion_limit(tmp_path) -> None:
    """15 tool rounds is ~31 graph steps: over LangGraph's default limit of 25."""
    loopbot = _make_loopbot(rounds=15)

    async def factory(**kwargs: Any) -> BaseAgent:
        return AgentCatalog._new_agent(loopbot, **kwargs)

    AgentCatalog.register("loopbot", factory, config=AgentCatalog.config("knowledge"))
    try:
        model = _ScriptedModel(
            [_call("delegate", {"agent": "loopbot", "task": "describe tables"}), AIMessage(content="done")]
        )
        lead = await _lead(tmp_path, model)
        result = await lead.run("go", session="s-long")
        [entry] = result.state["work_record"]
        assert entry["status"] == "done", entry["summary"]
        assert entry["summary"] == "final answer"
    finally:
        AgentCatalog.unregister("loopbot")


def test_databot_nothing_to_review_is_failed_not_halted() -> None:
    from types import SimpleNamespace

    from tahoepilot.agent.specialists.databot.databot_agent import DatabotAgent
    from tahoepilot.agent.specialists.databot.gates import NOTHING_TO_REVIEW_CARDS

    agent = object.__new__(DatabotAgent)  # result_from_state needs no runtime
    agent.agent_config = SimpleNamespace(name="databot")
    base = {"messages": [AIMessage(content="No matching tables.")]}
    stopped = DatabotAgent.result_from_state(agent, {**base, "halt_reason": NOTHING_TO_REVIEW_CARDS})
    assert stopped.status == "failed"
    assert stopped.artifacts["halt_reason"] == NOTHING_TO_REVIEW_CARDS
    reviewer = DatabotAgent.result_from_state(
        agent,
        {
            **base,
            "halt_reason": "wrong tables",
            "gate_decisions": [{"gate": "cards", "decision": "deny-halt", "comments": "wrong tables"}],
        },
    )
    assert reviewer.status == "halted"


def test_databot_result_carries_leading_rows_for_the_lead() -> None:
    """A weak summary must not leave the lead without numbers."""
    from types import SimpleNamespace

    from tahoepilot.agent.specialists.databot.databot_agent import DatabotAgent

    agent = object.__new__(DatabotAgent)
    agent.agent_config = SimpleNamespace(name="databot")
    rows = [{"grain": "month", "period": "2026-10-01", "gmv": 1234.5}] + [
        {"grain": "day", "period": f"2026-10-{d:02d}", "gmv": d} for d in range(1, 32)
    ]
    result = DatabotAgent.result_from_state(
        agent,
        {
            "messages": [AIMessage(content="I finished the query.")],
            "execution_result": {"ok": True, "columns": ["grain", "period", "gmv"], "rows": rows, "row_count": 32},
        },
    )
    leading = result.artifacts["execution"]["leading_rows"]
    assert leading[0]["gmv"] == 1234.5
    assert len(leading) == 20


def test_fallback_summary_includes_values() -> None:
    from tahoepilot.agent.specialists.databot.graph import DatabotTopology

    text = DatabotTopology._fallback_turn_summary(
        {
            "approved_cards": [{"name": "order_level"}],
            "execution_result": {"ok": True, "rows": [{"period": "2026-10-01", "gmv": 1234.5}]},
        },
        "wish gmv last month",
    )
    assert "1234.5" in text and "Leading rows" in text

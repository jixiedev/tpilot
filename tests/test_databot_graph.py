"""End-to-end smoke test for the Databot v2 graph.

Drives the state machine from a seeded ``DatabotState`` through the
SQL gate and into ``execute_sql``. Asserts the wiring, not the LLM
quality — the model is a stub that emits a ``chat_completion`` tool
call so each per-stage ReAct subgraph exits cleanly.
"""

from __future__ import annotations

import pytest
from langchain_core.language_models.fake_chat_models import FakeMessagesListChatModel
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage
from langchain_core.tools import tool
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command

from agent.react.databot.graph import build_databot_graph
from agent.react.databot.state import DatabotState


class _ExitStageModel(FakeMessagesListChatModel):
    """Stub model that always emits a ``chat_completion`` tool call.

    This lets each per-stage ReAct subgraph exit on the very first
    ``step_llm`` → ``step_tools`` cycle, so the test can drive the
    outer state machine without depending on real LLM behavior.
    """

    def bind_tools(self, tools, **kwargs):  # type: ignore[override]
        return self

    def _generate(self, messages, stop=None, **kwargs):
        from langchain_core.outputs import ChatGeneration, ChatResult

        # Detect whether we're in the fetch or SQL stage by reading the
        # system prompt; emit stage-appropriate side effects (calls) so
        # the gate's reason map is populated when the gate fires.
        tool_calls = [
            {
                "name": "chat_completion",
                "args": {"reply": "stage done"},
                "id": "call_1",
            }
        ]
        return ChatResult(
            generations=[ChatGeneration(message=AIMessage(content="ok", tool_calls=tool_calls))]
        )


def _make_tool(name: str):
    @tool
    def _stub(**kwargs) -> dict:
        """stub tool"""
        return {}

    _stub.name = name
    return _stub


@pytest.fixture
def compiled_graph():
    fetch_related = _make_tool("fetch_related_models")
    add_card = _make_tool("add_card_to_state")
    search = _make_tool("search")
    get_entities = _make_tool("get_entities")
    trino_run = _make_tool("trino_run_query")
    trino_explain = _make_tool("trino_explain")
    trino_desc = _make_tool("trino_desc_table")
    hive_desc = _make_tool("hive_desc_table")
    chat_completion = _make_tool("chat_completion")
    s3_list = _make_tool("s3_list_objects")
    s3_head = _make_tool("s3_head_object")
    s3_get = _make_tool("s3_get_object")

    all_tools = [
        fetch_related, add_card, search, get_entities,
        trino_run, trino_explain, trino_desc, hive_desc, chat_completion,
        s3_list, s3_head, s3_get,
    ]
    rag_tools = [fetch_related, add_card]
    model = _ExitStageModel(responses=[AIMessage(content="ok")])
    graph = build_databot_graph(
        model, all_tools, rag_tools, checkpointer=MemorySaver()
    )
    return graph, trino_run


def _seed(stage: str, **overrides) -> DatabotState:
    base: DatabotState = {
        "messages": [HumanMessage(content="how many orders yesterday?")],
        "session_name": "t1",
        "user_id": "alice",
        "tool_call_count": 0,
        "idle_rounds": 0,
        "autonomous_compact_requested": False,
        "failed_tools": [],
        "stage": stage,  # type: ignore[typeddict-item]
        "staging_cards": [],
        "candidate_cards": [],
        "selected_cards": [{"name": "orders_daily"}],
        "approved_cards": [],
        "metric_conflicts": [],
        "draft_sql": "",
        "approved_sql": "",
        "sql_validated": False,
        "execution_result": {},
        "gate_decisions": [],
        "cards_reasons": {
            "approve": "matches", "deny-comments": "risky",
            "deny-halt": "no", "dryrun": "safe",
        },
        "sql_reasons": {
            "approve": "sql ok", "deny-comments": "wrong join",
            "deny-halt": "no", "dryrun": "safe",
        },
        "dryrun": False,
        "halt_reason": "",
        "chart_requested": False,
        "deny_feedback": "",
    }
    base.update(overrides)  # type: ignore[arg-type]
    return base


async def test_cards_gate_interrupt_carries_reasons(compiled_graph):
    graph, _ = compiled_graph
    result = await graph.ainvoke(
        _seed("gate_cards"),
        config={"configurable": {"thread_id": "t1"}},
    )
    assert "__interrupt__" in result
    interrupt_obj = result["__interrupt__"][0]
    # AG-UI v2 standard interrupt: {id, reason, message(JSON)}
    raw_message = getattr(interrupt_obj, "value", interrupt_obj)
    if isinstance(raw_message, str):
        import json
        payload = json.loads(raw_message)
    elif isinstance(raw_message, dict) and "message" in raw_message:
        import json
        payload = json.loads(raw_message["message"])
    else:
        payload = raw_message
    assert payload["gate"] == "cards"
    reasons = {opt["id"]: opt["reason"] for opt in payload["options"]}
    assert reasons["approve"] == "matches"
    assert reasons["dryrun"] == "safe"


async def test_cards_gate_approve_promotes_to_sql_stage(compiled_graph):
    graph, _ = compiled_graph
    config = {"configurable": {"thread_id": "t1"}, "recursion_limit": 50}
    await graph.ainvoke(_seed("gate_cards"), config=config)
    # After the gate approves, the state machine moves to the SQL stage
    # and its subgraph fires. Our stub emits a ``chat_completion`` so the
    # subgraph exits, then the SQL gate interrupts.
    r2 = await graph.ainvoke(Command(resume="approve"), config=config)
    # The SQL gate is now blocking; the interrupt is the new top-level
    # ``__interrupt__`` and ``stage`` stayed at the value the gate-cards
    # node wrote (``sql``) until the SQL gate resolves.
    assert "__interrupt__" in r2
    interrupt_obj = r2["__interrupt__"][0]
    raw_message = getattr(interrupt_obj, "value", interrupt_obj)
    if isinstance(raw_message, str):
        import json
        payload = json.loads(raw_message)
    elif isinstance(raw_message, dict) and "message" in raw_message:
        import json
        payload = json.loads(raw_message["message"])
    else:
        payload = raw_message
    assert payload["gate"] == "sql"
    assert r2.get("approved_cards") == [{"name": "orders_daily"}]
    assert any(
        entry.get("decision") == "approve" and entry.get("gate") == "cards"
        for entry in (r2.get("gate_decisions") or [])
    )


async def test_sql_gate_approve_runs_execute(compiled_graph):
    graph, _ = compiled_graph
    config = {"configurable": {"thread_id": "t1"}, "recursion_limit": 50}
    seed = _seed(
        "gate_sql",
        approved_cards=[{"name": "orders_daily"}],
        draft_sql="SELECT count(*) FROM orders_daily",
        sql_validated=True,
    )
    await graph.ainvoke(seed, config=config)
    r2 = await graph.ainvoke(Command(resume="approve"), config=config)
    assert r2.get("approved_sql") == "SELECT count(*) FROM orders_daily"
    result = r2.get("execution_result") or {}
    # The stub trino_run_query returns {} but the node wraps it.
    assert result.get("ok") is True
    assert r2.get("stage") in {"chart", "done"}


async def test_cards_gate_deny_halt_routes_to_refusal(compiled_graph):
    graph, _ = compiled_graph
    config = {"configurable": {"thread_id": "t1"}}
    await graph.ainvoke(_seed("gate_cards"), config=config)
    r2 = await graph.ainvoke(
        Command(resume="deny-halt"),
        config=config,
    )
    assert r2.get("stage") == "done"
    # The refusal branch appended a final AI message.
    assert any(
        getattr(m, "type", None) == "ai" and "halted" in m.content
        for m in (r2.get("messages") or [])
    )


async def test_cards_gate_deny_with_comments_loops_back(compiled_graph):
    graph, _ = compiled_graph
    config = {"configurable": {"thread_id": "t1"}, "recursion_limit": 50}
    await graph.ainvoke(_seed("gate_cards"), config=config)
    r2 = await graph.ainvoke(
        Command(resume='{"decision":"deny-comments","comments":"use daily_orders instead"}'),
        config=config,
    )
    # After deny-comments the gate writes ``stage="fetch"`` and routes
    # back into ``fetch_cards``. The subgraph (stub model) exits via
    # ``chat_completion``; the post-subgraph bridge node then advances
    # ``stage`` to ``"gate_cards"`` so the human sees the re-picked
    # selection. We don't have to wait for the next interrupt — the
    # state right after the bridge is what we want to assert.
    assert r2.get("stage") == "gate_cards"
    assert r2.get("deny_feedback") == "use daily_orders instead"
    audit = r2.get("gate_decisions") or []
    assert any(
        entry.get("decision") == "deny-comments"
        and entry.get("comments") == "use daily_orders instead"
        for entry in audit
    )


def test_stage_done_follow_up_always_restarts_fetch():
    from agent.react.databot.graph import make_databot_entry_node, _stage_route
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "stage": "done",
        "approved_cards": [{"name": "daily_rev_tahoe"}],
        "selected_cards": [{"name": "daily_rev_tahoe"}],
        "execution_result": {"ok": True, "rows": [[1, 2]]},
        "messages": [
            HumanMessage(content="wish上个月订单数和revenue"),
            AIMessage(content="done"),
            HumanMessage(content="我要的是revenue，你给我的是gmv"),
        ],
    }
    patch = make_databot_entry_node("")(state)  # type: ignore[arg-type]
    assert patch.get("stage") == "fetch"
    assert patch.get("approved_cards") == []
    assert patch.get("execution_result") == {}
    assert len(state["messages"]) == 3
    merged = {**state, **patch}
    assert _stage_route(merged) == "fetch_cards"


def test_stage_done_new_question_still_starts_fetch():
    from agent.react.databot.graph import make_databot_entry_node, _stage_route
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "stage": "done",
        "execution_result": {"ok": True},
        "messages": [
            HumanMessage(content="wish上个月订单数"),
            AIMessage(content="done"),
            HumanMessage(content="wish上个月的gmv是多少"),
        ],
    }
    patch = make_databot_entry_node("")(state)  # type: ignore[arg-type]
    assert patch.get("stage") == "fetch"
    merged = {**state, **patch}
    assert _stage_route(merged) == "fetch_cards"


def test_stage_done_with_trailing_human_starts_new_fetch():
    from agent.react.databot.graph import _stage_route, make_databot_entry_node
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "stage": "done",
        "messages": [
            HumanMessage(content="first"),
            AIMessage(content="done"),
            HumanMessage(content="second"),
        ],
    }
    patch = make_databot_entry_node("")(state)  # type: ignore[arg-type]
    assert patch.get("stage") == "fetch"
    merged = {**state, **patch}
    assert _stage_route(merged) == "fetch_cards"


def test_stage_done_without_trailing_human_ends_turn():
    from agent.react.databot.graph import _stage_route
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "stage": "done",
        "messages": [HumanMessage(content="first"), AIMessage(content="done")],
    }
    assert _stage_route(state) == "end_with_summary"


def test_after_gate_sql_deny_comments_routes_to_generate_sql():
    from agent.react.databot.graph import _after_gate_sql

    state = {
        "stage": "sql",
        "deny_feedback": "use commission_revenue not gmv",
    }
    assert _after_gate_sql(state) == "generate_sql"


def test_after_gate_sql_approve_routes_to_write_sql_artifact():
    from agent.react.databot.graph import _after_gate_sql

    state = {"stage": "execute", "approved_sql": "SELECT 1"}
    assert _after_gate_sql(state) == "write_sql_artifact"


async def test_sql_gate_deny_comments_clears_sql_contract(compiled_graph):
    graph, _ = compiled_graph
    config = {"configurable": {"thread_id": "sql-deny"}, "recursion_limit": 50}
    seed = _seed(
        "gate_sql",
        approved_cards=[{"name": "orders_daily"}],
        draft_sql="SELECT sum(gmv) FROM orders_daily",
        sql_validated=True,
    )
    await graph.ainvoke(seed, config=config)
    r2 = await graph.ainvoke(
        Command(
            resume='{"decision":"deny-comments","comments":"use commission_revenue not gmv"}'
        ),
        config=config,
    )
    assert r2.get("deny_feedback") == "use commission_revenue not gmv"
    assert r2.get("draft_sql") == ""
    assert r2.get("sql_reasons") == {}
    assert "__interrupt__" in r2
    interrupt_obj = r2["__interrupt__"][0]
    raw_message = getattr(interrupt_obj, "value", interrupt_obj)
    if isinstance(raw_message, str):
        import json
        payload = json.loads(raw_message)
    elif isinstance(raw_message, dict) and "message" in raw_message:
        import json
        payload = json.loads(raw_message["message"])
    else:
        payload = raw_message
    assert payload["gate"] == "sql"


async def test_chart_question_does_not_interrupt(compiled_graph):
    graph, _ = compiled_graph
    result = await graph.ainvoke(
        _seed("chart", execution_result={"ok": True}),
        config={"configurable": {"thread_id": "chart-no-block"}},
    )
    assert "__interrupt__" not in result
    assert result.get("stage") == "done"
    assert result.get("chart_requested") is False


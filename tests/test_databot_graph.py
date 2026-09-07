"""End-to-end smoke test for the Databot v2 graph.

Drives the state machine from a seeded ``DatabotState`` through the
SQL gate and into ``execute_sql``. Asserts the wiring, not the LLM
quality — the model is a stub that returns plain assistant text
call so each per-stage ReAct subgraph exits cleanly.
"""

from __future__ import annotations

import pytest
from langchain_core.language_models.fake_chat_models import FakeMessagesListChatModel
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage
from langchain_core.tools import tool
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command

from agent.specialists.databot._constants import (
    FOLLOW_UP_INTENTION_KNOWLEDGE,
    FOLLOW_UP_INTENTION_REQUERY,
    NODE_CLASSIFY_FOLLOW_UP,
    NODE_END_WITH_SUMMARY,
    NODE_FETCH_CARDS,
    NODE_GENERATE_SQL,
    NODE_KNOWLEDGE_FOLLOW_UP,
    NODE_WRITE_SQL_ARTIFACT,
    STAGE_DONE,
    STAGE_EXECUTE,
    STAGE_FETCH,
    STAGE_GATE_CARDS,
    STAGE_GATE_SQL,
    STAGE_SQL,
)
from agent.plan.stage_tools import SpecialistRunner
from agent.specialists.databot.graph import build_databot_graph
from agent.specialists.databot.state import DatabotState
from graph.builder import static_system_prompt
from agent.specialists.databot.tool_scopes import (
    REGISTRY_NAME,
    TOOL_ID_EXECUTE,
    TOOL_ID_FETCH,
    TOOL_ID_SQL,
)
from tools.bootstrap import ensure_tools_registered
from tools.common import register_tool_binding


from agent.turn import AgentTurnResult


class _FakeKnowledgeSpecialist:
    async def run(self, task: str, *, session: str, print_output: bool = False) -> AgentTurnResult:
        return AgentTurnResult(
            state={"messages": [AIMessage(content=f"knowledge answer for: {task}")]},
            cancelled=False,
        )


async def _fake_get_specialist(_name: str) -> _FakeKnowledgeSpecialist:
    return _FakeKnowledgeSpecialist()


def _test_runner() -> SpecialistRunner:
    return SpecialistRunner(get_specialist=_fake_get_specialist)


class _ExitStageModel(FakeMessagesListChatModel):
    """Stub model that returns assistant text with no tool calls.

    Staged subgraphs whose contract is unmet then idle-exit; tests that
    seed gate stages skip the ReAct loop entirely.
    """

    def bind_tools(self, tools, **kwargs):  # type: ignore[override]
        return self

    def _generate(self, messages, stop=None, **kwargs):
        from langchain_core.outputs import ChatGeneration, ChatResult

        return ChatResult(
            generations=[ChatGeneration(message=AIMessage(content="ok"))]
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
    ensure_tools_registered()
    fetch_related = _make_tool("fetch_related_models")
    add_card = _make_tool("commit_cards")
    search = _make_tool("search")
    get_entities = _make_tool("get_entities")
    trino_run = _make_tool("trino_run_query")
    trino_explain = _make_tool("trino_explain")
    trino_desc = _make_tool("trino_desc_table")
    hive_desc = _make_tool("hive_desc_table")

    for tool in (fetch_related, add_card, search, get_entities):
        register_tool_binding(f"{REGISTRY_NAME},{TOOL_ID_FETCH}", tool)
    for tool in (trino_explain, trino_desc, hive_desc):
        register_tool_binding(f"{REGISTRY_NAME},{TOOL_ID_SQL}", tool)
    register_tool_binding(f"{REGISTRY_NAME},{TOOL_ID_EXECUTE}", trino_run)

    model = _ExitStageModel(responses=[AIMessage(content="ok")])
    graph = build_databot_graph(
        model,
        checkpointer=MemorySaver(),
        runner=_test_runner(),
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
        "committed_cards": [],
        "review_cards": [{"name": "orders_daily"}],
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
        "parent_hitl_applied": 0,
        "follow_up_turn": False,
        "follow_up_intention": "",
        "cards_selection_summary": "",
    }
    base.update(overrides)  # type: ignore[arg-type]
    return base


async def test_cards_gate_interrupt_carries_reasons(compiled_graph):
    graph, _ = compiled_graph
    result = await graph.ainvoke(
        _seed(STAGE_GATE_CARDS),
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
    await graph.ainvoke(_seed(STAGE_GATE_CARDS), config=config)
    # After the gate approves, the state machine moves to the SQL stage
    # and its subgraph fires. The stub returns text with no tool calls so
    # the subgraph idle-exits, then the SQL gate interrupts.
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
        STAGE_GATE_SQL,
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
    assert r2.get("stage") == STAGE_DONE


async def test_cards_gate_deny_halt_routes_to_refusal(compiled_graph):
    graph, _ = compiled_graph
    config = {"configurable": {"thread_id": "t1"}}
    await graph.ainvoke(_seed(STAGE_GATE_CARDS), config=config)
    r2 = await graph.ainvoke(
        Command(resume="deny-halt"),
        config=config,
    )
    assert r2.get("stage") == STAGE_DONE
    # The refusal branch appended a final AI message.
    assert any(
        getattr(m, "type", None) == "ai" and "halted" in m.content
        for m in (r2.get("messages") or [])
    )


async def test_cards_gate_deny_with_comments_loops_back(compiled_graph):
    graph, _ = compiled_graph
    config = {"configurable": {"thread_id": "t1"}, "recursion_limit": 50}
    await graph.ainvoke(_seed(STAGE_GATE_CARDS), config=config)
    r2 = await graph.ainvoke(
        Command(resume='{"decision":"deny-comments","comments":"use daily_orders instead"}'),
        config=config,
    )
    # After deny-comments the gate writes ``stage="fetch"`` and routes
    # back into ``fetch_cards``. The subgraph (stub model) idle-exits;
    # the post-subgraph bridge node then advances
    # ``stage`` to ``"gate_cards"`` so the human sees the re-picked
    # selection. We don't have to wait for the next interrupt — the
    # state right after the bridge is what we want to assert.
    assert r2.get("stage") == STAGE_GATE_CARDS
    assert r2.get("deny_feedback") == "use daily_orders instead"
    audit = r2.get("gate_decisions") or []
    assert any(
        entry.get("decision") == "deny-comments"
        and entry.get("comments") == "use daily_orders instead"
        for entry in audit
    )


def test_stage_done_follow_up_preserves_artifacts_until_requery():
    from agent.specialists.databot.follow_up_intention import make_classify_follow_up_node
    from agent.specialists.databot.graph import (
        _route_after_classify_follow_up,
        _route_after_entry,
        make_databot_entry_node,
    )
    from langchain_core.language_models.fake_chat_models import FakeMessagesListChatModel
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "stage": STAGE_DONE,
        "approved_cards": [{"name": "daily_rev_tahoe"}],
        "draft_sql": "SELECT 1",
        "execution_result": {"ok": True, "rows": [[1, 2]]},
        "messages": [
            HumanMessage(content="wish上个月订单数和revenue"),
            AIMessage(content="done"),
            HumanMessage(content="buyer region 是什么意思"),
        ],
    }
    patch = make_databot_entry_node(static_system_prompt(""))(state)
    assert patch.get("follow_up_turn") is True
    assert patch.get("stage") is None
    assert patch.get("approved_cards") is None
    merged = {**state, **patch}
    assert merged["approved_cards"] == [{"name": "daily_rev_tahoe"}]
    assert _route_after_entry(merged) == NODE_CLASSIFY_FOLLOW_UP

    model = FakeMessagesListChatModel(
        responses=[AIMessage(content='{"intention": "knowledge", "reason": "definition"}')]
    )
    classify_patch = make_classify_follow_up_node(model)(merged)
    assert classify_patch.get("follow_up_intention") == FOLLOW_UP_INTENTION_KNOWLEDGE
    assert "approved_cards" not in classify_patch
    knowledge_merged = {**merged, **classify_patch}
    assert knowledge_merged["approved_cards"] == [{"name": "daily_rev_tahoe"}]
    assert _route_after_classify_follow_up(knowledge_merged) == NODE_KNOWLEDGE_FOLLOW_UP

    model_requery = FakeMessagesListChatModel(
        responses=[AIMessage(content='{"intention": "requery", "reason": "new metric"}')]
    )
    requery_patch = make_classify_follow_up_node(model_requery)(merged)
    assert requery_patch.get("follow_up_intention") == FOLLOW_UP_INTENTION_REQUERY
    assert "approved_cards" not in requery_patch
    assert requery_patch.get("stage") == STAGE_FETCH
    assert requery_patch.get("staging_cards") == []
    requery_merged = {**merged, **requery_patch}
    assert requery_merged["approved_cards"] == [{"name": "daily_rev_tahoe"}]
    assert _route_after_classify_follow_up(requery_merged) == NODE_FETCH_CARDS


def test_stage_done_follow_up_routes_through_classify():
    from agent.specialists.databot.graph import (
        _route_after_classify_follow_up,
        _route_after_entry,
        make_databot_entry_node,
    )
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "stage": STAGE_DONE,
        "approved_cards": [{"name": "daily_rev_tahoe"}],
        "review_cards": [{"name": "daily_rev_tahoe"}],
        "execution_result": {"ok": True, "rows": [[1, 2]]},
        "messages": [
            HumanMessage(content="wish上个月订单数和revenue"),
            AIMessage(content="done"),
            HumanMessage(content="我要的是revenue，你给我的是gmv"),
        ],
    }
    patch = make_databot_entry_node(static_system_prompt(""))(state)
    assert patch.get("follow_up_turn") is True
    merged = {**state, **patch}
    assert merged["approved_cards"] == [{"name": "daily_rev_tahoe"}]
    assert _route_after_entry(merged) == NODE_CLASSIFY_FOLLOW_UP
    merged["follow_up_intention"] = FOLLOW_UP_INTENTION_REQUERY
    merged["approved_cards"] = []
    merged["stage"] = STAGE_FETCH
    assert _route_after_classify_follow_up(merged) == NODE_FETCH_CARDS


def test_stage_done_new_question_still_starts_fetch_after_requery_intent():
    from agent.specialists.databot.graph import (
        _route_after_classify_follow_up,
        _route_after_entry,
        make_databot_entry_node,
    )
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "stage": STAGE_DONE,
        "execution_result": {"ok": True},
        "messages": [
            HumanMessage(content="wish上个月订单数"),
            AIMessage(content="done"),
            HumanMessage(content="wish上个月的gmv是多少"),
        ],
    }
    patch = make_databot_entry_node(static_system_prompt(""))(state)
    assert patch.get("follow_up_turn") is True
    merged = {**state, **patch}
    assert _route_after_entry(merged) == NODE_CLASSIFY_FOLLOW_UP
    merged["follow_up_intention"] = FOLLOW_UP_INTENTION_REQUERY
    merged["stage"] = STAGE_FETCH
    assert _route_after_classify_follow_up(merged) == NODE_FETCH_CARDS


def test_stage_done_with_trailing_human_starts_classify():
    from agent.specialists.databot.graph import (
        _route_after_classify_follow_up,
        _route_after_entry,
        make_databot_entry_node,
    )
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "stage": STAGE_DONE,
        "messages": [
            HumanMessage(content="first"),
            AIMessage(content="done"),
            HumanMessage(content="second"),
        ],
    }
    patch = make_databot_entry_node(static_system_prompt(""))(state)
    assert patch.get("follow_up_turn") is True
    merged = {**state, **patch}
    assert _route_after_entry(merged) == NODE_CLASSIFY_FOLLOW_UP
    merged["follow_up_intention"] = FOLLOW_UP_INTENTION_REQUERY
    merged["stage"] = STAGE_FETCH
    assert _route_after_classify_follow_up(merged) == NODE_FETCH_CARDS


def test_knowledge_follow_up_subgraph_persists_plain_text():
    from langgraph.checkpoint.memory import MemorySaver

    from agent.specialists.databot.subgraphs import build_knowledge_follow_up_subgraph

    class _BindToolsStub:
        def bind_tools(self, tools, **kwargs):
            return self

    graph = build_knowledge_follow_up_subgraph(
        _BindToolsStub(),
        _test_runner(),
        checkpointer=MemorySaver(),
        max_tool_calls=3,
    )
    assert "inject_completion_as_ai" not in graph.get_graph().nodes


def test_knowledge_follow_up_intention_routes_to_delegate_subgraph():
    from agent.specialists.databot.graph import _route_after_classify_follow_up

    state = {
        "stage": STAGE_FETCH,
        "follow_up_turn": True,
        "follow_up_intention": FOLLOW_UP_INTENTION_KNOWLEDGE,
        "messages": [],
    }
    assert _route_after_classify_follow_up(state) == NODE_KNOWLEDGE_FOLLOW_UP


def test_follow_up_route_map_covers_entry_and_classify_targets():
    from agent.specialists.databot.graph import (
        _AFTER_CLASSIFY_FOLLOW_UP_ROUTES,
        _route_after_classify_follow_up,
        _route_after_entry,
        make_databot_entry_node,
    )
    from langchain_core.messages import AIMessage, HumanMessage

    follow_up_state = {
        "stage": STAGE_DONE,
        "messages": [
            HumanMessage(content="first"),
            AIMessage(content="done"),
            HumanMessage(content="buyer region 是什么意思"),
        ],
    }
    patch = make_databot_entry_node(static_system_prompt(""))(follow_up_state)
    merged = {**follow_up_state, **patch}
    for router in (_route_after_entry, _route_after_classify_follow_up):
        for intention in (FOLLOW_UP_INTENTION_KNOWLEDGE, FOLLOW_UP_INTENTION_REQUERY, ""):
            state = {**merged, "follow_up_intention": intention}
            target = router(state)
            assert target in _AFTER_CLASSIFY_FOLLOW_UP_ROUTES, (
                f"{router.__name__} returned {target!r} missing from edge map"
            )


def test_stage_done_without_trailing_human_ends_turn():
    from agent.specialists.databot.graph import _stage_route
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "stage": STAGE_DONE,
        "messages": [HumanMessage(content="first"), AIMessage(content="done")],
    }
    assert _stage_route(state) == NODE_END_WITH_SUMMARY


def test_stage_done_with_trailing_tool_after_human_starts_classify():
    from agent.specialists.databot.graph import (
        _route_after_classify_follow_up,
        _route_after_entry,
        make_databot_entry_node,
    )
    from langchain_core.messages import AIMessage, HumanMessage, ToolMessage

    state = {
        "stage": STAGE_DONE,
        "messages": [
            HumanMessage(content="first"),
            AIMessage(content="done"),
            HumanMessage(content="second"),
            ToolMessage(content="{}", tool_call_id="tc-1"),
        ],
    }
    patch = make_databot_entry_node(static_system_prompt(""))(state)
    assert patch.get("follow_up_turn") is True
    merged = {**state, **patch}
    assert _route_after_entry(merged) == NODE_CLASSIFY_FOLLOW_UP
    merged["follow_up_intention"] = FOLLOW_UP_INTENTION_REQUERY
    merged["stage"] = STAGE_FETCH
    assert _route_after_classify_follow_up(merged) == NODE_FETCH_CARDS


def test_stage_done_answered_follow_up_does_not_restart_classify():
    from agent.specialists.databot.graph import (
        _route_after_entry,
        make_databot_entry_node,
    )
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "stage": STAGE_DONE,
        "messages": [
            HumanMessage(content="gmv by country"),
            AIMessage(content="here are the numbers"),
            HumanMessage(content="shipping_country 是什么意思"),
            AIMessage(content="买家收货国家，ISO alpha-2"),
        ],
    }
    patch = make_databot_entry_node(static_system_prompt(""))(state)
    assert patch.get("follow_up_turn") is False
    merged = {**state, **patch}
    assert _route_after_entry(merged) == NODE_END_WITH_SUMMARY


def test_stage_done_empty_trailing_human_does_not_restart_classify():
    from agent.specialists.databot.graph import (
        _route_after_entry,
        make_databot_entry_node,
    )
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "stage": STAGE_DONE,
        "messages": [
            HumanMessage(content="gmv by country"),
            AIMessage(content="done"),
            HumanMessage(content=""),
        ],
    }
    patch = make_databot_entry_node(static_system_prompt(""))(state)
    assert patch.get("follow_up_turn") is False
    merged = {**state, **patch}
    assert _route_after_entry(merged) == NODE_END_WITH_SUMMARY


def test_stage_done_with_replayed_human_does_not_start_new_fetch():
    from agent.specialists.databot.graph import _stage_route, make_databot_entry_node
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "stage": STAGE_DONE,
        "messages": [
            HumanMessage(content="first"),
            AIMessage(content="done"),
            HumanMessage(
                content="replayed follow-up",
                additional_kwargs={"replayed": True},
            ),
        ],
    }
    patch = make_databot_entry_node(static_system_prompt(""))(state)
    assert patch.get("stage") is None
    merged = {**state, **patch}
    assert _stage_route(merged) == NODE_END_WITH_SUMMARY


def test_stage_done_with_trailing_remove_does_not_start_new_fetch():
    from agent.specialists.databot.graph import _stage_route
    from langchain_core.messages import AIMessage, HumanMessage, RemoveMessage

    state = {
        "stage": STAGE_DONE,
        "messages": [
            HumanMessage(content="first"),
            AIMessage(content="done"),
            RemoveMessage(id="msg-old"),
        ],
    }
    assert _stage_route(state) == NODE_END_WITH_SUMMARY


def test_after_gate_sql_deny_comments_routes_to_generate_sql():
    from agent.specialists.databot.graph import _after_gate_sql

    state = {
        "stage": STAGE_SQL,
        "deny_feedback": "use commission_revenue not gmv",
    }
    assert _after_gate_sql(state) == NODE_GENERATE_SQL


def test_after_gate_sql_approve_routes_to_write_sql_artifact():
    from agent.specialists.databot.graph import _after_gate_sql

    state = {"stage": STAGE_EXECUTE, "approved_sql": "SELECT 1"}
    assert _after_gate_sql(state) == NODE_WRITE_SQL_ARTIFACT


async def test_sql_gate_deny_comments_clears_sql_contract(compiled_graph):
    graph, _ = compiled_graph
    config = {"configurable": {"thread_id": "sql-deny"}, "recursion_limit": 50}
    seed = _seed(
        STAGE_GATE_SQL,
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


async def test_execute_sql_routes_to_turn_summary(compiled_graph):
    graph, _ = compiled_graph
    result = await graph.ainvoke(
        _seed(
            STAGE_EXECUTE,
            approved_sql="SELECT 1",
            approved_cards=[{"name": "orders_daily"}],
        ),
        config={"configurable": {"thread_id": "execute-summary"}, "recursion_limit": 50},
    )
    assert "__interrupt__" not in result
    assert result.get("stage") == STAGE_DONE
    assert any(
        getattr(m, "type", None) == "ai"
        and not getattr(m, "tool_calls", None)
        and getattr(m, "content", None)
        for m in (result.get("messages") or [])
    )


def test_turn_summary_node_writes_assistant_message():
    from agent.specialists.databot.turn_summary import make_turn_summary_node

    model = FakeMessagesListChatModel(
        responses=[AIMessage(content="Orders yesterday: 1,234 rows returned.")]
    )
    node = make_turn_summary_node(model)
    state: DatabotState = {
        "messages": [HumanMessage(content="how many orders yesterday?")],
        "session_name": "t1",
        "user_id": "alice",
        "tool_call_count": 0,
        "idle_rounds": 0,
        "autonomous_compact_requested": False,
        "failed_tools": [],
        "stage": STAGE_DONE,
        "staging_cards": [],
        "committed_cards": [],
        "review_cards": [],
        "approved_cards": [{"name": "orders_daily"}],
        "metric_conflicts": [],
        "draft_sql": "",
        "approved_sql": "SELECT count(*) FROM orders_daily",
        "sql_validated": True,
        "execution_result": {"ok": True, "rows": [[1234]]},
        "gate_decisions": [],
        "cards_reasons": {},
        "sql_reasons": {},
        "dryrun": False,
        "halt_reason": "",
        "chart_requested": False,
        "deny_feedback": "",
    }
    patch = node(state)
    assert patch.get("stage") == STAGE_DONE
    messages = patch.get("messages") or []
    assert len(messages) == 1
    assert not getattr(messages[0], "tool_calls", None)
    assert "1,234" in messages[0].content


def test_turn_summary_writes_fallback_when_model_returns_think() -> None:
    from agent.specialists.databot.turn_summary import make_turn_summary_node

    model = FakeMessagesListChatModel(
        responses=[
            AIMessage(
                content=(
                    "<think>The user wants a summary. I should mention rows.</think>"
                )
            )
        ]
    )
    node = make_turn_summary_node(model)
    patch = node(
        {
            "messages": [
                HumanMessage(content="上个月各国 GMV"),
                AIMessage(content="internal planning leftover"),
            ],
            "approved_cards": [{"name": "fct_transaction_variations"}],
            "execution_result": {"ok": True, "rows": [[1], [2], [3]]},
            "dryrun": False,
        }
    )
    messages = patch.get("messages") or []
    assert not getattr(messages[0], "tool_calls", None)
    text = messages[0].content
    assert "<think>" not in text
    assert "fct_transaction_variations" in text
    assert "3" in text
    assert "Results" in text or "结果" in text


def test_turn_summary_uses_reasoning_content_when_message_body_empty() -> None:
    from agent.specialists.databot.turn_summary import make_turn_summary_node

    model = FakeMessagesListChatModel(
        responses=[
            AIMessage(
                content="",
                additional_kwargs={
                    "reasoning_content": (
                        "US led last month GMV at 465K, followed by AU and CH."
                    )
                },
            )
        ]
    )
    node = make_turn_summary_node(model)
    patch = node(
        {
            "messages": [HumanMessage(content="last month GMV by country")],
            "approved_cards": [{"name": "fct_transaction_variations"}],
            "execution_result": {"ok": True, "rows": [[1]]},
        }
    )
    reply = patch["messages"][0].content
    assert "465K" in reply


def test_turn_summary_uses_original_question_after_sql_gate_redrafts() -> None:
    from agent.specialists.databot.turn_summary import make_turn_summary_node

    captured: list[str] = []

    class _CaptureModel(FakeMessagesListChatModel):
        def invoke(self, input, config=None, **kwargs):
            for msg in input:
                if getattr(msg, "type", None) == "human":
                    captured.append(str(msg.content))
            return AIMessage(content="上月各国 GMV 已按 shipping_country 汇总。")

    model = _CaptureModel(responses=[AIMessage(content="unused")])
    node = make_turn_summary_node(model)
    patch = node(
        {
            "messages": [
                HumanMessage(content="上个月各国 GMV"),
                HumanMessage(
                    content=(
                        "SQL gate review — redraft and address this feedback:\n日期错了"
                    )
                ),
                HumanMessage(
                    content=(
                        "SQL gate review — redraft and address this feedback:\n"
                        "现在是2026.09.03"
                    )
                ),
            ],
            "approved_cards": [{"name": "fct_transaction_variations"}],
            "approved_sql": (
                "SELECT shipping_country, SUM(gmv_variation) AS gmv "
                "FROM hive.core_data.fct_transaction_variations "
                "WHERE dt >= '2026-08-01' AND dt < '2026-09-01' "
                "GROUP BY shipping_country"
            ),
            "execution_result": {"ok": True, "rows": [["US", 100]]},
            "gate_decisions": [
                {
                    "gate": "sql",
                    "decision": "deny-comments",
                    "comments": "日期错了",
                    "reasons": {},
                },
                {
                    "gate": "sql",
                    "decision": "deny-comments",
                    "comments": "现在是2026.09.03",
                    "reasons": {},
                },
            ],
        }
    )
    assert "上个月各国 GMV" in captured[0]
    assert "现在是2026.09.03" not in captured[0].split("User question:", 1)[-1].split(
        "\n", 1
    )[0]
    assert "GMV" in patch["messages"][0].content


def test_stage_done_plain_assistant_text_counts_as_answered() -> None:
    from agent.specialists.databot.graph import make_databot_entry_node
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "stage": STAGE_DONE,
        "messages": [
            HumanMessage(content="gmv by country"),
            AIMessage(content="US 465K"),
        ],
    }
    patch = make_databot_entry_node(static_system_prompt(""))(state)
    assert patch.get("follow_up_turn") is False


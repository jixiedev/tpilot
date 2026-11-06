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

from agent.specialists.databot.graph import DatabotGraphBuilder
from config.agent_config import DatabotAgentConfig, agent_config_path
from agent.specialists.databot.graph import (
    LAYER_PREPARE_CARDS,
    LAYER_SUMMARY,
    NODE_END_WITH_SUMMARY,
    NODE_EXECUTE_SQL,
    PHASE_EXECUTE_SQL,
    PHASE_PREPARE_CARDS,
    PHASE_PREPARE_SQL,
    PHASE_SUMMARY,
    REGISTRY_NAME,
    TOOL_ID_EXECUTE,
    TOOL_ID_FETCH,
    TOOL_ID_SQL,
)
from agent.specialists.databot.state import DatabotState
from tools.bootstrap import ensure_tools_registered
from tools.registry import register_tool_binding


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

    register_tool_binding(f"{REGISTRY_NAME},{TOOL_ID_FETCH}", fetch_related, replace=True)
    for tool in (add_card, search, get_entities):
        register_tool_binding(f"{REGISTRY_NAME},{TOOL_ID_FETCH}", tool)
    register_tool_binding(f"{REGISTRY_NAME},{TOOL_ID_SQL}", trino_explain, replace=True)
    for tool in (trino_desc, hive_desc):
        register_tool_binding(f"{REGISTRY_NAME},{TOOL_ID_SQL}", tool)
    register_tool_binding(f"{REGISTRY_NAME},{TOOL_ID_EXECUTE}", trino_run, replace=True)

    model = _ExitStageModel(responses=[AIMessage(content="ok")])
    graph = DatabotGraphBuilder.build(
        model,
        checkpointer=MemorySaver(),
        run_context=DatabotAgentConfig(agent_config_path("databot")).run_context,
    )
    return graph, trino_run


def test_root_graph_exposes_pipeline_nodes(compiled_graph):
    from agent.specialists.databot.graph import (
        LAYER_EXECUTE_SQL,
        LAYER_PREPARE_CARDS,
        LAYER_PREPARE_SQL,
        LAYER_SUMMARY,
    )

    graph, _ = compiled_graph
    nodes = set(graph.get_graph().nodes)
    assert {
        LAYER_PREPARE_CARDS,
        LAYER_PREPARE_SQL,
        LAYER_EXECUTE_SQL,
        LAYER_SUMMARY,
    }.issubset(nodes)
    assert "dispatch" not in nodes
    assert "layer_entry" not in nodes
    assert "classify_follow_up" not in nodes
    assert "knowledge_follow_up" not in nodes


def _seed(stage: str, **overrides) -> DatabotState:
    base: DatabotState = {
        "messages": [HumanMessage(content="how many orders yesterday?")],
        "session_name": "t1",
        "user_id": "alice",
        "history_cards": [],
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
        "deny_feedback": "",
        "cards_selection_summary": "",
    }
    base.update(overrides)  # type: ignore[arg-type]
    return base


async def test_cards_gate_interrupt_carries_reasons(compiled_graph):
    graph, _ = compiled_graph
    result = await graph.ainvoke(
        _seed(PHASE_PREPARE_CARDS),
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
    await graph.ainvoke(_seed(PHASE_PREPARE_CARDS), config=config)
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
        PHASE_PREPARE_SQL,
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
    assert r2.get("stage") == PHASE_SUMMARY


async def test_cards_gate_deny_halt_routes_to_refusal(compiled_graph):
    graph, _ = compiled_graph
    config = {"configurable": {"thread_id": "t1"}}
    await graph.ainvoke(_seed(PHASE_PREPARE_CARDS), config=config)
    r2 = await graph.ainvoke(
        Command(resume="deny-halt"),
        config=config,
    )
    assert r2.get("stage") == PHASE_SUMMARY
    # The refusal branch appended a final AI message.
    assert any(
        getattr(m, "type", None) == "ai" and "halted" in m.content
        for m in (r2.get("messages") or [])
    )


async def test_cards_gate_deny_with_comments_loops_back(compiled_graph):
    graph, _ = compiled_graph
    config = {"configurable": {"thread_id": "t1"}, "recursion_limit": 50}
    await graph.ainvoke(_seed(PHASE_PREPARE_CARDS), config=config)
    r2 = await graph.ainvoke(
        Command(resume='{"decision":"deny-comments","comments":"use daily_orders instead"}'),
        config=config,
    )
    # After deny-comments the gate stays in prepare_cards and routes back to fetch.
    # The gate runs inside the layer subgraph, so read the paused layer's state.
    active = (await DatabotGraphBuilder.aget_active_state(graph, config)).values
    assert active.get("stage") == PHASE_PREPARE_CARDS
    assert active.get("deny_feedback") == "use daily_orders instead"
    audit = active.get("gate_decisions") or []
    assert any(
        entry.get("decision") == "deny-comments"
        and entry.get("comments") == "use daily_orders instead"
        for entry in audit
    )


def test_new_turn_baseline_resets_pipeline_after_summary():
    from agent.specialists.databot.databot_agent import DatabotTurnMessagePolicy
    from agent.specialists.databot.graph import node_for_state, to_next_layer
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "stage": PHASE_SUMMARY,
        "approved_cards": [{"name": "daily_rev_tahoe"}],
        "draft_sql": "SELECT 1",
        "execution_result": {"ok": True, "rows": [[1, 2]]},
        "messages": [
            HumanMessage(content="wish上个月订单数和revenue"),
            AIMessage(content="done"),
            HumanMessage(content="换成上周的GMV"),
        ],
    }
    merged = {**state, **DatabotTurnMessagePolicy.baseline_fields()}
    assert merged["stage"] == PHASE_PREPARE_CARDS
    assert merged["draft_sql"] == ""
    assert merged["execution_result"] == {}
    assert merged["approved_cards"] == []
    assert to_next_layer(merged) == LAYER_PREPARE_CARDS


def test_stage_done_without_trailing_human_ends_turn():
    from agent.specialists.databot.graph import node_for_state, to_next_layer
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "stage": PHASE_SUMMARY,
        "messages": [HumanMessage(content="first"), AIMessage(content="done")],
    }
    assert node_for_state(state) == NODE_END_WITH_SUMMARY


def test_new_turn_baseline_routes_to_prepare_cards_with_trailing_tool():
    from agent.specialists.databot.databot_agent import DatabotTurnMessagePolicy
    from agent.specialists.databot.graph import node_for_state, to_next_layer
    from langchain_core.messages import AIMessage, HumanMessage, ToolMessage

    state = {
        "stage": PHASE_SUMMARY,
        "messages": [
            HumanMessage(content="first"),
            AIMessage(content="done"),
            HumanMessage(content="second"),
            ToolMessage(content="{}", tool_call_id="tc-1"),
        ],
    }
    merged = {**state, **DatabotTurnMessagePolicy.baseline_fields()}
    assert merged.get("stage") == PHASE_PREPARE_CARDS
    assert to_next_layer(merged) == LAYER_PREPARE_CARDS


def test_stage_done_answered_turn_routes_to_summary_layer():
    from agent.specialists.databot.graph import node_for_state, to_next_layer
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "stage": PHASE_SUMMARY,
        "messages": [
            HumanMessage(content="gmv by country"),
            AIMessage(content="here are the numbers"),
        ],
    }
    assert to_next_layer(state) == LAYER_SUMMARY


def test_stage_done_empty_trailing_human_routes_to_summary_layer():
    from agent.specialists.databot.graph import node_for_state, to_next_layer
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "stage": PHASE_SUMMARY,
        "messages": [
            HumanMessage(content="gmv by country"),
            AIMessage(content="done"),
            HumanMessage(content=""),
        ],
    }
    assert to_next_layer(state) == LAYER_SUMMARY


def test_stage_done_with_replayed_human_does_not_start_new_fetch():
    from agent.specialists.databot.graph import node_for_state, to_next_layer
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "stage": PHASE_SUMMARY,
        "messages": [
            HumanMessage(content="first"),
            AIMessage(content="done"),
            HumanMessage(
                content="replayed follow-up",
                additional_kwargs={"replayed": True},
            ),
        ],
    }
    assert node_for_state(state) == NODE_END_WITH_SUMMARY


def test_stage_done_with_trailing_remove_does_not_start_new_fetch():
    from agent.specialists.databot.graph import node_for_state, to_next_layer
    from langchain_core.messages import AIMessage, HumanMessage, RemoveMessage

    state = {
        "stage": PHASE_SUMMARY,
        "messages": [
            HumanMessage(content="first"),
            AIMessage(content="done"),
            RemoveMessage(id="msg-old"),
        ],
    }
    assert node_for_state(state) == NODE_END_WITH_SUMMARY


async def test_sql_gate_deny_comments_clears_sql_contract(compiled_graph):
    graph, _ = compiled_graph
    config = {"configurable": {"thread_id": "sql-deny"}, "recursion_limit": 50}
    seed = _seed(
        PHASE_PREPARE_SQL,
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
    active = (await DatabotGraphBuilder.aget_active_state(graph, config)).values
    assert active.get("deny_feedback") == "use commission_revenue not gmv"
    assert active.get("draft_sql") == ""
    assert active.get("sql_reasons") == {}
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


async def test_disabled_cards_gate_auto_approves_without_cards_interrupt():
    ensure_tools_registered()
    fetch_related = _make_tool("fetch_related_models")
    add_card = _make_tool("commit_cards")
    trino_run = _make_tool("trino_run_query")
    trino_explain = _make_tool("trino_explain")
    register_tool_binding(f"{REGISTRY_NAME},{TOOL_ID_FETCH}", fetch_related, replace=True)
    register_tool_binding(f"{REGISTRY_NAME},{TOOL_ID_FETCH}", add_card)
    register_tool_binding(f"{REGISTRY_NAME},{TOOL_ID_SQL}", trino_explain, replace=True)
    register_tool_binding(f"{REGISTRY_NAME},{TOOL_ID_EXECUTE}", trino_run, replace=True)

    ctx = {
        **DatabotAgentConfig(agent_config_path("databot")).run_context,
        "gates": {"cards_enabled": False, "sql_enabled": True},
    }
    model = _ExitStageModel(responses=[AIMessage(content="ok")])
    graph = DatabotGraphBuilder.build(
        model,
        checkpointer=MemorySaver(),
        run_context=ctx,
    )
    result = await graph.ainvoke(
        _seed(PHASE_PREPARE_CARDS),
        config={"configurable": {"thread_id": "gates-off-cards"}, "recursion_limit": 50},
    )
    if "__interrupt__" in result:
        interrupt_obj = result["__interrupt__"][0]
        raw_message = getattr(interrupt_obj, "value", interrupt_obj)
        import json

        if isinstance(raw_message, str):
            payload = json.loads(raw_message)
        elif isinstance(raw_message, dict) and "message" in raw_message:
            payload = json.loads(raw_message["message"])
        else:
            payload = raw_message
        assert payload.get("gate") != "cards"
    assert any(
        entry.get("gate") == "cards" and entry.get("decision") == "approve"
        for entry in (result.get("gate_decisions") or [])
    )


async def test_execute_sql_routes_to_turn_summary(compiled_graph):
    graph, _ = compiled_graph
    result = await graph.ainvoke(
        _seed(
            PHASE_EXECUTE_SQL,
            approved_sql="SELECT 1",
            approved_cards=[{"name": "orders_daily"}],
        ),
        config={"configurable": {"thread_id": "execute-summary"}, "recursion_limit": 50},
    )
    assert "__interrupt__" not in result
    assert result.get("stage") == PHASE_SUMMARY
    assert any(
        getattr(m, "type", None) == "ai"
        and not getattr(m, "tool_calls", None)
        and getattr(m, "content", None)
        for m in (result.get("messages") or [])
    )


def test_turn_summary_node_writes_assistant_message():
    from agent.specialists.databot.graph import DatabotTopology

    model = FakeMessagesListChatModel(
        responses=[AIMessage(content="Orders yesterday: 1,234 rows returned.")]
    )
    node = DatabotTopology(model).turn_summary()
    state: DatabotState = {
        "messages": [HumanMessage(content="how many orders yesterday?")],
        "session_name": "t1",
        "user_id": "alice",
        "history_cards": [],
        "stage": PHASE_SUMMARY,
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
        "deny_feedback": "",
        "cards_selection_summary": "",
    }
    patch = node(state)
    assert patch.get("stage") == PHASE_SUMMARY
    messages = patch.get("messages") or []
    assert len(messages) == 1
    assert not getattr(messages[0], "tool_calls", None)
    assert "1,234" in messages[0].content


def test_turn_summary_writes_fallback_when_model_returns_think() -> None:
    from agent.specialists.databot.graph import DatabotTopology

    model = FakeMessagesListChatModel(
        responses=[
            AIMessage(
                content=(
                    "<think>The user wants a summary. I should mention rows.</think>"
                )
            )
        ]
    )
    node = DatabotTopology(model).turn_summary()
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
    from agent.specialists.databot.graph import DatabotTopology

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
    node = DatabotTopology(model).turn_summary()
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
    from agent.specialists.databot.graph import DatabotTopology

    captured: list[str] = []

    class _CaptureModel(FakeMessagesListChatModel):
        def invoke(self, input, config=None, **kwargs):
            for msg in input:
                if getattr(msg, "type", None) == "human":
                    captured.append(str(msg.content))
            return AIMessage(content="上月各国 GMV 已按 shipping_country 汇总。")

    model = _CaptureModel(responses=[AIMessage(content="unused")])
    node = DatabotTopology(model).turn_summary()
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


def test_stage_done_plain_assistant_text_routes_to_summary_layer() -> None:
    from agent.specialists.databot.graph import node_for_state, to_next_layer
    from langchain_core.messages import AIMessage, HumanMessage

    state = {
        "stage": PHASE_SUMMARY,
        "messages": [
            HumanMessage(content="gmv by country"),
            AIMessage(content="US 465K"),
        ],
    }
    assert to_next_layer(state) == LAYER_SUMMARY


def test_finished_sql_redraft_routes_to_gate_not_back_to_generate():
    """After a SQL-gate deny-comments, a complete new draft must reach the gate."""
    from agent.specialists.databot.graph import (
        NODE_GATE_SQL,
        NODE_GENERATE_SQL,
        DatabotTopology,
        after_generate_sql,
        node_for_state,
    )

    denied = {
        "stage": PHASE_PREPARE_SQL,
        "gate_decisions": [{"gate": "sql", "decision": "deny-comments", "comments": "fix"}],
        "draft_sql": "",
        "sql_reasons": {},
    }
    assert node_for_state(denied) == NODE_GENERATE_SQL
    redrafted = {**denied, "draft_sql": "SELECT 2", "sql_reasons": {"approve": "ok"}}
    assert node_for_state(redrafted) == NODE_GATE_SQL
    assert after_generate_sql(redrafted) == NODE_GATE_SQL
    assert DatabotTopology.prepare_sql_entry(redrafted) == NODE_GATE_SQL


class _ScriptedModel(FakeMessagesListChatModel):
    """Plays back scripted AI messages (tool calls included); ignores tool binding."""

    def bind_tools(self, tools, **kwargs):  # type: ignore[override]
        return self


async def test_sql_redraft_pauses_at_gate_again():
    """End to end: deny-comments → the model redrafts → the SQL gate interrupts again."""
    from agent.catalog import AgentCatalog
    from agent.specialists.databot.stage_tools import propose_sql, write_gate_reasons

    ensure_tools_registered()
    register_tool_binding(f"{REGISTRY_NAME},{TOOL_ID_SQL}", propose_sql, replace=True)
    register_tool_binding(f"{REGISTRY_NAME},{TOOL_ID_SQL}", write_gate_reasons)
    register_tool_binding(f"{REGISTRY_NAME},{TOOL_ID_EXECUTE}", _make_tool("trino_run_query"), replace=True)
    model = _ScriptedModel(
        responses=[
            AIMessage(content="", tool_calls=[{"name": "propose_sql", "args": {"sql": "SELECT 2"}, "id": "c1"}]),
            AIMessage(
                content="",
                tool_calls=[{
                    "name": "write_gate_reasons",
                    "args": {"gate": "sql", "reasons": ["a", "b", "c", "d"]},
                    "id": "c2",
                }],
            ),
        ]
        + [AIMessage(content="ok")] * 10
    )
    try:
        graph = DatabotGraphBuilder.build(
            model,
            checkpointer=MemorySaver(),
            run_context=DatabotAgentConfig(agent_config_path("databot")).run_context,
        )
        config = {"configurable": {"thread_id": "sql-redraft"}, "recursion_limit": 40}
        await graph.ainvoke(
            _seed(PHASE_PREPARE_SQL, approved_cards=[{"name": "o"}],
                  draft_sql="SELECT 1", sql_validated=True),
            config=config,
        )
        r2 = await graph.ainvoke(
            Command(resume='{"decision":"deny-comments","comments":"use table b"}'),
            config=config,
        )
        assert "__interrupt__" in r2, "redraft should pause at the SQL gate again"
        active = (await DatabotGraphBuilder.aget_active_state(graph, config)).values
        assert active["draft_sql"] == "SELECT 2"
        assert active["stage"] == PHASE_PREPARE_SQL
    finally:
        AgentCatalog.restore_tools_snapshot()


def _interrupt_payload(result) -> dict:
    import json

    interrupt_obj = result["__interrupt__"][0]
    raw = getattr(interrupt_obj, "value", interrupt_obj)
    if isinstance(raw, dict) and "message" in raw:
        return json.loads(raw["message"])
    return json.loads(raw) if isinstance(raw, str) else raw


async def test_sql_gate_unrecognized_reply_reasks_without_executing(compiled_graph):
    """Free text at the SQL gate must not run the query; the gate asks again."""
    graph, _ = compiled_graph
    config = {"configurable": {"thread_id": "sql-reask"}, "recursion_limit": 50}
    seed = _seed(
        PHASE_PREPARE_SQL,
        approved_cards=[{"name": "orders_daily"}],
        draft_sql="SELECT count(*) FROM orders_daily",
        sql_validated=True,
    )
    await graph.ainvoke(seed, config=config)
    r2 = await graph.ainvoke(
        Command(resume="use commission_revenue not gmv"), config=config
    )
    assert "__interrupt__" in r2, "unrecognized reply must re-ask, not proceed"
    payload = _interrupt_payload(r2)
    assert payload["gate"] == "sql"
    assert "not understood" in payload["note"]
    assert "approve" in payload["note"]
    active = (await DatabotGraphBuilder.aget_active_state(graph, config)).values
    assert active.get("stage") == PHASE_PREPARE_SQL
    assert not active.get("approved_sql")
    assert not active.get("execution_result")
    assert not active.get("gate_decisions")

    r3 = await graph.ainvoke(Command(resume="approve"), config=config)
    assert r3.get("approved_sql") == "SELECT count(*) FROM orders_daily"
    assert (r3.get("execution_result") or {}).get("ok") is True
    decisions = [(e["gate"], e["decision"]) for e in r3.get("gate_decisions") or []]
    assert decisions == [("sql", "approve")]


async def test_cards_gate_unknown_json_decision_reasks(compiled_graph):
    graph, _ = compiled_graph
    config = {"configurable": {"thread_id": "cards-reask"}, "recursion_limit": 50}
    await graph.ainvoke(_seed(PHASE_PREPARE_CARDS), config=config)
    r2 = await graph.ainvoke(
        Command(resume={"decision": "banana", "comments": "x"}), config=config
    )
    assert "__interrupt__" in r2
    assert _interrupt_payload(r2)["gate"] == "cards"
    active = (await DatabotGraphBuilder.aget_active_state(graph, config)).values
    assert active.get("stage") == PHASE_PREPARE_CARDS
    assert not active.get("approved_cards")


def test_inject_stage_instruction_dedupes_only_within_current_turn():
    from langchain_core.messages import SystemMessage
    from agent.specialists.databot.graph import DatabotTopology
    from agent.specialists.databot.ui_actions import gate_redraft_message_content

    node = DatabotTopology.inject_stage_instruction("FETCH NOW")
    turn1 = [
        HumanMessage(content="q1"),
        SystemMessage(content="FETCH NOW"),
        AIMessage(content="done"),
    ]
    # Same turn (including after a gate redraft message): no duplicate.
    assert node({"messages": turn1}) == {}
    redraft = HumanMessage(content=gate_redraft_message_content("use b", gate="Cards"))
    assert node({"messages": [*turn1, redraft]}) == {}
    # A new user question starts a new turn: the instruction is injected again.
    result = node({"messages": [*turn1, HumanMessage(content="q2")]})
    assert [m.content for m in result["messages"]] == ["FETCH NOW"]


def test_start_turn_resets_only_new_question_after_summary():
    from agent.specialists.databot import graph as databot_graph

    start_turn = getattr(databot_graph, "start_turn", None)
    starts_new_turn = getattr(databot_graph, "starts_new_turn", None)
    assert start_turn is not None and starts_new_turn is not None
    done = {
        "stage": PHASE_SUMMARY,
        "history_cards": [{"name": "h"}],
        "approved_cards": [{"name": "a"}],
        "draft_sql": "SELECT 1",
        "halt_reason": "x",
        "messages": [HumanMessage(content="q1"), AIMessage(content="done")],
    }
    assert start_turn(done) == {}
    fresh = {**done, "messages": [*done["messages"], HumanMessage(content="q2")]}
    patch = start_turn(fresh)
    assert patch["stage"] == PHASE_PREPARE_CARDS
    assert patch["approved_cards"] == [] and patch["draft_sql"] == ""
    assert patch["halt_reason"] == ""
    assert "history_cards" not in patch  # carried forward, not wiped
    # Empty / replayed trailing human messages are not new questions.
    for trailing in (
        HumanMessage(content=""),
        HumanMessage(content="again", additional_kwargs={"replayed": True}),
    ):
        assert not starts_new_turn({**done, "messages": [*done["messages"], trailing]})
    # CLI path: DatabotTurnMessagePolicy already reset the stage; no second reset.
    cli = {**fresh, "stage": PHASE_PREPARE_CARDS}
    assert start_turn(cli) == {}


async def test_new_question_in_finished_thread_starts_fresh_pipeline(compiled_graph):
    """Web path: the graph alone must reset a finished turn on a new question."""
    graph, _ = compiled_graph
    config = {"configurable": {"thread_id": "web-turn2"}, "recursion_limit": 50}
    finished = _seed(
        PHASE_SUMMARY,
        history_cards=[{"name": "orders_daily", "prior_question": "q1"}],
        approved_cards=[{"name": "orders_daily"}],
        draft_sql="SELECT 1",
        approved_sql="SELECT 1",
        execution_result={"ok": True, "rows": [[1]]},
        gate_decisions=[{"gate": "sql", "decision": "approve", "comments": "", "reasons": {}}],
    )
    await graph.ainvoke(finished, config=config)
    r2 = await graph.ainvoke(
        {"messages": [HumanMessage(content="and last week?")]}, config=config
    )
    assert "__interrupt__" in r2, "new question should run fetch and pause at cards gate"
    assert _interrupt_payload(r2)["gate"] == "cards"
    active = (await DatabotGraphBuilder.aget_active_state(graph, config)).values
    assert active["stage"] == PHASE_PREPARE_CARDS
    assert active["approved_cards"] == []
    assert active["approved_sql"] == "" and active["draft_sql"] == ""
    assert active["execution_result"] == {}
    assert active["gate_decisions"] == []
    assert active["history_cards"] == [{"name": "orders_daily", "prior_question": "q1"}]

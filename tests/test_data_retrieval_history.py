"""Tests for DataRetrievalRecord persistence and history_cards unpacking."""

from __future__ import annotations

from langchain_core.messages import HumanMessage, SystemMessage

from agent.specialists.databot.history import DataRetrievalRecord, DataRetrievalStore
from agent.specialists.databot.databot_agent import DatabotTurnMessagePolicy


def _approved_state(**overrides):
    state = {
        "messages": [HumanMessage(content="上个月各国 GMV")],
        "user_id": "alice",
        "session_name": "s1",
        "dryrun": False,
        "approved_cards": [
            {
                "staging_id": "fct_orders_aaa11111",
                "name": "fct_orders",
                "selected_metrics": ["gmv"],
                "selected_dimensions": ["shipping_country"],
            }
        ],
        "approved_sql": "SELECT shipping_country, SUM(gmv) FROM fct_orders GROUP BY 1",
        "gate_decisions": [{"gate": "sql", "decision": "approve", "comments": "", "reasons": {}}],
    }
    state.update(overrides)
    return state


def test_record_from_state_captures_cards_and_sql() -> None:
    record = DataRetrievalRecord.from_state(_approved_state())
    assert record is not None
    assert record.question == "上个月各国 GMV"
    assert record.cards[0]["name"] == "fct_orders"
    assert "SUM(gmv)" in record.sql


def test_record_from_state_skips_dryrun() -> None:
    assert DataRetrievalRecord.from_state(_approved_state(dryrun=True)) is None


def test_record_from_state_skips_halted_turn_after_cards_approve() -> None:
    """Cards approved, then SQL deny-halt: the refusal says nothing was saved."""
    state = _approved_state(
        approved_sql="",
        halt_reason="user halted at sql gate",
        gate_decisions=[
            {"gate": "cards", "decision": "approve", "comments": "", "reasons": {}},
            {"gate": "sql", "decision": "deny-halt", "comments": "", "reasons": {}},
        ],
    )
    assert DataRetrievalRecord.from_state(state) is None


def test_store_persist_from_state_skips_halted_turn(tmp_path) -> None:
    store = DataRetrievalStore(tmp_path)
    state = _approved_state(halt_reason="stop")
    assert store.persist_from_state(state) is None
    assert not store.path_for("alice").exists()


def test_record_from_state_skips_without_approve() -> None:
    assert DataRetrievalRecord.from_state(_approved_state(gate_decisions=[])) is None


def test_store_load_reads_disk_once(tmp_path) -> None:
    store = DataRetrievalStore(tmp_path)
    first = DataRetrievalRecord.from_state(_approved_state())
    assert first is not None
    store.append("alice", first)
    path = store.path_for("alice")
    path.write_text("", encoding="utf-8")
    cards = store.history_cards("alice")
    assert cards[0]["name"] == "fct_orders"


def test_store_round_trip_and_history_cards(tmp_path) -> None:
    store = DataRetrievalStore(tmp_path)
    first = DataRetrievalRecord.from_state(_approved_state())
    assert first is not None
    store.append("alice", first)
    later = DataRetrievalRecord.from_state(
        _approved_state(
            messages=[HumanMessage(content="订单数")],
            approved_cards=[
                {
                    "staging_id": "fct_orders_bbb22222",
                    "name": "fct_orders",
                    "selected_metrics": ["order_count"],
                }
            ],
            approved_sql="SELECT COUNT(*) FROM fct_orders",
        )
    )
    assert later is not None
    store.append("alice", later)

    cards = store.history_cards("alice")
    assert len(cards) == 1
    assert cards[0]["name"] == "fct_orders"
    assert cards[0]["selected_metrics"] == ["order_count"]
    assert cards[0]["prior_question"] == "订单数"


def test_store_reads_legacy_jsonl_shape(tmp_path) -> None:
    path = tmp_path / "alice.databot_turns.jsonl"
    path.write_text(
        '{"approved_cards": [{"name": "dim_country", "staging_id": "dim_1"}],'
        ' "approved_sql": "SELECT 1", "session": "old"}\n',
        encoding="utf-8",
    )
    cards = DataRetrievalStore(tmp_path).history_cards("alice")
    assert cards[0]["name"] == "dim_country"
    assert cards[0]["prior_sql"] == "SELECT 1"


def test_accept_injects_history_briefing() -> None:
    state = {
        "stage": "prepare_cards",
        "history_cards": [
            {
                "staging_id": "fct_orders_aaa11111",
                "name": "fct_orders",
                "selected_metrics": ["gmv"],
                "prior_question": "上个月 GMV",
            }
        ],
        "messages": [HumanMessage(content="再查一次 GMV")],
    }
    DatabotTurnMessagePolicy.inject_history_briefing(state)
    messages = state.get("messages") or []
    assert messages
    assert isinstance(messages[0], SystemMessage)
    assert "fct_orders" in messages[0].content
    assert "fetch_related_models" in messages[0].content


def test_accept_does_not_duplicate_history_briefing() -> None:
    already = SystemMessage(content=DataRetrievalRecord.briefing([{"name": "fct_orders"}]))
    state = {
        "stage": "prepare_cards",
        "history_cards": [{"name": "fct_orders"}],
        "messages": [already, HumanMessage(content="gmv")],
    }
    DatabotTurnMessagePolicy.inject_history_briefing(state)
    assert state["messages"][0] is already


def test_databot_history_state_prefers_memory_history_cards(tmp_path) -> None:
    from langgraph.checkpoint.memory import MemorySaver

    from agent.listener import CliReactListener
    from agent.specialists.databot.databot_agent import DatabotAgent
    from config.agent_config import DatabotAgentConfig, agent_config_path
    from memory.profile_store import FileProfileStore
    from memory.session_runtime import SessionRuntime
    from tests.minimal_chat_model import MinimalChatModel

    store = DataRetrievalStore(tmp_path)

    agent = DatabotAgent(
        model=MinimalChatModel(),
        checkpointer=MemorySaver(),
        session_runtime=SessionRuntime(FileProfileStore(tmp_path)),
        tools=[],
        agent_config=DatabotAgentConfig(
            agent_config_path("databot"),
            run_overrides={"max_tool_calls": 10},
        ),
        retrievals=store,
        listener=CliReactListener(),
    )
    record = DataRetrievalRecord.from_state(_approved_state())
    assert record is not None
    store.append("alice", record)
    agent.session_runtime.activate_user("alice")

    from_store = agent.session_turn_processor.history_fields()
    assert from_store["history_cards"][0]["name"] == "fct_orders"

    store.path_for("alice").write_text("", encoding="utf-8")
    from_prior = agent.session_turn_processor.history_fields(
        {"history_cards": [{"name": "kept"}]}
    )
    assert from_prior["history_cards"] == [{"name": "kept"}]
    still_cached = agent.session_turn_processor.history_fields()
    assert still_cached["history_cards"][0]["name"] == "fct_orders"


def test_commit_resolves_from_history_cards() -> None:
    from agent.specialists.databot.card_staging import apply_add_card_selections

    sid = "fct_orders_aaa11111"
    updated, note = apply_add_card_selections(
        staging_cards=[],
        committed_cards=[],
        history_cards=[
            {
                "staging_id": sid,
                "name": "fct_orders",
                "metrics": [{"name": "gmv"}],
            }
        ],
        selections=[
            {
                "staging_id": sid,
                "selected_metrics": ["gmv"],
            }
        ],
    )
    assert "unknown staging_id" not in note
    assert updated[0]["name"] == "fct_orders"

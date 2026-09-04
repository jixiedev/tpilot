"""Databot graph node names and state-machine stage values."""

from __future__ import annotations

# Outer graph node names (LangGraph ``add_node`` / routing targets).
NODE_INJECT_SYSTEM_PROMPT = "inject_system_prompt"
NODE_FETCH_CARDS = "fetch_cards"
NODE_PREPARE_CARDS_FOR_GATE = "prepare_cards_for_gate"
NODE_GATE_CARDS = "gate_cards"
NODE_WRITE_CARDS_ARTIFACT = "write_cards_artifact"
NODE_GENERATE_SQL = "generate_sql"
NODE_GATE_SQL = "gate_sql"
NODE_WRITE_SQL_ARTIFACT = "write_sql_artifact"
NODE_EXECUTE_SQL = "execute_sql"
NODE_END_WITH_SUMMARY = "end_with_summary"
NODE_END_WITH_REFUSAL = "end_with_refusal"
NODE_CLASSIFY_FOLLOW_UP = "classify_follow_up"
NODE_KNOWLEDGE_FOLLOW_UP = "knowledge_follow_up"
NODE_FINISH_KNOWLEDGE_FOLLOW_UP = "finish_knowledge_follow_up"

# Follow-up intention labels (set by ``classify_follow_up``).
FOLLOW_UP_INTENTION_KNOWLEDGE = "knowledge"
FOLLOW_UP_INTENTION_REQUERY = "requery"

# State-machine ``stage`` field values.
STAGE_FETCH = "fetch"
STAGE_GATE_CARDS = "gate_cards"
STAGE_SQL = "sql"
STAGE_GATE_SQL = "gate_sql"
STAGE_EXECUTE = "execute"
STAGE_DONE = "done"

VALID_STAGES = frozenset({
    STAGE_FETCH,
    STAGE_GATE_CARDS,
    STAGE_SQL,
    STAGE_GATE_SQL,
    STAGE_EXECUTE,
    STAGE_DONE,
})

# Self-map for conditional edges whose router returns a node name.
NODE_ROUTE_MAP = {
    NODE_CLASSIFY_FOLLOW_UP: NODE_CLASSIFY_FOLLOW_UP,
    NODE_KNOWLEDGE_FOLLOW_UP: NODE_KNOWLEDGE_FOLLOW_UP,
    NODE_FINISH_KNOWLEDGE_FOLLOW_UP: NODE_FINISH_KNOWLEDGE_FOLLOW_UP,
    NODE_FETCH_CARDS: NODE_FETCH_CARDS,
    NODE_GATE_CARDS: NODE_GATE_CARDS,
    NODE_WRITE_CARDS_ARTIFACT: NODE_WRITE_CARDS_ARTIFACT,
    NODE_GENERATE_SQL: NODE_GENERATE_SQL,
    NODE_GATE_SQL: NODE_GATE_SQL,
    NODE_WRITE_SQL_ARTIFACT: NODE_WRITE_SQL_ARTIFACT,
    NODE_EXECUTE_SQL: NODE_EXECUTE_SQL,
    NODE_END_WITH_SUMMARY: NODE_END_WITH_SUMMARY,
    NODE_END_WITH_REFUSAL: NODE_END_WITH_REFUSAL,
}

"""Databot prompt templates split by concern."""

from agent.react.databot.prompts.fetch import (
    FETCH_CARDS_NEXT_STEP_PROMPT,
    FETCH_CARDS_SYSTEM_PROMPT,
    FETCH_CARDS_TOOL_BUDGET_PROMPT,
)
from agent.react.databot.prompts.gate_prep import PREPARE_CARDS_FOR_GATE_PROMPT
from agent.react.databot.prompts.idle import (
    IDLE_CHAT_COMPLETION_PROMPT,
    IDLE_NUDGE_PROMPT,
    NEXT_STEP_PROMPT,
    REFINE_USER_PROFILE_PROMPT,
    TOOL_BUDGET_EXHAUSTED_PROMPT,
)
from agent.react.databot.prompts.sql import (
    GENERATE_SQL_NEXT_STEP_PROMPT,
    GENERATE_SQL_SYSTEM_PROMPT,
    GENERATE_SQL_TOOL_BUDGET_PROMPT,
    render_generate_sql_system_prompt,
)
from agent.react.databot.prompts.system import (
    DATA_RETRIEVAL_SYSTEM_PROMPT,
    SESSION_TURN_BOUNDARY,
    STAGE_USER_FACING_OUTPUT_STYLE,
    SYSTEM_PROMPT,
    DataRetrievalSystemPrompt,
    DatabotSystemPrompt,
)
from agent.react.databot.prompts.turn_summary import TURN_SUMMARY_SYSTEM_PROMPT

__all__ = [
    "DATA_RETRIEVAL_SYSTEM_PROMPT",
    "DataRetrievalSystemPrompt",
    "DatabotSystemPrompt",
    "FETCH_CARDS_NEXT_STEP_PROMPT",
    "FETCH_CARDS_SYSTEM_PROMPT",
    "FETCH_CARDS_TOOL_BUDGET_PROMPT",
    "GENERATE_SQL_NEXT_STEP_PROMPT",
    "GENERATE_SQL_SYSTEM_PROMPT",
    "GENERATE_SQL_TOOL_BUDGET_PROMPT",
    "IDLE_CHAT_COMPLETION_PROMPT",
    "IDLE_NUDGE_PROMPT",
    "NEXT_STEP_PROMPT",
    "PREPARE_CARDS_FOR_GATE_PROMPT",
    "REFINE_USER_PROFILE_PROMPT",
    "SESSION_TURN_BOUNDARY",
    "STAGE_USER_FACING_OUTPUT_STYLE",
    "SYSTEM_PROMPT",
    "TOOL_BUDGET_EXHAUSTED_PROMPT",
    "TURN_SUMMARY_SYSTEM_PROMPT",
    "render_generate_sql_system_prompt",
]

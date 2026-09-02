"""Per-stage ReAct subgraphs for the Databot state machine."""

from __future__ import annotations

import logging
from collections.abc import Callable
from typing import Any

from agent.config import StateLike

from langchain_core.language_models import BaseChatModel
from langchain_core.tools import BaseTool
from langgraph.graph.state import CompiledStateGraph

from agent.config import AgentPromptConfig, AgentRunConfig, RouterConfig
from agent.react.databot.prompts.fetch import (
    FETCH_CARDS_NEXT_STEP_PROMPT,
    FETCH_CARDS_SYSTEM_PROMPT,
    FETCH_CARDS_TOOL_BUDGET_PROMPT,
)
from agent.react.databot.prompts.idle import IDLE_NUDGE_PROMPT
from agent.react.databot.prompts.sql import (
    GENERATE_SQL_NEXT_STEP_PROMPT,
    GENERATE_SQL_TOOL_BUDGET_PROMPT,
    render_generate_sql_system_prompt,
)
from agent.react.databot.state import DatabotState
from agent.router import CompletionToolRouter
from graph.builder import build_react_graph

logger = logging.getLogger(__name__)


# Stage-scoped prompt configs. Each ReAct subgraph gets its own prompts so
# the LLM does not see contradictory guidance (e.g. "glossary first" while
# in the SQL stage).
_FETCH_PROMPT_CONFIG = AgentPromptConfig(
    next_step=FETCH_CARDS_NEXT_STEP_PROMPT,
    idle_nudge_prompt=IDLE_NUDGE_PROMPT,
    tool_budget_exhausted_prompt=FETCH_CARDS_TOOL_BUDGET_PROMPT,
    refine_user_profile_prompt="",
)

_SQL_PROMPT_CONFIG = AgentPromptConfig(
    next_step=GENERATE_SQL_NEXT_STEP_PROMPT,
    idle_nudge_prompt=IDLE_NUDGE_PROMPT,
    tool_budget_exhausted_prompt=GENERATE_SQL_TOOL_BUDGET_PROMPT,
    refine_user_profile_prompt="",
)


def _stage_state_exit_router(
    *,
    max_tool_calls: int,
    max_idle_rounds: int,
    state_exit_keys: tuple[str, ...] = (),
) -> tuple[Callable[[StateLike], str], Callable[[StateLike], str]]:
    """Router for one subgraph: exit when ``state_exit_keys`` are populated."""
    run_config = AgentRunConfig(
        max_tool_calls=max_tool_calls,
        max_idle_rounds=max_idle_rounds,
    )
    router_config = RouterConfig(
        action_end_outlet="__end__",
        state_exit_keys=state_exit_keys,
    )
    router = CompletionToolRouter(
        run_config,
        router_config,
        completion_tool_name=None,
    )
    return router.route_after_reason(), router.route_after_action()


def build_fetch_cards_subgraph(
    model: BaseChatModel,
    tools: list[BaseTool],
    *,
    checkpointer: Any,
    max_tool_calls: int,
    max_idle_rounds: int = 1,
) -> CompiledStateGraph:
    """Subgraph for the fetch stage.

    Tools: ``fetch_related_models``, MCP datahub ``search`` (glossary-only),
    ``datahub_get_entities``, ``commit_cards``, ``record_metric_conflict``.
    Card selection and gate reasons run in outer-graph nodes after this subgraph.
    """
    route_reason, route_action = _stage_state_exit_router(
        max_tool_calls=max_tool_calls,
        max_idle_rounds=max_idle_rounds,
        state_exit_keys=("committed_cards",),
    )
    return build_react_graph(
        model,
        tools,
        checkpointer=checkpointer,
        system_prompt=FETCH_CARDS_SYSTEM_PROMPT,
        next_step_prompt=_FETCH_PROMPT_CONFIG.next_step,
        route_after_reason=route_reason,
        route_after_action=route_action,
        idle_nudge_prompt=_FETCH_PROMPT_CONFIG.idle_nudge_prompt,
        tool_budget_exhausted_prompt=_FETCH_PROMPT_CONFIG.tool_budget_exhausted_prompt,
        max_tool_calls=max_tool_calls,
        state_class=DatabotState,
    )


def build_generate_sql_subgraph(
    model: BaseChatModel,
    tools: list[BaseTool],
    *,
    checkpointer: Any,
    max_tool_calls: int,
    max_idle_rounds: int = 1,
) -> CompiledStateGraph:
    """Subgraph for the SQL-draft stage.

    Tools: read-only schema introspection (``trino_desc_table``,
    ``hive_desc_table``), ``commit_cards`` is intentionally
    omitted — cards are already pinned by the gate. The LLM must call
    ``propose_sql`` to write ``draft_sql`` and ``write_gate_reasons`` to
    fill the SQL-gate reason map before exiting.
    """
    route_reason, route_action = _stage_state_exit_router(
        max_tool_calls=max_tool_calls,
        max_idle_rounds=max_idle_rounds,
        state_exit_keys=("draft_sql", "sql_reasons"),
    )
    return build_react_graph(
        model,
        tools,
        checkpointer=checkpointer,
        system_prompt=render_generate_sql_system_prompt,
        next_step_prompt=_SQL_PROMPT_CONFIG.next_step,
        route_after_reason=route_reason,
        route_after_action=route_action,
        idle_nudge_prompt=_SQL_PROMPT_CONFIG.idle_nudge_prompt,
        tool_budget_exhausted_prompt=_SQL_PROMPT_CONFIG.tool_budget_exhausted_prompt,
        max_tool_calls=max_tool_calls,
        state_class=DatabotState,
    )

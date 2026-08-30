"""Per-stage subgraphs for the Databot v2 state machine.

Each stage is a self-contained ReAct loop built on top of
``graph.builder.build_react_graph``. The outer state machine composes them
in order and inserts human-gate nodes between them.

Why subgraphs instead of one mega-ReAct: the thought-1 pipeline has hard
gates between stages and a strict per-stage tool scope (the SQL stage
should not be able to fire off another RAG call mid-loop, etc.). A state
machine between stages + ReAct inside stages gets both.
"""

from __future__ import annotations

import logging
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.tools import BaseTool
from langgraph.graph.state import CompiledStateGraph

from agent.config import AgentPromptConfig, AgentRunConfig, RouterConfig
from agent.react.databot.prompt import (
    FETCH_CARDS_NEXT_STEP_PROMPT,
    FETCH_CARDS_SYSTEM_PROMPT,
    FETCH_CARDS_TOOL_BUDGET_PROMPT,
    GENERATE_SQL_NEXT_STEP_PROMPT,
    GENERATE_SQL_SYSTEM_PROMPT,
    GENERATE_SQL_TOOL_BUDGET_PROMPT,
    IDLE_NUDGE_PROMPT,
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
    refine_user_profile_prompt="",  # subgraphs do not refine the profile
)

_SQL_PROMPT_CONFIG = AgentPromptConfig(
    next_step=GENERATE_SQL_NEXT_STEP_PROMPT,
    idle_nudge_prompt=IDLE_NUDGE_PROMPT,
    tool_budget_exhausted_prompt=GENERATE_SQL_TOOL_BUDGET_PROMPT,
    refine_user_profile_prompt="",
)


def _stage_completion_router(
    *,
    completion_tool_name: str,
    max_tool_calls: int,
    max_idle_rounds: int,
) -> tuple:
    """Build a ``CompletionToolRouter`` for one subgraph.

    We reuse the same router the Tahoe base uses: the LLM exits a stage
    by calling ``chat_completion``; plain text bumps the idle counter
    and the budget governs how long the loop may run. This is what
    fixes the "step_llm called twice in a row → 400 from the provider"
    bug — idle rounds now properly terminate the subgraph instead of
    looping the LLM.
    """
    run_config = AgentRunConfig(
        max_tool_calls=max_tool_calls,
        max_idle_rounds=max_idle_rounds,
    )
    router_config = RouterConfig(
        # Subgraph has no human end-of-turn step, so the tool-end route
        # is just END.
        tool_end_outlet="__end__",
    )
    router = CompletionToolRouter(
        run_config,
        router_config,
        completion_tool_name=completion_tool_name,
    )
    return router.route_after_step(), router.route_after_tools()


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
    ``datahub_get_entities``, ``add_card_to_state``, plus the four-option
    ``write_gate_reasons`` tool the LLM must call before the cards gate.
    """
    route_step, route_tools = _stage_completion_router(
        completion_tool_name="chat_completion",
        max_tool_calls=max_tool_calls,
        max_idle_rounds=max_idle_rounds,
    )
    return build_react_graph(
        model,
        tools,
        checkpointer=checkpointer,
        system_prompt=FETCH_CARDS_SYSTEM_PROMPT,
        next_step_prompt=_FETCH_PROMPT_CONFIG.next_step,
        route_after_step=route_step,
        route_after_tools=route_tools,
        refine_user_profile_node=None,  # explicit: no profile write inside subgraph
        idle_nudge_prompt=_FETCH_PROMPT_CONFIG.idle_nudge_prompt,
        tool_budget_exhausted_prompt=_FETCH_PROMPT_CONFIG.tool_budget_exhausted_prompt,
        max_tool_calls=max_tool_calls,
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
    ``hive_desc_table``), the ``add_card_to_state`` is intentionally
    omitted — cards are already pinned by the gate. The LLM must call
    ``propose_sql`` to write ``draft_sql`` and ``write_gate_reasons`` to
    fill the SQL-gate reason map before exiting.
    """
    route_step, route_tools = _stage_completion_router(
        completion_tool_name="chat_completion",
        max_tool_calls=max_tool_calls,
        max_idle_rounds=max_idle_rounds,
    )
    return build_react_graph(
        model,
        tools,
        checkpointer=checkpointer,
        system_prompt=GENERATE_SQL_SYSTEM_PROMPT,
        next_step_prompt=_SQL_PROMPT_CONFIG.next_step,
        route_after_step=route_step,
        route_after_tools=route_tools,
        refine_user_profile_node=None,
        idle_nudge_prompt=_SQL_PROMPT_CONFIG.idle_nudge_prompt,
        tool_budget_exhausted_prompt=_SQL_PROMPT_CONFIG.tool_budget_exhausted_prompt,
        max_tool_calls=max_tool_calls,
    )

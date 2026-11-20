"""Warehouse data specialist: one ReAct loop with a tool-enforced SQL review.

Replaces databot as the lead's data specialist (databot stays as its own front
agent). There are no stages: the model finds tables, checks columns, drafts SQL
and answers in a single message history. The only hard step is the review:
``request_sql_approval`` pauses for the user and ``run_sql`` runs nothing that
was not approved (see :mod:`agent.specialists.warehouse.tools`).

Nested under the lead's ``delegate`` tool, the review interrupt pauses the
lead's run; resuming the lead's thread resumes this agent at the same tool.
"""

from __future__ import annotations

import re
from collections.abc import Mapping
from typing import Annotated, Any

from langgraph.graph.state import CompiledStateGraph

from agent.specialists.databot.card_staging import staging_cards_reducer
from agent.prompt import SystemPromptAssembler
from agent.react import BaseReactAgent
from agent.specialists.warehouse.tools import (
    QueryRunner,
    make_request_sql_approval_tool,
    make_run_sql_tool,
)
from agent.subagent import SubagentResult, leading_rows
from settings.agent_config import AgentConfig, WarehouseAgentConfig, agent_config_path
from graph.builder import ReactLoopSpec, ReactStateSpec, build_react_graph
from graph.state import ReactAgentState

REGISTRY_NAME = "warehouse"

#: The only DataHub tools warehouse may use: table documentation and lineage.
WAREHOUSE_DATAHUB_TOOLS = frozenset(
    {"datahub_get_table_docs", "datahub_get_lineage", "datahub_get_lineage_paths_between"}
)
#: DataHub MCP tool names (search, entities, glossary); never given to warehouse.
_DATAHUB_MCP_TOOLS = frozenset({"search", "get_entities", "get_lineage", "list_schema_fields"})


def is_datahub_tool(tool: Any) -> bool:
    """A DataHub tool warehouse must not get.

    Warehouse reads table documentation and lineage only
    (:data:`WAREHOUSE_DATAHUB_TOOLS`); it never searches the catalog or
    glossary, or compares glossary definitions (the lead gets definitions from
    knowledge and passes them in the brief). MCP DataHub tools are all refused.
    """
    name = str(getattr(tool, "name", "") or "")
    if name in WAREHOUSE_DATAHUB_TOOLS:
        return False
    return name.startswith("datahub") or name in _DATAHUB_MCP_TOOLS


#: Rows of the result kept in the lead-visible UI view.
_UI_MAX_ROWS = 200


_TABLE_REF = re.compile(r"\b(?:from|join)\s+([A-Za-z_][\w$]*(?:\.[A-Za-z_][\w$]*){0,2})", re.IGNORECASE)
_CTE_NAME = re.compile(r"(?:\bwith|,)\s*([A-Za-z_][\w$]*)\s+as\s*\(", re.IGNORECASE)


def sql_table_names(sql: str) -> list[str]:
    """Tables a query reads (``FROM`` / ``JOIN`` targets), CTE names excluded, in order."""
    if not sql:
        return []
    ctes = {name.lower() for name in _CTE_NAME.findall(sql)}
    names = [
        match.group(1)
        for match in _TABLE_REF.finditer(sql)
        if match.group(1).lower() not in ctes and not _inside_from_function(sql, match.start())
    ]
    return _dedupe(names)


#: Functions whose arguments use FROM (``extract(year FROM dt)``), not a table.
_FROM_FUNCTIONS = frozenset({"extract", "substring", "trim", "position", "overlay"})


def _inside_from_function(sql: str, pos: int) -> bool:
    depth = 0
    for i in range(pos - 1, -1, -1):
        char = sql[i]
        if char == ")":
            depth += 1
        elif char == "(":
            if depth == 0:
                word = re.search(r"([A-Za-z_]+)\s*$", sql[:i])
                return bool(word) and word.group(1).lower() in _FROM_FUNCTIONS
            depth -= 1
    return False


def _dedupe(names: Any) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for name in names:
        key = str(name).strip()
        if key and key.lower() not in seen:
            seen.add(key.lower())
            out.append(key)
    return out


class WarehouseState(ReactAgentState):
    """ReAct state plus what the review and the query left behind."""

    #: Models staged by ``find_models_metrics`` (metric catalog), newest last.
    staging_cards: Annotated[list[dict[str, Any]], staging_cards_reducer]
    #: Fingerprints of approved SQL (``tools.sql_fingerprint``).
    approved_sql: list[str]
    #: Latest review: ``{status, sql, explanation, tables, comments, edited}``.
    sql_review: dict[str, Any]
    #: Latest ``run_sql`` result: ``{sql, columns, rows, row_count, truncated}`` or ``{sql, error}``.
    execution: dict[str, Any]


class WarehouseSystemPrompt(SystemPromptAssembler):
    def __init__(self, config: AgentConfig | None = None) -> None:
        super().__init__(config or WarehouseAgentConfig(agent_config_path(REGISTRY_NAME)))


class WarehouseAgent(BaseReactAgent):
    """Data specialist. Tools: discovery tools from the config plus the two gate tools."""

    prompt_factory = WarehouseSystemPrompt
    tool_ids = ("default",)
    #: Executes approved SQL; ``None`` uses Trino. Tests swap in a fake.
    query_runner: QueryRunner | None = None

    def warehouse_tools(self) -> list[Any]:
        run_context = self.run_context
        bound = [
            make_request_sql_approval_tool(
                gate_enabled=bool(run_context.get("sql_gate_enabled", True))
            ),
            make_run_sql_tool(
                row_limit=AgentConfig.as_int(
                    run_context, "result_row_limit", WarehouseAgentConfig.DEFAULT_RESULT_ROW_LIMIT
                ),
                runner=self.query_runner,
            ),
        ]
        names = {tool.name for tool in bound}
        # A configured tool with a gate tool's name, or a raw query tool, never
        # reaches the model: SQL runs only through the reviewed `run_sql`.
        blocked = names | {"trino_run_query"}
        return [
            *bound,
            *(tool for tool in self.tools if tool.name not in blocked and not is_datahub_tool(tool)),
        ]

    def build_graph(self, **kwargs: Any) -> CompiledStateGraph:
        if self.graph is not None:
            return self.graph
        self.graph = build_react_graph(
            self.model,
            self.warehouse_tools(),
            checkpointer=self.checkpointer,
            router=self.router,
            listener=self.listener,
            compressor=self.compressor,
            loop=ReactLoopSpec.from_run_context(self.run_context),
            state=ReactStateSpec(state_class=WarehouseState),
        )
        return self.graph

    def ui_view(self, state: Mapping[str, Any]) -> dict[str, Any]:
        """Tables, the SQL review and the result, for the lead's workspace.

        ``tables`` are the ones the SQL reads (or that the review lists), with
        the dbt model description when one was found. Every search hit lands
        in ``staging_cards`` (several per lookup), so listing those showed
        27 mostly unrelated models; the rest go in ``candidates`` by name only.
        """
        view: dict[str, Any] = {}
        cards: dict[str, str] = {}
        for card in state.get("staging_cards") or []:
            if not isinstance(card, Mapping):
                continue
            name = str(card.get("name") or card.get("model_name") or "")
            if name:
                cards.setdefault(name, str(card.get("description") or "")[:240])
        review = state.get("sql_review") or {}
        execution = state.get("execution") or {}
        sql = str(execution.get("sql") or review.get("sql") or "")
        used = _dedupe([*sql_table_names(sql), *(str(t) for t in review.get("tables") or [])])
        if used:
            view["tables"] = [
                {"name": name, "description": cards.get(name.rsplit(".", 1)[-1], "")}
                for name in used
            ]
        short_used = {name.rsplit(".", 1)[-1] for name in used}
        candidates = [name for name in cards if name not in short_used]
        if candidates:
            view["candidates"] = candidates
        if review:
            view["sql_review"] = dict(review)
        if execution:
            view["execution"] = {
                **{k: v for k, v in execution.items() if k != "rows"},
                "rows": list(execution.get("rows") or [])[:_UI_MAX_ROWS],
            }
        return view

    def result_from_state(self, state: Mapping[str, Any]) -> SubagentResult:
        """Answer text, plus SQL, tables and leading rows as artifacts.

        ``halted`` only when the reviewer stopped the query; a failed last
        query is ``failed`` so the lead may re-delegate once.
        """
        base = super().result_from_state(state)
        review = state.get("sql_review") or {}
        execution = state.get("execution") or {}
        artifacts: dict[str, Any] = {}
        if review.get("tables"):
            artifacts["tables"] = list(review["tables"])
        if execution.get("sql") or review.get("sql"):
            artifacts["sql"] = execution.get("sql") or review.get("sql")
        if execution:
            summary = {
                key: execution[key]
                for key in ("columns", "row_count", "truncated", "error")
                if key in execution
            }
            rows = leading_rows(execution.get("rows"))
            if rows:
                summary["leading_rows"] = rows
            artifacts["execution"] = summary
        summary = base.summary
        if base.status == "failed" and execution.get("rows"):
            # No written answer (e.g. only reasoning), but the query ran: the
            # lead can answer from the rows in the artifacts.
            summary = "The query ran; the answer rows are in artifacts.execution.leading_rows."
            base = SubagentResult(agent=base.agent, status="done", summary=summary)
        stopped = review.get("status") == "stopped"
        if stopped:
            artifacts["halt_reason"] = review.get("comments") or "the reviewer stopped the query"
        status = "halted" if stopped else ("failed" if execution.get("error") else base.status)
        return SubagentResult(
            agent=base.agent,
            status=status,
            summary=summary,
            artifacts=artifacts,
            ui_state=self.ui_view(state),
        )

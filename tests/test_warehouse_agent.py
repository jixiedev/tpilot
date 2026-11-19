"""Warehouse specialist: the SQL review is enforced by its tools, not its prompt."""

from __future__ import annotations

from typing import Any

import pytest
from langchain_core.messages import AIMessage, ToolMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command

from agent.catalog import AgentCatalog
from agent.specialists.warehouse import WarehouseAgent
from agent.specialists.warehouse.tools import (
    RUN_SQL_TOOL,
    normalize_sql,
    parse_gate_resume,
    sql_fingerprint,
)
from agent.subagent import SubagentTask
from config.agent_config import WarehouseAgentConfig, agent_config_path
from memory.profile_store import FileProfileStore
from tests.test_lead_agent import _call, _ScriptedModel

SQL = "SELECT sum(gmv) AS gmv FROM bi.order_level WHERE dt >= '2026-10-01'"


class _Runner:
    def __init__(self, rows: list[dict[str, Any]] | None = None, exc: Exception | None = None):
        self.calls: list[str] = []
        self._rows = rows if rows is not None else [{"gmv": 767175.04}]
        self._exc = exc

    def __call__(self, sql: str, limit: int) -> dict[str, Any]:
        self.calls.append(sql)
        if self._exc:
            raise self._exc
        return {"columns": list(self._rows[0]) if self._rows else [], "rows": self._rows,
                "row_count": len(self._rows), "truncated": False}


def _agent(tmp_path, model, runner: _Runner, *, gate: bool = True) -> WarehouseAgent:
    config = WarehouseAgentConfig(
        agent_config_path("warehouse"), run_overrides={"sql_gate_enabled": gate}
    )
    agent = AgentCatalog._new_agent(
        WarehouseAgent,
        profile_store=FileProfileStore(tmp_path),
        agent_config=config,
        model=model,
        checkpointer=MemorySaver(),
        tools={},
    )
    agent.query_runner = runner
    return agent


async def _start(agent: WarehouseAgent, thread: str = "w1"):
    config = {"configurable": {"thread_id": thread}}
    task = SubagentTask(agent="warehouse", task="Wish GMV for October 2026", user_question="gmv?")
    state = await agent.build_graph().ainvoke(agent.subagent_input(task), config)
    return config, state


def _tool_texts(state, name: str) -> list[str]:
    return [m.content for m in state["messages"] if isinstance(m, ToolMessage) and m.name == name]


@pytest.mark.parametrize(
    ("resume", "expected"),
    [
        ("approve", ("approve", "", "")),
        ({"decision": "stop", "comments": "wrong table"}, ("stop", "", "wrong table")),
        ('{"decision": "approve", "sql": "SELECT 2"}', ("approve", "SELECT 2", "")),
        ("use the payment date instead", ("revise", "", "use the payment date instead")),
        (None, ("revise", "", "")),
    ],
)
def test_parse_gate_resume(resume, expected) -> None:
    assert parse_gate_resume(resume) == expected


def test_fingerprint_ignores_whitespace_and_semicolon_only() -> None:
    assert sql_fingerprint("SELECT 1;") == sql_fingerprint("  SELECT\n   1 ")
    assert sql_fingerprint("SELECT 1") != sql_fingerprint("SELECT 2")
    assert normalize_sql(" SELECT 1 ; ") == "SELECT 1"


async def test_approved_sql_runs_and_result_carries_rows(tmp_path) -> None:
    runner = _Runner()
    model = _ScriptedModel(
        [
            _call("request_sql_approval", {"sql": SQL, "explanation": "October GMV", "tables": ["bi.order_level"]}),
            _call(RUN_SQL_TOOL, {"sql": SQL + ";"}),
            AIMessage(content="October 2026 GMV was 767,175.04 (bi.order_level)."),
        ]
    )
    agent = _agent(tmp_path, model, runner)
    config, state = await _start(agent)
    [pending] = state["__interrupt__"]
    assert '"gate": "warehouse_sql"' in pending.value["message"]
    assert runner.calls == []  # nothing runs before the review

    final = await agent.build_graph().ainvoke(Command(resume={"decision": "approve"}), config)
    assert runner.calls == [SQL]
    result = agent.result_from_state(final)
    assert result.status == "done"
    assert result.artifacts["sql"] == SQL
    assert result.artifacts["execution"]["leading_rows"] == [{"gmv": 767175.04}]
    assert result.ui_state["sql_review"]["status"] == "approved"
    assert result.ui_state["execution"]["rows"] == [{"gmv": 767175.04}]


async def test_run_sql_refuses_sql_that_skipped_review(tmp_path) -> None:
    runner = _Runner()
    model = _ScriptedModel([_call(RUN_SQL_TOOL, {"sql": SQL}), AIMessage(content="could not run")])
    _, state = await _start(_agent(tmp_path, model, runner))
    assert runner.calls == []
    assert "has not been approved" in _tool_texts(state, RUN_SQL_TOOL)[0]


async def test_reviewer_edit_is_what_runs(tmp_path) -> None:
    edited = SQL.replace("2026-10-01", "2026-10-02")
    runner = _Runner()
    model = _ScriptedModel(
        [
            _call("request_sql_approval", {"sql": SQL, "explanation": "x"}),
            _call(RUN_SQL_TOOL, {"sql": SQL}),  # the original: refused
            _call(RUN_SQL_TOOL, {"sql": edited}),
            AIMessage(content="done"),
        ]
    )
    agent = _agent(tmp_path, model, runner)
    config, _ = await _start(agent)
    final = await agent.build_graph().ainvoke(
        Command(resume={"decision": "approve", "sql": edited}), config
    )
    assert runner.calls == [edited]
    texts = _tool_texts(final, RUN_SQL_TOOL)
    assert "has not been approved" in texts[0]
    assert final["sql_review"]["edited"] is True


async def test_reviewer_stop_halts_without_running(tmp_path) -> None:
    runner = _Runner()
    model = _ScriptedModel(
        [
            _call("request_sql_approval", {"sql": SQL, "explanation": "x"}),
            AIMessage(content="Stopped: I had prepared a GMV query on bi.order_level."),
        ]
    )
    agent = _agent(tmp_path, model, runner)
    config, _ = await _start(agent)
    final = await agent.build_graph().ainvoke(
        Command(resume={"decision": "stop", "comments": "not now"}), config
    )
    assert runner.calls == []
    result = agent.result_from_state(final)
    assert result.status == "halted"
    assert result.artifacts["halt_reason"] == "not now"


async def test_gate_off_approves_automatically_but_order_is_kept(tmp_path) -> None:
    runner = _Runner()
    model = _ScriptedModel(
        [
            _call("request_sql_approval", {"sql": SQL, "explanation": "x"}),
            _call(RUN_SQL_TOOL, {"sql": SQL}),
            AIMessage(content="767,175.04"),
        ]
    )
    _, state = await _start(_agent(tmp_path, model, runner, gate=False))
    assert "__interrupt__" not in state
    assert runner.calls == [SQL]


async def test_review_must_be_alone_and_read_only(tmp_path) -> None:
    runner = _Runner()
    batch = AIMessage(
        content="",
        tool_calls=[
            {"name": "request_sql_approval", "args": {"sql": SQL, "explanation": "x"}, "id": "a"},
            {"name": RUN_SQL_TOOL, "args": {"sql": SQL}, "id": "b"},
        ],
    )
    model = _ScriptedModel(
        [
            batch,
            _call("request_sql_approval", {"sql": "DELETE FROM bi.order_level", "explanation": "x"}),
            AIMessage(content="stopped"),
        ]
    )
    _, state = await _start(_agent(tmp_path, model, runner))
    texts = _tool_texts(state, "request_sql_approval")
    assert "alone" in texts[0]
    assert "Not sent for review" in texts[1]
    assert "__interrupt__" not in state
    assert runner.calls == []


async def test_failed_query_is_reported_as_failed(tmp_path) -> None:
    runner = _Runner(exc=RuntimeError("COLUMN_NOT_FOUND: gmvv"))
    model = _ScriptedModel(
        [
            _call("request_sql_approval", {"sql": SQL, "explanation": "x"}),
            _call(RUN_SQL_TOOL, {"sql": SQL}),
            AIMessage(content="The query failed: COLUMN_NOT_FOUND."),
        ]
    )
    agent = _agent(tmp_path, model, runner)
    config, _ = await _start(agent)
    final = await agent.build_graph().ainvoke(Command(resume="approve"), config)
    result = agent.result_from_state(final)
    assert result.status == "failed"
    assert "COLUMN_NOT_FOUND" in result.artifacts["execution"]["error"]


def test_raw_query_tool_never_reaches_the_model(tmp_path) -> None:
    from tools.data.trino import trino_run_query

    config = WarehouseAgentConfig(agent_config_path("warehouse"))
    agent = AgentCatalog._new_agent(
        WarehouseAgent,
        profile_store=FileProfileStore(tmp_path),
        agent_config=config,
        model=_ScriptedModel([AIMessage(content="x")]),
        checkpointer=MemorySaver(),
        tools={"default": [trino_run_query]},
    )
    names = {tool.name for tool in agent.warehouse_tools()}
    assert "trino_run_query" not in names
    assert {"request_sql_approval", RUN_SQL_TOOL} <= names


async def test_review_pauses_the_lead_and_resuming_it_runs_the_query(tmp_path) -> None:
    """Nested under `delegate`, the SQL review interrupt pauses the lead's thread."""
    from agent.lead.paused import live_subagent_view
    from tests.test_lead_agent import _lead

    runner = _Runner()
    # One scripted model serves the lead and the specialist, in call order.
    model = _ScriptedModel(
        [
            _call("delegate", {"agent": "warehouse", "task": "Wish GMV for October 2026"}),
            _call("request_sql_approval", {"sql": SQL, "explanation": "October GMV"}),
            _call(RUN_SQL_TOOL, {"sql": SQL}),
            AIMessage(content="October 2026 GMV was 767,175.04."),
            AIMessage(content="Wish's GMV in October 2026 was 767,175.04 (warehouse)."),
        ]
    )
    lead = await _lead(tmp_path, model)
    specialist = _agent(tmp_path, model, runner)
    specialist.checkpointer = lead.checkpointer
    specialist.graph = None

    async def get_specialist(name):
        assert name == "warehouse"
        return specialist

    lead.specialists.get_or_create = get_specialist
    graph = lead.build_graph()
    config = {"configurable": {"thread_id": "lead-w"}, "recursion_limit": 80}
    request = await lead.accept_user_request("what was wish's gmv last month?", "lead-w")
    paused = await graph.ainvoke(request.state, config)
    [pending] = paused["__interrupt__"]
    assert '"gate": "warehouse_sql"' in pending.value["message"]
    assert runner.calls == []

    view = await live_subagent_view(lead, config)
    assert view and view["name"] == "warehouse" and view["paused"] is True

    final = await graph.ainvoke(Command(resume={"decision": "approve"}), config)
    assert runner.calls == [SQL]
    assert final["messages"][-1].content.startswith("Wish's GMV in October 2026")
    [entry] = final["work_record"]
    assert entry["agent"] == "warehouse" and entry["status"] == "done"
    assert entry["artifacts"]["execution"]["leading_rows"] == [{"gmv": 767175.04}]
    assert final["active_subagent"]["state"]["execution"]["rows"] == [{"gmv": 767175.04}]


@pytest.mark.parametrize(
    ("final", "expected_status", "expected_summary"),
    [
        ("<think>long reasoning</think>\n\n**GMV: 767,175.04**", "done", "**GMV: 767,175.04**"),
        # Only reasoning, but the query ran: the lead answers from the rows.
        ("<think>still deciding which number to report", "done", "The query ran;"),
    ],
)
async def test_summary_drops_reasoning(tmp_path, final, expected_status, expected_summary) -> None:
    runner = _Runner()
    model = _ScriptedModel(
        [
            _call("request_sql_approval", {"sql": SQL, "explanation": "x"}),
            _call(RUN_SQL_TOOL, {"sql": SQL}),
            AIMessage(content=final),
        ]
    )
    agent = _agent(tmp_path, model, runner)
    config, _ = await _start(agent)
    state = await agent.build_graph().ainvoke(Command(resume="approve"), config)
    result = agent.result_from_state(state)
    assert result.status == expected_status
    assert result.summary.startswith(expected_summary)
    assert "<think>" not in result.summary


def test_datahub_limited_to_table_docs_and_lineage(tmp_path) -> None:
    """Warehouse reads table docs and lineage only; no glossary, catalog search or MCP."""
    from langchain_core.tools import tool

    from agent.specialists.warehouse.warehouse_agent import WAREHOUSE_DATAHUB_TOOLS
    from config.agent_config import agent_tool_scopes

    def fake(name: str):
        @tool(name)
        def _fake(query: str = "") -> str:
            """DataHub stand-in."""
            return ""

        return _fake

    config = WarehouseAgentConfig(agent_config_path("warehouse"))
    assert not config.accepted_mcp
    configured = {name for names in agent_tool_scopes("warehouse").values() for name in names}
    assert {n for n in configured if n.startswith("datahub")} == set(WAREHOUSE_DATAHUB_TOOLS)

    offered = [
        fake(name)
        for name in (
            "datahub_get_table_docs",
            "datahub_get_lineage",
            "datahub_get_lineage_paths_between",
            "datahub_list_glossary_terms",
            "datahub_list_datasets",
            "datahub_list_schema_fields",
            "datahub_graphql_query",
            "search",  # DataHub MCP
            "get_entities",  # DataHub MCP
        )
    ]
    agent = AgentCatalog._new_agent(
        WarehouseAgent,
        profile_store=FileProfileStore(tmp_path),
        agent_config=config,
        model=_ScriptedModel([AIMessage(content="x")]),
        checkpointer=MemorySaver(),
        tools={"default": offered},
    )
    names = {t.name for t in agent.warehouse_tools()}
    assert {n for n in names if n.startswith("datahub") or n in {"search", "get_entities"}} == set(
        WAREHOUSE_DATAHUB_TOOLS
    )


def test_table_docs_return_documentation_only(monkeypatch) -> None:
    from tools.external.datahub import operations

    entity = {
        "urn": "urn:li:dataset:(urn:li:dataPlatform:hive,bi.order_level,PROD)",
        "name": "bi.order_level",
        "platform": {"name": "hive"},
        "properties": {"name": "order_level", "qualifiedName": "bi.order_level", "description": "Order fact."},
        "ownership": {"owners": [{"owner": {"username": "ana", "properties": {"displayName": "Ana"}}}]},
        "glossaryTerms": {"terms": [{"term": {"name": "GMV"}}]},
        "tags": {"tags": [{"tag": {"name": "tier1"}}]},
        "schemaMetadata": {
            "fields": [
                {"fieldPath": "dt", "nativeDataType": "string", "description": ""},
                {"fieldPath": "gmv", "nativeDataType": "double", "description": "Gross merchandise value, USD"},
            ]
        },
    }
    other = {**entity, "urn": "urn:other", "name": "tmp.order_level_backup",
             "properties": {"name": "order_level_backup", "qualifiedName": "tmp.order_level_backup"}}
    monkeypatch.setattr(
        operations, "list_entities", lambda *a, **k: {"entities": [other, entity]}
    )
    result = operations.get_table_docs("bi.order_level")
    assert result["qualified_name"] == "bi.order_level"  # exact match ranked first
    assert result["alternatives"] == ["tmp.order_level_backup"]
    assert result["description"] == "Order fact."
    assert result["owners"] == ["Ana"]
    assert [c["name"] for c in result["columns"]] == ["dt", "gmv"]
    assert "column_docs" not in result
    assert "glossary" not in str(result).lower() and "tier1" not in str(result)

    detail = operations.get_table_docs("bi.order_level", columns=["gmv"])
    assert detail["column_docs"] == [
        {"name": "gmv", "type": "double", "description": "Gross merchandise value, USD"}
    ]
    assert "description" not in detail  # the follow-up only sends what it asked for


def test_table_docs_split_long_documentation() -> None:
    from tools.external.datahub.operations import TABLE_DOC_HEAD_CHARS, compact_table_docs

    doc = "# T\n\n## Overview\n" + "x" * 5000 + "\n\n**Partitioning information**\n\nby dt, daily\n"
    entity = {"urn": "u", "properties": {"description": doc}, "schemaMetadata": {"fields": []}}
    head = compact_table_docs(entity)
    assert len(head["description"]) == TABLE_DOC_HEAD_CHARS
    assert head["sections"] == ["T", "Overview", "Partitioning information"]
    part = compact_table_docs(entity, section="partitioning")
    assert part["section"]["text"].endswith("by dt, daily")
    assert "description" not in part


def test_sql_table_names_skips_ctes_and_function_from() -> None:
    from agent.specialists.warehouse.warehouse_agent import sql_table_names

    sql = (
        "WITH fin AS (SELECT day FROM bi.daily_finance_metrics f), "
        "exp AS (SELECT extract(year FROM dt) FROM core_data.fct_transaction_variations t "
        "JOIN fin ON true) "
        "SELECT (SELECT 1 FROM fin), (SELECT 1 FROM exp)"
    )
    assert sql_table_names(sql) == [
        "bi.daily_finance_metrics",
        "core_data.fct_transaction_variations",
    ]


def test_ui_view_lists_used_tables_and_folds_search_hits(tmp_path) -> None:
    agent = _agent(tmp_path, _ScriptedModel([AIMessage(content="x")]), _Runner())
    state = {
        "staging_cards": [
            {"name": "order_level", "description": "BI order fact"},
            {"name": "fct_dau", "description": "DAU"},
            {"name": "weekly_category_gmv", "description": "weekly"},
        ],
        "sql_review": {"status": "approved", "sql": "SELECT count(*) FROM bi.order_level", "tables": []},
        "execution": {"sql": "SELECT count(*) FROM bi.order_level", "rows": [{"n": 1}]},
    }
    view = agent.ui_view(state)
    assert view["tables"] == [{"name": "bi.order_level", "description": "BI order fact"}]
    assert view["candidates"] == ["fct_dau", "weekly_category_gmv"]

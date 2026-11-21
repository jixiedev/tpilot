"""The unified eval framework: batch loading, checks, the runner and the report."""

from __future__ import annotations

import json
from pathlib import Path

import pytest
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage

from evals.__main__ import build_arg_parser, parse_run_context
from evals.case import BatchRun, EvalCase, list_agents, list_batches, load_batch, load_cases
from evals.checks import active_checks, is_subsequence, run_checks, score_sequence
from evals.report import format_aggregate, format_run
from evals.runner import CaseAggregate, RunRecord, extract_lead_outcome, run_cases, score_run


def _case(**expect) -> EvalCase:
    return EvalCase(agent="a", batch="b", name="c", query="q", models=["m"], expect=expect)


def _record(tools: list[str] = (), reply: str = "", state: dict | None = None) -> RunRecord:
    return RunRecord(reply=reply, state=state or {}, tool_names=list(tools), rounds=len(tools))


def _write(root: Path, agent: str, batch: str, payload) -> None:
    (root / agent).mkdir(parents=True, exist_ok=True)
    (root / agent / f"{batch}.json").write_text(json.dumps(payload), encoding="utf-8")


def _delegate(agent: str, call_id: str) -> list:
    return [
        AIMessage(content="", tool_calls=[{"name": "delegate", "args": {"agent": agent, "task": "t"}, "id": call_id}]),
        ToolMessage(content="{}", tool_call_id=call_id, name="delegate"),
    ]


# --------------------------------------------------------------------- sequences


def test_sequence_scoring() -> None:
    assert is_subsequence(["a", "c"], ["a", "b", "c"])
    assert not is_subsequence(["c", "a"], ["a", "c"])
    assert score_sequence(["a"], ["x", "a"], empty_reason="-")[0] == 1.0
    assert score_sequence(["a", "b"], ["b", "a"], empty_reason="-")[0] == pytest.approx(0.5)
    assert score_sequence([], [], empty_reason="none")[0] == 1.0
    assert score_sequence([], ["x"], empty_reason="none")[0] == 0.0


# --------------------------------------------------------------------- checks


def test_checks_follow_the_expectation_keys() -> None:
    names = lambda case: [c.__name__ for c in active_checks(case)]  # noqa: E731
    assert names(_case(expected_tools=["t"], total_rounds=2)) == ["check_tools", "check_rounds"]
    assert names(_case(expected_tools=[], answer={})) == ["check_tools"]  # empty answer = no check
    assert names(_case(expected_decision="plan", expected_routes=["x"])) == [
        "check_decision", "check_routes", "check_delegations"]
    assert names(_case(expected_models=["m"], max_tool_calls=3)) == [
        "check_selection", "check_recall", "check_economy"]


def test_rounds_budget() -> None:
    def rounds(budget: int, used: int) -> float:
        return run_checks(_case(total_rounds=budget), _record(["t"] * used))[0].score

    assert rounds(0, 0) == 1.0 and rounds(0, 1) == 0.0  # no-tool case
    assert rounds(2, 0) == 0.0  # a tool case that used no tools
    assert rounds(2, 2) == 1.0 and rounds(2, 3) == pytest.approx(0.5) and rounds(2, 4) == 0.0


def test_answer_check_reads_the_reply_json() -> None:
    (check,) = run_checks(_case(answer={"model": ["a", "b"], "root_id": None}),
                          _record(reply='{"model": "B", "root_id": null}'))
    assert check.score == 1.0


def test_lead_outcome_and_routing_checks() -> None:
    prior = [HumanMessage(content="old"), *_delegate("swe", "old"), AIMessage(content="old answer")]
    state = {"messages": [*prior, HumanMessage(content="q"), *_delegate("warehouse", "c1"), AIMessage(content="42")]}
    assert extract_lead_outcome(state)["routes"] == ["warehouse"]  # prior turn not counted
    run = score_run(_case(expected_decision="delegate", expected_routes=["warehouse"]), _record(state=state))
    assert run.scores == {"decision": 1.0, "routes": 1.0, "delegations": 1.0}
    wrong = score_run(_case(expected_decision="answer", expected_routes=[], max_delegations=0), _record(state=state))
    assert wrong.scores == {"decision": 0.0, "routes": 0.0, "delegations": 0.0}
    clarify = {"messages": [HumanMessage(content="q"), AIMessage(content="Which region?")]}
    assert extract_lead_outcome(clarify)["decision"] == "clarify"
    plan_call = AIMessage(content="", tool_calls=[{"name": "write_plan", "args": {}, "id": "p"}])
    plan = {"messages": [HumanMessage(content="q"), plan_call,
                         ToolMessage(content="ok", tool_call_id="p", name="write_plan"), AIMessage(content="done")]}
    assert extract_lead_outcome(plan)["decision"] == "plan"


def test_errors_and_cancelled_runs_score_zero() -> None:
    case = _case(expected_tools=[])
    assert score_run(case, RunRecord(error="boom")).total == 0.0
    assert score_run(case, RunRecord(cancelled=True)).total == 0.0
    assert score_run(case, _record()).total == 1.0


# --------------------------------------------------------------------- loading


def test_batch_file_shape(tmp_path: Path) -> None:
    _write(tmp_path, "knowledge", "metric", {
        "description": "d",
        "models": ["m1"],
        "run": {"variants": {"x": {"retrieval": "rag"}}},
        "defaults": {"expected_tools": ["t"], "total_rounds": 2},
        "cases": [
            {"name": "a", "query": "q1"},
            {"name": "b", "query": "q2", "models": ["m2"], "total_rounds": 5, "kind": "k", "notes": "n"},
        ],
    })
    a, b = load_batch("knowledge", "metric", cases_dir=tmp_path)
    assert a.id == "knowledge/metric/a" and a.models == ["m1"]
    assert a.expect == {"expected_tools": ["t"], "total_rounds": 2}
    assert b.models == ["m2"] and b.expect["total_rounds"] == 5 and (b.kind, b.notes) == ("k", "n")
    assert a.run.variants == {"x": {"retrieval": "rag"}}
    assert list_agents(cases_dir=tmp_path) == ["knowledge"]
    assert list_batches("knowledge", cases_dir=tmp_path) == ["metric"]


@pytest.mark.parametrize(
    ("cases", "message"),
    [
        ([{"name": "a"}], "query"),
        ([{"query": "q"}], "name"),
        ([{"name": "a", "query": "q"}], "no expectation"),
        ([{"name": "a", "query": "q", "answer": {}}], "no expectation"),
        ([{"name": "a", "query": "q", "expected_tool": []}], "unknown field"),
        ([{"name": "a", "query": "q", "expected_decision": "maybe"}], "expected_decision"),
        ([{"name": "a", "query": "q", "total_rounds": -1}], "total_rounds"),
        ([{"name": "a", "query": "q", "expected_tools": []}] * 2, "duplicate"),
    ],
)
def test_bad_cases_fail_at_load(tmp_path: Path, cases, message) -> None:
    _write(tmp_path, "x", "b", {"models": ["m"], "cases": cases})
    with pytest.raises(ValueError, match=message):
        load_batch("x", "b", cases_dir=tmp_path)


def test_models_are_required(tmp_path: Path) -> None:
    _write(tmp_path, "x", "b", {"cases": [{"name": "a", "query": "q", "expected_tools": []}]})
    with pytest.raises(ValueError, match="models"):
        load_batch("x", "b", cases_dir=tmp_path)


def test_unknown_batch(tmp_path: Path) -> None:
    _write(tmp_path, "x", "b", {"models": ["m"], "cases": [{"name": "a", "query": "q", "expected_tools": []}]})
    with pytest.raises(FileNotFoundError, match="known for x: b"):
        load_cases("x", ["nope"], cases_dir=tmp_path)


def test_shipped_batches_load() -> None:
    for agent in list_agents():
        cases = load_cases(agent)
        assert cases, agent
        assert len({c.id for c in cases}) == len(cases)
    assert set(list_agents()) == {"knowledge", "lead", "model_selection", "warehouse"}
    lead = load_cases("lead")
    assert all(c.run.stub_specialists for c in lead)
    assert all("expected_decision" in c.expect for c in lead)


# --------------------------------------------------------------------- runner


class _FakeAgent:
    """Answers with a fixed reply; records nothing on the listener."""

    def __init__(self, reply: str) -> None:
        self.reply = reply

    def clear_secondaries(self) -> None: ...

    def register_secondary(self, listener) -> None: ...

    async def run(self, query, *, session, user_id, print_output):
        from tahoepilot.agent.turn import AgentTurnResult

        return AgentTurnResult(state={"messages": [HumanMessage(content=query), AIMessage(content=self.reply)]})


async def test_runner_averages_models_then_cases(tmp_path: Path) -> None:
    _write(tmp_path, "x", "b", {"models": ["good", "bad"], "cases": [
        {"name": "a", "query": "q", "answer": {"result": "3"}},
    ]})
    built: list[tuple[str, dict]] = []

    async def factory(model_name: str, context: dict):
        built.append((model_name, context))
        return _FakeAgent('{"result": "3"}' if model_name == "good" else '{"result": "4"}')

    aggregates = await run_cases(load_cases("x", cases_dir=tmp_path), factory, run_context={"k": "v"})
    assert built == [("good", {"k": "v"}), ("bad", {"k": "v"})]
    (aggregate,) = aggregates
    assert aggregate.average == pytest.approx(0.5)
    text = format_run(aggregate.runs[0])
    assert text.startswith("[1.00] x/b/a model=good (answer=1.00)")
    assert "case avg: 0.500 (2 models: good, bad)" in format_aggregate(aggregate)


async def test_runner_runs_each_variant_with_its_own_agent(tmp_path: Path) -> None:
    _write(tmp_path, "x", "b", {"models": ["m"], "run": {"variants": {"v1": {"r": 1}, "v2": {"r": 2}}},
                                "cases": [{"name": "a", "query": "q", "expected_tools": []},
                                          {"name": "b", "query": "q", "expected_tools": []}]})
    contexts: list[dict] = []

    async def factory(model_name: str, context: dict):
        contexts.append(context)
        return _FakeAgent("ok")

    aggregates = await run_cases(load_cases("x", cases_dir=tmp_path), factory)
    assert [(a.case.name, a.variant) for a in aggregates] == [("a", "v1"), ("a", "v2"), ("b", "v1"), ("b", "v2")]
    assert contexts == [{"r": 1}, {"r": 2}]  # agents are reused across cases
    only = await run_cases(load_cases("x", cases_dir=tmp_path), factory, variants=["v2"])
    assert {a.variant for a in only} == {"v2"}


def test_empty_aggregate_average_is_zero() -> None:
    assert CaseAggregate(case=_case(expected_tools=[]), variant="").average == 0.0


def test_cli_flags() -> None:
    args = build_arg_parser().parse_args(["-a", "knowledge", "-g", "not_in_catalog", "--run-context", "a=b"])
    assert (args.agent, args.groups) == ("knowledge", ["not_in_catalog"])
    assert parse_run_context(args.run_context, "coll") == {"a": "b", "rag_collection": "coll"}
    with pytest.raises(ValueError):
        parse_run_context(["nokey"], None)
    assert BatchRun().variants == {"": {}}


# --------------------------------------------------------------- golden-query checks


def test_tool_policy_check() -> None:
    case = _case(allowed_tools=["a", "b"], forbidden_tools=["x"])
    assert run_checks(case, _record(["a", "b"]))[0].score == 1.0
    assert run_checks(case, _record(["a", "c"]))[0].score == 0.0  # outside the allowed set
    assert run_checks(_case(forbidden_tools=["x"]), _record(["a", "x"]))[0].score == 0.0


def test_cards_reply_and_sql_runs_checks() -> None:
    case = _case(expected_tables=["core_data.fct_dau"], expected_reply="core_data.fct_dau", expect_sql_runs=True)
    # Databot: cards of the furthest stage, its execution_result
    state = {"approved_cards": [{"name": "fct_dau"}], "committed_cards": [{"name": "other"}],
             "execution_result": {"ok": True, "row_count": 3, "sql": "select 1"}}
    run = score_run(case, _record(reply="  core_data.fct_dau\n", state=state))
    assert run.scores == {"tables": 1.0, "reply": 1.0, "sql_runs": 1.0}
    failed = {"committed_cards": [{"name": "fct_dau_w_bots"}], "execution_result": {"ok": False, "error": "boom"}}
    run = score_run(case, _record(reply="The table is core_data.fct_dau.", state=failed))
    assert run.scores == {"tables": 0.0, "reply": 0.0, "sql_runs": 0.0}
    assert score_run(case, _record(reply="core_data.fct_dau")).scores["sql_runs"] == 0.0  # never reached execute
    # Warehouse: tables of the reviewed SQL, else staged models; its execution record
    warehouse = {"sql_review": {"tables": ["core_data.fct_dau"]}, "staging_cards": [{"name": "x"}],
                 "execution": {"sql": "select 1", "row_count": 1}}
    assert score_run(case, _record(reply="core_data.fct_dau", state=warehouse)).scores == {
        "tables": 1.0, "reply": 1.0, "sql_runs": 1.0}
    staged_only = {"staging_cards": [{"name": "fct_dau_w_bots"}, {"name": "fct_dau"}]}
    run = score_run(_case(expected_tables=["fct_dau"], expect_sql_runs=False), _record(state=staged_only))
    assert run.scores == {"tables": 1.0, "sql_runs": 1.0}


def test_batch_gate_reply_answers_interrupts(tmp_path: Path) -> None:
    _write(tmp_path, "x", "b", {"models": ["m"], "run": {"gate_reply": "dryrun"},
                                "cases": [{"name": "a", "query": "q", "expected_tools": []}]})
    (case,) = load_cases("x", cases_dir=tmp_path)
    assert case.run.gate_reply == "dryrun"
    _write(tmp_path, "x", "bad", {"models": ["m"], "run": {"gate_reply": 1},
                                  "cases": [{"name": "a", "query": "q", "expected_tools": []}]})
    with pytest.raises(ValueError, match="gate_reply"):
        load_cases("x", ["bad"], cases_dir=tmp_path)


class _GateAgent(_FakeAgent):
    async def run(self, query, *, session, user_id, print_output, on_interrupt=None):
        from tahoepilot.agent.turn import AgentTurnResult

        answer = await on_interrupt("Run this SQL?") if on_interrupt else None
        self.seen = (user_id, answer)
        return AgentTurnResult(state={"messages": [HumanMessage(content=query), AIMessage(content=str(answer))]})


async def test_runner_passes_gate_reply_user_and_models(tmp_path: Path) -> None:
    _write(tmp_path, "x", "b", {"models": ["m"], "run": {"gate_reply": "dryrun"},
                                "cases": [{"name": "a", "query": "q", "expected_reply": "dryrun"}]})
    agents: dict[str, _GateAgent] = {}

    async def factory(model_name: str, context: dict):
        agents[model_name] = _GateAgent("")
        return agents[model_name]

    (aggregate,) = await run_cases(load_cases("x", cases_dir=tmp_path), factory, models=["other"], user_id="alice")
    assert list(agents) == ["other"]  # --models replaced the case's list
    assert agents["other"].seen == ("alice", "dryrun")
    assert aggregate.average == 1.0


def test_timer_records_model_and_tool_calls() -> None:
    from uuid import uuid4

    from evals.timing import EvalTimer, TurnTiming

    timer = EvalTimer()
    model, tool = uuid4(), uuid4()
    timer.on_chat_model_start({}, [], run_id=model, metadata={"langgraph_checkpoint_ns": "layer_a:1"})
    timer.on_llm_end(None, run_id=model)
    timer.on_tool_start({"name": "trino_explain"}, "", run_id=tool, metadata={})
    timer.on_tool_end(None, run_id=tool)
    timing = TurnTiming(wall_seconds=1.0, calls=timer.calls)
    assert (timing.count("model"), timing.count("tool")) == (1, 1)
    assert list(timing.by_stage()) == ["layer_a", ""]
    assert "trino_explain" in timing.by_tool()
    assert timing.to_json()["tool_calls"] == 1
    assert timing.render()[0].startswith("timing: wall=1.0s")


# ------------------------------------------------- proposed SQL, checked without running


def test_reply_sql_and_tables() -> None:
    from evals.checks import reply_sql, sql_tables

    reply = ('{"models_selected": ["core_data.fct_dau"], "proposed_sql": '
             '["SELECT dt FROM hive.core_data.fct_dau d JOIN wish.master_users u ON d.user_id = u.id"]}')
    (sql,) = reply_sql(reply)
    assert sql_tables(sql) == ["core_data.fct_dau", "wish.master_users"]
    assert reply_sql('{"models_selected": [], "proposed_sql": []}') == []
    assert reply_sql("not json") == []
    assert reply_sql('{"proposed_sql": "SELECT 1 FROM a.b"}') == ["SELECT 1 FROM a.b"]


def test_sql_tables_and_compiles_checks(monkeypatch) -> None:
    import evals.checks as checks

    case = _case(expected_sql_tables=["core_data.fct_dau"], expect_sql_compiles=True,
                 answer={"models_selected": ["core_data.fct_dau"]})
    good = '{"models_selected": ["core_data.fct_dau"], "proposed_sql": ["SELECT 1 FROM core_data.fct_dau"]}'
    monkeypatch.setattr(checks, "explain_sql", lambda sql: "")
    assert score_run(case, _record(reply=good)).scores == {"answer": 1.0, "sql_tables": 1.0, "sql_compiles": 1.0}

    monkeypatch.setattr(checks, "explain_sql", lambda sql: "TrinoUserError: COLUMN_NOT_FOUND")
    wrong = '{"models_selected": ["core_data.fct_dau_w_bots"], "proposed_sql": ["SELECT 1 FROM core_data.fct_dau_w_bots"]}'
    assert score_run(case, _record(reply=wrong)).scores == {"answer": 0.0, "sql_tables": 0.0, "sql_compiles": 0.0}

    empty = '{"models_selected": [], "proposed_sql": []}'  # "cannot tell" scores 0, it is not a crash
    assert score_run(case, _record(reply=empty)).scores == {"answer": 0.0, "sql_tables": 0.0, "sql_compiles": 0.0}


def test_shipped_golden_batches_forbid_the_gate() -> None:
    for case in load_cases("warehouse"):
        assert {"request_sql_approval", "run_sql"} <= set(case.expect["forbidden_tools"]), case.id
        assert not {"request_sql_approval", "run_sql"} & set(case.expect["allowed_tools"]), case.id
        assert '"models_selected"' in case.query and '"proposed_sql"' in case.query, case.id
        assert case.run.gate_reply == "stop", case.id

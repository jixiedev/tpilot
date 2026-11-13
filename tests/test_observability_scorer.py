"""EvalScorer: workload dimensions, eval-set selection, and the dimension rules."""

from __future__ import annotations

import pytest

from observability.case import DatabotEvalCase, IntentEvalCase, ReactEvalCase, ToolsSpec
from observability.runner import EvalRunResult, ToolCall
from observability.scorer import EvalScorer

BOTH = ToolsSpec(required=["planning", "bash"], allowed=["planning", "bash"])
scorer = EvalScorer()


def _react(**overrides) -> ReactEvalCase:
    values = dict(
        agent_name="knowledge",
        eval_set="harness",
        name="sample",
        prompt="hello",
        max_tool_calls=0,
    )
    values.update(overrides)
    return ReactEvalCase(**values)


def _intent(**overrides) -> IntentEvalCase:
    values = dict(
        agent_name="intent",
        eval_set="functional",
        name="sample",
        prompt="hello",
        expected_status="published",
        expected_intentions=["KNOWLEDGE", "DATA"],
        expected_routes=["plan"],
    )
    values.update(overrides)
    return IntentEvalCase(**values)


def _run(case, *tools: str, reply: str = "", state: dict | None = None, cancelled=False):
    return EvalRunResult(
        case=case,
        model_name="m",
        state=state or {},
        reply=reply,
        tool_calls=[ToolCall(name) for name in tools],
        cancelled=cancelled,
    )


# --- dimension rules -----------------------------------------------------------


def test_score_tools() -> None:
    assert scorer.score_tools(BOTH, ["planning", "bash"]).details["reason"] == "ordered match"
    assert scorer.score_tools(ToolsSpec(), ["planning"]).value == 0.0
    assert scorer.score_tools(ToolsSpec(), []).value == 1.0
    disallowed = scorer.score_tools(
        ToolsSpec(required=["planning"], allowed=["planning"]), ["planning", "bash"]
    )
    assert disallowed.value == 0.0 and disallowed.details["reason"] == "disallowed tool used"
    partial = scorer.score_tools(BOTH, ["bash", "planning"])
    assert partial.value == 0.5 and partial.details["reason"] == "unordered partial"
    assert scorer.score_tools(ToolsSpec(forbidden=["bash"]), ["bash"]).value == 0.0
    assert scorer.score_tools(ToolsSpec(allowed=["a", "b"]), ["b"]).value == 1.0


def test_score_sequence() -> None:
    assert scorer.score_sequence(["a", "b"], ["x", "a", "y", "b"], name="s").value == 1.0
    assert scorer.score_sequence(["a", "b"], ["b", "a"], name="s").value == 0.5
    assert scorer.score_sequence([], ["a"], name="s").value == 0.0


def test_score_budget() -> None:
    assert scorer.score_budget(2, 2).value == 1.0
    assert scorer.score_budget(1, 3).value == pytest.approx(0.0)
    assert scorer.score_budget(4, 5).value == pytest.approx(0.75)
    assert scorer.score_budget(0, 1).value == 0.0


def test_score_json_answer_requires_bare_object() -> None:
    assert scorer.score_json_answer('{"result": 3}', {"result": 3}).value == 1.0
    assert scorer.score_json_answer('\n{"result": 3}\n', {"result": 3}).value == 1.0
    assert scorer.score_json_answer('{"result": 3.0}', {"result": 3}).value == 1.0

    for off_format in (
        '```json\n{"result": 3}\n```',  # fenced
        'The answer is {"result": 3}',  # prose around the object
        "[3]",  # JSON, but not an object
        "TAHOE-949 in prose",
    ):
        score = scorer.score_json_answer(off_format, {"result": 3})
        assert score.value == 0.0, off_format
        assert "bare JSON object" in score.details["parse_error"]


def test_score_json_answer_values_are_exact() -> None:
    assert scorer.score_json_answer('{"result": "3"}', {"result": 3}).value == 0.0
    assert scorer.score_json_answer('{"t": "tahoe-949"}', {"t": "TAHOE-949"}).value == 0.0
    mixed = scorer.score_json_answer('{"result": 3, "note": "nope"}', {"result": 3, "note": "ok", "x": 1})
    assert mixed.value == pytest.approx(1 / 3)
    assert mixed.details["matched"] == ["result"]
    assert mixed.details["mismatched"] == ["note"]
    assert mixed.details["missing"] == ["x"]


def test_score_text_answer_is_exact() -> None:
    assert scorer.score_text_answer("core_data.fct_dau", "core_data.fct_dau").value == 1.0
    assert scorer.score_text_answer("  core_data.fct_dau\n", "core_data.fct_dau").value == 1.0
    for off_format in (
        "The dataset is core_data.fct_dau.",  # prose
        "**core_data.fct_dau**",  # markdown
        "hive.core_data.fct_dau",  # differently qualified
        "Core_Data.FCT_DAU",  # case differs
        "core_data.fct_dau_w_bots",  # wrong table
    ):
        score = scorer.score_text_answer(off_format, "core_data.fct_dau")
        assert score.value == 0.0, off_format
        assert score.details["reason"] == "mismatch"


def test_state_readers() -> None:
    assert scorer.card_names({"committed_cards": [{"name": "a"}, {"name": "b"}]}) == ["a", "b"]
    assert scorer.card_names({"review_cards": [{"name": "r"}], "committed_cards": [{"name": "c"}]}) == ["r"]
    assert scorer.card_names({}) == []
    assert scorer.intent_outcome(
        {"status": "published", "user_intentions": ["KNOWLEDGE", "DATA"], "route_target": "plan"}
    ) == {"status": "published", "intentions": ["KNOWLEDGE", "DATA"], "routes": ["plan"]}
    clarify = scorer.intent_outcome({"__interrupt__": [{"q": "?"}], "user_intentions": ["DATA"]})
    assert clarify["status"] == "clarify" and clarify["intentions"] == ["DATA"]
    assert scorer.intent_outcome({"status": "rejected"})["routes"] == []


# --- EvalScorer.score ------------------------------------------------------------


def test_eval_set_selects_dimensions() -> None:
    def dims(eval_set: str) -> list[str]:
        case = _react(eval_set=eval_set, tools=BOTH, max_tool_calls=2, expected_output={"t": "1"})
        score = scorer.score(_run(case, "planning", "bash", reply='{"t": "1"}'))
        return [d.name for d in score.dimensions]

    assert dims("functional") == ["tools", "answer"]
    assert dims("performance") == ["max_tool_calls"]
    assert dims("harness") == ["tools", "max_tool_calls", "answer"]


def test_react_without_expected_output_has_no_answer() -> None:
    score = scorer.score(_run(_react(tools=BOTH, max_tool_calls=2), "planning", "bash"))
    assert score.named("answer") is None
    assert score.total == 1.0


def test_cancelled_scores_zero() -> None:
    score = scorer.score(_run(_react(expected_output={"x": "1"}), cancelled=True))
    assert score.cancelled and score.total == 0.0


def test_databot_dimensions() -> None:
    case = DatabotEvalCase(
        agent_name="databot",
        eval_set="functional",
        name="find_dataset",
        prompt="find dau",
        tools=ToolsSpec(
            required=["fetch_related_models", "commit_cards"],
            allowed=["fetch_related_models", "commit_cards"],
        ),
        expected_output="core.fct_dau",
        expected_table_cards=["fct_dau"],
    )
    score = scorer.score(
        _run(
            case,
            "fetch_related_models",
            "commit_cards",
            reply="core.fct_dau",
            state={
                "committed_cards": [{"name": "fct_dau"}],
                "execution_result": {"ok": True, "row_count": 7, "sql": "SELECT 1"},
            },
        )
    )
    assert [d.name for d in score.dimensions] == ["tools", "cards", "sql_runs", "answer"]
    assert score.total == 1.0

    case.draft_tools = ToolsSpec(required=["trino_run_query"])
    with_draft = scorer.score(_run(case, "fetch_related_models", "commit_cards"))
    assert with_draft.value_of("draft_tools") == 0.0


def test_score_sql_runs() -> None:
    ran = scorer.score_sql_runs({"execution_result": {"ok": True, "row_count": 7, "sql": "SELECT 1"}})
    assert ran.value == 1.0
    assert ran.details["reason"] == "7 row(s)"

    failed = scorer.score_sql_runs(
        {"execution_result": {"ok": False, "error": "unsupported date format", "sql": "SELECT x"}}
    )
    assert failed.value == 0.0
    assert failed.details["actual"] == "failed"
    assert failed.details["reason"] == "unsupported date format"
    assert failed.render() == [
        "  sql_runs: expected=executed actual=failed (unsupported date format)"
    ]

    for state in ({"execution_result": {}}, {}):
        never = scorer.score_sql_runs(state)
        assert never.value == 0.0
        assert never.details["reason"] == "turn ended before execute_sql"


def test_sql_runs_is_not_a_performance_dimension() -> None:
    case = DatabotEvalCase(
        agent_name="databot", eval_set="performance", name="p", prompt="q", max_tool_calls=5
    )
    score = scorer.score(_run(case, state={"execution_result": {"ok": False, "error": "boom"}}))
    assert [d.name for d in score.dimensions] == ["max_tool_calls"]


def test_intent_dimensions() -> None:
    state = {"status": "published", "user_intentions": ["KNOWLEDGE", "DATA"], "route_target": "plan"}
    assert scorer.score(_run(_intent(), state=state)).total == 1.0

    partial = scorer.score(
        _run(
            _intent(),
            state={
                "status": "published",
                "user_intentions": ["DATA", "KNOWLEDGE"],
                "route_target": "databot",
            },
        )
    )
    assert partial.value_of("intentions") == 0.5
    assert partial.value_of("routes") == 0.0

    perf = scorer.score(
        _run(_intent(eval_set="performance"), state={"status": "published", "route_target": "x"})
    )
    assert [d.name for d in perf.dimensions] == ["status"] and perf.total == 1.0

    reject = _intent(expected_status="rejected", expected_intentions=[], expected_routes=[])
    assert scorer.score(_run(reject, state={"status": "rejected"})).total == 1.0

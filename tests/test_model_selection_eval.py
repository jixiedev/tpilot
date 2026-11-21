"""Model selection agent (eval-only) and the retrieval-arm comparison eval."""

from __future__ import annotations

import json
from pathlib import Path

import pytest
from langchain_core.messages import AIMessage
from langgraph.checkpoint.memory import MemorySaver

from tahoepilot.agent.catalog import AgentCatalog, AgentCatalogSettings
from tahoepilot.agent.lead.prompt import delegatable_agents
from tahoepilot.agent.listener import AgentListener
from tahoepilot.agent.specialists.model_selection import ModelSelectionAgent, ModelSelectionSystemPrompt
from tahoepilot.settings.agent_config import ModelSelectionAgentConfig
from evals.__main__ import build_arg_parser
from evals.case import BatchRun, EvalCase, load_cases
from evals.checks import normalize_model_name
from evals.report import format_case_matrix, format_variant_summary, results_to_json
from evals.runner import CaseAggregate, CaseRun, run_cases, run_turn, score_run, select_variants

ARMS = tuple(ModelSelectionAgentConfig.RETRIEVAL_ARMS)
VARIANTS = {"run": {"variants": {"catalog": {"retrieval": "catalog"}}}}
from tahoepilot.memory import CompressionConfig
from tahoepilot.memory.profile_store import FileProfileStore
from tests.test_lead_agent import _call, _ScriptedModel

CHOICE = {
    "model": "core_data.fct_transaction_variations",
    "alternatives": ["master_commerce_transactions"],
    "root_id": "gmv",
    "member_id": "sum_excl_ltd",
    "reason": "Line grain with paid price and shipping.",
}


def _catalog_script(choice: dict | None = None) -> list[AIMessage]:
    return [
        _call("search_metric_catalog", {"pattern": "gmv|成交"}),
        _call("search_metric_catalog", {"scope": "members", "root_id": "gmv"}),
        _call("find_models_metrics", {"root_id": "gmv", "member_id": "sum_excl_ltd"}),
        AIMessage(content=json.dumps(choice or CHOICE)),
    ]


async def _agent(tmp_path: Path, model, arm: str) -> ModelSelectionAgent:
    catalog = AgentCatalog(
        AgentCatalogSettings.for_agent(
            "model_selection",
            profile_store=FileProfileStore(tmp_path),
            model=model,
            checkpointer=MemorySaver(),
            compression_config=CompressionConfig(enabled=False),
        )
    )
    return await catalog.create(
        "model_selection", listener=AgentListener(), run_context={"retrieval": arm}
    )


def _case(**expect) -> EvalCase:
    fields = {"expected_models": ["fct_transaction_variations", "master_commerce_transactions"], **expect}
    return EvalCase(
        agent="model_selection",
        batch="t",
        name="gmv",
        query="What was Wish's GMV last month?",
        models=["fake"],
        expect=fields,
        run=BatchRun(variants={"catalog": {"retrieval": "catalog"}}),
    )


async def _run(case: EvalCase, agent) -> CaseRun:
    return score_run(case, await run_turn(case, agent, variant="catalog"), model_name="fake", variant="catalog")


def _detail(run: CaseRun, check: str) -> dict:
    return next(c.details for c in run.checks if c.name == check)


def _write_batch(cases_dir: Path, batch: str, cases: list[dict]) -> None:
    folder = cases_dir / "model_selection"
    folder.mkdir(parents=True, exist_ok=True)
    (folder / f"{batch}.json").write_text(
        json.dumps({"models": ["fake"], **VARIANTS, "cases": cases}), encoding="utf-8"
    )


def test_model_selection_is_never_delegated_by_the_lead() -> None:
    assert "model_selection" in AgentCatalog.names()
    assert "model_selection" not in delegatable_agents()


@pytest.mark.parametrize("arm", ARMS)
def test_prompt_renders_only_the_active_arm_workflow(arm: str) -> None:
    config = AgentCatalog.config("model_selection").with_run_overrides({"retrieval": arm})
    blocks = ModelSelectionSystemPrompt(config).section_blocks()
    workflows = [text for title, text in blocks if title == "Workflow"]
    assert len(workflows) == 1
    has_search = "fetch_related_models" in workflows[0]
    has_catalog = "find_models_metrics" in workflows[0]
    assert (has_search, has_catalog) == {
        "rag": (True, False),
        "catalog": (False, True),
        "hybrid": (True, True),
    }[arm]


def test_unknown_arm_is_rejected() -> None:
    with pytest.raises(ValueError, match="unknown retrieval arm"):
        AgentCatalog.config("model_selection").with_run_overrides({"retrieval": "bm25"})
    case = _case()
    with pytest.raises(ValueError, match="unknown variant"):
        select_variants(case, ["bm25"])
    assert select_variants(case, None) == ["catalog"]


@pytest.mark.parametrize("arm", ARMS)
async def test_each_arm_gets_only_its_tools(tmp_path: Path, arm: str) -> None:
    agent = await _agent(tmp_path, _ScriptedModel([AIMessage(content="{}")]), arm)
    names = {tool.name for tool in agent.selection_tools()}
    assert names == set(ModelSelectionAgentConfig.RETRIEVAL_ARMS[arm])
    assert agent.run_context["refine_user_profile_prompt"] == ""


async def test_catalog_run_scores_selection_recall_and_economy(tmp_path: Path) -> None:
    agent = await _agent(tmp_path, _ScriptedModel(_catalog_script()), "catalog")
    run = await _run(_case(max_tool_calls=4), agent)
    assert run.record.tool_names == ["search_metric_catalog", "search_metric_catalog", "find_models_metrics"]
    assert _detail(run, "selection")["chosen"] == "fct_transaction_variations"
    assert "fct_transaction_variations" in run.record.candidates
    assert run.scores == {"selection": 1.0, "recall": 1.0, "economy": 1.0}
    assert _detail(run, "selection")["member_id"] == "sum_excl_ltd"


async def test_wrong_choice_with_good_candidates_is_a_choice_miss(tmp_path: Path) -> None:
    choice = {**CHOICE, "model": "dau_attribution"}
    agent = await _agent(tmp_path, _ScriptedModel(_catalog_script(choice)), "catalog")
    run = await _run(_case(max_tool_calls=2), agent)
    assert run.scores["selection"] == 0.0
    assert run.scores["recall"] == 1.0
    assert run.scores["economy"] == pytest.approx(0.5)


async def test_null_choice_without_tools_scores_zero(tmp_path: Path) -> None:
    reply = AIMessage(content='{"model": null, "reason": "not in the catalog"}')
    agent = await _agent(tmp_path, _ScriptedModel([reply]), "catalog")
    run = await _run(_case(), agent)
    assert _detail(run, "selection")["chosen"] == "" and run.record.candidates == []
    assert (run.scores["selection"], run.scores["recall"]) == (0.0, 0.0)


async def test_runner_builds_one_agent_per_llm_and_arm(tmp_path: Path) -> None:
    cases_dir = tmp_path / "cases"
    _write_batch(cases_dir, "sel", [
        {"name": "a", "query": "gmv?", "expected_models": ["fct_transaction_variations"]},
        {"name": "b", "query": "gmv again?", "expected_models": "master_commerce_transactions"},
    ])
    built: list[tuple[str, str]] = []

    async def factory(model_name: str, context: dict):
        arm = context["retrieval"]
        built.append((model_name, arm))
        script = _catalog_script() * 2
        return await _agent(tmp_path / arm, _ScriptedModel(script), arm)

    cases = load_cases("model_selection", ["sel"], cases_dir=cases_dir)
    aggregates = await run_cases(cases, factory, variants=["catalog"])
    assert built == [("fake", "catalog")]
    assert [a.case.name for a in aggregates] == ["a", "b"]
    assert aggregates[0].average == pytest.approx(1.0)
    assert aggregates[1].runs[0].scores["selection"] == 0.0
    assert "catalog" in format_variant_summary(aggregates)
    assert "*fct_transaction_variations" in format_case_matrix(aggregates)
    payload = results_to_json(aggregates)
    assert payload["summary"][0]["variant"] == "catalog" and len(payload["runs"]) == 2
    assert payload["runs"][0]["arm"] == "catalog"  # selection_report reads runs by "arm"


def test_shipped_cases_load_and_name_known_models() -> None:
    from tahoepilot.tools.data import metrics

    cases = load_cases("model_selection")
    assert len({case.name for case in cases}) == len(cases)
    catalog_models = set(metrics.load_root_member_assign()[0])
    for case in cases:
        assert set(case.run.variants) == set(ARMS), case.id
        if case.kind != "uncovered":
            models = {normalize_model_name(m) for m in case.expect["expected_models"]}
            assert models <= catalog_models, case.name


def test_case_needs_an_expectation(tmp_path: Path) -> None:
    _write_batch(tmp_path, "bad", [{"name": "x", "query": "q"}])
    with pytest.raises(ValueError, match="no expectation"):
        load_cases("model_selection", ["bad"], cases_dir=tmp_path)
    _write_batch(tmp_path, "bad2", [{"name": "x", "query": "q", "expected_models": 3}])
    with pytest.raises(ValueError, match="expected_models"):
        load_cases("model_selection", ["bad2"], cases_dir=tmp_path)


async def test_abstain_case_rewards_null_and_skips_recall(tmp_path: Path) -> None:
    null_reply = AIMessage(content='{"model": null, "reason": "no ad spend model"}')
    agent = await _agent(tmp_path, _ScriptedModel([null_reply]), "catalog")
    run = await _run(_case(expected_models=[]), agent)
    assert run.scores == {"selection": 1.0}  # recall does not apply
    assert run.total == pytest.approx(1.0)

    guess = AIMessage(content='{"model": "fct_dau", "reason": "closest"}')
    agent = await _agent(tmp_path / "g", _ScriptedModel([guess]), "catalog")
    run = await _run(_case(expected_models=[]), agent)
    assert run.scores["selection"] == 0.0

    prose = AIMessage(content="I could not find a model.")
    agent = await _agent(tmp_path / "p", _ScriptedModel([prose]), "catalog")
    run = await _run(_case(expected_models=[]), agent)
    assert run.scores["selection"] == 0.0  # no JSON answer is not an abstention


def test_budget_prompt_demands_the_json_answer() -> None:
    prompt = AgentCatalog.config("model_selection").run_context["tool_budget_exhausted_prompt"]
    assert "JSON" in prompt and "null" in prompt


def test_normalize_model_name() -> None:
    assert normalize_model_name("core_data.FCT_DAU") == "fct_dau"
    assert normalize_model_name(None) == ""


def test_cli_accepts_model_selection_arms_and_out() -> None:
    args = build_arg_parser().parse_args(
        ["-a", "model_selection", "--arms", "rag", "hybrid", "--out", "x.json"]
    )
    assert args.agent == "model_selection" and args.variants == ["rag", "hybrid"]
    assert str(args.out) == "x.json"


def test_empty_aggregate_average_is_zero() -> None:
    assert CaseAggregate(case=_case(), variant="rag").average == 0.0


async def test_rag_collection_pins_the_search_tool(tmp_path: Path, monkeypatch) -> None:
    import tahoepilot.tools.rag.dbt_models as dbt

    seen: list[str] = []

    def fake_search(collection, query, **kwargs):
        seen.append(collection)
        return []

    monkeypatch.setattr(dbt, "qdrant_search", fake_search)
    catalog = AgentCatalog(
        AgentCatalogSettings.for_agent(
            "model_selection",
            profile_store=FileProfileStore(tmp_path),
            model=_ScriptedModel([AIMessage(content="{}")]),
            checkpointer=MemorySaver(),
            compression_config=CompressionConfig(enabled=False),
        )
    )
    agent = await catalog.create(
        "model_selection",
        listener=AgentListener(),
        run_context={"retrieval": "rag", "rag_collection": "metric_catalog_models"},
    )
    (tool,) = agent.selection_tools()
    assert tool.name == "fetch_related_models"
    assert "layer" not in tool.tool_call_schema.model_json_schema()["properties"]
    tool.func("daily active users", runtime=None)
    assert seen == ["metric_catalog_models"]


def test_selection_report_pairs_arms_and_lists_disagreements(tmp_path: Path) -> None:
    from evals.selection_report import load_runs, paired, render, sign_test_p

    def run(arm: str, case: str, selection: float, chosen: str) -> dict:
        return {
            "case": f"g/s/{case}", "kind": "metric", "arm": arm, "model": "m", "cancelled": False,
            "expected": ["fct_dau"], "chosen": chosen, "candidates": [chosen], "tool_calls": ["t"],
            "seconds": 1.0, "reply": "",
            "score": {"selection": selection, "recall": 1.0, "economy": 1.0, "details": {"parsed": True}},
        }

    path = tmp_path / "r.json"
    path.write_text(json.dumps({"runs": [
        run("rag", "a", 0.0, "fct_dau_w_bots"), run("catalog", "a", 1.0, "fct_dau"),
        run("rag", "b", 1.0, "fct_dau"), run("catalog", "b", 1.0, "fct_dau"),
    ]}), encoding="utf-8")
    runs = load_runs([path])
    result = paired(runs, "catalog", "rag")
    assert (result["wins"], result["losses"], result["ties"]) == (1, 0, 1)
    assert sign_test_p(0, 0) == 1.0 and sign_test_p(6, 0) == pytest.approx(2 / 64)
    text = render(runs)
    assert "| a | ✗ `fct_dau_w_bots` | ✓ `fct_dau` | fct_dau |" in text


async def test_parallel_retrieval_calls_merge_staged_cards(tmp_path: Path) -> None:
    both = AIMessage(
        content="",
        tool_calls=[
            {"name": "find_models_metrics", "args": {"root_id": "gmv", "member_id": "sum_excl_ltd"}, "id": "c1"},
            {"name": "find_models_metrics", "args": {"root_id": "dau", "member_id": "distinct"}, "id": "c2"},
        ],
    )
    agent = await _agent(tmp_path, _ScriptedModel([both, AIMessage(content=json.dumps(CHOICE))]), "catalog")
    run = await _run(_case(), agent)
    assert run.record.tool_names == ["find_models_metrics", "find_models_metrics"]
    assert {"fct_transaction_variations", "fct_dau"} <= set(run.record.candidates)


def test_staging_reducer_unions_by_id_and_clears_on_empty() -> None:
    from tahoepilot.agent.specialists.databot.card_staging import staging_cards_reducer

    a, b, c = ({"staging_id": x} for x in "abc")
    assert staging_cards_reducer([a], [a, b]) == [a, b]
    assert staging_cards_reducer(staging_cards_reducer([a], [a, b]), [a, c]) == [a, b, c]
    assert staging_cards_reducer([a, b], []) == []
    assert staging_cards_reducer([a], None) == [a]


async def test_runner_records_a_crashed_run_and_continues(tmp_path: Path) -> None:
    cases_dir = tmp_path / "cases"
    cases_dir.mkdir()
    _write_batch(cases_dir, "sel", [
        {"name": "boom", "query": "q", "expected_models": ["fct_dau"]},
        {"name": "ok", "query": "gmv?", "expected_models": ["fct_transaction_variations"]},
    ])

    class _Boom(_ScriptedModel):
        def invoke(self, messages, *args, **kwargs):
            if self.calls == 0:
                self.calls += 1
                raise RuntimeError("provider down")
            return super().invoke(messages, *args, **kwargs)

    async def factory(model_name: str, context: dict):
        arm = context["retrieval"]
        return await _agent(tmp_path / arm, _Boom([AIMessage(content=""), *_catalog_script()]), arm)

    cases = load_cases("model_selection", ["sel"], cases_dir=cases_dir)
    aggregates = await run_cases(cases, factory)
    boom, ok = (a.runs[0] for a in aggregates)
    assert "provider down" in boom.record.error and boom.total == 0.0
    assert ok.scores["selection"] == 1.0


def test_parse_selection_ignores_think_block_braces() -> None:
    from tahoepilot.agent.specialists.model_selection import parse_selection

    reply = '<think>compare {grain} and {"model": "wrong"}</think>\n{"model": "fct_dau", "reason": "x {y}"}'
    assert parse_selection(reply)["model"] == "fct_dau"
    assert parse_selection('prose {not json} then {"model": null}') == {"model": None}
    assert parse_selection("no json here") == {}


def test_rescore_uses_current_gold_and_parser(tmp_path: Path) -> None:
    from evals.selection_report import rescore_runs

    run = {
        "case": "model_selection/metric/orders_yesterday", "kind": "metric", "arm": "rag",
        "model": "m", "cancelled": False, "error": "", "expected": [], "chosen": "",
        "candidates": ["fct_daily_buyer"], "tool_calls": [], "seconds": 1.0,
        "reply": '<think>{x}</think>{"model": "fct_daily_buyer"}',
        "score": {"selection": 0.0, "recall": 0.0, "economy": 1.0, "details": {"parsed": False}},
    }
    (rescored,) = rescore_runs([run])
    assert rescored["chosen"] == "fct_daily_buyer"
    assert rescored["score"]["selection"] == 1.0 and rescored["score"]["recall"] == 1.0

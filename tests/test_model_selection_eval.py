"""Model selection agent (eval-only) and the retrieval-arm comparison eval."""

from __future__ import annotations

import json
from pathlib import Path

import pytest
from langchain_core.messages import AIMessage
from langgraph.checkpoint.memory import MemorySaver

from agent.catalog import AgentCatalog, AgentCatalogSettings
from agent.lead.prompt import delegatable_agents
from agent.listener import AgentListener
from agent.specialists.model_selection import ModelSelectionAgent, ModelSelectionSystemPrompt
from config.agent_config import ModelSelectionAgentConfig
from evals.__main__ import build_arg_parser
from evals.selection_case import (
    ARMS,
    ModelSelectionCase,
    SelectionAggregate,
    find_selection_cases,
    format_arm_summary,
    format_case_matrix,
    normalize_model_name,
    results_to_json,
    run_selection_cases,
    validate_arms,
)
from memory import CompressionConfig
from memory.profile_store import FileProfileStore
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


def _case(**overrides) -> ModelSelectionCase:
    fields = {
        "name": "gmv",
        "case_group": "t/s",
        "query": "What was Wish's GMV last month?",
        "models": ["fake"],
        "expected_models": ["fct_transaction_variations", "master_commerce_transactions"],
    }
    fields.update(overrides)
    return ModelSelectionCase(**fields)


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
    with pytest.raises(ValueError):
        validate_arms(["rag", "bm25"])
    assert validate_arms(["Rag", "rag", "hybrid"]) == ["rag", "hybrid"]


@pytest.mark.parametrize("arm", ARMS)
async def test_each_arm_gets_only_its_tools(tmp_path: Path, arm: str) -> None:
    agent = await _agent(tmp_path, _ScriptedModel([AIMessage(content="{}")]), arm)
    names = {tool.name for tool in agent.selection_tools()}
    assert names == set(ModelSelectionAgentConfig.RETRIEVAL_ARMS[arm])
    assert agent.run_context["refine_user_profile_prompt"] == ""


async def test_catalog_run_scores_selection_recall_and_economy(tmp_path: Path) -> None:
    agent = await _agent(tmp_path, _ScriptedModel(_catalog_script()), "catalog")
    result = await _case(max_tool_calls=4).run(agent, model_name="fake", arm="catalog")
    assert result.tool_calls == ["search_metric_catalog", "search_metric_catalog", "find_models_metrics"]
    assert result.chosen == "fct_transaction_variations"
    assert "fct_transaction_variations" in result.candidates
    assert (result.score.selection, result.score.recall, result.score.economy) == (1.0, 1.0, 1.0)
    assert result.score.details["member_id"] == "sum_excl_ltd"


async def test_wrong_choice_with_good_candidates_is_a_choice_miss(tmp_path: Path) -> None:
    choice = {**CHOICE, "model": "dau_attribution"}
    agent = await _agent(tmp_path, _ScriptedModel(_catalog_script(choice)), "catalog")
    result = await _case(max_tool_calls=2).run(agent, model_name="fake", arm="catalog")
    assert result.score.selection == 0.0
    assert result.score.recall == 1.0
    assert result.score.economy == pytest.approx(0.5)


async def test_null_choice_without_tools_scores_zero(tmp_path: Path) -> None:
    reply = AIMessage(content='{"model": null, "reason": "not in the catalog"}')
    agent = await _agent(tmp_path, _ScriptedModel([reply]), "catalog")
    result = await _case().run(agent, model_name="fake", arm="catalog")
    assert result.chosen == "" and result.candidates == []
    assert (result.score.selection, result.score.recall) == (0.0, 0.0)


async def test_runner_builds_one_agent_per_llm_and_arm(tmp_path: Path) -> None:
    cases_dir = tmp_path / "cases"
    cases_dir.mkdir()
    (cases_dir / "sel.json").write_text(
        json.dumps(
            {
                "models": ["fake"],
                "s": [
                    {"name": "a", "query": "gmv?", "expected_models": ["fct_transaction_variations"]},
                    {"name": "b", "query": "gmv again?", "expected_models": "master_commerce_transactions"},
                ],
            }
        ),
        encoding="utf-8",
    )
    built: list[tuple[str, str]] = []

    async def factory(model_name: str, arm: str):
        built.append((model_name, arm))
        script = _catalog_script() * 2
        return await _agent(tmp_path / arm, _ScriptedModel(script), arm)

    aggregates = await run_selection_cases(["sel"], factory, arms=["catalog"], cases_dir=cases_dir)
    assert built == [("fake", "catalog")]
    assert [a.case.name for a in aggregates] == ["a", "b"]
    assert aggregates[0].average == pytest.approx(1.0)
    assert aggregates[1].model_results[0].score.selection == 0.0
    assert "catalog" in format_arm_summary(aggregates)
    assert "*fct_transaction_variations" in format_case_matrix(aggregates)
    payload = results_to_json(aggregates)
    assert payload["summary"][0]["arm"] == "catalog" and len(payload["runs"]) == 2


def test_shipped_cases_load_and_name_known_models() -> None:
    from tools.data import metrics

    cases = find_selection_cases(["model_selection"])
    assert len({case.name for case in cases}) == len(cases)
    catalog_models = set(metrics.load_root_member_assign()[0])
    for case in cases:
        if case.kind != "uncovered":
            assert set(case.expected_models) <= catalog_models, case.name


def test_case_requires_expected_models(tmp_path: Path) -> None:
    (tmp_path / "bad.json").write_text(
        json.dumps({"models": ["fake"], "s": [{"name": "x", "query": "q"}]}),
        encoding="utf-8",
    )
    with pytest.raises(ValueError, match="expected_models"):
        find_selection_cases(["bad"], cases_dir=tmp_path)


async def test_abstain_case_rewards_null_and_skips_recall(tmp_path: Path) -> None:
    null_reply = AIMessage(content='{"model": null, "reason": "no ad spend model"}')
    agent = await _agent(tmp_path, _ScriptedModel([null_reply]), "catalog")
    result = await _case(expected_models=[]).run(agent, model_name="fake", arm="catalog")
    assert (result.score.selection, result.score.recall) == (1.0, None)
    assert result.score.total == pytest.approx(1.0)

    guess = AIMessage(content='{"model": "fct_dau", "reason": "closest"}')
    agent = await _agent(tmp_path / "g", _ScriptedModel([guess]), "catalog")
    result = await _case(expected_models=[]).run(agent, model_name="fake", arm="catalog")
    assert result.score.selection == 0.0

    prose = AIMessage(content="I could not find a model.")
    agent = await _agent(tmp_path / "p", _ScriptedModel([prose]), "catalog")
    result = await _case(expected_models=[]).run(agent, model_name="fake", arm="catalog")
    assert result.score.selection == 0.0  # no JSON answer is not an abstention


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
    assert args.agent == "model_selection" and args.arms == ["rag", "hybrid"]
    assert str(args.out) == "x.json"


def test_empty_aggregate_average_is_zero() -> None:
    assert SelectionAggregate(case=_case(), arm="rag").average == 0.0


async def test_rag_collection_pins_the_search_tool(tmp_path: Path, monkeypatch) -> None:
    import tools.rag.dbt_models as dbt

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
    result = await _case().run(agent, model_name="fake", arm="catalog")
    assert result.tool_calls == ["find_models_metrics", "find_models_metrics"]
    assert {"fct_transaction_variations", "fct_dau"} <= set(result.candidates)


def test_staging_reducer_unions_by_id_and_clears_on_empty() -> None:
    from agent.specialists.databot.card_staging import staging_cards_reducer

    a, b, c = ({"staging_id": x} for x in "abc")
    assert staging_cards_reducer([a], [a, b]) == [a, b]
    assert staging_cards_reducer(staging_cards_reducer([a], [a, b]), [a, c]) == [a, b, c]
    assert staging_cards_reducer([a, b], []) == []
    assert staging_cards_reducer([a], None) == [a]


async def test_runner_records_a_crashed_run_and_continues(tmp_path: Path) -> None:
    cases_dir = tmp_path / "cases"
    cases_dir.mkdir()
    (cases_dir / "sel.json").write_text(json.dumps({"models": ["fake"], "s": [
        {"name": "boom", "query": "q", "expected_models": ["fct_dau"]},
        {"name": "ok", "query": "gmv?", "expected_models": ["fct_transaction_variations"]},
    ]}), encoding="utf-8")

    class _Boom(_ScriptedModel):
        def invoke(self, messages, *args, **kwargs):
            if self.calls == 0:
                self.calls += 1
                raise RuntimeError("provider down")
            return super().invoke(messages, *args, **kwargs)

    async def factory(model_name: str, arm: str):
        return await _agent(tmp_path / arm, _Boom([AIMessage(content=""), *_catalog_script()]), arm)

    aggregates = await run_selection_cases(["sel"], factory, arms=["catalog"], cases_dir=cases_dir)
    boom, ok = (a.model_results[0] for a in aggregates)
    assert "provider down" in boom.error and boom.score.selection == 0.0
    assert ok.score.selection == 1.0


def test_parse_selection_ignores_think_block_braces() -> None:
    from agent.specialists.model_selection import parse_selection

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

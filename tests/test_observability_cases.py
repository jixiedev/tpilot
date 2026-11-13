"""EvalCase subclasses and CaseLoader."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from observability.case import (
    CaseLoader,
    DatabotEvalCase,
    IntentEvalCase,
    ReactEvalCase,
    ToolsSpec,
)


def _write(root: Path, eval_set: str, agent: str, payload: dict) -> None:
    directory = root / eval_set
    directory.mkdir(parents=True, exist_ok=True)
    (directory / f"{agent}.json").write_text(json.dumps(payload), encoding="utf-8")


def test_loader_maps_agents_to_case_types() -> None:
    assert CaseLoader.CASE_TYPES == {
        "databot": DatabotEvalCase,
        "knowledge": ReactEvalCase,
        "intent": IntentEvalCase,
    }


def test_load_react_case(tmp_path: Path) -> None:
    _write(
        tmp_path,
        "functional",
        "knowledge",
        {
            "cases": [
                {
                    "name": "ok",
                    "query": "hello",
                    "tools": {"required": ["planning"], "allowed": ["planning"]},
                    "max_tool_calls": 2,
                    "expected_output": {"x": "y"},
                }
            ],
        },
    )
    [case] = CaseLoader(tmp_path).load(["knowledge"], ["functional"])
    assert isinstance(case, ReactEvalCase)
    assert case.id == "functional/knowledge/ok"
    assert case.prompt == "hello"
    assert case.tools == ToolsSpec(required=["planning"], allowed=["planning"])
    assert case.max_tool_calls == 2
    assert case.expected_output == {"x": "y"}


def test_load_databot_case(tmp_path: Path) -> None:
    _write(
        tmp_path,
        "functional",
        "databot",
        {
            "cases": [
                {
                    "name": "plain",
                    "query": "find table",
                    "tools": {"required": ["fetch_related_models", "commit_cards"]},
                    "expected_table_cards": ["fct_dau"],
                    "expected_output": "core_data.fct_dau",
                    "expected_sql": "select 1",
                },
                {
                    "name": "with_draft",
                    "query": "find table",
                    "max_tool_calls": 3,
                    "draft_tools": {"required": ["trino_run_query"]},
                },
            ],
        },
    )
    plain, with_draft = CaseLoader(tmp_path).load(["databot"], ["functional"])
    assert isinstance(plain, DatabotEvalCase)
    assert plain.tools.required == ["fetch_related_models", "commit_cards"]
    assert plain.draft_tools is None
    assert plain.expected_output == "core_data.fct_dau"
    assert plain.expected_table_cards == ["fct_dau"]
    assert plain.expected_sql == "select 1"
    assert with_draft.max_tool_calls == 3
    assert with_draft.draft_tools == ToolsSpec(required=["trino_run_query"])


def test_load_intent_case(tmp_path: Path) -> None:
    _write(
        tmp_path,
        "functional",
        "intent",
        {
            "cases": [
                {
                    "name": "ok",
                    "query": "What was GMV?",
                    "expected_status": "published",
                    "expected_intentions": ["DATA"],
                    "expected_routes": ["databot"],
                }
            ],
        },
    )
    [case] = CaseLoader(tmp_path).load(["intent"], ["functional"])
    assert isinstance(case, IntentEvalCase)
    assert case.expected_routes == ["databot"]
    assert case.run_kwargs == {"handoff": False}
    assert case.traced is False


def test_models_key_in_fixture_is_ignored(tmp_path: Path) -> None:
    _write(
        tmp_path,
        "harness",
        "knowledge",
        {"models": ["x"], "cases": [{"name": "a", "query": "q", "models": ["y"]}]},
    )
    [case] = CaseLoader(tmp_path).load(["knowledge"], ["harness"])
    assert not hasattr(case, "models")


def test_missing_agent_file_is_skipped(tmp_path: Path) -> None:
    (tmp_path / "functional").mkdir()
    assert CaseLoader(tmp_path).load(["knowledge"], ["functional"]) == []


def test_shipped_fixtures_load() -> None:
    loader = CaseLoader()
    assert loader.eval_sets() == ["functional", "harness", "performance"]
    every_set = ["functional", "performance", "harness"]
    databot = loader.load(["databot"], ["functional"])
    assert isinstance(databot[0], DatabotEvalCase)
    assert databot[0].tools.required == ["fetch_related_models", "commit_cards"]
    knowledge = loader.load(["knowledge"], ["harness"])
    assert {case.name for case in knowledge} == {
        "arithmetic",
        "greeting",
        "create_plan_before_reply",
    }
    assert loader.load(["databot", "knowledge", "intent"], every_set)


def test_missing_query_raises(tmp_path: Path) -> None:
    _write(tmp_path, "functional", "knowledge", {"cases": [{"name": "a"}]})
    with pytest.raises(KeyError):
        CaseLoader(tmp_path).load(["knowledge"], ["functional"])

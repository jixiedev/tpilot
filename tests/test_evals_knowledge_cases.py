"""Knowledge and lead batches for metric and lineage questions: gold stays consistent."""

from __future__ import annotations

import tomllib
from pathlib import Path

from evals.case import load_cases
from tahoepilot.tools.data.metrics import load_roots, search_metric_catalog_impl

ROOT = Path(__file__).resolve().parents[1]


def _model_names() -> set[str]:
    return {p.stem for p in (ROOT / "semantic_models").glob("*/*.sql")}


def _knowledge_tools() -> set[str]:
    groups = tomllib.loads((ROOT / "config/tool_groups.toml").read_text())
    scopes = tomllib.loads((ROOT / "config/agents/knowledge.toml").read_text())["tools"]
    out: set[str] = set()
    for names in scopes.values():
        for name in names:
            out |= set(groups.get(name[1:], [])) if name.startswith("@") else {name}
    return out


def test_metric_batches_use_catalog_ids():
    cases = load_cases("knowledge", ["metric_definition", "not_in_catalog"])
    assert len(cases) >= 10
    roots = load_roots()
    models = _model_names()
    for case in cases:
        answer = case.expect["answer"]
        root, member, gold = (answer[k] for k in ("root_id", "member_id", "model"))
        if root is None:
            assert member is None and gold is None, case.id
            continue
        assert root in roots, case.id
        members = {r["member_id"] for r in search_metric_catalog_impl("", "members", root, 100)["rows"]}
        assert member in members, case.id
        assert gold and set(gold) <= models, case.id
        assert case.expect["expected_tools"] == ["search_metric_catalog", "describe_metric_models"], case.id


def test_knowledge_batches_only_expect_knowledge_tools():
    tools = _knowledge_tools()
    for case in load_cases("knowledge"):
        assert set(case.expect.get("expected_tools") or []) <= tools | {"planning"}, case.id


def test_every_scored_key_is_asked_for():
    for case in load_cases("knowledge"):
        for key in case.expect.get("answer") or {}:
            assert f'"{key}"' in case.query, (case.id, key)


def test_lead_routing_batches_for_metrics_and_lineage():
    cases = {c.name: c for c in load_cases("lead", ["route_metric_questions", "route_lineage_questions"])}
    assert cases["gmv_definition"].expect["expected_routes"] == ["knowledge"]
    assert cases["gmv_number"].expect["expected_routes"] == ["warehouse"]
    assert cases["define_then_query"].expect["expected_decision"] == "plan"
    assert cases["dag_of_table"].expect["expected_routes"] == ["knowledge"]
    assert cases["failed_dag_goes_to_diagnostic"].expect["expected_routes"] == ["diagnostic"]

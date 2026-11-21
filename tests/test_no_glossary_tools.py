"""No agent gets DataHub glossary tools; metric questions use the metric catalog."""

from __future__ import annotations

import tomllib
from pathlib import Path

CONFIG = Path(__file__).resolve().parents[1] / "config"
GLOSSARY_TOOLS = {"datahub_list_glossary_terms", "record_metric_conflict"}


def _groups() -> dict[str, list[str]]:
    return tomllib.loads((CONFIG / "tool_groups.toml").read_text())


def _expand(names: list[str], groups: dict[str, list[str]]) -> set[str]:
    out: set[str] = set()
    for name in names:
        out |= set(groups.get(name[1:], [])) if name.startswith("@") else {name}
    return out


def test_no_agent_lists_glossary_tools():
    groups = _groups()
    for path in sorted((CONFIG / "agents").glob("*.toml")):
        scopes = tomllib.loads(path.read_text()).get("tools") or {}
        for scope, names in scopes.items():
            leaked = _expand(list(names), groups) & GLOSSARY_TOOLS
            assert not leaked, f"{path.name} [tools].{scope} lists {sorted(leaked)}"


def test_knowledge_has_metric_catalog_tools():
    scopes = tomllib.loads((CONFIG / "agents" / "knowledge.toml").read_text())["tools"]
    tools = _expand(scopes["default"], _groups())
    assert {"search_metric_catalog", "describe_metric_models"} <= tools
    assert "find_models_metrics" not in tools  # stages cards into state; knowledge only reads


def test_describe_metric_models_reads_without_state():
    import json

    from tahoepilot.tools.data.metrics import describe_metric_models

    out = json.loads(describe_metric_models.invoke({"root_id": "gmv", "member_id": "sum_excl_ltd"}))
    assert out["models"] and "staging_id" not in out["models"][0]
    assert out["models"][0]["matched_metrics"][0]["agg"]
    missing = json.loads(describe_metric_models.invoke({"root_id": "nope", "member_id": "x"}))
    assert missing["models"] == [] and "fetch_related_models" not in missing["message"]

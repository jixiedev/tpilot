"""Metric catalog lookups and the search_metric_catalog / find_models_metrics tools."""

from __future__ import annotations

import json
from types import SimpleNamespace

import pytest
from langchain_core.utils.function_calling import convert_to_openai_function

from tools.data import metrics as M


def test_catalog_files_are_consistent() -> None:
    roots = M.load_roots()
    members = M.load_members()
    models, by_root_member = M.load_root_member_assign()
    assert roots and members and models
    assert set(members) <= set(roots)
    known_pairs = {(m.root_id, m.member_id) for ms in members.values() for m in ms}
    for root_id, member_id in by_root_member:
        if root_id == M.UNASSIGNED_ROOT:
            continue
        assert (root_id, member_id) in known_pairs, (root_id, member_id)
    for name in models:
        assert M.load_model(name) is not None, f"missing yml for {name}"


def test_lookup_sorted_by_ratio_and_not_mutated() -> None:
    first = M.lookup_models_metrics("gmv", "sum_excl_ltd")
    ratios = [a.related_ratio for _, a in first]
    assert ratios == sorted(ratios, reverse=True)
    assert M.lookup_models_metrics("no_such_root", "x") == []
    _, by_root_member = M.load_root_member_assign()
    assert ("no_such_root", "x") not in by_root_member
    assert M.lookup_models_metrics("gmv", "sum_excl_ltd") == first


def test_search_roots_matches_aliases_and_chinese() -> None:
    result = json.loads(M.search_metric_catalog.invoke({"pattern": "成交总额"}))
    assert "gmv" in [row["root_id"] for row in result["rows"]]


def test_search_members_of_root_default_first() -> None:
    result = json.loads(M.search_metric_catalog.invoke({"scope": "members", "root_id": "gmv"}))
    rows = result["rows"]
    assert rows and all(row["root_id"] == "gmv" for row in rows)
    assert rows[0]["is_default"] is True


def test_search_invalid_regex_falls_back_to_literal() -> None:
    result = json.loads(M.search_metric_catalog.invoke({"pattern": "gmv("}))
    assert result["match_count"] == 0


def test_search_rejects_bad_scope_and_unknown_root() -> None:
    with pytest.raises(ValueError):
        M.search_metric_catalog_impl("gmv", scope="tables")
    with pytest.raises(ValueError):
        M.search_metric_catalog_impl("", scope="members", root_id="no_such_root")


def test_find_cards_have_table_card_shape() -> None:
    cards, message = M.find_models_metrics_cards("gmv", "sum_excl_ltd")
    assert cards, message
    card = cards[0]
    for key in ("name", "physical_tables", "columns", "metrics", "cte", "agg_time_dimension"):
        assert key in card
    assert card["matched_chunk_type"] == "metric_catalog"
    assert card["matched_metrics"] and card["related_ratio"] == max(
        m["related_ratio"] for m in card["matched_metrics"]
    )
    assert len({c["name"] for c in cards}) == len(cards)


@pytest.mark.parametrize(
    ("root_id", "member_id", "hint"),
    [
        ("no_such_root", "x", "fetch_related_models"),
        (M.UNASSIGNED_ROOT, M.UNASSIGNED_ROOT, "fetch_related_models"),
        ("gmv", "no_such_member", "sum_excl_ltd"),
    ],
)
def test_find_unknown_pairs_explain_next_step(root_id: str, member_id: str, hint: str) -> None:
    cards, message = M.find_models_metrics_cards(root_id, member_id)
    assert cards == []
    assert hint in message


def test_find_tool_stages_cards_for_commit() -> None:
    runtime = SimpleNamespace(state={"staging_cards": [{"staging_id": "old_1", "name": "old"}]}, tool_call_id="c1")
    command = M.find_models_metrics.func("gmv", "sum_excl_ltd", limit=3, runtime=runtime)
    staging = command.update["staging_cards"]
    assert staging[0]["staging_id"] == "old_1"
    assert len(staging) == 4 and all(c.get("staging_id") for c in staging)
    summary = json.loads(command.update["messages"][0].content)
    assert [ref["staging_id"] for ref in summary["staged"]] == [c["staging_id"] for c in staging[1:]]
    assert "preference" in summary["message"]


def test_tool_schemas_are_provider_safe() -> None:
    for t in (M.search_metric_catalog, M.find_models_metrics):
        props = convert_to_openai_function(t)["parameters"]["properties"]
        for spec in props.values():
            assert "enum" not in spec and "anyOf" not in spec and "const" not in spec

from __future__ import annotations

import json
from typing import Any
from urllib.error import URLError
from urllib.request import Request

import pytest

from config.tool_config import DataHubToolConfig
from tools.external import datahub as datahub_mod


def test_assert_query_only_rejects_mutation() -> None:
    with pytest.raises(ValueError, match="read-only"):
        datahub_mod._assert_query_only('mutation { createTag(input: {name: "x"}) }')


def test_assert_query_only_allows_query() -> None:
    datahub_mod._assert_query_only("{ me { corpUser { username } } }")


def test_execute_graphql_posts_and_returns_data(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("DATAHUB_GMS_TOKEN", "test-token")
    captured: dict[str, Any] = {}

    class _Resp:
        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

        def read(self) -> bytes:
            return json.dumps({"data": {"me": {"corpUser": {"username": "alice"}}}}).encode()

    def fake_urlopen(request: Request, timeout: float = 0):
        captured["url"] = request.full_url
        captured["method"] = request.get_method()
        captured["auth"] = request.get_header("Authorization")
        captured["body"] = request.data
        captured["timeout"] = timeout
        return _Resp()

    monkeypatch.setattr(datahub_mod.urllib.request, "urlopen", fake_urlopen)
    cfg = DataHubToolConfig(
        gms_url="http://datahub.example",
        token_env="DATAHUB_GMS_TOKEN",
        timeout_seconds=12,
    )
    result = datahub_mod.execute_graphql(
        "query ($q: String!) { searchAcrossEntities(input: {query: $q, start: 0, count: 1}) { total } }",
        {"q": "gmv"},
        cfg=cfg,
    )
    assert result["data"]["me"]["corpUser"]["username"] == "alice"
    assert captured["url"] == "http://datahub.example/api/graphql"
    assert captured["method"] == "POST"
    assert captured["timeout"] == 12.0
    assert captured["auth"] == "Bearer test-token"
    body = json.loads(captured["body"].decode())
    assert "searchAcrossEntities" in body["query"]
    assert body["variables"] == {"q": "gmv"}


def test_execute_graphql_raises_on_graphql_errors(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("DATAHUB_GMS_TOKEN", "t")

    class _Resp:
        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

        def read(self) -> bytes:
            return json.dumps({"errors": [{"message": "bad field"}]}).encode()

    monkeypatch.setattr(
        datahub_mod.urllib.request,
        "urlopen",
        lambda *args, **kwargs: _Resp(),
    )
    with pytest.raises(datahub_mod.DataHubGraphQLError, match="bad field"):
        datahub_mod.execute_graphql("{ nope }", cfg=DataHubToolConfig(token_env="DATAHUB_GMS_TOKEN"))


def test_execute_graphql_connection_error(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DATAHUB_GMS_TOKEN", "t")

    def boom(*args, **kwargs):
        raise URLError("connection refused")

    monkeypatch.setattr(datahub_mod.urllib.request, "urlopen", boom)
    with pytest.raises(datahub_mod.DataHubGraphQLError, match="connection failed"):
        datahub_mod.execute_graphql("{ me { urn } }", cfg=DataHubToolConfig(token_env="DATAHUB_GMS_TOKEN"))


def test_datahub_graphql_query_tool_rejects_mutation() -> None:
    with pytest.raises(ValueError, match="read-only"):
        datahub_mod.datahub_graphql_query.invoke(
            {"query": 'mutation { deleteTag(urn: "urn:li:tag:x") }', "variables": ""}
        )


def test_list_entities_search_then_hydrate(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DATAHUB_GMS_TOKEN", "t")
    calls: list[dict[str, Any]] = []

    def fake_execute(query: str, variables=None, *, cfg=None):
        calls.append({"query": query, "variables": variables})
        if "searchAcrossEntities" in query:
            return {
                "data": {
                    "searchAcrossEntities": {
                        "start": 0,
                        "count": 1,
                        "total": 1,
                        "searchResults": [
                            {
                                "entity": {
                                    "urn": "urn:li:dataset:(urn:li:dataPlatform:hive,db.t,PROD)",
                                    "type": "DATASET",
                                }
                            }
                        ],
                    }
                }
            }
        return {
            "data": {
                "entities": [
                    {
                        "urn": "urn:li:dataset:(urn:li:dataPlatform:hive,db.t,PROD)",
                        "type": "DATASET",
                        "properties": {"name": "t", "description": "demo"},
                        "upstream": {"total": 0, "relationships": []},
                        "downstream": {
                            "total": 1,
                            "relationships": [
                                {
                                    "type": "DownstreamOf",
                                    "entity": {
                                        "urn": "urn:li:dataset:(urn:li:dataPlatform:hive,db.out,PROD)",
                                        "type": "DATASET",
                                    },
                                }
                            ],
                        },
                    }
                ]
            }
        }

    monkeypatch.setattr(datahub_mod, "execute_graphql", fake_execute)
    result = datahub_mod.list_entities("DATASET", query="demo", start=0, count=5)
    assert result["entity_type"] == "DATASET"
    assert result["total"] == 1
    assert result["count"] == 1
    assert result["entities"][0]["properties"]["name"] == "t"
    assert result["entities"][0]["downstream"]["total"] == 1
    assert "searchAcrossEntities" in calls[0]["query"]
    assert calls[0]["variables"]["input"]["types"] == ["DATASET"]
    assert "hydrateEntities" in calls[1]["query"] or "entities(urns" in calls[1]["query"]
    assert "upstream" in calls[1]["query"]
    assert "downstream" in calls[1]["query"]


def test_list_glossary_terms_tool_uses_glossary_fragment(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("DATAHUB_GMS_TOKEN", "t")

    def fake_execute(query: str, variables=None, *, cfg=None):
        if "searchAcrossEntities" in query:
            assert variables["input"]["types"] == ["GLOSSARY_TERM"]
            return {
                "data": {
                    "searchAcrossEntities": {
                        "start": 0,
                        "count": 1,
                        "total": 1,
                        "searchResults": [
                            {"entity": {"urn": "urn:li:glossaryTerm:GMV", "type": "GLOSSARY_TERM"}}
                        ],
                    }
                }
            }
        assert "GlossaryTerm" in query or "hierarchicalName" in query
        assert "TermedWith" in query
        return {
            "data": {
                "entities": [
                    {
                        "urn": "urn:li:glossaryTerm:GMV",
                        "type": "GLOSSARY_TERM",
                        "hierarchicalName": "Metrics.GMV",
                        "properties": {"name": "GMV", "description": "Gross merchandise value"},
                    }
                ]
            }
        }

    monkeypatch.setattr(datahub_mod, "execute_graphql", fake_execute)
    result = datahub_mod.datahub_list_glossary_terms.invoke({"query": "GMV", "start": 0, "count": 5})
    assert result["entities"][0]["properties"]["name"] == "GMV"


def test_list_count_is_clamped(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DATAHUB_GMS_TOKEN", "t")
    seen: dict[str, Any] = {}

    def fake_execute(query: str, variables=None, *, cfg=None):
        if "searchAcrossEntities" in query:
            seen["count"] = variables["input"]["count"]
            return {
                "data": {
                    "searchAcrossEntities": {
                        "start": 0,
                        "count": 0,
                        "total": 0,
                        "searchResults": [],
                    }
                }
            }
        return {"data": {"entities": []}}

    monkeypatch.setattr(datahub_mod, "execute_graphql", fake_execute)
    datahub_mod.list_entities("TAG", query="*", count=100)
    assert seen["count"] == datahub_mod.MAX_LIST_COUNT


def test_tools_export_includes_typed_list_helpers() -> None:
    names = {tool.name for tool in datahub_mod.TOOLS}
    assert "datahub_list_datasets" in names
    assert "datahub_list_data_jobs" in names
    assert "datahub_list_data_flows" in names
    assert "datahub_list_glossary_terms" in names
    assert "datahub_list_charts" in names
    assert "datahub_list_dashboards" in names
    assert "datahub_list_tags" in names
    assert "datahub_list_people" in names
    assert "datahub_list_groups" in names
    assert "datahub_graphql_query" in names

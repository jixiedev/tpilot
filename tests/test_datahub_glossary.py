from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest

from tools.datahub_glossary import (
    find_search_tool,
    glossary_search_variants,
    invoke_glossary_search,
    make_search_glossary_term_tool,
)


def test_find_search_tool_prefers_known_names() -> None:
    other = MagicMock()
    other.name = "other"
    search = MagicMock()
    search.name = "search"
    assert find_search_tool([other, search]) is search


def test_glossary_search_variants_include_entity_type_filters() -> None:
    variants = glossary_search_variants("gmv", 5)
    assert len(variants) >= 3
    assert variants[0]["entity_types"] == ["GLOSSARY_TERM"]
    assert any("GLOSSARY_TERM" in str(variant) for variant in variants)


@pytest.mark.asyncio
async def test_invoke_glossary_search_returns_first_success() -> None:
    search_tool = MagicMock()
    search_tool.ainvoke = AsyncMock(
        side_effect=[
            "=== TOOL ERROR ===\n{}",
            {"entities": [{"name": "GMV"}]},
        ]
    )

    result = await invoke_glossary_search(search_tool, "gmv", num_results=5)

    assert result["query"] == "gmv"
    assert result["results"] == {"entities": [{"name": "GMV"}]}
    assert search_tool.ainvoke.await_count == 2


@pytest.mark.asyncio
async def test_invoke_glossary_search_reports_all_failures() -> None:
    search_tool = MagicMock()
    search_tool.ainvoke = AsyncMock(return_value="=== TOOL ERROR ===\n{}")

    result = await invoke_glossary_search(search_tool, "gmv")

    assert result["error"] == "glossary_search_failed"
    assert len(result["attempts"]) == len(glossary_search_variants("gmv", 10))


@pytest.mark.asyncio
async def test_search_glossary_term_rejects_wildcards() -> None:
    tool = make_search_glossary_term_tool(MagicMock(name="search"))
    result = await tool.ainvoke({"query": "*"})
    assert result["error"] == "invalid_query"


@pytest.mark.asyncio
async def test_search_glossary_term_without_mcp_search() -> None:
    tool = make_search_glossary_term_tool(None)
    result = await tool.ainvoke({"query": "gmv"})
    assert result["error"] == "no_search_tool"

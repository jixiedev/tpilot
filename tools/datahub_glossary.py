"""DataHub glossary search with fixed GLOSSARY_TERM entity filtering."""

from __future__ import annotations

import json
from typing import Any

from langchain.tools import tool
from langchain_core.tools import BaseTool

from tools.errors import StructuredToolError

SEARCH_TOOL_NAMES = frozenset({"search", "datahub_search"})


def find_search_tool(tools: list[BaseTool]) -> BaseTool | None:
    """Return the first loaded DataHub search MCP tool, if any."""
    for candidate in tools:
        if candidate.name in SEARCH_TOOL_NAMES:
            return candidate
    return None


def glossary_search_variants(query: str, num_results: int) -> list[dict[str, Any]]:
    """Parameter shapes used across common DataHub MCP search tool schemas."""
    cleaned = query.strip()
    if cleaned.startswith("/q "):
        cleaned = cleaned[3:].strip()
    return [
        {"query": cleaned, "entity_types": ["GLOSSARY_TERM"], "num_results": num_results},
        {"query": cleaned, "entityTypes": ["GLOSSARY_TERM"], "num_results": num_results},
        {
            "query": cleaned,
            "filter": 'entityTypes:["GLOSSARY_TERM"]',
            "num_results": num_results,
        },
        {"query": f"/q {cleaned} AND entityType:GLOSSARY_TERM", "num_results": num_results},
    ]


def _failed_payload_message(result: Any) -> str | None:
    if isinstance(result, str) and StructuredToolError.MARKER in result:
        return result
    if isinstance(result, dict) and result.get("error"):
        return json.dumps(result, ensure_ascii=False)
    return None


async def invoke_glossary_search(
    search_tool: BaseTool,
    query: str,
    num_results: int = 10,
) -> dict[str, Any]:
    """Try glossary-only search variants until one succeeds."""
    attempts: list[dict[str, Any]] = []
    for kwargs in glossary_search_variants(query, num_results):
        try:
            if hasattr(search_tool, "ainvoke"):
                result = await search_tool.ainvoke(kwargs)
            else:
                result = search_tool.invoke(kwargs)
        except Exception as exc:
            attempts.append({"arguments": kwargs, "error": str(exc)})
            continue

        failure = _failed_payload_message(result)
        if failure:
            attempts.append({"arguments": kwargs, "error": failure})
            continue

        return {
            "query": query,
            "arguments": kwargs,
            "results": result,
        }

    return {
        "error": "glossary_search_failed",
        "message": "All glossary search parameter variants failed",
        "attempts": attempts,
    }


def make_search_glossary_term_tool(search_tool: BaseTool | None) -> BaseTool:
    """Build ``search_glossary_term`` bound to the MCP search tool when present."""

    @tool
    async def search_glossary_term(query: str, num_results: int = 10) -> dict[str, Any]:
        """Search DataHub glossary terms for a metric or business definition.

        Use this for metric/KPI lookups instead of generic ``search``. Results are
        restricted to GLOSSARY_TERM entities.
        """
        if search_tool is None:
            return {
                "error": "no_search_tool",
                "message": "DataHub search MCP tool is not loaded",
            }

        term = query.strip()
        if not term or term in {"*", "**", "all", "ALL"}:
            return {
                "error": "invalid_query",
                "message": "Provide a specific glossary term; wildcard queries are not allowed",
            }

        return await invoke_glossary_search(search_tool, term, num_results)

    return search_glossary_term

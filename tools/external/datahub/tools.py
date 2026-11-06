"""LangChain ``@tool`` wrappers for DataHub and their tool-binding registrations."""

from __future__ import annotations

from typing import Any

from langchain.tools import tool

from tools.registry import register_tool
from tools.external.datahub.client import execute_graphql
from tools.external.datahub.operations import (
    get_dataset_queries,
    get_lineage,
    get_lineage_paths_between,
    list_entities,
    list_schema_fields,
)
from tools.external.datahub.parsing import (
    DEFAULT_LINEAGE_TOOL_COUNT,
    DEFAULT_LIST_COUNT,
    DEFAULT_QUERY_COUNT,
    DEFAULT_SCHEMA_FIELD_COUNT,
    _clamp_count,
    compact_glossary_list_result,
)


@tool
def datahub_graphql_query(
    query: str,
    variables: str = "",
) -> dict[str, Any]:
    """Run a read-only DataHub GraphQL query (escape hatch for custom lookups).

    Prefer the typed ``datahub_list_*`` / ``datahub_get_*`` tools for common catalog browsing.
    Mutations and subscriptions are rejected.
    """
    return execute_graphql(query, variables or None)


@tool
def datahub_get_dataset_queries(
    urn: str,
    column: str = "",
    source: str = "",
    start: int = 0,
    count: int = DEFAULT_QUERY_COUNT,
) -> dict[str, Any]:
    """Fetch real SQL queries associated with a dataset or column.

    Use after choosing a candidate table to learn JOIN / filter / aggregation patterns.
    ``source`` may be MANUAL, SYSTEM, or empty for both. Optional ``column`` scopes to a field.
    """
    return get_dataset_queries(
        urn,
        column=column or None,
        source=source or None,
        start=start,
        count=count,
    )


@tool
def datahub_get_lineage(
    urn: str,
    direction: str = "UPSTREAM",
    max_hops: int = 1,
    column: str = "",
    query: str = "*",
    start: int = 0,
    count: int = DEFAULT_LINEAGE_TOOL_COUNT,
) -> dict[str, Any]:
    """Retrieve upstream or downstream lineage with hop control (1–3; 3 ≈ unlimited).

    Optional ``column`` enables column-level lineage. Use ``query`` to search within
    lineage neighbors (same keyword style as DataHub search).
    """
    return get_lineage(
        urn,
        direction=direction,
        max_hops=max_hops,
        column=column or None,
        query=query,
        start=start,
        count=count,
    )


@tool
def datahub_get_lineage_paths_between(
    source_urn: str,
    target_urn: str,
    source_column: str = "",
    target_column: str = "",
    direction: str = "",
) -> dict[str, Any]:
    """Return exact lineage path(s) between two datasets or columns.

    Omit ``direction`` to try downstream then upstream. When ``source_column`` is set,
    ``target_column`` is required.
    """
    return get_lineage_paths_between(
        source_urn,
        target_urn,
        source_column=source_column or None,
        target_column=target_column or None,
        direction=direction or None,
    )


@tool
def datahub_list_schema_fields(
    urn: str,
    keywords: str = "",
    start: int = 0,
    count: int = DEFAULT_SCHEMA_FIELD_COUNT,
) -> dict[str, Any]:
    """List dataset schema fields with optional keyword filter and pagination.

    ``keywords`` is a comma-separated list (OR match on fieldPath / description / label).
    Prefer this over full dataset hydration when schemas are large.
    """
    keyword_list = [part.strip() for part in (keywords or "").split(",") if part.strip()]
    return list_schema_fields(
        urn,
        keywords=keyword_list or None,
        start=start,
        count=count,
    )


@tool
def datahub_list_datasets(
    query: str = "*",
    start: int = 0,
    count: int = DEFAULT_LIST_COUNT,
) -> dict[str, Any]:
    """List DataHub datasets matching ``query`` with rich metadata and lineage.

    Each entity includes platform, properties, owners, tags, glossary terms,
    domain, schema fields, and 1-hop upstream/downstream lineage.
    """
    return list_entities("DATASET", query=query, start=start, count=count)


@tool
def datahub_list_data_jobs(
    query: str = "*",
    start: int = 0,
    count: int = DEFAULT_LIST_COUNT,
) -> dict[str, Any]:
    """List DataHub data jobs (pipeline tasks) with parent flow and lineage.

    Each entity includes job properties, parent data flow, owners/tags/terms,
    and 1-hop upstream/downstream lineage (consumed/produced datasets, jobs).
    """
    return list_entities("DATA_JOB", query=query, start=start, count=count)


@tool
def datahub_list_data_flows(
    query: str = "*",
    start: int = 0,
    count: int = DEFAULT_LIST_COUNT,
) -> dict[str, Any]:
    """List DataHub data flows (pipelines/DAGs) with child jobs and lineage.

    Each entity includes orchestrator/flowId/cluster, properties, ownership,
    tags/terms, child jobs (IsPartOf), and 1-hop lineage.
    """
    return list_entities("DATA_FLOW", query=query, start=start, count=count)


@tool
def datahub_list_glossary_terms(
    query: str = "*",
    start: int = 0,
    count: int = 5,
) -> dict[str, Any]:
    """List DataHub glossary terms with compact definition fields for agents.

    Returns name, description/calculation text, key custom properties (aggregation,
    source table), parent node names, and TermedWith dataset URNs. Full GraphQL
    hydration is omitted so results stay small enough to answer without offload loops.
    Prefer a small ``count`` (default 5).
    """
    raw = list_entities("GLOSSARY_TERM", query=query, start=start, count=count)
    return compact_glossary_list_result(raw, max_entities=min(_clamp_count(count), 5))


@tool
def datahub_list_charts(
    query: str = "*",
    start: int = 0,
    count: int = DEFAULT_LIST_COUNT,
) -> dict[str, Any]:
    """List DataHub charts with properties, ownership, tags/terms, and lineage."""
    return list_entities("CHART", query=query, start=start, count=count)


@tool
def datahub_list_dashboards(
    query: str = "*",
    start: int = 0,
    count: int = DEFAULT_LIST_COUNT,
) -> dict[str, Any]:
    """List DataHub dashboards with properties, ownership, tags/terms, and lineage."""
    return list_entities("DASHBOARD", query=query, start=start, count=count)


@tool
def datahub_list_tags(
    query: str = "*",
    start: int = 0,
    count: int = DEFAULT_LIST_COUNT,
) -> dict[str, Any]:
    """List DataHub tags with name, description, and ownership."""
    return list_entities("TAG", query=query, start=start, count=count)


@tool
def datahub_list_people(
    query: str = "*",
    start: int = 0,
    count: int = DEFAULT_LIST_COUNT,
) -> dict[str, Any]:
    """List DataHub people (corp users) with profile fields (email, title, etc.)."""
    return list_entities("CORP_USER", query=query, start=start, count=count)


@tool
def datahub_list_groups(
    query: str = "*",
    start: int = 0,
    count: int = DEFAULT_LIST_COUNT,
) -> dict[str, Any]:
    """List DataHub groups with description and member relationships."""
    return list_entities("CORP_GROUP", query=query, start=start, count=count)


TOOLS = [
    datahub_list_datasets,
    datahub_list_data_jobs,
    datahub_list_data_flows,
    datahub_list_glossary_terms,
    datahub_list_charts,
    datahub_list_dashboards,
    datahub_list_tags,
    datahub_list_people,
    datahub_list_groups,
    datahub_get_dataset_queries,
    datahub_get_lineage,
    datahub_get_lineage_paths_between,
    datahub_list_schema_fields,
    datahub_graphql_query,
]

for _datahub_tool in TOOLS:
    register_tool(_datahub_tool)

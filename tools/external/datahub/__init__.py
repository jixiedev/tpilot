"""DataHub GraphQL tools (DataHub 1.2.x compatible, read-only).

Provides typed list helpers (datasets, jobs, flows, glossary, charts, …)
built on ``searchAcrossEntities`` + ``entities`` hydration, plus focused
helpers for dataset queries, multi-hop lineage, lineage paths, and schema
field listing, and a raw ``datahub_graphql_query`` escape hatch.

Layout:

- :mod:`.client` — HTTP transport, auth, read-only guard, ``DataHubGraphQLError``
- :mod:`.queries` — GraphQL documents and entity hydration fragments
- :mod:`.parsing` — limits, input normalization, response compaction
- :mod:`.operations` — read operations built on ``execute_graphql``
- :mod:`.tools` — LangChain ``@tool`` wrappers; importing this package registers them

To stub GraphQL calls in tests, patch ``tools.external.datahub.operations.execute_graphql``
(operations look the name up in their own module).
"""

from __future__ import annotations

from tools.external.datahub.client import (
    DataHubGraphQLError,
    _assert_query_only,
    _classify_datahub_graphql_error,
    _normalize_variables,
    execute_graphql,
)
from tools.external.datahub.operations import (
    _hydrate_entities,
    _search_across_lineage,
    _search_entity_urns,
    get_dataset_queries,
    get_lineage,
    get_lineage_paths_between,
    list_entities,
    list_schema_fields,
)
from tools.external.datahub.parsing import (
    DEFAULT_LINEAGE_COUNT,
    DEFAULT_LINEAGE_TOOL_COUNT,
    DEFAULT_LIST_COUNT,
    DEFAULT_QUERY_COUNT,
    DEFAULT_RELATIONSHIP_COUNT,
    DEFAULT_SCHEMA_FIELD_COUNT,
    MAX_LINEAGE_TOOL_COUNT,
    MAX_LIST_COUNT,
    MAX_QUERY_SQL_CHARS,
    MAX_SCHEMA_FIELD_COUNT,
    _clamp_count,
    _degree_or_filters,
    _entities_equal_or_filters,
    _maybe_schema_field_urn,
    _normalize_query,
    _require_urn,
    _schema_field_urn,
    _truncate_sql,
    compact_glossary_list_result,
    compact_glossary_term,
)
from tools.external.datahub.tools import (
    TOOLS,
    datahub_get_dataset_queries,
    datahub_get_lineage,
    datahub_get_lineage_paths_between,
    datahub_graphql_query,
    datahub_list_charts,
    datahub_list_dashboards,
    datahub_list_data_flows,
    datahub_list_data_jobs,
    datahub_list_glossary_terms,
    datahub_list_groups,
    datahub_list_people,
    datahub_list_schema_fields,
    datahub_list_tags,
)

__all__ = [
    "DEFAULT_LINEAGE_COUNT",
    "DEFAULT_LINEAGE_TOOL_COUNT",
    "DEFAULT_LIST_COUNT",
    "DEFAULT_QUERY_COUNT",
    "DEFAULT_RELATIONSHIP_COUNT",
    "DEFAULT_SCHEMA_FIELD_COUNT",
    "MAX_LINEAGE_TOOL_COUNT",
    "MAX_LIST_COUNT",
    "MAX_QUERY_SQL_CHARS",
    "MAX_SCHEMA_FIELD_COUNT",
    "TOOLS",
    "DataHubGraphQLError",
    "compact_glossary_list_result",
    "compact_glossary_term",
    "datahub_get_dataset_queries",
    "datahub_get_lineage",
    "datahub_get_lineage_paths_between",
    "datahub_graphql_query",
    "datahub_list_charts",
    "datahub_list_dashboards",
    "datahub_list_data_flows",
    "datahub_list_data_jobs",
    "datahub_list_glossary_terms",
    "datahub_list_groups",
    "datahub_list_people",
    "datahub_list_schema_fields",
    "datahub_list_tags",
    "execute_graphql",
    "get_dataset_queries",
    "get_lineage",
    "get_lineage_paths_between",
    "list_entities",
    "list_schema_fields",
]

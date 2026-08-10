"""DataHub GraphQL tools (DataHub 1.2.x compatible, read-only).

Provides typed list helpers (datasets, jobs, flows, glossary, charts, …)
built on ``searchAcrossEntities`` + ``entities`` hydration, plus a raw
``datahub_graphql_query`` escape hatch.
"""

from __future__ import annotations

import json
import re
import urllib.error
import urllib.request
from typing import Any

from langchain.tools import tool

from config.tool_config import DataHubToolConfig, datahub_token, tool_config

_MUTATION_RE = re.compile(r"\b(mutation|subscription)\b", re.IGNORECASE)

DEFAULT_LIST_COUNT = 10
MAX_LIST_COUNT = 20
DEFAULT_LINEAGE_COUNT = 15
DEFAULT_RELATIONSHIP_COUNT = 20

# Shared GraphQL selection sets -------------------------------------------------

_OWNERSHIP_FIELDS = """
  ownership {
    owners {
      type
      owner {
        ... on CorpUser {
          urn
          username
          properties { displayName email title departmentName }
        }
        ... on CorpGroup {
          urn
          name
          properties { displayName email description }
        }
      }
    }
  }
"""

_TAGS_FIELDS = """
  tags {
    tags {
      tag {
        urn
        properties { name description }
      }
    }
  }
"""

_GLOSSARY_ON_ASSET_FIELDS = """
  glossaryTerms {
    terms {
      term {
        urn
        hierarchicalName
        properties { name description }
      }
    }
  }
"""

_DOMAIN_FIELDS = """
  domain {
    domain {
      urn
      properties { name description }
    }
  }
"""

_DEPRECATION_FIELDS = """
  deprecation { deprecated note actor decommissionTime }
"""

_LINEAGE_FIELDS = f"""
  upstream: lineage(input: {{ direction: UPSTREAM, start: 0, count: {DEFAULT_LINEAGE_COUNT} }}) {{
    total
    relationships {{
      type
      entity {{ urn type }}
    }}
  }}
  downstream: lineage(input: {{ direction: DOWNSTREAM, start: 0, count: {DEFAULT_LINEAGE_COUNT} }}) {{
    total
    relationships {{
      type
      entity {{ urn type }}
    }}
  }}
"""

_DATASET_FRAGMENT = f"""
  ... on Dataset {{
    urn
    type
    name
    lastIngested
    platform {{ urn name }}
    properties {{
      name
      description
      qualifiedName
      origin
      externalUrl
      customProperties {{ key value }}
    }}
    container {{ urn properties {{ name }} }}
    {_OWNERSHIP_FIELDS}
    {_TAGS_FIELDS}
    {_GLOSSARY_ON_ASSET_FIELDS}
    {_DOMAIN_FIELDS}
    {_DEPRECATION_FIELDS}
    schemaMetadata {{
      name
      platformSchema {{
        ... on TableSchema {{ schema }}
        ... on KeyValueSchema {{ keySchema valueSchema }}
      }}
      fields {{
        fieldPath
        nullable
        description
        nativeDataType
      }}
      primaryKeys
    }}
    {_LINEAGE_FIELDS}
  }}
"""

_DATA_JOB_FRAGMENT = f"""
  ... on DataJob {{
    urn
    type
    jobId
    lastIngested
    dataFlow {{
      urn
      flowId
      orchestrator
      cluster
      properties {{ name description }}
    }}
    properties {{
      name
      description
      externalUrl
      customProperties {{ key value }}
    }}
    {_OWNERSHIP_FIELDS}
    {_TAGS_FIELDS}
    {_GLOSSARY_ON_ASSET_FIELDS}
    {_DOMAIN_FIELDS}
    {_DEPRECATION_FIELDS}
    {_LINEAGE_FIELDS}
  }}
"""

_DATA_FLOW_FRAGMENT = f"""
  ... on DataFlow {{
    urn
    type
    orchestrator
    flowId
    cluster
    lastIngested
    properties {{
      name
      description
      project
      externalUrl
      customProperties {{ key value }}
    }}
    {_OWNERSHIP_FIELDS}
    {_TAGS_FIELDS}
    {_GLOSSARY_ON_ASSET_FIELDS}
    {_DOMAIN_FIELDS}
    {_DEPRECATION_FIELDS}
    {_LINEAGE_FIELDS}
    childJobs: relationships(
      input: {{ types: ["IsPartOf"], direction: INCOMING, start: 0, count: {DEFAULT_RELATIONSHIP_COUNT} }}
    ) {{
      total
      relationships {{
        type
        entity {{
          urn
          type
          ... on DataJob {{
            jobId
            properties {{ name description }}
          }}
        }}
      }}
    }}
  }}
"""

_GLOSSARY_TERM_FRAGMENT = f"""
  ... on GlossaryTerm {{
    urn
    type
    hierarchicalName
    properties {{
      name
      description
      termSource
      sourceRef
      sourceUrl
      customProperties {{ key value }}
    }}
    parentNodes {{
      nodes {{
        urn
        ... on GlossaryNode {{
          properties {{ name description }}
        }}
      }}
    }}
    {_OWNERSHIP_FIELDS}
    {_DOMAIN_FIELDS}
    {_DEPRECATION_FIELDS}
    relatedOutgoing: relationships(
      input: {{
        types: ["IsA", "HasA", "RelatedTo", "ReplacedBy", "Values"]
        direction: OUTGOING
        start: 0
        count: {DEFAULT_RELATIONSHIP_COUNT}
      }}
    ) {{
      total
      relationships {{ type entity {{ urn type }} }}
    }}
    relatedIncoming: relationships(
      input: {{
        types: ["TermedWith", "IsA", "HasA", "RelatedTo", "ReplacedBy", "Values"]
        direction: INCOMING
        start: 0
        count: {DEFAULT_RELATIONSHIP_COUNT}
      }}
    ) {{
      total
      relationships {{ type entity {{ urn type }} }}
    }}
  }}
"""

_CHART_FRAGMENT = f"""
  ... on Chart {{
    urn
    type
    tool
    chartId
    lastIngested
    properties {{
      name
      description
      externalUrl
      customProperties {{ key value }}
    }}
    {_OWNERSHIP_FIELDS}
    {_TAGS_FIELDS}
    {_GLOSSARY_ON_ASSET_FIELDS}
    {_DOMAIN_FIELDS}
    {_DEPRECATION_FIELDS}
    {_LINEAGE_FIELDS}
  }}
"""

_DASHBOARD_FRAGMENT = f"""
  ... on Dashboard {{
    urn
    type
    tool
    dashboardId
    lastIngested
    properties {{
      name
      description
      externalUrl
      customProperties {{ key value }}
    }}
    {_OWNERSHIP_FIELDS}
    {_TAGS_FIELDS}
    {_GLOSSARY_ON_ASSET_FIELDS}
    {_DOMAIN_FIELDS}
    {_DEPRECATION_FIELDS}
    {_LINEAGE_FIELDS}
  }}
"""

_TAG_FRAGMENT = """
  ... on Tag {
    urn
    type
    properties { name description }
    ownership {
      owners {
        type
        owner {
          ... on CorpUser { urn username properties { displayName email } }
          ... on CorpGroup { urn name properties { displayName } }
        }
      }
    }
  }
"""

_CORP_USER_FRAGMENT = """
  ... on CorpUser {
    urn
    type
    username
    status
    properties {
      displayName
      email
      title
      departmentName
      firstName
      lastName
      fullName
      active
      manager { urn username properties { displayName email } }
    }
    editableProperties { displayName aboutMe teams title skills }
  }
"""

_CORP_GROUP_FRAGMENT = """
  ... on CorpGroup {
    urn
    type
    name
    properties { displayName email description }
    ownership {
      owners {
        type
        owner {
          ... on CorpUser { urn username properties { displayName email } }
        }
      }
    }
    relationships(
      input: { types: ["IsMemberOfGroup"], direction: INCOMING, start: 0, count: 50 }
    ) {
      total
      relationships {
        type
        entity {
          urn
          type
          ... on CorpUser { username properties { displayName email } }
        }
      }
    }
  }
"""

_HYDRATION_FRAGMENTS: dict[str, str] = {
    "DATASET": _DATASET_FRAGMENT,
    "DATA_JOB": _DATA_JOB_FRAGMENT,
    "DATA_FLOW": _DATA_FLOW_FRAGMENT,
    "GLOSSARY_TERM": _GLOSSARY_TERM_FRAGMENT,
    "CHART": _CHART_FRAGMENT,
    "DASHBOARD": _DASHBOARD_FRAGMENT,
    "TAG": _TAG_FRAGMENT,
    "CORP_USER": _CORP_USER_FRAGMENT,
    "CORP_GROUP": _CORP_GROUP_FRAGMENT,
}


class DataHubGraphQLError(RuntimeError):
    """Raised when a DataHub GraphQL request fails or returns GraphQL errors."""


def _normalize_variables(variables: dict[str, Any] | str | None) -> dict[str, Any]:
    if variables is None or variables == "":
        return {}
    if isinstance(variables, dict):
        return variables
    text = str(variables).strip()
    if not text:
        return {}
    parsed = json.loads(text)
    if not isinstance(parsed, dict):
        raise ValueError("variables must be a JSON object")
    return parsed


def _assert_query_only(query: str) -> None:
    text = (query or "").strip()
    if not text:
        raise ValueError("GraphQL query must be a non-empty string")
    without_block = re.sub(r"/\*.*?\*/", "", text, flags=re.DOTALL)
    without_comments = re.sub(r"#.*?$", "", without_block, flags=re.MULTILINE)
    if _MUTATION_RE.search(without_comments):
        raise ValueError(
            "datahub_graphql_query is read-only; mutation/subscription operations are not allowed"
        )


def execute_graphql(
    query: str,
    variables: dict[str, Any] | str | None = None,
    *,
    cfg: DataHubToolConfig | None = None,
) -> dict[str, Any]:
    """POST a GraphQL query to DataHub ``/api/graphql`` (Bearer auth)."""
    _assert_query_only(query)
    config = cfg or tool_config.datahub
    payload = {
        "query": query.strip(),
        "variables": _normalize_variables(variables),
    }
    body = json.dumps(payload).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": f"Bearer {datahub_token(config)}",
    }
    request = urllib.request.Request(
        config.graphql_url,
        data=body,
        headers=headers,
        method="POST",
    )
    timeout = float(config.timeout_seconds)
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            raw = response.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace") if exc.fp else ""
        message = f"DataHub GraphQL HTTP {exc.code}: {detail or exc.reason}"
        raise DataHubGraphQLError(message) from exc
    except urllib.error.URLError as exc:
        raise DataHubGraphQLError(f"DataHub GraphQL connection failed: {exc.reason}") from exc

    try:
        parsed = json.loads(raw) if raw else {}
    except json.JSONDecodeError as exc:
        raise DataHubGraphQLError(f"DataHub GraphQL returned non-JSON body: {raw[:500]}") from exc

    if not isinstance(parsed, dict):
        raise DataHubGraphQLError(f"unexpected GraphQL response type: {type(parsed)!r}")

    errors = parsed.get("errors")
    if errors:
        raise DataHubGraphQLError(f"DataHub GraphQL errors: {json.dumps(errors, ensure_ascii=False)}")

    return {
        "data": parsed.get("data"),
        "extensions": parsed.get("extensions"),
    }


def _clamp_count(count: int) -> int:
    try:
        value = int(count)
    except (TypeError, ValueError) as exc:
        raise ValueError("count must be an integer") from exc
    if value < 1:
        raise ValueError("count must be >= 1")
    return min(value, MAX_LIST_COUNT)


def _normalize_query(query: str | None) -> str:
    text = (query or "").strip()
    return text or "*"


def _search_entity_urns(
    entity_type: str,
    *,
    query: str,
    start: int,
    count: int,
    cfg: DataHubToolConfig | None = None,
) -> dict[str, Any]:
    gql = """
    query searchEntities($input: SearchAcrossEntitiesInput!) {
      searchAcrossEntities(input: $input) {
        start
        count
        total
        searchResults {
          entity { urn type }
        }
      }
    }
    """
    result = execute_graphql(
        gql,
        {
            "input": {
                "types": [entity_type],
                "query": _normalize_query(query),
                "start": int(start),
                "count": count,
            }
        },
        cfg=cfg,
    )
    payload = (result.get("data") or {}).get("searchAcrossEntities") or {}
    urns: list[str] = []
    for hit in payload.get("searchResults") or []:
        entity = (hit or {}).get("entity") or {}
        urn = entity.get("urn")
        if isinstance(urn, str) and urn.strip():
            urns.append(urn.strip())
    return {
        "start": payload.get("start", start),
        "count": payload.get("count", count),
        "total": payload.get("total", len(urns)),
        "urns": urns,
    }


def _hydrate_entities(
    entity_type: str,
    urns: list[str],
    *,
    cfg: DataHubToolConfig | None = None,
) -> list[dict[str, Any]]:
    if not urns:
        return []
    fragment = _HYDRATION_FRAGMENTS[entity_type]
    gql = f"""
    query hydrateEntities($urns: [String!]!) {{
      entities(urns: $urns) {{
        urn
        type
        {fragment}
      }}
    }}
    """
    result = execute_graphql(gql, {"urns": urns}, cfg=cfg)
    entities = (result.get("data") or {}).get("entities") or []
    return [entity for entity in entities if isinstance(entity, dict) and entity.get("urn")]


def list_entities(
    entity_type: str,
    *,
    query: str = "*",
    start: int = 0,
    count: int = DEFAULT_LIST_COUNT,
    cfg: DataHubToolConfig | None = None,
) -> dict[str, Any]:
    """Search then hydrate entities of one DataHub ``EntityType``."""
    etype = str(entity_type or "").strip().upper()
    if etype not in _HYDRATION_FRAGMENTS:
        raise ValueError(
            f"unsupported entity type {entity_type!r}; "
            f"allowed={sorted(_HYDRATION_FRAGMENTS)}"
        )
    page_size = _clamp_count(count)
    start_idx = max(0, int(start))
    search = _search_entity_urns(
        etype,
        query=query,
        start=start_idx,
        count=page_size,
        cfg=cfg,
    )
    entities = _hydrate_entities(etype, search["urns"], cfg=cfg)
    return {
        "entity_type": etype,
        "query": _normalize_query(query),
        "start": search["start"],
        "count": len(entities),
        "total": search["total"],
        "entities": entities,
    }


@tool
def datahub_graphql_query(
    query: str,
    variables: str = "",
) -> dict[str, Any]:
    """Run a read-only DataHub GraphQL query (escape hatch for custom lookups).

    Prefer the typed ``datahub_list_*`` tools for common catalog browsing.
    Mutations and subscriptions are rejected.
    """
    return execute_graphql(query, variables or None)


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
    count: int = DEFAULT_LIST_COUNT,
) -> dict[str, Any]:
    """List DataHub glossary terms with definition, hierarchy, and related entities.

    Each term includes hierarchical name, description/source, parent glossary
    nodes, ownership/domain, and related incoming/outgoing relationships
    (e.g. TermedWith assets, IsA / HasA / RelatedTo).
    """
    return list_entities("GLOSSARY_TERM", query=query, start=start, count=count)


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
    datahub_graphql_query,
]

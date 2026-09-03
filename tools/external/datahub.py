"""DataHub GraphQL tools (DataHub 1.2.x compatible, read-only).

Provides typed list helpers (datasets, jobs, flows, glossary, charts, …)
built on ``searchAcrossEntities`` + ``entities`` hydration, plus focused
helpers for dataset queries, multi-hop lineage, lineage paths, and schema
field listing, and a raw ``datahub_graphql_query`` escape hatch.
"""

from __future__ import annotations

import json
import re
import urllib.error
import urllib.request
from typing import Any, Literal

from langchain.tools import tool

from config.tool_config import DataHubToolConfig, datahub_graphql_url, datahub_token, tool_config
from tools.common import register_tool_binding
from tools.errors import ToolErrorType, register_exception

_MUTATION_RE = re.compile(r"\b(mutation|subscription)\b", re.IGNORECASE)

DEFAULT_LIST_COUNT = 10
MAX_LIST_COUNT = 20
DEFAULT_LINEAGE_COUNT = 15
DEFAULT_LINEAGE_TOOL_COUNT = 15
MAX_LINEAGE_TOOL_COUNT = 30
DEFAULT_RELATIONSHIP_COUNT = 20
DEFAULT_SCHEMA_FIELD_COUNT = 50
MAX_SCHEMA_FIELD_COUNT = 100
DEFAULT_QUERY_COUNT = 10
MAX_QUERY_SQL_CHARS = 4000

_LINEAGE_NEIGHBOR_GQL = """
query GetEntityLineage($input: SearchAcrossLineageInput!) {
  searchAcrossLineage(input: $input) {
    start
    count
    total
    searchResults {
      degree
      entity {
        urn
        type
        ... on Dataset {
          name
          properties { name qualifiedName }
          platform { name }
        }
        ... on DataJob {
          jobId
          dataFlow { flowId orchestrator }
        }
        ... on DataFlow {
          flowId
          orchestrator
        }
        ... on Chart {
          chartId
          properties { name }
        }
        ... on Dashboard {
          dashboardId
          properties { name }
        }
        ... on SchemaFieldEntity {
          fieldPath
          parent { urn type }
        }
      }
      paths {
        path {
          urn
          type
          ... on SchemaFieldEntity {
            fieldPath
            parent { urn type }
          }
          ... on Dataset {
            name
            properties { name qualifiedName }
          }
          ... on QueryEntity {
            urn
          }
        }
      }
    }
  }
}
"""

_LIST_QUERIES_GQL = """
query listQueries($input: ListQueriesInput!) {
  listQueries(input: $input) {
    start
    total
    count
    queries {
      urn
      properties {
        name
        description
        source
        statement { value language }
      }
      platform { urn name }
      subjects {
        dataset { urn }
        schemaField { urn fieldPath }
      }
    }
  }
}
"""

_SCHEMA_FIELDS_GQL = """
query datasetSchemaFields($urns: [String!]!) {
  entities(urns: $urns) {
    urn
    type
    ... on Dataset {
      schemaMetadata {
        fields {
          fieldPath
          nullable
          description
          nativeDataType
          label
        }
      }
    }
  }
}
"""

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


def _classify_datahub_graphql_error(exc: BaseException) -> tuple[ToolErrorType, bool, str] | None:
    message = str(exc)
    lower = message.lower()
    if any(token in lower for token in ("timeout", "timed out")):
        return ToolErrorType.TIMEOUT, True, message
    if any(
        token in lower
        for token in ("connection", "connect", "refused", "unreachable", "urlerror")
    ):
        return ToolErrorType.CONNECTION, True, message
    return ToolErrorType.UNKNOWN, False, message


register_exception(DataHubGraphQLError, classifier=_classify_datahub_graphql_error)


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
        datahub_graphql_url(config),
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


def _clamp_count(count: int, *, max_count: int = MAX_LIST_COUNT) -> int:
    try:
        value = int(count)
    except (TypeError, ValueError) as exc:
        raise ValueError("count must be an integer") from exc
    if value < 1:
        raise ValueError("count must be >= 1")
    return min(value, max_count)


def _normalize_query(query: str | None) -> str:
    text = (query or "").strip()
    return text or "*"


def _require_urn(urn: str, *, label: str = "urn") -> str:
    text = (urn or "").strip()
    if not text:
        raise ValueError(f"{label} must be a non-empty string")
    return text


def _schema_field_urn(dataset_urn: str, column: str) -> str:
    """Build a DataHub schema-field URN for column-level lookups."""
    base = _require_urn(dataset_urn, label="urn")
    field = (column or "").strip()
    if not field or field.lower() == "null":
        raise ValueError("column must be a non-empty string")
    if not base.startswith("urn:li:dataset:"):
        raise ValueError(f"column requires a dataset URN, got {base!r}")
    return f"urn:li:schemaField:({base},{field})"


def _maybe_schema_field_urn(urn: str, column: str | None) -> str:
    base = _require_urn(urn)
    if column is None:
        return base
    text = str(column).strip()
    if not text or text.lower() == "null":
        return base
    return _schema_field_urn(base, text)


def _entities_equal_or_filters(urn: str) -> list[dict[str, Any]]:
    return [
        {
            "and": [
                {
                    "field": "entities",
                    "condition": "EQUAL",
                    "values": [_require_urn(urn)],
                }
            ]
        }
    ]


def _degree_or_filters(max_hops: int) -> list[dict[str, Any]]:
    try:
        hops = int(max_hops)
    except (TypeError, ValueError) as exc:
        raise ValueError("max_hops must be an integer") from exc
    if hops < 1:
        raise ValueError("max_hops must be >= 1")
    if hops == 1:
        values = ["1"]
    elif hops == 2:
        values = ["1", "2"]
    else:
        values = ["1", "2", "3+"]
    return [
        {
            "and": [
                {
                    "field": "degree",
                    "condition": "EQUAL",
                    "values": values,
                }
            ]
        }
    ]


def _truncate_sql(statement: str, *, limit: int = MAX_QUERY_SQL_CHARS) -> str:
    text = statement or ""
    if len(text) <= limit:
        return text
    return text[: max(0, limit - len("... [truncated]"))] + "... [truncated]"


def _dedupe_query_subject_urns(subjects: list[Any] | None) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for subject in subjects or []:
        if not isinstance(subject, dict):
            continue
        dataset = subject.get("dataset") if isinstance(subject.get("dataset"), dict) else {}
        urn = dataset.get("urn")
        if isinstance(urn, str) and urn.strip() and urn not in seen:
            seen.add(urn)
            out.append(urn.strip())
    return out


def _compact_query_entity(entity: dict[str, Any]) -> dict[str, Any]:
    props = entity.get("properties") if isinstance(entity.get("properties"), dict) else {}
    statement = props.get("statement") if isinstance(props.get("statement"), dict) else {}
    value = statement.get("value")
    compact: dict[str, Any] = {
        "urn": entity.get("urn"),
        "source": props.get("source"),
        "name": props.get("name"),
        "statement": {
            "language": statement.get("language"),
            "value": _truncate_sql(str(value) if value is not None else ""),
        },
    }
    platform = entity.get("platform") if isinstance(entity.get("platform"), dict) else {}
    if platform.get("name") or platform.get("urn"):
        compact["platform"] = {
            k: platform[k] for k in ("urn", "name") if platform.get(k) is not None
        }
    subjects = _dedupe_query_subject_urns(
        entity.get("subjects") if isinstance(entity.get("subjects"), list) else None
    )
    if subjects:
        compact["subjects"] = subjects
    return compact


def _compact_lineage_entity(entity: dict[str, Any] | None) -> dict[str, Any]:
    if not isinstance(entity, dict):
        return {}
    compact: dict[str, Any] = {
        "urn": entity.get("urn"),
        "type": entity.get("type"),
    }
    props = entity.get("properties") if isinstance(entity.get("properties"), dict) else {}
    name = props.get("name") or entity.get("name") or entity.get("jobId") or entity.get("flowId")
    if isinstance(name, str) and name.strip():
        compact["name"] = name.strip()
    qualified = props.get("qualifiedName")
    if isinstance(qualified, str) and qualified.strip():
        compact["qualifiedName"] = qualified.strip()
    platform = entity.get("platform") if isinstance(entity.get("platform"), dict) else {}
    platform_name = platform.get("name")
    if isinstance(platform_name, str) and platform_name.strip():
        compact["platform"] = platform_name.strip()
    field_path = entity.get("fieldPath")
    if isinstance(field_path, str) and field_path.strip():
        compact["fieldPath"] = field_path.strip()
    parent = entity.get("parent") if isinstance(entity.get("parent"), dict) else {}
    if parent.get("urn"):
        compact["parentUrn"] = parent.get("urn")
    return {k: v for k, v in compact.items() if v is not None}


def _compact_path_node(node: dict[str, Any] | None) -> dict[str, Any]:
    if not isinstance(node, dict):
        return {}
    compact: dict[str, Any] = {
        "urn": node.get("urn"),
        "type": node.get("type"),
    }
    field_path = node.get("fieldPath")
    if isinstance(field_path, str) and field_path.strip():
        compact["fieldPath"] = field_path.strip()
    props = node.get("properties") if isinstance(node.get("properties"), dict) else {}
    name = props.get("name") or node.get("name")
    if isinstance(name, str) and name.strip():
        compact["name"] = name.strip()
    parent = node.get("parent") if isinstance(node.get("parent"), dict) else {}
    if parent.get("urn"):
        compact["parentUrn"] = parent.get("urn")
    return {k: v for k, v in compact.items() if v is not None}


def _search_across_lineage(
    urn: str,
    *,
    direction: Literal["UPSTREAM", "DOWNSTREAM"],
    max_hops: int = 1,
    query: str = "*",
    start: int = 0,
    count: int = DEFAULT_LINEAGE_TOOL_COUNT,
    include_paths: bool = False,
    cfg: DataHubToolConfig | None = None,
) -> dict[str, Any]:
    page_size = _clamp_count(count, max_count=MAX_LINEAGE_TOOL_COUNT)
    start_idx = max(0, int(start))
    variables = {
        "input": {
            "urn": _require_urn(urn),
            "direction": direction,
            "query": _normalize_query(query),
            "start": start_idx,
            "count": page_size,
            "orFilters": _degree_or_filters(max_hops),
            "searchFlags": {"skipHighlighting": True, "maxAggValues": 3},
        }
    }
    result = execute_graphql(_LINEAGE_NEIGHBOR_GQL, variables, cfg=cfg)
    payload = (result.get("data") or {}).get("searchAcrossLineage") or {}
    neighbors: list[dict[str, Any]] = []
    for hit in payload.get("searchResults") or []:
        if not isinstance(hit, dict):
            continue
        item: dict[str, Any] = {
            "degree": hit.get("degree"),
            "entity": _compact_lineage_entity(
                hit.get("entity") if isinstance(hit.get("entity"), dict) else None
            ),
        }
        if include_paths:
            paths_out: list[dict[str, Any]] = []
            for path_obj in hit.get("paths") or []:
                if not isinstance(path_obj, dict):
                    continue
                nodes = [
                    _compact_path_node(node)
                    for node in (path_obj.get("path") or [])
                    if isinstance(node, dict)
                ]
                paths_out.append({"path": [n for n in nodes if n.get("urn")]})
            item["paths"] = paths_out
        neighbors.append(item)
    return {
        "start": payload.get("start", start_idx),
        "count": payload.get("count", len(neighbors)),
        "total": payload.get("total", len(neighbors)),
        "searchResults": neighbors,
    }


def get_dataset_queries(
    urn: str,
    *,
    column: str | None = None,
    source: str | None = None,
    start: int = 0,
    count: int = DEFAULT_QUERY_COUNT,
    cfg: DataHubToolConfig | None = None,
) -> dict[str, Any]:
    subject_urn = _maybe_schema_field_urn(urn, column)
    page_size = _clamp_count(count)
    start_idx = max(0, int(start))
    input_payload: dict[str, Any] = {
        "start": start_idx,
        "count": page_size,
        "orFilters": _entities_equal_or_filters(subject_urn),
    }
    if source is not None:
        src = str(source).strip().upper()
        if src not in {"MANUAL", "SYSTEM"}:
            raise ValueError("source must be MANUAL, SYSTEM, or omitted")
        input_payload["source"] = src
    result = execute_graphql(_LIST_QUERIES_GQL, {"input": input_payload}, cfg=cfg)
    payload = (result.get("data") or {}).get("listQueries") or {}
    queries = [
        _compact_query_entity(item)
        for item in (payload.get("queries") or [])
        if isinstance(item, dict)
    ]
    col = None
    if isinstance(column, str) and column.strip() and column.strip().lower() != "null":
        col = column.strip()
    return {
        "urn": _require_urn(urn),
        "column": col,
        "source": input_payload.get("source"),
        "start": payload.get("start", start_idx),
        "count": len(queries),
        "total": payload.get("total", len(queries)),
        "queries": queries,
    }


def get_lineage(
    urn: str,
    *,
    direction: str = "UPSTREAM",
    max_hops: int = 1,
    column: str | None = None,
    query: str = "*",
    start: int = 0,
    count: int = DEFAULT_LINEAGE_TOOL_COUNT,
    cfg: DataHubToolConfig | None = None,
) -> dict[str, Any]:
    direction_key = str(direction or "").strip().upper()
    if direction_key not in {"UPSTREAM", "DOWNSTREAM"}:
        raise ValueError("direction must be UPSTREAM or DOWNSTREAM")
    subject_urn = _maybe_schema_field_urn(urn, column)
    payload = _search_across_lineage(
        subject_urn,
        direction=direction_key,  # type: ignore[arg-type]
        max_hops=max_hops,
        query=query,
        start=start,
        count=count,
        include_paths=False,
        cfg=cfg,
    )
    col = None
    if isinstance(column, str) and column.strip() and column.strip().lower() != "null":
        col = column.strip()
    return {
        "urn": _require_urn(urn),
        "column": col,
        "direction": direction_key,
        "max_hops": max(1, int(max_hops)),
        "query": _normalize_query(query),
        "start": payload["start"],
        "count": len(payload["searchResults"]),
        "total": payload["total"],
        "entities": [
            {
                "degree": hit.get("degree"),
                **(hit.get("entity") or {}),
            }
            for hit in payload["searchResults"]
        ],
    }


def _entity_matches_target(hit: dict[str, Any], target_urn: str, *, column_level: bool) -> bool:
    if column_level:
        for path_obj in hit.get("paths") or []:
            if not isinstance(path_obj, dict):
                continue
            path = path_obj.get("path") or []
            if not path:
                continue
            last = path[-1] if isinstance(path[-1], dict) else {}
            if last.get("urn") == target_urn:
                return True
        return False
    entity = hit.get("entity") if isinstance(hit.get("entity"), dict) else {}
    return entity.get("urn") == target_urn


def get_lineage_paths_between(
    source_urn: str,
    target_urn: str,
    *,
    source_column: str | None = None,
    target_column: str | None = None,
    direction: str | None = None,
    max_hops: int = 3,
    count: int = MAX_LINEAGE_TOOL_COUNT,
    cfg: DataHubToolConfig | None = None,
) -> dict[str, Any]:
    src = _require_urn(source_urn, label="source_urn")
    tgt = _require_urn(target_urn, label="target_urn")
    if source_column and not target_column:
        raise ValueError("target_column is required when source_column is provided")
    src_full = _maybe_schema_field_urn(src, source_column)
    tgt_full = _maybe_schema_field_urn(tgt, target_column)
    column_level = bool(source_column and target_column)

    if direction is None or not str(direction).strip():
        directions = ["DOWNSTREAM", "UPSTREAM"]
    else:
        key = str(direction).strip().lower()
        if key not in {"upstream", "downstream"}:
            raise ValueError("direction must be upstream, downstream, or omitted")
        directions = [key.upper()]

    tried: list[str] = []
    for direction_key in directions:
        tried.append(direction_key)
        payload = _search_across_lineage(
            src_full,
            direction=direction_key,  # type: ignore[arg-type]
            max_hops=max_hops,
            query="*",
            start=0,
            count=count,
            include_paths=True,
            cfg=cfg,
        )
        match = next(
            (
                hit
                for hit in payload["searchResults"]
                if _entity_matches_target(hit, tgt_full, column_level=column_level)
            ),
            None,
        )
        if match is None and not column_level:
            match = next(
                (
                    hit
                    for hit in payload["searchResults"]
                    if (hit.get("entity") or {}).get("urn") == tgt
                ),
                None,
            )
        if match is None:
            continue
        paths = match.get("paths") or []
        source_info: dict[str, Any] = {"urn": src}
        target_info: dict[str, Any] = {"urn": tgt}
        if source_column:
            source_info["column"] = str(source_column).strip()
        if target_column:
            target_info["column"] = str(target_column).strip()
        return {
            "source": source_info,
            "target": target_info,
            "direction": direction_key.lower(),
            "pathCount": len(paths),
            "paths": paths,
        }

    source_info = {"urn": src}
    target_info = {"urn": tgt}
    if source_column:
        source_info["column"] = str(source_column).strip()
    if target_column:
        target_info["column"] = str(target_column).strip()
    return {
        "source": source_info,
        "target": target_info,
        "direction": None,
        "pathCount": 0,
        "paths": [],
        "tried_directions": [d.lower() for d in tried],
        "note": "No lineage path found between the given entities.",
    }


def list_schema_fields(
    urn: str,
    *,
    keywords: list[str] | None = None,
    start: int = 0,
    count: int = DEFAULT_SCHEMA_FIELD_COUNT,
    cfg: DataHubToolConfig | None = None,
) -> dict[str, Any]:
    dataset_urn = _require_urn(urn)
    page_size = _clamp_count(count, max_count=MAX_SCHEMA_FIELD_COUNT)
    start_idx = max(0, int(start))
    result = execute_graphql(_SCHEMA_FIELDS_GQL, {"urns": [dataset_urn]}, cfg=cfg)
    entities = (result.get("data") or {}).get("entities") or []
    entity = next(
        (e for e in entities if isinstance(e, dict) and e.get("urn") == dataset_urn),
        None,
    )
    if entity is None and entities and isinstance(entities[0], dict):
        entity = entities[0]
    schema = (entity or {}).get("schemaMetadata") if isinstance(entity, dict) else None
    fields_raw = schema.get("fields") if isinstance(schema, dict) else None
    fields: list[dict[str, Any]] = [
        {
            "fieldPath": f.get("fieldPath"),
            "nullable": f.get("nullable"),
            "description": f.get("description"),
            "nativeDataType": f.get("nativeDataType"),
            "label": f.get("label"),
        }
        for f in (fields_raw or [])
        if isinstance(f, dict)
    ]
    keyword_list = [
        k.strip().lower()
        for k in (keywords or [])
        if isinstance(k, str) and k.strip()
    ]

    def _match_count(field: dict[str, Any]) -> int:
        if not keyword_list:
            return 0
        haystacks = [
            str(field.get("fieldPath") or "").lower(),
            str(field.get("description") or "").lower(),
            str(field.get("label") or "").lower(),
            str(field.get("nativeDataType") or "").lower(),
        ]
        return sum(1 for kw in keyword_list if any(kw in h for h in haystacks))

    if keyword_list:
        scored = [(_match_count(f), f) for f in fields]
        matched = [(score, f) for score, f in scored if score > 0]
        matched.sort(key=lambda item: (-item[0], str(item[1].get("fieldPath") or "")))
        ordered = [f for _, f in matched]
        matching_count: int | None = len(ordered)
    else:
        ordered = fields
        matching_count = None

    page = ordered[start_idx : start_idx + page_size]
    return {
        "urn": dataset_urn,
        "keywords": keyword_list or None,
        "start": start_idx,
        "count": len(page),
        "totalFields": len(fields),
        "matchingCount": matching_count,
        "returned": len(page),
        "remainingCount": max(0, len(ordered) - start_idx - len(page)),
        "fields": page,
    }


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


def _custom_properties_map(properties: dict[str, Any] | None) -> dict[str, str]:
    out: dict[str, str] = {}
    if not isinstance(properties, dict):
        return out
    for item in properties.get("customProperties") or []:
        if not isinstance(item, dict):
            continue
        key = item.get("key")
        value = item.get("value")
        if isinstance(key, str) and key.strip() and value is not None:
            out[key.strip()] = str(value)
    return out


def compact_glossary_term(entity: dict[str, Any]) -> dict[str, Any]:
    """Keep definition-critical fields so agent tool results stay under offload size."""
    props = entity.get("properties") if isinstance(entity.get("properties"), dict) else {}
    custom = _custom_properties_map(props)
    parents: list[str] = []
    parent_nodes = entity.get("parentNodes") if isinstance(entity.get("parentNodes"), dict) else {}
    for node in parent_nodes.get("nodes") or []:
        if not isinstance(node, dict):
            continue
        node_props = node.get("properties") if isinstance(node.get("properties"), dict) else {}
        name = node_props.get("name") or node.get("urn")
        if isinstance(name, str) and name.strip():
            parents.append(name.strip())
    related_datasets: list[str] = []
    incoming = entity.get("relatedIncoming") if isinstance(entity.get("relatedIncoming"), dict) else {}
    for rel in incoming.get("relationships") or []:
        if not isinstance(rel, dict) or rel.get("type") != "TermedWith":
            continue
        related = rel.get("entity") if isinstance(rel.get("entity"), dict) else {}
        urn = related.get("urn")
        if isinstance(urn, str) and urn.strip():
            related_datasets.append(urn.strip())
    compact: dict[str, Any] = {
        "urn": entity.get("urn"),
        "hierarchicalName": entity.get("hierarchicalName"),
        "name": props.get("name"),
        "description": props.get("description"),
    }
    for key in ("aggregation", "db_name", "table_name", "metric_source", "time_granularity"):
        if key in custom:
            compact[key] = custom[key]
    if parents:
        compact["parent_nodes"] = parents
    if related_datasets:
        compact["related_dataset_urns"] = related_datasets[:5]
    return compact


def compact_glossary_list_result(
    raw: dict[str, Any],
    *,
    max_entities: int = 5,
) -> dict[str, Any]:
    entities = raw.get("entities") if isinstance(raw.get("entities"), list) else []
    compact_entities = [
        compact_glossary_term(entity)
        for entity in entities
        if isinstance(entity, dict)
    ]
    limited = compact_entities[: max(1, int(max_entities))]
    return {
        "entity_type": raw.get("entity_type", "GLOSSARY_TERM"),
        "query": raw.get("query"),
        "start": raw.get("start", 0),
        "count": len(limited),
        "total": raw.get("total", len(compact_entities)),
        "entities": limited,
        "note": (
            "Compact glossary view for agents (definition fields only; "
            f"showing up to {max_entities} terms). "
            "If the needed term is missing, retry with a tighter query; "
            "use datahub_graphql_query only when full hydration is required."
        ),
    }


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

_FETCH_DATAHUB_NATIVE_NAMES = frozenset(
    {"datahub_list_glossary_terms", "datahub_graphql_query"}
)

for _datahub_tool in TOOLS:
    register_tool_binding("databot,default", _datahub_tool)
    register_tool_binding("knowledge,catalog", _datahub_tool)
    if getattr(_datahub_tool, "name", "") in _FETCH_DATAHUB_NATIVE_NAMES:
        register_tool_binding("databot,fetch", _datahub_tool)

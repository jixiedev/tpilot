"""DataHub read operations: lineage, dataset queries, schema fields, and entity listing.

Each operation builds GraphQL variables, calls :func:`execute_graphql`, and
normalizes the response via helpers in :mod:`.parsing`.
"""

from __future__ import annotations

from typing import Any, Literal

from config.tool_config import DataHubToolConfig
from tools.external.datahub.client import execute_graphql
from tools.external.datahub.parsing import (
    DEFAULT_LINEAGE_TOOL_COUNT,
    DEFAULT_LIST_COUNT,
    DEFAULT_QUERY_COUNT,
    DEFAULT_SCHEMA_FIELD_COUNT,
    MAX_LINEAGE_TOOL_COUNT,
    MAX_SCHEMA_FIELD_COUNT,
    _clamp_count,
    _compact_lineage_entity,
    _compact_path_node,
    _compact_query_entity,
    _compact_schema_field,
    _degree_or_filters,
    _entities_equal_or_filters,
    _entity_matches_target,
    _maybe_schema_field_urn,
    _normalize_query,
    _require_urn,
)
from tools.external.datahub.queries import (
    _HYDRATION_FRAGMENTS,
    _LINEAGE_NEIGHBOR_GQL,
    _LIST_QUERIES_GQL,
    _SCHEMA_FIELDS_GQL,
    _SEARCH_ENTITIES_GQL,
    hydrate_entities_gql,
)


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


def _parse_path_directions(direction: str | None) -> list[str]:
    """Directions to try: both (downstream first) when omitted, else the one given."""
    if direction is None or not str(direction).strip():
        return ["DOWNSTREAM", "UPSTREAM"]
    key = str(direction).strip().lower()
    if key not in {"upstream", "downstream"}:
        raise ValueError("direction must be upstream, downstream, or omitted")
    return [key.upper()]


def _find_target_hit(
    hits: list[dict[str, Any]],
    *,
    target_full_urn: str,
    target_urn: str,
    column_level: bool,
) -> dict[str, Any] | None:
    """First lineage hit reaching the target (falls back to a bare-URN match at entity level)."""
    match = next(
        (
            hit
            for hit in hits
            if _entity_matches_target(hit, target_full_urn, column_level=column_level)
        ),
        None,
    )
    if match is None and not column_level:
        match = next(
            (hit for hit in hits if (hit.get("entity") or {}).get("urn") == target_urn),
            None,
        )
    return match


def _lineage_endpoint(urn: str, column: str | None) -> dict[str, Any]:
    info: dict[str, Any] = {"urn": urn}
    if column:
        info["column"] = str(column).strip()
    return info


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
    directions = _parse_path_directions(direction)

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
        match = _find_target_hit(
            payload["searchResults"],
            target_full_urn=tgt_full,
            target_urn=tgt,
            column_level=column_level,
        )
        if match is None:
            continue
        paths = match.get("paths") or []
        return {
            "source": _lineage_endpoint(src, source_column),
            "target": _lineage_endpoint(tgt, target_column),
            "direction": direction_key.lower(),
            "pathCount": len(paths),
            "paths": paths,
        }

    return {
        "source": _lineage_endpoint(src, source_column),
        "target": _lineage_endpoint(tgt, target_column),
        "direction": None,
        "pathCount": 0,
        "paths": [],
        "tried_directions": [d.lower() for d in tried],
        "note": "No lineage path found between the given entities.",
    }


def _fetch_schema_fields(dataset_urn: str, *, cfg: DataHubToolConfig | None) -> list[dict[str, Any]]:
    """Fetch and compact the schema fields of one dataset (empty if none)."""
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
    return [_compact_schema_field(f) for f in (fields_raw or []) if isinstance(f, dict)]


def _normalize_keywords(keywords: list[str] | None) -> list[str]:
    return [k.strip().lower() for k in (keywords or []) if isinstance(k, str) and k.strip()]


def _keyword_match_count(field: dict[str, Any], keyword_list: list[str]) -> int:
    """Number of keywords found in any of the field's searchable text attributes."""
    if not keyword_list:
        return 0
    haystacks = [
        str(field.get("fieldPath") or "").lower(),
        str(field.get("description") or "").lower(),
        str(field.get("label") or "").lower(),
        str(field.get("nativeDataType") or "").lower(),
    ]
    return sum(1 for kw in keyword_list if any(kw in h for h in haystacks))


def _rank_fields_by_keywords(
    fields: list[dict[str, Any]], keyword_list: list[str]
) -> list[dict[str, Any]]:
    """Fields matching at least one keyword, best match first, then by fieldPath."""
    scored = [(_keyword_match_count(f, keyword_list), f) for f in fields]
    matched = [(score, f) for score, f in scored if score > 0]
    matched.sort(key=lambda item: (-item[0], str(item[1].get("fieldPath") or "")))
    return [f for _, f in matched]


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
    fields = _fetch_schema_fields(dataset_urn, cfg=cfg)
    keyword_list = _normalize_keywords(keywords)

    if keyword_list:
        ordered = _rank_fields_by_keywords(fields, keyword_list)
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
    result = execute_graphql(
        _SEARCH_ENTITIES_GQL,
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
    gql = hydrate_entities_gql(_HYDRATION_FRAGMENTS[entity_type])
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


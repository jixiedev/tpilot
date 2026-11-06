"""Pagination limits, input normalization, and response compaction for DataHub results."""

from __future__ import annotations

from typing import Any

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


def _compact_schema_field(field: dict[str, Any]) -> dict[str, Any]:
    return {
        "fieldPath": field.get("fieldPath"),
        "nullable": field.get("nullable"),
        "description": field.get("description"),
        "nativeDataType": field.get("nativeDataType"),
        "label": field.get("label"),
    }


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

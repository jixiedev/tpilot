"""Ingest dbt semantic model definitions (schema yml + sql) into Qdrant.

Each dbt model is split into **two Qdrant points** to balance retrieval
diversity against description fidelity:

- ``model+columns`` — model header (name, description, owner, hive_table,
  usage, agg time dimension) + every column's name and full description
- ``model+metrics`` — same model header + every MetricFlow metric's name
  and full description

The dense vector carries the full description text (only truncated by the
embedding caller's ``max_chars`` cap, not by us). The point payload keeps
the entire structured model — columns, metrics, SQL, owner, usage — so a
retrieved point is enough for the calling agent to render a ``TableCard``
without a second hop.

Why two chunks (not one, not 26+):
- One chunk per model would force us to truncate long descriptions to fit
  the local BGE encoder's 512-token cap, losing semantic signal.
- One chunk per column / metric reintroduces the popularity-bias problem
  (``fetch_related_models`` returns model-level ``TableCard`` instances;
  column-heavy models would crowd out other relevant models in top-K).
- Two chunks give ~equal representation per model, keep each chunk's
  embed text focused (columns *or* metrics, not both), and stay small
  enough that the full descriptions usually fit the local encoder.

Re-ingest on a collection that still has the previous single-chunk
``::model`` points will leave them stale; recreate the collection to
clean up.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Iterable

import yaml

from rag.nrag.data import Chunk, Document, Paragraph, TextParagraph
from rag.nrag.ids import stable_point_id
from rag.nrag.pipeline import upsert_documents
from rag.nrag.split import IdentitySplitStrategy

# Safety cap on description / usage / SQL fields stored in payloads. With
# the 2-chunk split each chunk's embed_text is focused (columns *or*
# metrics, not both), so this can stay conservative without losing
# semantic signal. Qdrant's per-point payload limit is 40 MiB; this is
# only a guardrail against pathological inputs.
_MAX_PAYLOAD_TEXT_CHARS = 4000

# Chunk-type tags used in the payload and point_key.
_CHUNK_COLUMNS = "model+columns"
_CHUNK_METRICS = "model+metrics"


def _is_empty(value: Any) -> bool:
    if value is None:
        return True
    if isinstance(value, float) and math.isnan(value):
        return True
    if isinstance(value, str):
        return not value.strip()
    if isinstance(value, (list, tuple, dict, set)):
        return not value
    return False


def _as_str(value: Any) -> str:
    if _is_empty(value):
        return ""
    if isinstance(value, str):
        return value.strip()
    return str(value).strip()


def _meta(meta: Any) -> dict[str, Any]:
    if not isinstance(meta, dict):
        return {}
    return {str(k): v for k, v in meta.items()}


def _truncate(text: str, max_chars: int) -> str:
    cleaned = (text or "").strip()
    if len(cleaned) <= max_chars:
        return cleaned
    return cleaned[:max_chars]


@dataclass(kw_only=True)
class ModelDocument(Document):
    """One dbt model; paragraphs are the columns chunk and/or the metrics chunk."""

    model_name: str
    yml_path_str: str
    base_payload: dict[str, Any] = field(default_factory=dict)
    columns_embed: str = ""
    metrics_embed: str = ""

    def split_paragraphs(self) -> list[Paragraph]:
        if self.paragraphs:
            return self.paragraphs
        paras: list[Paragraph] = []
        seq = 0
        if self.columns_embed.strip():
            paras.append(
                TextParagraph(
                    ref_doc=self,
                    para_seq=seq,
                    para_title="columns",
                    content=self.columns_embed,
                )
            )
            seq += 1
        if self.metrics_embed.strip():
            paras.append(
                TextParagraph(
                    ref_doc=self,
                    para_seq=seq,
                    para_title="metrics",
                    content=self.metrics_embed,
                )
            )
        self.paragraphs = paras
        return self.paragraphs

    def chunk_payload(self, chunk: Chunk) -> dict[str, Any]:
        payload = dict(self.base_payload)
        title = chunk.ref_para.para_title
        payload["chunk_type"] = (
            _CHUNK_COLUMNS if title == "columns" else _CHUNK_METRICS
        )
        return payload

    def chunk_embed_text(self, chunk: Chunk) -> str:
        return chunk.content

    def chunk_point_id(self, chunk: Chunk) -> int | str:
        suffix = "columns" if chunk.ref_para.para_title == "columns" else "metrics"
        return stable_point_id(f"{self.yml_path_str}::{self.model_name}::{suffix}")


def _as_dict(value: Any) -> dict[str, Any]:
    return value if isinstance(value, dict) else {}


def _format_data_tests(tests: Any) -> str:
    if not isinstance(tests, list):
        return ""
    rendered: list[str] = []
    for item in tests:
        if isinstance(item, str):
            rendered.append(item)
            continue
        if isinstance(item, dict):
            for test_name, params in item.items():
                if _is_empty(params):
                    rendered.append(str(test_name))
                elif isinstance(params, str):
                    rendered.append(f"{test_name}('{params}')")
                else:
                    rendered.append(f"{test_name}({params})")
    return ", ".join(rendered)


def _find_model_sql(yml_path: Path, model_name: str) -> Path | None:
    sibling = yml_path.with_name(f"{model_name}.sql")
    return sibling if sibling.is_file() else None


def _read_sql(sql_path: Path | None) -> str:
    if sql_path is None or not sql_path.is_file():
        return ""
    try:
        return sql_path.read_text(encoding="utf-8").strip()
    except OSError:
        return ""


def _column_to_record(column: dict[str, Any]) -> dict[str, Any] | None:
    name = _as_str(column.get("name"))
    if not name:
        return None
    description = _as_str(column.get("description"))
    entity = _as_dict(column.get("entity"))
    dimension = _as_dict(column.get("dimension"))
    granularity = _as_str(column.get("granularity"))
    data_tests = _format_data_tests(column.get("data_tests"))

    record: dict[str, Any] = {
        "name": name,
        "description": _truncate(description, _MAX_PAYLOAD_TEXT_CHARS),
    }
    if data_tests:
        record["data_tests"] = data_tests
    if entity:
        entity_record: dict[str, Any] = {}
        etype = _as_str(entity.get("type"))
        if etype:
            entity_record["type"] = etype
        ename = _as_str(entity.get("name"))
        if ename:
            entity_record["name"] = ename
        edesc = _as_str(entity.get("description"))
        if edesc:
            entity_record["description"] = _truncate(edesc, _MAX_PAYLOAD_TEXT_CHARS)
        if entity_record:
            record["entity"] = entity_record
    if dimension:
        dim_record: dict[str, Any] = {}
        dtype = _as_str(dimension.get("type"))
        if dtype:
            dim_record["type"] = dtype
        dlabel = _as_str(dimension.get("label"))
        if dlabel:
            dim_record["label"] = dlabel
        if granularity:
            dim_record["granularity"] = granularity
        if dim_record:
            record["dimension"] = dim_record
    elif granularity:
        record["granularity"] = granularity
    return record


def _metric_to_record(metric: dict[str, Any]) -> dict[str, Any] | None:
    name = _as_str(metric.get("name"))
    if not name:
        return None
    description = _as_str(metric.get("description"))
    record: dict[str, Any] = {
        "name": name,
        "description": _truncate(description, _MAX_PAYLOAD_TEXT_CHARS),
    }
    metric_type = _as_str(metric.get("type"))
    if metric_type:
        record["type"] = metric_type
    label = _as_str(metric.get("label"))
    if label:
        record["label"] = label
    agg = _as_str(metric.get("agg"))
    if agg:
        record["agg"] = agg
    expr = _as_str(metric.get("expr"))
    if expr:
        record["expr"] = expr
    return record


def _build_model_base_payload(
    *,
    model: dict[str, Any],
    sql_text: str,
    sql_path: str,
    yml_path: str,
    column_records: list[dict[str, Any]],
    metric_records: list[dict[str, Any]],
) -> dict[str, Any] | None:
    name = _as_str(model.get("name"))
    if not name:
        return None
    description = _as_str(model.get("description"))
    config = _as_dict(model.get("config"))
    model_meta = _meta(config.get("meta"))
    owner = _as_str(model_meta.get("owner"))
    hive_table = _as_str(model_meta.get("hive_table"))
    agg_time_dimension = _as_str(model.get("agg_time_dimension"))

    semantic = _as_dict(model.get("semantic_model"))
    semantic_config = _as_dict(semantic.get("config"))
    semantic_meta = _meta(semantic_config.get("meta"))
    usage = _as_str(semantic_meta.get("usage"))

    payload: dict[str, Any] = {
        "source": "dbt_semantic_model",
        "model_name": name,
        "description": _truncate(description, _MAX_PAYLOAD_TEXT_CHARS),
        "yml_path": yml_path,
        "sql_path": sql_path,
        "column_count": len(column_records),
        "column_names": [c["name"] for c in column_records],
        "metric_count": len(metric_records),
        "metric_names": [m["name"] for m in metric_records],
        "columns": column_records,
        "metrics": metric_records,
    }
    if owner:
        payload["owner"] = owner
    if hive_table:
        payload["hive_table"] = hive_table
    if agg_time_dimension:
        payload["agg_time_dimension"] = agg_time_dimension
    if usage:
        payload["usage"] = _truncate(usage, _MAX_PAYLOAD_TEXT_CHARS)
    if sql_text:
        payload["sql"] = _truncate(sql_text, _MAX_PAYLOAD_TEXT_CHARS)
    if semantic.get("enabled") is False:
        payload["semantic_enabled"] = False
    return payload


def _model_header_lines(payload_base: dict[str, Any]) -> list[str]:
    """Common model-level lines prepended to both column and metric embed text."""
    parts: list[str] = [f"Model: {payload_base['model_name']}"]
    description = payload_base.get("description")
    if description:
        parts.append(f"Description: {description}")
    if payload_base.get("owner"):
        parts.append(f"Owner: {payload_base['owner']}")
    if payload_base.get("hive_table"):
        parts.append(f"Hive table: {payload_base['hive_table']}")
    if payload_base.get("usage"):
        parts.append(f"Usage: {payload_base['usage']}")
    if payload_base.get("agg_time_dimension"):
        parts.append(f"Agg time dimension: {payload_base['agg_time_dimension']}")
    return parts


def _column_embed_block(column: dict[str, Any]) -> str:
    name = column.get("name", "")
    description = column.get("description", "")
    bits: list[str] = [f"- {name}"]

    entity = column.get("entity")
    if entity:
        ebits: list[str] = []
        etype = entity.get("type")
        ename = entity.get("name")
        if etype:
            ebits.append(str(etype))
        if ename:
            ebits.append(f"name={ename}")
        if ebits:
            bits.append(f"({', '.join(ebits)} entity)")

    dimension = column.get("dimension")
    granularity = column.get("granularity")
    if dimension:
        dbits: list[str] = []
        dtype = dimension.get("type")
        if dtype:
            dbits.append(str(dtype))
        if dimension.get("label") and dimension["label"] != name:
            dbits.append(f"label={dimension['label']}")
        if dimension.get("granularity") or granularity:
            dbits.append(f"granularity={dimension.get('granularity') or granularity}")
        if dbits:
            bits.append(f"({', '.join(dbits)} dimension)")

    if description:
        bits.append(f": {description}")

    line = " ".join(bits)
    extras: list[str] = []
    if column.get("data_tests"):
        extras.append(f"Data tests: {column['data_tests']}")
    if entity and entity.get("description"):
        extras.append(f"Entity description: {entity['description']}")
    if extras:
        line += "\n  " + "\n  ".join(extras)
    return line


def _metric_embed_block(metric: dict[str, Any]) -> str:
    name = metric.get("name", "")
    description = metric.get("description", "")
    abits: list[str] = []
    if metric.get("type"):
        abits.append(str(metric["type"]))
    if metric.get("label") and metric["label"] != name:
        abits.append(f"label={metric['label']}")
    if metric.get("agg"):
        abits.append(f"agg={metric['agg']}")
    if metric.get("expr"):
        abits.append(f"expr={metric['expr']}")
    bits: list[str] = [f"- {name}"]
    if abits:
        bits.append(f"({', '.join(abits)})")
    if description:
        bits.append(f": {description}")
    return " ".join(bits)


def _build_columns_embed_text(
    payload_base: dict[str, Any], column_records: list[dict[str, Any]]
) -> str:
    parts = _model_header_lines(payload_base)
    parts.append(f"Type: {_CHUNK_COLUMNS}")
    parts.append(f"Columns ({len(column_records)}):")
    parts.extend(_column_embed_block(c) for c in column_records)
    return "\n".join(parts)


def _build_metrics_embed_text(
    payload_base: dict[str, Any], metric_records: list[dict[str, Any]]
) -> str:
    parts = _model_header_lines(payload_base)
    parts.append(f"Type: {_CHUNK_METRICS}")
    parts.append(f"Metrics ({len(metric_records)}):")
    parts.extend(_metric_embed_block(m) for m in metric_records)
    return "\n".join(parts)


def _model_to_document(
    *,
    model: dict[str, Any],
    yml_path: Path,
) -> tuple[ModelDocument | None, int, int]:
    """Build a document with 0-2 paragraphs. Returns (doc, column_count, metric_count)."""
    name = _as_str(model.get("name"))
    if not name:
        return None, 0, 0
    semantic = _as_dict(model.get("semantic_model"))
    if semantic.get("enabled") is False:
        return None, 0, 0

    sql_path = _find_model_sql(yml_path, name)
    sql_text = _read_sql(sql_path)
    sql_path_str = str(sql_path) if sql_path else ""
    yml_path_str = str(yml_path)

    column_records: list[dict[str, Any]] = []
    for column in (model.get("columns") or []):
        if not isinstance(column, dict):
            continue
        rec = _column_to_record(column)
        if rec is not None:
            column_records.append(rec)

    metric_records: list[dict[str, Any]] = []
    for metric in (model.get("metrics") or []):
        if not isinstance(metric, dict):
            continue
        rec = _metric_to_record(metric)
        if rec is not None:
            metric_records.append(rec)

    base_payload = _build_model_base_payload(
        model=model,
        sql_text=sql_text,
        sql_path=sql_path_str,
        yml_path=yml_path_str,
        column_records=column_records,
        metric_records=metric_records,
    )
    if base_payload is None:
        return None, 0, 0

    columns_embed = (
        _build_columns_embed_text(base_payload, column_records) if column_records else ""
    )
    metrics_embed = (
        _build_metrics_embed_text(base_payload, metric_records) if metric_records else ""
    )
    if not columns_embed and not metrics_embed:
        return None, 0, 0

    doc = ModelDocument(
        doc_id=f"{yml_path_str}::{name}",
        url=yml_path_str,
        title=name,
        content="\n\n".join(part for part in (columns_embed, metrics_embed) if part),
        model_name=name,
        yml_path_str=yml_path_str,
        base_payload=base_payload,
        columns_embed=columns_embed,
        metrics_embed=metrics_embed,
    )
    return doc, len(column_records), len(metric_records)


def _iter_dbt_yml_files(root: Path) -> Iterable[Path]:
    seen: set[Path] = set()
    for pattern in ("*.yml", "*.yaml"):
        for path in sorted(root.rglob(pattern)):
            if not path.is_file():
                continue
            if path in seen:
                continue
            seen.add(path)
            yield path


def collect_semantic_model_documents(model_path: str | Path) -> list[ModelDocument]:
    """Walk ``model_path`` for dbt schema yml files; return model documents."""
    docs, _stats = collect_semantic_model_documents_with_stats(model_path)
    return docs


def collect_semantic_model_documents_with_stats(
    model_path: str | Path,
) -> tuple[list[ModelDocument], dict[str, int]]:
    root = Path(model_path).expanduser().resolve()
    if not root.is_dir():
        raise FileNotFoundError(f"dbt models directory not found: {root}")

    docs: list[ModelDocument] = []
    seen_keys: set[str] = set()
    stats = {
        "yml_files": 0,
        "models": 0,
        "models_skipped_disabled": 0,
        "chunks": 0,
        "column_chunks": 0,
        "metric_chunks": 0,
        "columns": 0,
        "metrics": 0,
    }

    for yml_path in _iter_dbt_yml_files(root):
        try:
            data = yaml.safe_load(yml_path.read_text(encoding="utf-8"))
        except yaml.YAMLError as exc:
            print(f"Skipping {yml_path}: YAML parse failed ({exc})")
            continue
        if not isinstance(data, dict):
            continue
        models = data.get("models")
        if not isinstance(models, list):
            continue
        stats["yml_files"] += 1

        for model in models:
            if not isinstance(model, dict):
                continue
            model_name = _as_str(model.get("name"))
            if not model_name:
                continue
            semantic = _as_dict(model.get("semantic_model"))
            if semantic.get("enabled") is False:
                stats["models_skipped_disabled"] += 1
                continue
            stats["models"] += 1

            doc, col_count, met_count = _model_to_document(
                model=model, yml_path=yml_path
            )
            stats["columns"] += col_count
            stats["metrics"] += met_count
            if doc is None:
                continue
            if doc.doc_id in seen_keys:
                continue
            seen_keys.add(doc.doc_id)
            if doc.columns_embed:
                stats["column_chunks"] += 1
                stats["chunks"] += 1
            if doc.metrics_embed:
                stats["metric_chunks"] += 1
                stats["chunks"] += 1
            docs.append(doc)

    return docs, stats


def upload_semantic_models(
    model_path: str,
    collection_name: str,
    *,
    batch_size: int | None = None,
    max_chars: int | None = None,
) -> int:
    """Embed dbt semantic model definitions under ``model_path`` into ``collection_name``.

    Each model is split into a ``model+columns`` point and a ``model+metrics``
    point (whichever has content). The point payload carries the full
    structured model so the calling agent can render a ``TableCard``
    directly. ``max_chars`` overrides ``config.rag.toml [embedding].max_chars``
    for this call only — useful when using an OpenAI-compatible endpoint
    that supports a larger context than local BGE.
    """
    from rag.config import get_rag_config

    embedding_config = None
    if max_chars is not None:
        cfg = get_rag_config().embedding
        embedding_config = cfg.model_copy(update={"max_chars": max_chars})

    docs, stats = collect_semantic_model_documents_with_stats(model_path)
    print(
        f"Collected {stats['chunks']} chunks from {stats['models']} models in {model_path!s}"
        f" → collection {collection_name!r} (yml_files={stats['yml_files']},"
        f" columns={stats['columns']} → {stats['column_chunks']} chunk(s),"
        f" metrics={stats['metrics']} → {stats['metric_chunks']} chunk(s),"
        f" skipped_disabled={stats['models_skipped_disabled']})"
    )
    return upsert_documents(
        collection_name,
        docs,
        strategy=IdentitySplitStrategy(),
        batch_size=batch_size,
        embedding_config=embedding_config,
    )

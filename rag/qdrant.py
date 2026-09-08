"""Qdrant client helpers used by ingest jobs and retrieval tools."""

from __future__ import annotations

from functools import lru_cache
from typing import Any

from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels

from rag.config import get_rag_config, resolve_qdrant_api_key
from rag.embeddings import get_embedding, to_sparse_vector

_EMBED_TEXT_KEYS = ("chunk_data", "text")
_TITLE_KEYS = ("description", "summary")


@lru_cache(maxsize=1)
def get_client() -> QdrantClient:
    cfg = get_rag_config().qdrant
    return QdrantClient(
        url=cfg.url,
        api_key=resolve_qdrant_api_key(cfg),
        timeout=cfg.timeout_seconds,
    )


def ensure_collection(
    collection_name: str,
    *,
    vector_size: int | None = None,
    distance: qmodels.Distance = qmodels.Distance.COSINE,
    client: QdrantClient | None = None,
) -> None:
    """Create the collection when missing; refuse size mismatches if it exists."""
    qdrant = client or get_client()
    size = vector_size if vector_size is not None else get_rag_config().embedding.vector_size
    if qdrant.collection_exists(collection_name):
        info = qdrant.get_collection(collection_name)
        existing = _vector_size(info)
        if existing is not None and existing != size:
            raise ValueError(
                f"Collection {collection_name!r} has vector_size={existing}, "
                f"but embedding config expects {size}. Recreate the collection "
                "or update config/rag.toml [embedding].vector_size."
            )
        if not _is_hybrid_collection(info):
            raise ValueError(
                f"Collection {collection_name!r} is not a named dense+sparse hybrid "
                "collection. Re-ingest with plan/run and --recreate-collection, e.g. "
                f"`python -m rag run --tasks <tasks.json> --checkpoint <checkpoint.json> "
                f"--recreate-collection` (collection {collection_name!r})."
            )
        return
    qdrant.create_collection(
        collection_name=collection_name,
        vectors_config={
            "dense": qmodels.VectorParams(size=size, distance=distance),
        },
        sparse_vectors_config={
            "sparse": qmodels.SparseVectorParams(),
        },
    )


def _params(info: Any) -> Any:
    config = getattr(info, "config", None)
    return getattr(config, "params", None) if config is not None else None


def _vector_size(info: Any) -> int | None:
    params = _params(info)
    vectors = getattr(params, "vectors", None) if params is not None else None
    if vectors is None:
        return None
    size = getattr(vectors, "size", None)
    if isinstance(size, int):
        return size
    if isinstance(vectors, dict) and vectors:
        dense = vectors.get("dense") or next(iter(vectors.values()))
        return getattr(dense, "size", None)
    return None


def _is_hybrid_collection(info: Any) -> bool:
    params = _params(info)
    vectors = getattr(params, "vectors", None) if params is not None else None
    sparse = getattr(params, "sparse_vectors", None) if params is not None else None
    if not isinstance(vectors, dict) or "dense" not in vectors:
        return False
    if not isinstance(sparse, dict) or "sparse" not in sparse:
        return False
    return True


def upsert_points(
    collection_name: str,
    points: list[qmodels.PointStruct],
    *,
    client: QdrantClient | None = None,
) -> None:
    if not points:
        return
    qdrant = client or get_client()
    ensure_collection(collection_name, client=qdrant)
    qdrant.upsert(collection_name=collection_name, points=points)


def search(
    collection_name: str,
    query: str,
    *,
    limit: int = 5,
    score_threshold: float | None = None,
    query_filter: qmodels.Filter | None = None,
    client: QdrantClient | None = None,
) -> list[dict[str, Any]]:
    """Dense + sparse RRF retrieve, then rerank.

    Collections must be named-vector hybrid (``dense`` + ``sparse``).
    ``query_filter`` is applied on each prefetch so filtered collections
    (e.g. ``chunk_type = "model+columns"``) are not truncated by fusion.
    """
    qdrant = client or get_client()
    info = qdrant.get_collection(collection_name)
    if not _is_hybrid_collection(info):
        raise ValueError(
            f"Collection {collection_name!r} is not a named dense+sparse hybrid "
            "collection. Re-ingest with --recreate-collection."
        )
    top_k = max(1, limit)
    prefetch_limit = max(top_k, get_rag_config().rerank.prefetch_limit)
    dense_query, sparse_weights = get_embedding(query)
    if not dense_query or not sparse_weights:
        raise ValueError("Query embedding must include both dense and sparse vectors")
    response = qdrant.query_points(
        collection_name=collection_name,
        prefetch=[
            qmodels.Prefetch(
                query=dense_query,
                using="dense",
                limit=prefetch_limit,
                filter=query_filter,
            ),
            qmodels.Prefetch(
                query=to_sparse_vector(sparse_weights),
                using="sparse",
                limit=prefetch_limit,
                filter=query_filter,
            ),
        ],
        query=qmodels.FusionQuery(fusion=qmodels.Fusion.RRF),
        limit=prefetch_limit,
        with_payload=True,
        with_vectors=False,
    )

    ranked = rerank_points(query, list(response.points), limit=top_k)
    hits: list[dict[str, Any]] = []
    for point, score in ranked:
        if score_threshold is not None and score < score_threshold:
            continue
        payload = dict(point.payload or {})
        hits.append({"id": point.id, "score": score, "payload": payload})
    return hits


def passage_text(payload: dict[str, Any] | None) -> str:
    """Text fed to the reranker (chunk embed text, else dbt name lists)."""
    raw = payload or {}
    for key in _EMBED_TEXT_KEYS:
        value = raw.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()

    parts: list[str] = []
    model_name = raw.get("model_name")
    if isinstance(model_name, str) and model_name.strip():
        parts.append(f"Model: {model_name.strip()}")
    chunk_type = raw.get("chunk_type")
    if isinstance(chunk_type, str) and chunk_type.strip():
        parts.append(f"Type: {chunk_type.strip()}")
    for key in _TITLE_KEYS:
        value = raw.get(key)
        if isinstance(value, str) and value.strip():
            parts.append(value.strip())
            break
    columns = [str(name) for name in (raw.get("column_names") or []) if name]
    if columns:
        parts.append("Columns: " + ", ".join(columns))
    metrics = [str(name) for name in (raw.get("metric_names") or []) if name]
    if metrics:
        parts.append("Metrics: " + ", ".join(metrics))
    if parts:
        return "\n".join(parts)
    return ""


@lru_cache(maxsize=1)
def _reranker() -> Any:
    from FlagEmbedding import FlagReranker

    cfg = get_rag_config().rerank
    device = get_rag_config().embedding.device.strip()
    return FlagReranker(
        cfg.model,
        use_fp16=device.lower() not in {"cpu", "mps"},
        devices=device or None,
        normalize=True,
        max_length=max(32, int(get_rag_config().embedding.max_seq_length)),
        batch_size=max(1, int(get_rag_config().embedding.batch_size)),
    )


def rerank_points(
    query: str,
    points: list[Any],
    *,
    limit: int,
) -> list[tuple[Any, float]]:
    """Rerank retrieved points with BGE reranker; keep fusion order if disabled."""
    if not points:
        return []
    cfg = get_rag_config().rerank
    if not (cfg.model or "").strip():
        return [(point, float(getattr(point, "score", 0.0) or 0.0)) for point in points[:limit]]

    pairs = [(query, passage_text(getattr(point, "payload", None))) for point in points]
    raw_scores = _reranker().compute_score(pairs)
    try:
        scores = [float(value) for value in list(raw_scores)]
    except TypeError:
        scores = [float(raw_scores)]
    if len(scores) != len(points):
        raise ValueError(
            f"Reranker returned {len(scores)} scores for {len(points)} points"
        )
    ranked = sorted(zip(points, scores, strict=True), key=lambda item: item[1], reverse=True)
    return ranked[: max(1, limit)]

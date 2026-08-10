"""Thin Qdrant store helpers used by ingest jobs and retrieval tools."""

from __future__ import annotations

from functools import lru_cache
from typing import Any

from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels

from rag.config import get_rag_config, resolve_qdrant_api_key
from rag.embeddings import get_embedding


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
        return
    qdrant.create_collection(
        collection_name=collection_name,
        vectors_config=qmodels.VectorParams(size=size, distance=distance),
    )


def _vector_size(info: Any) -> int | None:
    params = getattr(info, "config", None)
    params = getattr(params, "params", None) if params is not None else None
    vectors = getattr(params, "vectors", None) if params is not None else None
    if vectors is None:
        return None
    size = getattr(vectors, "size", None)
    if isinstance(size, int):
        return size
    # Named vectors map — use the first entry.
    if isinstance(vectors, dict) and vectors:
        first = next(iter(vectors.values()))
        return getattr(first, "size", None)
    return None


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
    client: QdrantClient | None = None,
) -> list[dict[str, Any]]:
    """Embed ``query`` and return ranked payload hits for agent tools."""
    qdrant = client or get_client()
    vector = get_embedding(query)
    response = qdrant.query_points(
        collection_name=collection_name,
        query=vector,
        limit=max(1, limit),
        score_threshold=score_threshold,
        with_payload=True,
        with_vectors=False,
    )
    hits: list[dict[str, Any]] = []
    for point in response.points:
        payload = dict(point.payload or {})
        hits.append(
            {
                "id": point.id,
                "score": point.score,
                "payload": payload,
            }
        )
    return hits

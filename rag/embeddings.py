"""Text embeddings for RAG ingest and query (local BGE-M3 dense + sparse)."""

from __future__ import annotations

from functools import lru_cache
from typing import Any

from qdrant_client.http import models as qmodels

from rag.config import EmbeddingConfig, get_rag_config

HybridEmbedding = tuple[list[float], dict[int, float]]


def _use_fp16(device: str) -> bool:
    name = device.strip().lower()
    return name not in {"cpu", "mps"}


@lru_cache(maxsize=1)
def _local_model() -> Any:
    from FlagEmbedding import BGEM3FlagModel

    cfg = get_rag_config().embedding
    device = cfg.device.strip()
    return BGEM3FlagModel(
        cfg.model,
        use_fp16=_use_fp16(device),
        devices=device or None,
        normalize_embeddings=True,
        return_dense=True,
        return_sparse=True,
        query_max_length=max(32, int(cfg.max_seq_length)),
        passage_max_length=max(32, int(cfg.max_seq_length)),
        batch_size=max(1, int(cfg.batch_size)),
    )


def truncate_text(text: str, *, max_chars: int | None = None) -> str:
    limit = max_chars if max_chars is not None else get_rag_config().embedding.max_chars
    cleaned = (text or "").strip()
    if len(cleaned) <= limit:
        return cleaned
    return cleaned[:limit]


def to_sparse_vector(weights: dict[int, float] | dict[str, float] | None) -> qmodels.SparseVector:
    """Convert BGE lexical weights to a Qdrant sparse vector (sorted unique indices)."""
    if not weights:
        raise ValueError("Sparse embedding is empty")
    merged: dict[int, float] = {}
    for key, value in weights.items():
        index = int(key)
        merged[index] = float(value)
    pairs = sorted(merged.items())
    if not pairs:
        raise ValueError("Sparse embedding is empty")
    return qmodels.SparseVector(
        indices=[index for index, _ in pairs],
        values=[value for _, value in pairs],
    )


def ensure_hybrid_embedding(
    dense: list[float],
    sparse: dict[int, float],
) -> HybridEmbedding:
    """Reject empty dense or sparse vectors; hybrid ingest/query requires both."""
    if not dense:
        raise ValueError("Dense embedding is empty")
    if not sparse:
        raise ValueError("Sparse embedding is empty")
    return dense, sparse


def _as_dense_rows(dense: Any, count: int) -> list[Any]:
    ndim = getattr(dense, "ndim", None)
    if ndim == 1 and count == 1:
        return [dense]
    return list(dense)


def _as_sparse_rows(sparse: Any) -> list[dict[Any, Any]]:
    if isinstance(sparse, dict):
        return [sparse]
    return [dict(row or {}) for row in list(sparse or [])]


def _embed_local(payloads: list[str], *, config: EmbeddingConfig) -> list[HybridEmbedding]:
    model = _local_model()
    vectors = model.encode(
        payloads,
        return_dense=True,
        return_sparse=True,
        return_colbert_vecs=False,
        batch_size=max(1, config.batch_size),
        max_length=max(32, int(config.max_seq_length)),
    )
    dense_rows = _as_dense_rows(vectors["dense_vecs"], len(payloads))
    sparse_rows = _as_sparse_rows(vectors["lexical_weights"])
    encoded: list[HybridEmbedding] = []
    for dense, sparse in zip(dense_rows, sparse_rows, strict=True):
        weights = {int(key): float(value) for key, value in dict(sparse or {}).items()}
        encoded.append(ensure_hybrid_embedding([float(x) for x in dense], weights))
    return encoded


def get_embedding(
    text: str,
    *,
    config: EmbeddingConfig | None = None,
) -> HybridEmbedding:
    """Embed one string; returns ``(dense, lexical_weights)``. Both are non-empty."""
    return get_embeddings([text], config=config)[0]


def get_embeddings(
    texts: list[str],
    *,
    config: EmbeddingConfig | None = None,
) -> list[HybridEmbedding]:
    """Embed texts with local BGE-M3 (dense + sparse). Empty either side is an error."""
    cfg = config or get_rag_config().embedding
    payloads = [truncate_text(t, max_chars=cfg.max_chars) for t in texts]
    if not payloads or any(not p for p in payloads):
        raise ValueError("Cannot embed empty text in batch")
    return _embed_local(payloads, config=cfg)

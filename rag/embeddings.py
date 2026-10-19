"""Text embeddings for RAG ingest and query (local BGE-M3 dense + sparse)."""

from __future__ import annotations

import sys
from functools import lru_cache
from typing import Any

from qdrant_client.http import models as qmodels

from rag.config import EmbeddingConfig, get_rag_config
from rag.models import resolve_model_dir

HybridEmbedding = tuple[list[float], dict[int, float]]


def _use_fp16(device: str) -> bool:
    name = device.strip().lower()
    return name not in {"cpu", "mps"}


def resolve_bge_devices(device: str) -> str | None:
    """Device string for FlagEmbedding BGE models (dense + sparse must both work).

    On Apple Silicon, auto-selected ``mps:0`` often yields empty lexical weights for
    batched encode; use ``mps`` (not ``mps:0``). Unset config defaults to ``mps`` on
    macOS; empty sparse rows are re-encoded on CPU (batch size 1).
    """
    cleaned = (device or "").strip()
    if not cleaned:
        if sys.platform == "darwin":
            return "mps"
        return None
    lowered = cleaned.lower()
    if lowered.startswith("mps"):
        return "mps"
    return cleaned


def _device_cache_key(device: str | None) -> str:
    return device if device is not None else "__auto__"


@lru_cache(maxsize=4)
def _bge_model(device_key: str) -> Any:
    from FlagEmbedding import BGEM3FlagModel

    cfg = get_rag_config().embedding
    devices = None if device_key == "__auto__" else device_key
    return BGEM3FlagModel(
        resolve_model_dir(cfg.model, embedder=True),
        use_fp16=_use_fp16(devices or ""),
        devices=devices,
        normalize_embeddings=True,
        return_dense=True,
        return_sparse=True,
        query_max_length=max(32, int(cfg.max_seq_length)),
        passage_max_length=max(32, int(cfg.max_seq_length)),
        batch_size=max(1, int(cfg.batch_size)),
    )


@lru_cache(maxsize=1)
def _local_model() -> Any:
    device = resolve_bge_devices(get_rag_config().embedding.device)
    return _bge_model(_device_cache_key(device))


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


def _hybrid_rows_from_encode(
    vectors: Any,
    *,
    count: int,
) -> list[HybridEmbedding]:
    dense_rows = _as_dense_rows(vectors["dense_vecs"], count)
    sparse_rows = _as_sparse_rows(vectors["lexical_weights"])
    encoded: list[HybridEmbedding] = []
    for dense, sparse in zip(dense_rows, sparse_rows, strict=True):
        weights = {int(key): float(value) for key, value in dict(sparse or {}).items()}
        encoded.append(
            (
                [float(x) for x in dense],
                weights,
            )
        )
    return encoded


def _encode_hybrid_batch(
    model: Any,
    payloads: list[str],
    *,
    batch_size: int,
    encode_kwargs: dict[str, Any],
) -> list[HybridEmbedding]:
    vectors = model.encode(payloads, batch_size=batch_size, **encode_kwargs)
    return _hybrid_rows_from_encode(vectors, count=len(payloads))


def _sparse_lexical_fallback(
    model: Any,
    text: str,
    *,
    max_length: int,
) -> dict[int, float]:
    """Token-id weights when the model returns no lexical vector (ingest must not stall)."""
    tokenizer = model.tokenizer
    token_ids = tokenizer.encode(
        text,
        add_special_tokens=False,
        truncation=True,
        max_length=max_length,
    )
    if not token_ids:
        token_ids = tokenizer.encode("text", add_special_tokens=False)
    weights: dict[int, float] = {}
    for token_id in token_ids:
        key = int(token_id)
        weights[key] = weights.get(key, 0.0) + 1.0
    return weights


def _embed_local(payloads: list[str], *, config: EmbeddingConfig) -> list[HybridEmbedding]:
    model = _local_model()
    batch_size = max(1, config.batch_size)
    max_length = max(32, int(config.max_seq_length))
    encode_kwargs: dict[str, Any] = {
        "return_dense": True,
        "return_sparse": True,
        "return_colbert_vecs": False,
        "max_length": max_length,
    }
    encoded = _encode_hybrid_batch(
        model, payloads, batch_size=batch_size, encode_kwargs=encode_kwargs
    )

    missing = [i for i, (_, weights) in enumerate(encoded) if not weights]
    if missing:
        print(f"Sparse embed retry on cpu: {len(missing)}/{len(payloads)} text(s)")
        cpu_model = _bge_model("cpu")
        cpu_rows = _encode_hybrid_batch(
            cpu_model,
            payloads,
            batch_size=batch_size,
            encode_kwargs=encode_kwargs,
        )
        for index in missing:
            encoded[index] = cpu_rows[index]

        still_missing = [i for i, (_, weights) in enumerate(encoded) if not weights]
        for index in still_missing:
            encoded[index] = _encode_hybrid_batch(
                cpu_model,
                [payloads[index]],
                batch_size=1,
                encode_kwargs=encode_kwargs,
            )[0]

        still_missing = [i for i, (_, weights) in enumerate(encoded) if not weights]
        if still_missing:
            print(f"Sparse tokenizer fallback: {len(still_missing)} text(s)")
            for index in still_missing:
                dense, weights = encoded[index]
                if not dense:
                    dense, weights = _encode_hybrid_batch(
                        cpu_model,
                        [payloads[index]],
                        batch_size=1,
                        encode_kwargs=encode_kwargs,
                    )[0]
                if not weights:
                    weights = _sparse_lexical_fallback(
                        cpu_model,
                        payloads[index],
                        max_length=max_length,
                    )
                encoded[index] = (dense, weights)

    return [ensure_hybrid_embedding(dense, weights) for dense, weights in encoded]


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

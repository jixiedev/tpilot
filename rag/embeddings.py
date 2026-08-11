"""Text embeddings for RAG ingest and query (local BGE or OpenAI-compatible API)."""

from __future__ import annotations

from functools import lru_cache
from typing import Any

from rag.config import EmbeddingConfig, get_rag_config, resolve_embedding_api_key


@lru_cache(maxsize=1)
def _openai_client() -> Any:
    from openai import OpenAI

    cfg = get_rag_config().embedding
    return OpenAI(
        api_key=resolve_embedding_api_key(cfg),
        base_url=cfg.base_url,
        timeout=cfg.timeout_seconds,
    )


@lru_cache(maxsize=1)
def _local_model() -> Any:
    from sentence_transformers import SentenceTransformer

    cfg = get_rag_config().embedding
    kwargs: dict[str, Any] = {}
    if cfg.device.strip():
        kwargs["device"] = cfg.device.strip()
    # Prefer the local Hugging Face cache so query-time embedding does not hit
    # huggingface.co (often reset / slow). Fall back to online download once.
    try:
        model = SentenceTransformer(cfg.model, local_files_only=True, **kwargs)
    except Exception:
        model = SentenceTransformer(cfg.model, local_files_only=False, **kwargs)
    # Cap sequence length so long Jira/docs texts do not allocate multi‑GiB buffers.
    seq = max(32, int(cfg.max_seq_length))
    model.max_seq_length = seq
    return model


def truncate_text(text: str, *, max_chars: int | None = None) -> str:
    limit = max_chars if max_chars is not None else get_rag_config().embedding.max_chars
    cleaned = (text or "").strip()
    if len(cleaned) <= limit:
        return cleaned
    return cleaned[:limit]


def _embed_local(payloads: list[str], *, config: EmbeddingConfig) -> list[list[float]]:
    model = _local_model()
    # Truncation is enforced via model.max_seq_length set in _local_model.
    vectors = model.encode(
        payloads,
        normalize_embeddings=True,
        show_progress_bar=False,
        batch_size=max(1, config.batch_size),
    )
    return [list(map(float, row)) for row in vectors]


def _embed_openai(
    payloads: list[str],
    *,
    model: str,
) -> list[list[float]]:
    response = _openai_client().embeddings.create(input=payloads, model=model)
    ordered = sorted(response.data, key=lambda item: item.index)
    return [list(item.embedding) for item in ordered]


def get_embedding(
    text: str,
    *,
    model: str | None = None,
    config: EmbeddingConfig | None = None,
) -> list[float]:
    """Embed a single text string; returns the dense vector."""
    return get_embeddings([text], model=model, config=config)[0]


def get_embeddings(
    texts: list[str],
    *,
    model: str | None = None,
    config: EmbeddingConfig | None = None,
) -> list[list[float]]:
    """Embed multiple texts (local batch or provider batching)."""
    cfg = config or get_rag_config().embedding
    payloads = [truncate_text(t, max_chars=cfg.max_chars) for t in texts]
    if not payloads or any(not p for p in payloads):
        raise ValueError("Cannot embed empty text in batch")

    if cfg.provider == "local":
        return _embed_local(payloads, config=cfg)
    if cfg.provider == "openai":
        return _embed_openai(payloads, model=model or cfg.model)
    raise ValueError(f"Unsupported embedding provider: {cfg.provider!r}")

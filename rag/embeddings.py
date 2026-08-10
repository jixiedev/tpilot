"""OpenAI-compatible text embeddings for RAG ingest and query."""

from __future__ import annotations

from functools import lru_cache

from openai import OpenAI

from rag.config import EmbeddingConfig, get_rag_config, resolve_embedding_api_key


@lru_cache(maxsize=1)
def _client() -> OpenAI:
    cfg = get_rag_config().embedding
    return OpenAI(
        api_key=resolve_embedding_api_key(cfg),
        base_url=cfg.base_url,
        timeout=cfg.timeout_seconds,
    )


def truncate_text(text: str, *, max_chars: int | None = None) -> str:
    limit = max_chars if max_chars is not None else get_rag_config().embedding.max_chars
    cleaned = (text or "").strip()
    if len(cleaned) <= limit:
        return cleaned
    return cleaned[:limit]


def get_embedding(
    text: str,
    *,
    model: str | None = None,
    config: EmbeddingConfig | None = None,
) -> list[float]:
    """Embed a single text string; returns the dense vector."""
    cfg = config or get_rag_config().embedding
    payload = truncate_text(text, max_chars=cfg.max_chars)
    if not payload:
        raise ValueError("Cannot embed empty text")
    response = _client().embeddings.create(
        input=payload,
        model=model or cfg.model,
    )
    return list(response.data[0].embedding)


def get_embeddings(
    texts: list[str],
    *,
    model: str | None = None,
    config: EmbeddingConfig | None = None,
) -> list[list[float]]:
    """Embed multiple texts in one request (provider batching)."""
    cfg = config or get_rag_config().embedding
    payloads = [truncate_text(t, max_chars=cfg.max_chars) for t in texts]
    if not payloads or any(not p for p in payloads):
        raise ValueError("Cannot embed empty text in batch")
    response = _client().embeddings.create(
        input=payloads,
        model=model or cfg.model,
    )
    ordered = sorted(response.data, key=lambda item: item.index)
    return [list(item.embedding) for item in ordered]

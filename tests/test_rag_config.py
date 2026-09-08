from __future__ import annotations

import pytest

from rag.config import (
    EmbeddingConfig,
    QdrantConfig,
    get_rag_config,
    resolve_qdrant_api_key,
)
from rag.embeddings import ensure_hybrid_embedding, to_sparse_vector


def test_resolve_qdrant_api_key_optional(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("QDRANT_API_KEY", raising=False)
    cfg = QdrantConfig(api_key="", api_key_env="QDRANT_API_KEY")
    assert resolve_qdrant_api_key(cfg) is None


def test_get_rag_config_loads_toml() -> None:
    get_rag_config.cache_clear()
    cfg = get_rag_config()
    assert cfg.qdrant.url
    assert cfg.embedding.model == "BAAI/bge-m3"
    assert cfg.embedding.vector_size == 1024
    assert cfg.embedding.max_seq_length == 512
    assert cfg.embedding.batch_size <= 8
    assert cfg.rerank.model == "BAAI/bge-reranker-v2-m3"
    assert cfg.rerank.prefetch_limit == 50
    get_rag_config.cache_clear()


def test_get_rag_config_rejects_remote_embedding_provider(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("EMBEDDING_PROVIDER", "openai")
    get_rag_config.cache_clear()
    try:
        with pytest.raises(ValueError, match="local BGE-M3"):
            get_rag_config()
    finally:
        get_rag_config.cache_clear()


def test_embedding_config_has_no_remote_provider() -> None:
    cfg = EmbeddingConfig()
    assert not hasattr(cfg, "provider") or "openai" not in str(cfg.model_dump())
    dumped = cfg.model_dump()
    assert "base_url" not in dumped
    assert "api_key" not in dumped


def test_ensure_hybrid_embedding_rejects_empty() -> None:
    with pytest.raises(ValueError, match="Dense"):
        ensure_hybrid_embedding([], {1: 0.2})
    with pytest.raises(ValueError, match="Sparse"):
        ensure_hybrid_embedding([0.1, 0.2], {})


def test_to_sparse_vector_empty_raises() -> None:
    with pytest.raises(ValueError, match="Sparse"):
        to_sparse_vector({})
    with pytest.raises(ValueError, match="Sparse"):
        to_sparse_vector(None)

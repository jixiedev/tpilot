from __future__ import annotations

import pytest

from rag.config import (
    EmbeddingConfig,
    QdrantConfig,
    get_rag_config,
    resolve_embedding_api_key,
    resolve_qdrant_api_key,
)


def test_resolve_embedding_api_key_from_env(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("OPENAI_API_KEY", "emb-secret")
    cfg = EmbeddingConfig(
        provider="openai",
        api_key_env="OPENAI_API_KEY",
        api_key="",
    )
    assert resolve_embedding_api_key(cfg) == "emb-secret"


def test_resolve_embedding_api_key_missing_raises(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    cfg = EmbeddingConfig(provider="openai", api_key="", api_key_env="OPENAI_API_KEY")
    with pytest.raises(ValueError, match="OPENAI_API_KEY"):
        resolve_embedding_api_key(cfg)


def test_resolve_embedding_api_key_local_skips_secret(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    cfg = EmbeddingConfig(provider="local", api_key="", api_key_env="OPENAI_API_KEY")
    assert resolve_embedding_api_key(cfg) == ""


def test_resolve_qdrant_api_key_optional(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("QDRANT_API_KEY", raising=False)
    cfg = QdrantConfig(api_key="", api_key_env="QDRANT_API_KEY")
    assert resolve_qdrant_api_key(cfg) is None


def test_get_rag_config_loads_toml() -> None:
    get_rag_config.cache_clear()
    cfg = get_rag_config()
    assert cfg.qdrant.url
    assert cfg.embedding.provider == "local"
    assert cfg.embedding.model == "BAAI/bge-m3"
    assert cfg.embedding.vector_size == 1024
    get_rag_config.cache_clear()

"""RAG runtime settings (Qdrant + embeddings)."""

from __future__ import annotations

import os
from functools import lru_cache
from typing import Literal

from pydantic import BaseModel, Field


class QdrantConfig(BaseModel):
    url: str = "http://localhost:6333"
    api_key: str = ""
    api_key_env: str | None = "QDRANT_API_KEY"
    timeout_seconds: float = 30.0


class EmbeddingConfig(BaseModel):
    """Local sentence-transformers or OpenAI-compatible embeddings endpoint."""

    provider: Literal["local", "openai"] = "local"
    model: str = "BAAI/bge-m3"
    vector_size: int = 1024
    device: str = ""
    base_url: str = "https://api.openai.com/v1"
    api_key: str = ""
    api_key_env: str | None = "OPENAI_API_KEY"
    timeout_seconds: float = 60.0
    # Token cap for local sentence-transformers (avoids multi‑GiB encode buffers).
    max_seq_length: int = 512
    max_chars: int = 2000
    batch_size: int = 8


class RagConfig(BaseModel):
    qdrant: QdrantConfig = Field(default_factory=QdrantConfig)
    embedding: EmbeddingConfig = Field(default_factory=EmbeddingConfig)


def _env_or(value: str, env_name: str | None) -> str:
    if env_name:
        env_value = os.environ.get(env_name, "").strip()
        if env_value:
            return env_value
    return value.strip()


def _embedding_provider_from_env() -> Literal["local", "openai"] | None:
    raw = os.environ.get("EMBEDDING_PROVIDER", "").strip().lower()
    if raw in {"local", "openai"}:
        return raw  # type: ignore[return-value]
    return None


def resolve_qdrant_api_key(cfg: QdrantConfig | None = None) -> str | None:
    qdrant = cfg or get_rag_config().qdrant
    key = _env_or(qdrant.api_key, qdrant.api_key_env)
    return key or None


def resolve_embedding_api_key(cfg: EmbeddingConfig | None = None) -> str:
    embedding = cfg or get_rag_config().embedding
    if embedding.provider == "local":
        return ""
    key = _env_or(embedding.api_key, embedding.api_key_env)
    if key:
        return key
    env_hint = embedding.api_key_env or "OPENAI_API_KEY"
    raise ValueError(
        f"Missing embedding API key; set environment variable {env_hint!r} "
        "or rag.toml [embedding].api_key"
    )


@lru_cache(maxsize=1)
def get_rag_config() -> RagConfig:
    """Load ``config/rag.toml`` when present; otherwise env/defaults only."""
    from pathlib import Path
    import tomllib

    path = Path(__file__).resolve().parents[1] / "config" / "rag.toml"
    if not path.is_file():
        return RagConfig(
            qdrant=QdrantConfig(
                url=os.environ.get("QDRANT_URL", "http://localhost:6333").strip()
                or "http://localhost:6333",
            ),
            embedding=EmbeddingConfig(
                provider=_embedding_provider_from_env() or EmbeddingConfig().provider,
                base_url=os.environ.get("EMBEDDING_BASE_URL", "").strip()
                or EmbeddingConfig().base_url,
                model=os.environ.get("EMBEDDING_MODEL", "").strip()
                or EmbeddingConfig().model,
                vector_size=int(
                    os.environ.get("EMBEDDING_VECTOR_SIZE", "")
                    or EmbeddingConfig().vector_size
                ),
                device=os.environ.get("EMBEDDING_DEVICE", "").strip()
                or EmbeddingConfig().device,
            ),
        )

    with path.open("rb") as f:
        raw = tomllib.load(f)
    cfg = RagConfig.model_validate(raw)
    # Env overrides for local docker / secrets.
    url = os.environ.get("QDRANT_URL", "").strip()
    if url:
        cfg = cfg.model_copy(
            update={"qdrant": cfg.qdrant.model_copy(update={"url": url})}
        )
    emb_provider = _embedding_provider_from_env()
    emb_url = os.environ.get("EMBEDDING_BASE_URL", "").strip()
    emb_model = os.environ.get("EMBEDDING_MODEL", "").strip()
    emb_size = os.environ.get("EMBEDDING_VECTOR_SIZE", "").strip()
    emb_device = os.environ.get("EMBEDDING_DEVICE", "").strip()
    emb_updates: dict[str, object] = {}
    if emb_provider:
        emb_updates["provider"] = emb_provider
    if emb_url:
        emb_updates["base_url"] = emb_url
    if emb_model:
        emb_updates["model"] = emb_model
    if emb_size:
        emb_updates["vector_size"] = int(emb_size)
    if emb_device:
        emb_updates["device"] = emb_device
    if emb_updates:
        cfg = cfg.model_copy(
            update={"embedding": cfg.embedding.model_copy(update=emb_updates)}
        )
    return cfg

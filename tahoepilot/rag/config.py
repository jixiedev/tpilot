"""RAG runtime settings (Qdrant + embeddings)."""

from __future__ import annotations

import os
from functools import lru_cache

from pydantic import BaseModel, ConfigDict, Field


class QdrantConfig(BaseModel):
    url: str = "http://localhost:6333"
    api_key: str = ""
    api_key_env: str | None = "QDRANT_API_KEY"
    timeout_seconds: float = 30.0


class EmbeddingConfig(BaseModel):
    """Local BGE-M3 (FlagEmbedding) dense + sparse embeddings."""

    model_config = ConfigDict(extra="ignore")

    model: str = "BAAI/bge-m3"
    vector_size: int = 1024
    device: str = ""
    # Token cap for local BGE-M3 encode (avoids multi‑GiB buffers).
    max_seq_length: int = 512
    max_chars: int = 2000
    batch_size: int = 8


class RerankConfig(BaseModel):
    """Cross-encoder rerank applied after hybrid retrieval. Empty model skips rerank."""

    model: str = "BAAI/bge-reranker-v2-m3"
    prefetch_limit: int = 50


class LocalModelsConfig(BaseModel):
    """Where embedding/rerank weights are cached (``python -m tahoepilot.rag models``)."""

    dir: str = "~/.cache/tahoepilot/models"
    # Hugging Face endpoint (e.g. a mirror); empty = huggingface.co, then the mirror on failure.
    hf_endpoint: str = ""


class TikaConfig(BaseModel):
    """Apache Tika server used to extract text from non-markdown documents."""

    endpoint: str = "http://localhost:9998"


class RagConfig(BaseModel):
    qdrant: QdrantConfig = Field(default_factory=QdrantConfig)
    local_models: LocalModelsConfig = Field(default_factory=LocalModelsConfig)
    tika: TikaConfig = Field(default_factory=TikaConfig)
    embedding: EmbeddingConfig = Field(default_factory=EmbeddingConfig)
    rerank: RerankConfig = Field(default_factory=RerankConfig)


def _env_or(value: str, env_name: str | None) -> str:
    if env_name:
        env_value = os.environ.get(env_name, "").strip()
        if env_value:
            return env_value
    return value.strip()


def resolve_qdrant_api_key(cfg: QdrantConfig | None = None) -> str | None:
    qdrant = cfg or get_rag_config().qdrant
    key = _env_or(qdrant.api_key, qdrant.api_key_env)
    return key or None


@lru_cache(maxsize=1)
def get_rag_config() -> RagConfig:
    """Load ``<config dir>/rag.toml``; defaults when the file is missing.

    The file is the only source: only the Qdrant API key may come from the
    environment (``[qdrant].api_key_env``).
    """
    import tomllib

    from tahoepilot.settings.paths import config_file

    path = config_file("rag.toml")
    if not path.is_file():
        return RagConfig()
    with path.open("rb") as f:
        return RagConfig.model_validate(tomllib.load(f))

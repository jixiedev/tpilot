"""RAG helpers: embeddings, Qdrant store, document graph, and ingest.

The names below load on first use, so ``tahoepilot.rag.config`` and
``tahoepilot.rag.local_models`` import without the ``rag`` extra (qdrant-client,
FlagEmbedding, torch). The Docker entrypoint relies on that to check the models.
"""

from __future__ import annotations

from importlib import import_module
from typing import Any

_EXPORTS = {
    "ensure_collection": "tahoepilot.rag.qdrant",
    "get_client": "tahoepilot.rag.qdrant",
    "search": "tahoepilot.rag.qdrant",
    "upsert_points": "tahoepilot.rag.qdrant",
    "get_embedding": "tahoepilot.rag.embeddings",
    "get_embeddings": "tahoepilot.rag.embeddings",
}

__all__ = sorted(_EXPORTS)


def __getattr__(name: str) -> Any:
    module = _EXPORTS.get(name)
    if module is None:
        raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
    value = getattr(import_module(module), name)
    globals()[name] = value
    return value

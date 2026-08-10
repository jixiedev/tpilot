"""Compatibility facade for early RAG stubs.

Prefer ``rag.store``, ``rag.embeddings``, and ``rag.jira_ingest`` in new code.
"""

from __future__ import annotations

from typing import Any

from rag.embeddings import get_embedding, truncate_text as safe_text
from rag.google_drive_ingest import upload_google_drive
from rag.jira_ingest import upload_jira_csv
from rag.store import get_client, search


def __getattr__(name: str) -> Any:
    if name == "client":
        return get_client()
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


__all__ = [
    "client",
    "get_embedding",
    "safe_text",
    "search",
    "upload_google_drive",
    "upload_jira_csv",
]

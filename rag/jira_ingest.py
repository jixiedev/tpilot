"""Ingest Jira CSV exports into Qdrant."""

from __future__ import annotations

from rag.nrag.jira import JiraCsvReader, JiraDocument, row_to_document
from rag.nrag.pipeline import upsert_documents
from rag.nrag.split import IdentitySplitStrategy

__all__ = [
    "JiraDocument",
    "row_to_document",
    "upload_jira_csv",
]


def upload_jira_csv(
    csv_path: str,
    collection_name: str,
    *,
    start_line: int = 0,
    batch_size: int | None = None,
) -> int:
    """Embed Jira CSV rows and upsert into ``collection_name``. Returns upserted count."""
    reader = JiraCsvReader(csv_path, start_line=start_line)
    docs = list(reader)
    print(
        f"Loaded {reader.row_count} rows; {len(docs)} documents to embed "
        f"into {collection_name!r}"
    )
    return upsert_documents(
        collection_name,
        docs,
        strategy=IdentitySplitStrategy(),
        batch_size=batch_size,
    )

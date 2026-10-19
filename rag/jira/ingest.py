"""Upload Jira CSV documents into Qdrant."""

from __future__ import annotations

from pathlib import Path

from rag.ingest import length_strategy_for_embeddings, upsert_documents
from rag.jira.document import JiraCsvReader


def list_jira_paths(path: str | Path) -> list[Path]:
    """Return Jira CSV files: one file, or every ``*.csv`` under a directory."""
    root = Path(path).expanduser().resolve()
    if root.is_file():
        return [root]
    if not root.is_dir():
        raise FileNotFoundError(f"Jira ingest path not found: {root}")
    return sorted(p for p in root.rglob("*.csv") if p.is_file())


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
        strategy=length_strategy_for_embeddings(),
        batch_size=batch_size,
    )

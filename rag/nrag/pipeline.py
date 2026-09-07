"""Embed chunks and upsert them into Qdrant."""

from __future__ import annotations

from collections.abc import Iterable, Sequence

from qdrant_client.http import models as qmodels

from rag.config import EmbeddingConfig, get_rag_config
from rag.embeddings import get_embeddings
from rag.nrag.data import Chunk, Document
from rag.nrag.split import LengthSplitStrategy, SplitStrategy
from rag.store import ensure_collection, upsert_points


def iter_document_chunks(
    documents: Iterable[Document],
    strategy: SplitStrategy | None = None,
) -> Iterable[Chunk]:
    splitter = strategy or LengthSplitStrategy()
    for doc in documents:
        yield from splitter.iter_chunks(doc)


def upsert_chunks(
    collection_name: str,
    chunks: Iterable[Chunk],
    *,
    batch_size: int | None = None,
    embedding_config: EmbeddingConfig | None = None,
) -> int:
    """Embed ``chunks`` in batches and upsert into ``collection_name``.

    Empty embed text is skipped. A failed embedding or upsert batch is logged
    and skipped so the rest of the job can continue.
    """
    cfg = embedding_config or get_rag_config().embedding
    size = batch_size or cfg.batch_size
    ensure_collection(collection_name)

    prepared = [c for c in chunks if (c.embed_text() or "").strip()]
    total = len(prepared)
    if not total:
        print(f"No documents to embed; nothing uploaded to {collection_name!r}.")
        return 0

    uploaded = 0
    for offset in range(0, total, size):
        batch = prepared[offset : offset + size]
        try:
            vectors = get_embeddings([c.embed_text() for c in batch], config=cfg)
        except Exception as exc:  # noqa: BLE001 — continue remaining batches
            print(f"Embedding batch at offset {offset} failed: {exc}")
            continue
        points = [
            qmodels.PointStruct(id=chunk.point_id(), vector=vector, payload=chunk.payload())
            for chunk, vector in zip(batch, vectors, strict=True)
        ]
        try:
            upsert_points(collection_name, points)
            uploaded += len(points)
            print(f"Upserted {uploaded}/{total}")
        except Exception as exc:  # noqa: BLE001
            print(f"Upsert failed at offset {offset}: {exc}")
    print(f"Upload complete: {uploaded} points in {collection_name!r}")
    return uploaded


def upsert_documents(
    collection_name: str,
    documents: Iterable[Document],
    *,
    strategy: SplitStrategy | None = None,
    batch_size: int | None = None,
    embedding_config: EmbeddingConfig | None = None,
) -> int:
    """Split ``documents`` then embed and upsert the resulting chunks."""
    if isinstance(documents, Sequence) and not documents:
        print(f"No documents to embed; nothing uploaded to {collection_name!r}.")
        return 0
    chunks = iter_document_chunks(documents, strategy=strategy)
    return upsert_chunks(
        collection_name,
        chunks,
        batch_size=batch_size,
        embedding_config=embedding_config,
    )

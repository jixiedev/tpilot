"""Document / paragraph / chunk graph and ingest pipeline."""

from rag.nrag.data import Chunk, Document, Paragraph, TextParagraph, link_sequence
from rag.nrag.ids import stable_point_id
from rag.nrag.loader import Reader
from rag.nrag.pipeline import iter_document_chunks, upsert_chunks, upsert_documents
from rag.nrag.split import (
    IdentitySplitStrategy,
    LengthSplitStrategy,
    SplitStrategy,
    split_text,
)

__all__ = [
    "Chunk",
    "Document",
    "IdentitySplitStrategy",
    "LengthSplitStrategy",
    "Paragraph",
    "Reader",
    "SplitStrategy",
    "TextParagraph",
    "iter_document_chunks",
    "link_sequence",
    "split_text",
    "stable_point_id",
    "upsert_chunks",
    "upsert_documents",
]

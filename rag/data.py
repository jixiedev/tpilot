"""Document / paragraph / chunk types. Prefer ``rag.nrag`` for new code."""

from rag.nrag.data import Chunk, Document, Paragraph, TextParagraph, link_sequence

__all__ = [
    "Chunk",
    "Document",
    "Paragraph",
    "TextParagraph",
    "link_sequence",
]

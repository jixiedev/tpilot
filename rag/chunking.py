"""Chunk documents into paragraphs, then paragraphs into embedding units."""

from __future__ import annotations

import re
from abc import ABC, abstractmethod
from typing import Iterator

from rag.document import Chunk, Document, Paragraph, link_sequence

DEFAULT_CHUNK_CHARS = 4000
DEFAULT_CHUNK_OVERLAP = 200


def normalize_whitespace(text: str) -> str:
    text = text.replace("\x00", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def split_text(
    text: str,
    *,
    chunk_chars: int = DEFAULT_CHUNK_CHARS,
    overlap: int = DEFAULT_CHUNK_OVERLAP,
) -> list[str]:
    """Split long text into overlapping character chunks, preferring paragraph breaks."""
    cleaned = normalize_whitespace(text)
    if not cleaned:
        return []
    if len(cleaned) <= chunk_chars:
        return [cleaned]

    overlap = max(0, min(overlap, chunk_chars // 2))
    chunks: list[str] = []
    start = 0
    length = len(cleaned)
    while start < length:
        end = min(start + chunk_chars, length)
        if end < length:
            window = cleaned[start:end]
            break_at = max(window.rfind("\n\n"), window.rfind("\n"), window.rfind(". "))
            if break_at >= chunk_chars // 2:
                if window[break_at : break_at + 2] == "\n\n":
                    end = start + break_at + 2
                elif window[break_at : break_at + 2] == ". ":
                    end = start + break_at + 2
                else:
                    end = start + break_at + 1
        piece = cleaned[start:end].strip()
        if piece:
            chunks.append(piece)
        if end >= length:
            break
        start = max(end - overlap, start + 1)
    return chunks


class SplitStrategy(ABC):
    def split_document(self, doc: Document) -> list[Paragraph]:
        paras = doc.split_paragraphs()
        link_sequence(paras)
        return paras

    @abstractmethod
    def split_paragraph(self, para: Paragraph) -> list[Chunk]:
        pass

    def iter_chunks(self, doc: Document) -> Iterator[Chunk]:
        for para in self.split_document(doc):
            chunks = self.split_paragraph(para)
            link_sequence(chunks)
            para.chunks = list(chunks)
            yield from chunks


class LengthSplitStrategy(SplitStrategy):
    """Length-based chunker with overlap; paragraph boundaries come from the document."""

    def __init__(
        self,
        chunk_chars: int = DEFAULT_CHUNK_CHARS,
        overlap: int = DEFAULT_CHUNK_OVERLAP,
    ) -> None:
        self.chunk_chars = chunk_chars
        self.overlap = overlap

    def split_paragraph(self, para: Paragraph) -> list[Chunk]:
        pieces = split_text(
            para.text,
            chunk_chars=self.chunk_chars,
            overlap=self.overlap,
        )
        if not pieces:
            return []
        chunks: list[Chunk] = []
        for seq, piece in enumerate(pieces):
            chunk = Chunk(ref_para=para, chunk_seq=seq, chunk_content=piece)
            para.add_chunk(chunk)
            chunks.append(chunk)
        return chunks


class IdentitySplitStrategy(SplitStrategy):
    """One chunk per paragraph — used when the document already chose the unit."""

    def split_paragraph(self, para: Paragraph) -> list[Chunk]:
        text = para.text
        if not text.strip():
            return []
        chunk = Chunk(ref_para=para, chunk_seq=0, chunk_content=text)
        para.add_chunk(chunk)
        return [chunk]

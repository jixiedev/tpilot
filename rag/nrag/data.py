"""Document → paragraph → chunk graph used by ingest and split strategies.

Paragraphs are semantic sections (a whole Jira ticket, a markdown heading
block, a dbt columns/metrics group). Chunks are the embedding units written
to Qdrant. Adjacent nodes are linked so payload can carry prev/next seq.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Sequence, TypeVar

from rag.nrag.ids import stable_point_id

TLinked = TypeVar("TLinked", bound="Linked")


def link_sequence(nodes: Sequence[TLinked]) -> list[TLinked]:
    """Wire ``prev`` / ``next`` on an ordered sequence; returns the same nodes."""
    for i, node in enumerate(nodes):
        node.prev = nodes[i - 1] if i else None
        node.next = nodes[i + 1] if i + 1 < len(nodes) else None
    return list(nodes)


@dataclass(kw_only=True)
class Linked:
    prev: Linked | None = field(default=None, repr=False, compare=False)
    next: Linked | None = field(default=None, repr=False, compare=False)


@dataclass(kw_only=True)
class Document:
    doc_id: str
    url: str
    title: str
    content: str
    paragraphs: list[Paragraph] = field(default_factory=list, repr=False, compare=False)

    @property
    def primary_key(self) -> str:
        return self.doc_id

    @property
    def size(self) -> int:
        return len(self.content)

    def metadata(self) -> dict[str, Any]:
        return {}

    def split_paragraphs(self) -> list[Paragraph]:
        """Default: the whole document is a single paragraph.

        Subclasses override this for heading-aware or domain-specific sections.
        Repeated calls reuse ``self.paragraphs`` once filled.
        """
        if self.paragraphs:
            return self.paragraphs
        para = TextParagraph(
            ref_doc=self,
            para_seq=0,
            para_title=self.title,
            content=self.content,
        )
        self.paragraphs = [para]
        return self.paragraphs

    def chunk_payload(self, chunk: Chunk) -> dict[str, Any]:
        """Source-specific Qdrant payload fields merged onto the chunk."""
        return self.metadata()

    def chunk_embed_text(self, chunk: Chunk) -> str:
        return chunk.content

    def chunk_point_id(self, chunk: Chunk) -> int | str:
        return stable_point_id(chunk.primary_key)


@dataclass(kw_only=True)
class Paragraph(Linked):
    ref_doc: Document
    para_seq: int
    para_title: str
    chunks: list[Chunk] = field(default_factory=list, repr=False, compare=False)

    @property
    def primary_key(self) -> str:
        return f"{self.ref_doc.primary_key}#{self.para_seq}"

    @property
    def size(self) -> int:
        return len(self.text)

    @property
    def text(self) -> str:
        raise NotImplementedError

    def add_chunk(self, chunk: Chunk) -> None:
        self.chunks.append(chunk)


@dataclass(kw_only=True)
class TextParagraph(Paragraph):
    content: str = ""

    @property
    def text(self) -> str:
        return self.content


@dataclass(kw_only=True)
class Chunk(Linked):
    ref_para: Paragraph
    chunk_seq: int
    chunk_content: str

    @property
    def primary_key(self) -> str:
        return f"{self.ref_para.primary_key}#{self.chunk_seq}"

    @property
    def content(self) -> str:
        return self.chunk_content

    @property
    def ref_doc(self) -> Document:
        return self.ref_para.ref_doc

    @property
    def is_last_chunk(self) -> bool:
        return self.next is None

    @property
    def is_first_chunk(self) -> bool:
        return self.prev is None

    @property
    def next_chunk_seq(self) -> int:
        if self.is_last_chunk:
            return -2
        nxt = self.next
        return nxt.chunk_seq if isinstance(nxt, Chunk) else self.chunk_seq + 1

    @property
    def prev_chunk_seq(self) -> int:
        if self.is_first_chunk:
            return -1
        prv = self.prev
        return prv.chunk_seq if isinstance(prv, Chunk) else self.chunk_seq - 1

    @classmethod
    def is_valid_chunk_seq(cls, chunk_seq: int) -> bool:
        return chunk_seq >= 0

    def payload(self) -> dict[str, Any]:
        raw: dict[str, Any] = {
            "doc_url": self.ref_doc.url,
            "doc_title": self.ref_doc.title,
            "para_title": self.ref_para.para_title,
            "chunk_data": self.chunk_content,
            "chunk_seq": self.chunk_seq,
            "prev_chunk_seq": self.prev_chunk_seq,
            "next_chunk_seq": self.next_chunk_seq,
        }
        raw.update(self.ref_doc.chunk_payload(self))
        return raw

    def embed_text(self) -> str:
        return self.ref_doc.chunk_embed_text(self)

    def point_id(self) -> int | str:
        return self.ref_doc.chunk_point_id(self)

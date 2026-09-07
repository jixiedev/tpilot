from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, TypeVar

T = TypeVar("T")


@dataclass
class LinkedLike:
    _next: LinkedLike | None
    _prev: LinkedLike | None

    @property
    def next(self):
        return self._next

    @property
    def prev(self):
        return self._prev

    @next.setter
    def next(self, n: LinkedLike):
        self._next = n

    @prev.setter
    def prev(self, p: LinkedLike):
        self._prev = p


@dataclass
class Document(ABC):
    doc_id: str
    url: str
    title: str
    doc_content: str
    # set after split_paras
    paras: dict[str, Paragraph]
    para_chain: Paragraph

    @abstractmethod
    def split_paras(self) -> list[Paragraph]:
        """
        don't forget to set paras and para_chain in the object
        """
        pass

    @abstractmethod
    def metadata(self) -> dict[str, Any]:
        pass

    @property
    def get_primary_key(self):
        return self.doc_id

    @property
    def get_doc_size(self):
        return len(self.doc_content)


@dataclass
class Paragraph(LinkedLike):
    ref_doc: Document
    para_seq: int
    para_title: str
    # para content
    para_start_in_doc: int
    para_end_in_doc: int
    # set after splitting using split strategy
    chunks: dict[str, Chunk]
    chunk_chain_head: Chunk | None
    chunk_chain_tail: Chunk | None

    def add_chunk(self, chunk: Chunk):
        if self.chunk_chain_head is None:
            self.chunk_chain_head = chunk
            self.chunk_chain_tail = chunk

        else:
            self.chunk_chain_tail.next = chunk
            chunk.prev = self.chunk_chain_tail
            self.chunk_chain_tail = chunk
        self.chunks[chunk.get_primary_key] = chunk

    @classmethod
    def single_graph(cls, doc: Document) -> Paragraph:
        para = Paragraph(
            ref_doc=doc,
            para_seq=0,
            para_title="",
            para_start_in_doc=0,
            para_end_in_doc=len(doc.doc_content),
            chunks=dict(),
            chunk_chain_head=None,
            chunk_chain_tail=None,
            _next=None,
            _prev=None
        )
        return para

    @property
    def get_doc_id(self):
        return self.ref_doc.doc_id

    @property
    def get_primary_key(self):
        return f"{self.get_doc_id}#{str(self.para_seq)}"

    @property
    def get_para_size(self):
        return self.para_end_in_doc - self.para_start_in_doc

    @property
    def get_para_content(self):
        return self.ref_doc.doc_content[self.para_start_in_doc:self.para_end_in_doc]


@dataclass
class Chunk(ABC, LinkedLike):
    """
    point_id -> doc_id#para_id#chunk_seq
    payload ->
    """
    ref_para: Paragraph
    chunk_seq: int
    chunk_start_in_doc: int
    chunk_end_in_doc: int

    @property
    def get_primary_key(self) -> str:
        return f"{self.get_para.get_primary_key}#{self.chunk_seq}"

    @abstractmethod
    def get_extra_payload(self) -> dict[str, Any]:
        pass

    def get_payload(self) -> dict[str, Any]:
        raw = {
            "doc_url": self.get_doc.url,
            "doc_title": self.get_doc.title,
            "para_title": self.get_para.para_title,
            "chunk_data": self.ref_para.ref_doc.doc_content[self.chunk_start_in_doc:self.chunk_end_in_doc],
        }
        extra = self.get_extra_payload()
        raw.update(extra)
        return raw

    @abstractmethod
    def get_embedded_text(self) -> str:
        """
        will be calculated as vectors
        """
        pass

    @property
    def get_para(self):
        return self.ref_para

    @property
    def get_doc(self):
        return self.ref_para.ref_doc

    @property
    def is_last_chunk(self):
        return self.next is None

    @property
    def is_first_chunk(self):
        return self.prev is None

    @property
    def next_chunk_seq(self):
        if self.is_last_chunk:
            return -2
        else:
            return self.chunk_seq + 1

    @property
    def prev_chunk_seq(self):
        if self.is_first_chunk:
            return -1
        else:
            return self.chunk_seq - 1

    @classmethod
    def is_valid_chunk_seq(cls, chunk_seq):
        return chunk_seq >= 0

    @classmethod
    def single_chunk(cls, para: Paragraph):
        chunk = Chunk(
            ref_para=para,
            chunk_seq=0,
            chunk_start_in_doc=para.para_start_in_doc,
            chunk_end_in_doc=para.para_end_in_doc,
            _next=None,
            _prev=None
        )
        return chunk


class SimpleChunk(Chunk):
    def get_extra_payload(self) -> dict[str, Any]:
        return dict()

    def get_embedded_text(self) -> str:
        return self.get_doc.doc_content[self.chunk_start_in_doc:self.chunk_end_in_doc]

class NeighborSimpleChunk(SimpleChunk):

    def get_embedded_text(self) -> str:
        """
        [start, end) -> [start, min(start+(end-start)/2, end))
        [start, end) -> [max(start,end-(end-start)/2), end)
        """
        def select(start, end, ratio, index):
            """
            split intervals into {ratio} parts, choose the index-th one.
            """
            l = (end - start) / ratio
            if index < 0:
                index = ratio + index
            n_start = start + index * l
            n_end = n_start + l
            return n_start, n_end
        if self.prev is None and self.next is None:
            return super().get_embedded_text()
        elif self.prev is None:
            cur_start, _ = select(self.chunk_start_in_doc, self.chunk_end_in_doc, 2, -1)
            _, next_end = select(self.next.chunk_start_in_doc, self.next.chunk_end_in_doc, 2, 0)
            return self.get_doc.doc_content[cur_start:next_end]
        elif self.next is None:
            _, cur_end = select(self.chunk_start_in_doc, self.chunk_end_in_doc, 2, 0)
            prev_start, _ = select(self.prev.chunk_start_in_doc, self.prev.chunk_end_in_doc, 2, -1)
            return self.get_doc.doc_content[prev_start:cur_end]
        else:
            prev_start, prev_end = select(self.prev.chunk_start_in_doc, self.prev.chunk_end_in_doc, 3, -1)
            # todo we prefer the first part
            cur_start, cur_end = select(self.chunk_start_in_doc, self.chunk_end_in_doc, 3, 0)
            next_start, next_end = select(self.next.chunk_start_in_doc, self.next.chunk_end_in_doc, 3, 0)
            return self.get_doc.doc_content[prev_start:cur_end] + self.get_doc.doc_content[next_start:next_end]



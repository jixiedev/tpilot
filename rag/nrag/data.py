from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any


@dataclass
class Document(ABC):
    doc_id: str
    url: str
    title: str
    doc_content: str

    @abstractmethod
    def metadata(self) -> dict[str, Any]:
        pass

    def get_primary_key(self):
        return self.doc_id


@dataclass
class Paragraph:
    ref_doc: Document
    para_id: str
    para_title: str
    total_chunks: int
    para_start_in_doc: int
    para_end_in_doc: int

    @property
    def get_doc_id(self):
        return self.ref_doc.doc_id

    def get_primary_key(self):
        return f"{self.get_doc_id}#{self.para_id}"

@dataclass
class Chunk(ABC):
    """
    point_id -> doc_id#para_id#chunk_seq
    payload ->
    """
    ref_para: Paragraph
    chunk_seq: int
    data: str
    chunk_num: int
    chunk_start_in_doc: int
    chunk_end_in_doc: int



    def primary_key(self) -> str:
        return f"{self.get_para.get_primary_key()}#{self.chunk_seq}"

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
        pass

    @property
    def get_para(self):
        return self.ref_para

    @property
    def get_doc(self):
        return self.ref_para.ref_doc

    @property
    def is_last_chunk(self):
        return self.chunk_seq == self.chunk_num - 1

    @property
    def is_first_chunk(self):
        return self.chunk_seq == 0

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


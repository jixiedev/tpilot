from dataclasses import dataclass


@dataclass
class Document:
    doc_id: str
    url: str
    title: str

@dataclass
class Paragraph:
    ref_doc_id: str
    para_id: str
    para_title: str
    total_chunks: int

@dataclass
class Chunk:
    ref_para_id: str
    chunk_seq: int
    data: bytes
    chunk_num: int

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
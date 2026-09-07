from abc import ABC, abstractmethod
from typing import TypeVar

from rag.nrag.data import Document, Paragraph, Chunk, SimpleChunk, NeighborSimpleChunk


class SplitStrategy(ABC):
    @abstractmethod
    def accept_doc(self, doc: Document) -> list[Paragraph]:
        pass

    @abstractmethod
    def accept_para(self, para: Paragraph) -> list[Chunk]:
        pass


CK = TypeVar("CK", bound=Chunk)


class SimpleSplitStrategy(SplitStrategy):
    """
    A simple splitter that split text based on length
    """

    def __init__(self, stride, document_threshold=-1, para_threshold=-1, chunk_threshold=2000):
        """
        if document_size < document_threshold => skip splitting, otherwise split paras
        if para_size < para_threshold => skip splitting chunks, otherwise split chunks with less than chunk_threshold chars
        """
        self.stride = stride
        self.document_threshold = document_threshold
        self.para_threshold = para_threshold
        self.chunk_threshold = chunk_threshold

    def accept_doc(self, doc: Document) -> list[Paragraph]:
        if doc.get_doc_size <= self.document_threshold:
            return [Paragraph.single_graph(doc)]
        else:
            paras = doc.split_paras()
            return paras

    def accept_para(self, para: Paragraph) -> list[CK]:
        if para.get_para_size <= self.para_threshold:
            chunk = Chunk.single_chunk(para)
            para.add_chunk(chunk)
            return [chunk]
        else:
            chunks = []
            chunk_seq = 0
            last_chunk = None
            for i in range(para.para_start_in_doc, para.para_end_in_doc - self.chunk_threshold, self.stride):
                chunk = SimpleChunk(
                    ref_para=para,
                    chunk_seq=chunk_seq,
                    chunk_start_in_doc=i,
                    chunk_end_in_doc=min(i+self.chunk_threshold, para.para_end_in_doc),
                    _next=None,
                    _prev=last_chunk
                )
                para.add_chunk(chunk)
                last_chunk = chunk
                chunks.append(chunk)
            return chunks


class NeighborSimpleSplitStrategy(SimpleSplitStrategy):
    def accept_para(self, para: Paragraph) -> list[CK]:
        if para.get_para_size <= self.para_threshold:
            chunk = Chunk.single_chunk(para)
            para.add_chunk(chunk)
            return [chunk]
        else:
            chunks = []
            chunk_seq = 0
            last_chunk = None
            for i in range(para.para_start_in_doc, para.para_end_in_doc - self.chunk_threshold, self.stride):
                chunk = NeighborSimpleChunk(
                    ref_para=para,
                    chunk_seq=chunk_seq,
                    chunk_start_in_doc=i,
                    chunk_end_in_doc=min(i+self.chunk_threshold, para.para_end_in_doc),
                    _next=None,
                    _prev=last_chunk
                )
                para.add_chunk(chunk)
                last_chunk = chunk
                chunks.append(chunk)
            return chunks



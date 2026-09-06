from abc import ABC, abstractmethod

from rag.nrag.data import Document, Paragraph, Chunk


class SplitStrategy(ABC):
    @abstractmethod
    def accept_doc(self, doc: Document) -> list[Paragraph]:
        pass

    @abstractmethod
    def accept_para(self, para: Paragraph) -> list[Chunk]:
        pass
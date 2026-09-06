from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Iterator

T = TypeVar('T')

class Reader(ABC, Generic[T]):
    @abstractmethod
    def open(self):
        pass

    @abstractmethod
    def __iter__(self) -> Iterator[T]:
        pass

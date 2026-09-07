"""Source readers that yield ``Document`` instances for ingest."""

from __future__ import annotations

from abc import ABC
from typing import Generic, Iterator, TypeVar

T = TypeVar("T")


class Reader(ABC, Generic[T]):
    def __iter__(self) -> Iterator[T]:
        raise NotImplementedError

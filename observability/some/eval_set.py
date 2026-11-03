"""Eval-set slices: functional correctness, performance budget, harness smoke."""

from __future__ import annotations

from collections.abc import Mapping
from typing import ClassVar

from observability.some.scoring import CaseScore, DimensionScore


class EvalSet:
    """One eval slice. Directory name and scored dimensions both come from here."""

    name: ClassVar[str] = ""
    aliases: ClassVar[tuple[str, ...]] = ()
    _families: ClassVar[dict[str, tuple[str, ...]]] = {}

    def compose(self, family: str, produced: Mapping[str, DimensionScore]) -> CaseScore:
        dimensions: list[DimensionScore] = []
        for name in self.dimension_names(family):
            item = produced.get(name)
            if item is None or item.details.get("skipped"):
                continue
            dimensions.append(item)
        return CaseScore(dimensions=dimensions)

    def dimension_names(self, family: str) -> tuple[str, ...]:
        try:
            return self._families[family]
        except KeyError as exc:
            raise ValueError(
                f"{self.name or type(self).__name__} has no dimensions for family {family!r}"
            ) from exc

    def __str__(self) -> str:
        return self.name

    def __repr__(self) -> str:
        return f"{type(self).__name__}()"


class FunctionalEvalSet(EvalSet):
    """Did the agent take the right actions and reach the right outcome."""

    name = "functional"
    aliases = ("功能", "function")
    _families = {
        "react": ("tools", "answer"),
        "databot": ("prepare_tools", "draft_tools", "cards", "answer"),
        "intent": ("status", "intentions", "routes"),
    }


class PerformanceEvalSet(EvalSet):
    """Did the agent stay within the ReAct round budget."""

    name = "performance"
    aliases = ("性能",)
    _families = {
        "react": ("rounds",),
        "databot": ("rounds",),
        "intent": ("status",),
    }


class HarnessEvalSet(EvalSet):
    """Cheap smoke that the eval loop, JSON contract, and routing path work."""

    name = "harness"
    aliases = ()
    _families = {
        "react": ("tools", "rounds", "answer"),
        "databot": ("prepare_tools", "rounds", "answer"),
        "intent": ("status", "intentions", "routes"),
    }


class EvalSetCatalog:
    def __init__(self, sets: list[EvalSet] | None = None) -> None:
        self._sets = list(
            sets
            or (
                FunctionalEvalSet(),
                PerformanceEvalSet(),
                HarnessEvalSet(),
            )
        )
        self._by_name: dict[str, EvalSet] = {}
        for item in self._sets:
            self._by_name[item.name] = item
            for alias in item.aliases:
                self._by_name[alias] = item

    def resolve(self, name: str) -> EvalSet:
        key = str(name).strip().lower()
        try:
            return self._by_name[key]
        except KeyError as exc:
            expected = ", ".join(self.canonical_names())
            raise ValueError(
                f"unknown eval_set {name!r}; expected one of: {expected}"
            ) from exc

    def canonical_names(self) -> list[str]:
        return [item.name for item in self._sets]

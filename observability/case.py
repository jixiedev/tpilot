"""Eval cases: one ``EvalCase`` subclass per agent workload, and the fixture loader."""

from __future__ import annotations

import json
import uuid
from collections.abc import Iterable, Mapping
from dataclasses import dataclass, field, fields
from pathlib import Path
from typing import Any, ClassVar

CASES_DIR = Path(__file__).resolve().parent / "cases"


@dataclass
class ToolsSpec:
    """Tool constraints: ``required`` (ordered), ``allowed`` (whitelist), ``forbidden``."""

    required: list[str] = field(default_factory=list)
    allowed: list[str] = field(default_factory=list)
    forbidden: list[str] = field(default_factory=list)


@dataclass(kw_only=True)
class EvalCase:
    """One prompt plus the expectations for a single agent workload.

    Subclasses declare their scoring ``kind``, whether the runner should trace
    tool calls, and any extra ``agent.run`` kwargs.
    """

    name: str
    agent_name: str
    eval_set: str
    prompt: str

    kind: ClassVar[str] = ""
    traced: ClassVar[bool] = True
    run_kwargs: ClassVar[Mapping[str, Any]] = {}
    # Answer to every human-in-the-loop interrupt during the turn; None = no handler.
    gate_reply: ClassVar[str | None] = None
    user_id: ClassVar[str] = "case_bot"

    @property
    def id(self) -> str:
        return f"{self.eval_set}/{self.agent_name}/{self.name}"

    def session_id(self) -> str:
        return f"eval-{self.id.replace('/', '-')}-{uuid.uuid4().hex[:8]}"

    @classmethod
    def from_record(
        cls,
        raw: Mapping[str, Any],
        *,
        agent_name: str,
        eval_set: str,
    ) -> EvalCase:
        """Build a case from one JSON record; keys matching dataclass fields are copied."""
        accepted = {item.name for item in fields(cls)}
        values = {key: value for key, value in raw.items() if key in accepted}
        return cls(
            **values,
            agent_name=agent_name,
            eval_set=eval_set,
            prompt=raw["query"],
        )


@dataclass(kw_only=True)
class ToolPathEvalCase(EvalCase):
    """Base for workloads scored on the tools they call and the call budget."""

    tools: ToolsSpec = field(default_factory=ToolsSpec)
    max_tool_calls: int = 1

    @classmethod
    def from_record(cls, raw: Mapping[str, Any], **context: Any) -> EvalCase:
        raw = {**raw, "tools": ToolsSpec(**raw.get("tools", {}))}
        return super().from_record(raw, **context)


@dataclass(kw_only=True)
class ReactEvalCase(ToolPathEvalCase):
    """Single-loop ReAct specialists; the reply must carry these JSON fields."""

    expected_output: dict[str, Any] = field(default_factory=dict)

    kind: ClassVar[str] = "react"


@dataclass(kw_only=True)
class DatabotEvalCase(ToolPathEvalCase):
    """Staged Databot turn; the reply must name the ``database.table`` in ``expected_output``."""

    expected_output: str = ""
    draft_tools: ToolsSpec | None = None
    expected_table_cards: list[str] = field(default_factory=list)
    expected_sql: str = ""

    kind: ClassVar[str] = "databot"
    # Pass both human gates (cards, SQL) as preview-only: no query execution, no profile write.
    gate_reply: ClassVar[str | None] = "dryrun"

    @classmethod
    def from_record(cls, raw: Mapping[str, Any], **context: Any) -> EvalCase:
        if "draft_tools" in raw:
            raw = {**raw, "draft_tools": ToolsSpec(**raw["draft_tools"])}
        return super().from_record(raw, **context)


@dataclass(kw_only=True)
class IntentEvalCase(EvalCase):
    """Intent router: score status / intentions / routes without handing off."""

    expected_status: str
    expected_intentions: list[str] = field(default_factory=list)
    expected_routes: list[str] = field(default_factory=list)

    kind: ClassVar[str] = "intent"
    traced: ClassVar[bool] = False
    run_kwargs: ClassVar[Mapping[str, Any]] = {"handoff": False}


class CaseLoader:
    """Read ``{cases_dir}/{eval_set}/{agent}.json`` into typed cases."""

    # Agents that can be evaluated, and the case class each one's fixtures use.
    CASE_TYPES: ClassVar[dict[str, type[EvalCase]]] = {
        "databot": DatabotEvalCase,
        "knowledge": ReactEvalCase,
        "intent": IntentEvalCase,
    }

    def __init__(self, cases_dir: Path = CASES_DIR) -> None:
        self.cases_dir = Path(cases_dir)

    def eval_sets(self) -> list[str]:
        return sorted(path.name for path in self.cases_dir.iterdir() if path.is_dir())

    def load(self, agents: Iterable[str], eval_sets: Iterable[str]) -> list[EvalCase]:
        """Cases for each selected (eval_set, agent) file, in file order."""
        cases: list[EvalCase] = []
        for eval_set in eval_sets:
            for agent_name in agents:
                path = self.cases_dir / eval_set / f"{agent_name}.json"
                if path.exists():
                    cases.extend(self.load_file(path, agent_name, eval_set))
        return cases

    def load_file(self, path: Path, agent_name: str, eval_set: str) -> list[EvalCase]:
        payload = json.loads(path.read_text(encoding="utf-8"))
        case_type = self.CASE_TYPES[agent_name]
        return [
            case_type.from_record(raw, agent_name=agent_name, eval_set=eval_set)
            for raw in payload["cases"]
        ]

"""Eval-set models: case schema, loaders, and typed eval cases."""

from __future__ import annotations

import json
import uuid
from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, ClassVar

from agent.intent.orchestrator import intentions_from_state
from agent.turn import AgentTurnResult, extract_turn_output
from observability.evaluator import (
    AnswerMatcher,
    CaseScore,
    DimensionScore,
    ExactMatchScorer,
    OrderedSequenceScorer,
    RoundBudgetScorer,
    parse_expected_output,
)
from observability.trace import EvalReactListener, TracedAgentTurn

CASES_DIR = Path(__file__).resolve().parent / "cases"


@dataclass
class ToolsSpec:
    """Tool constraints from case JSON (``required`` / ``allowed`` / ``forbidden``)."""

    required: list[str] = field(default_factory=list)
    allowed: list[str] = field(default_factory=list)
    forbidden: list[str] = field(default_factory=list)

    @classmethod
    def empty(cls) -> ToolsSpec:
        return cls()

    @classmethod
    def from_raw(cls, raw: Any, *, label: str = "tools") -> ToolsSpec:
        if raw is None:
            return cls.empty()
        if isinstance(raw, list):
            names = [str(item).strip() for item in raw if str(item).strip()]
            return cls(required=names, allowed=[], forbidden=[])
        if not isinstance(raw, dict):
            raise ValueError(
                f"{label} must be an object with required/allowed/forbidden lists"
            )
        return cls(
            required=_string_list(raw.get("required"), field_name="required", label=label),
            allowed=_string_list(raw.get("allowed"), field_name="allowed", label=label),
            forbidden=_string_list(
                raw.get("forbidden"), field_name="forbidden", label=label
            ),
        )

    def as_dict(self) -> dict[str, list[str]]:
        return {
            "required": list(self.required),
            "allowed": list(self.allowed),
            "forbidden": list(self.forbidden),
        }

    def score(self, actual: list[str]) -> tuple[float, dict[str, Any]]:
        actual_names = [str(name) for name in actual]
        details: dict[str, Any] = {
            "required": list(self.required),
            "allowed": list(self.allowed),
            "forbidden": list(self.forbidden),
            "actual": actual_names,
        }

        forbidden_hits = [name for name in actual_names if name in set(self.forbidden)]
        if forbidden_hits:
            details["reason"] = "forbidden tool used"
            details["forbidden_hits"] = forbidden_hits
            return 0.0, details

        if not self.required and not self.allowed:
            details["reason"] = "no tools expected"
            return (1.0 if not actual_names else 0.0), details

        allowed_set = set(self.allowed)
        if allowed_set:
            disallowed = [name for name in actual_names if name not in allowed_set]
            if disallowed:
                details["reason"] = "disallowed tool used"
                details["disallowed"] = disallowed
                return 0.0, details

        if not self.required:
            details["reason"] = "allowed-only match"
            return 1.0, details

        if _is_subsequence(self.required, actual_names):
            details["reason"] = "ordered match"
            return 1.0, details

        expected_set = set(self.required)
        overlap = expected_set & set(actual_names)
        coverage = len(overlap) / len(expected_set)
        details["reason"] = "unordered partial"
        details["overlap"] = sorted(overlap)
        return 0.5 * coverage, details


def _string_list(raw: Any, *, field_name: str, label: str) -> list[str]:
    if raw is None:
        return []
    if not isinstance(raw, list):
        raise ValueError(f"{label}.{field_name} must be a list of strings")
    return [str(item).strip() for item in raw if str(item).strip()]


def _is_subsequence(expected: list[str], actual: list[str]) -> bool:
    if not expected:
        return True
    index = 0
    for name in actual:
        if name == expected[index]:
            index += 1
            if index == len(expected):
                return True
    return False


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
    """Did the agent stay within the ``max_tool_calls`` budget."""

    name = "performance"
    aliases = ("性能",)
    _families = {
        "react": ("max_tool_calls",),
        "databot": ("max_tool_calls",),
        "intent": ("status",),
    }


class HarnessEvalSet(EvalSet):
    """Cheap smoke that the eval loop, JSON contract, and routing path work."""

    name = "harness"
    aliases = ()
    _families = {
        "react": ("tools", "max_tool_calls", "answer"),
        "databot": ("prepare_tools", "max_tool_calls", "answer"),
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


@dataclass
class EvalResult:
    case: EvalCase
    score: CaseScore
    reply: str = ""
    cancelled: bool = False
    model_name: str = ""
    outcome: dict[str, Any] = field(default_factory=dict)


@dataclass
class CaseAggregate:
    """One case averaged across the models it was run on."""

    case: EvalCase
    model_results: list[EvalResult] = field(default_factory=list)

    @property
    def average(self) -> float:
        if not self.model_results:
            return 0.0
        total = 0.0
        for result in self.model_results:
            total += 0.0 if result.cancelled else result.score.total
        return total / len(self.model_results)

    def render(self) -> str:
        lines = [self.case.render(result) for result in self.model_results]
        n = len(self.model_results)
        model_names = [result.model_name for result in self.model_results if result.model_name]
        if not model_names:
            model_names = list(self.case.models)
        lines.append(
            f"  case avg: {self.average:.3f} "
            f"({n} model{'s' if n != 1 else ''}: {', '.join(model_names)})"
        )
        return "\n".join(lines)


@dataclass(kw_only=True)
class EvalCase:
    agent_name: str
    eval_set: EvalSet | str
    name: str
    prompt: str
    expected_output: dict[str, Any] | str = field(default_factory=dict)
    models: list[str] = field(default_factory=list)

    supported_agents: ClassVar[tuple[str, ...]] = ()
    family: ClassVar[str] = ""
    user_id: ClassVar[str] = "case_bot"

    @property
    def expected_answer(self) -> dict[str, Any] | str:
        return self.expected_output

    def __post_init__(self) -> None:
        self._answer_matcher = AnswerMatcher()
        if isinstance(self.eval_set, str):
            self.eval_set = EvalSetCatalog().resolve(self.eval_set)

    def allows_model(self, model_name: str) -> bool:
        return not self.models or model_name in self.models

    def resolved_eval_set(self) -> EvalSet:
        if isinstance(self.eval_set, str):
            self.eval_set = EvalSetCatalog().resolve(self.eval_set)
        return self.eval_set

    def session_id(self) -> str:
        return (
            f"eval-{self.agent_name}-{self.resolved_eval_set().name}-{self.name}-"
            f"{uuid.uuid4().hex[:8]}"
        )

    async def run(self, agent: Any, *, model_name: str = "") -> EvalResult:
        raise NotImplementedError

    def render(self, result: EvalResult) -> str:
        status = "CANCELLED" if result.cancelled else f"{result.score.total:.2f}"
        model_bit = f" model={result.model_name}" if result.model_name else ""
        line = (
            f"[{status}] {self.resolved_eval_set().name}/{self.agent_name}/{self.name}"
            f"{model_bit} ({result.score.summary()})"
        )
        if result.cancelled:
            return line
        extra = self.render_details(result)
        if not extra:
            return line
        return "\n".join([line, extra])

    def render_details(self, result: EvalResult) -> str:
        return ""

    def _answer_dimension(self, reply: str) -> DimensionScore:
        return self._answer_matcher.score(reply, self.expected_output)

    def _answer_detail_lines(self, answer: DimensionScore) -> list[str]:
        lines: list[str] = []
        details = answer.details
        missing = details.get("missing") or []
        if missing:
            lines.append(f"  expected_output missing keys: {missing}")
        mismatched = details.get("mismatched") or []
        if mismatched:
            lines.append(f"  expected_output mismatched keys: {mismatched}")
        if details.get("skipped"):
            lines.append("  expected_output: skipped")
        parse_error = details.get("parse_error")
        if parse_error:
            lines.append(f"  expected_output parse error: {parse_error}")
        return lines

    def _format_sequence_details(self, dimension: DimensionScore | None) -> str | None:
        if dimension is None or not dimension.details.get("reason"):
            return None
        details = dimension.details
        return (
            f"  {dimension.name}: expected={details.get('expected')} "
            f"actual={details.get('actual')} ({details['reason']})"
        )


@dataclass(kw_only=True)
class ReactEvalCase(EvalCase):
    tools: ToolsSpec = field(default_factory=ToolsSpec.empty)
    max_tool_calls: int = 1

    supported_agents: ClassVar[tuple[str, ...]] = (
        "knowledge",
        "diagnostic",
        "data_analysis",
        "swe",
    )
    family: ClassVar[str] = "react"

    def __post_init__(self) -> None:
        super().__post_init__()
        if isinstance(self.tools, list):
            self.tools = ToolsSpec.from_raw(self.tools)
        elif isinstance(self.tools, dict):
            self.tools = ToolsSpec.from_raw(self.tools)
        self._sequence_scorer = OrderedSequenceScorer()
        self._round_scorer = RoundBudgetScorer()
        self._runner = TracedAgentTurn()

    @property
    def expected_tools(self) -> list[str]:
        return list(self.tools.required)

    @property
    def expected_total_rounds(self) -> int:
        return self.max_tool_calls

    async def run(self, agent: Any, *, model_name: str = "") -> EvalResult:
        result, listener = await self._runner.run(
            agent,
            self.prompt,
            session=self.session_id(),
            user_id=self.user_id,
        )
        scored = self.score(result, listener)
        scored.model_name = model_name
        return scored

    def score(self, result: AgentTurnResult, listener: EvalReactListener) -> EvalResult:
        reply = extract_turn_output(result.state)
        produced = {
            "tools": self._tool_dimension(listener),
            "max_tool_calls": self._round_scorer.score(
                self.max_tool_calls,
                len(listener.tool_names()),
            ),
            "answer": self._answer_dimension(reply),
        }
        return EvalResult(
            case=self,
            score=self.resolved_eval_set().compose(self.family, produced),
            reply=reply,
            cancelled=result.cancelled,
        )

    def render_details(self, result: EvalResult) -> str:
        lines: list[str] = []
        tools = result.score.named("tools")
        if tools is not None and tools.details.get("reason"):
            details = tools.details
            lines.append(
                f"  tools: required={details.get('required')} "
                f"allowed={details.get('allowed')} "
                f"actual={details.get('actual')} ({details['reason']})"
            )
        budget = result.score.named("max_tool_calls")
        if budget is not None:
            details = budget.details
            lines.append(
                f"  max_tool_calls: expected={details.get('expected')} "
                f"actual={details.get('actual')}"
            )
        answer = result.score.named("answer")
        if answer is not None:
            lines.extend(self._answer_detail_lines(answer))
        return "\n".join(lines)

    def _tool_dimension(self, listener: EvalReactListener) -> DimensionScore:
        value, details = self.tools.score(listener.tool_names())
        return DimensionScore(name="tools", value=value, details=details)


@dataclass(kw_only=True)
class DatabotEvalCase(EvalCase):
    prepare_eval_case: ReactEvalCase
    draft_eval_case: ReactEvalCase | None = None
    expected_table_cards: list[str] = field(default_factory=list)

    supported_agents: ClassVar[tuple[str, ...]] = ("databot",)
    family: ClassVar[str] = "databot"

    def __post_init__(self) -> None:
        super().__post_init__()
        self._sequence_scorer = OrderedSequenceScorer()
        self._round_scorer = RoundBudgetScorer()
        self._runner = TracedAgentTurn()
        self._card_view = TableCardView()

    async def run(self, agent: Any, *, model_name: str = "") -> EvalResult:
        result, listener = await self._runner.run(
            agent,
            self.prompt,
            session=self.session_id(),
            user_id=self.user_id,
        )
        scored = self.score(result, listener)
        scored.model_name = model_name
        return scored

    def score(self, result: AgentTurnResult, listener: EvalReactListener) -> EvalResult:
        reply = extract_turn_output(result.state)
        produced = {
            "prepare_tools": self._stage_tool_dimension(
                "prepare_tools", self.prepare_eval_case, listener
            ),
            "max_tool_calls": self._round_scorer.score(
                self.prepare_eval_case.max_tool_calls,
                len(listener.tool_names()),
            ),
            "answer": self._answer_dimension(reply),
        }
        if self._draft_is_active():
            assert self.draft_eval_case is not None
            produced["draft_tools"] = self._stage_tool_dimension(
                "draft_tools", self.draft_eval_case, listener
            )
        if self.expected_table_cards:
            produced["cards"] = self._sequence_scorer.score(
                list(self.expected_table_cards),
                self._card_view.names_from_state(result.state),
                name="cards",
                empty_reason="no table cards expected",
            )
        return EvalResult(
            case=self,
            score=self.resolved_eval_set().compose(self.family, produced),
            reply=reply,
            cancelled=result.cancelled,
            outcome={"cards": self._card_view.names_from_state(result.state)},
        )

    def render_details(self, result: EvalResult) -> str:
        lines: list[str] = []
        for name in ("prepare_tools", "draft_tools", "cards"):
            dimension = result.score.named(name)
            if dimension is None or not dimension.details.get("reason"):
                continue
            details = dimension.details
            if "required" in details:
                lines.append(
                    f"  {dimension.name}: required={details.get('required')} "
                    f"allowed={details.get('allowed')} "
                    f"actual={details.get('actual')} ({details['reason']})"
                )
            else:
                formatted = self._format_sequence_details(dimension)
                if formatted:
                    lines.append(formatted)
        budget = result.score.named("max_tool_calls")
        if budget is not None:
            details = budget.details
            lines.append(
                f"  max_tool_calls: expected={details.get('expected')} "
                f"actual={details.get('actual')}"
            )
        answer = result.score.named("answer")
        if answer is not None:
            lines.extend(self._answer_detail_lines(answer))
        return "\n".join(lines)

    def _draft_is_active(self) -> bool:
        draft = self.draft_eval_case
        if draft is None:
            return False
        has_tools = bool(
            draft.tools.required or draft.tools.allowed or draft.tools.forbidden
        )
        return has_tools or bool(draft.expected_output)

    def _stage_tool_dimension(
        self,
        name: str,
        stage: ReactEvalCase,
        listener: EvalReactListener,
    ) -> DimensionScore:
        value, details = stage.tools.score(listener.tool_names())
        return DimensionScore(name=name, value=value, details=details)


@dataclass(kw_only=True)
class IntentionEvalCase(EvalCase):
    expected_status: str
    expected_intentions: list[str] = field(default_factory=list)
    expected_routes: list[str] = field(default_factory=list)

    supported_agents: ClassVar[tuple[str, ...]] = ("intent",)
    family: ClassVar[str] = "intent"

    def __post_init__(self) -> None:
        super().__post_init__()
        self.expected_status = str(self.expected_status).strip().lower()
        self.expected_intentions = [
            str(item).strip().upper()
            for item in self.expected_intentions
            if str(item).strip()
        ]
        self.expected_routes = [
            str(item).strip() for item in self.expected_routes if str(item).strip()
        ]
        self._sequence_scorer = OrderedSequenceScorer()
        self._exact_scorer = ExactMatchScorer()
        self._routing_view = IntentRoutingView()

    async def run(self, agent: Any, *, model_name: str = "") -> EvalResult:
        result: AgentTurnResult = await agent.run(
            self.prompt,
            session=self.session_id(),
            user_id=self.user_id,
            print_output=False,
            handoff=False,
        )
        scored = self.score(result)
        scored.model_name = model_name
        return scored

    def score(self, result: AgentTurnResult) -> EvalResult:
        outcome = self._routing_view.from_state(result.state)
        status = self._exact_scorer.score(
            self.expected_status,
            str(outcome.get("status") or "").strip().lower(),
            name="status",
        )
        intentions = self._sequence_scorer.score(
            list(self.expected_intentions),
            list(outcome.get("intentions") or []),
            name="intentions",
            empty_reason="no intentions expected",
        )
        routes = self._sequence_scorer.score(
            list(self.expected_routes),
            list(outcome.get("routes") or []),
            name="routes",
            empty_reason="no routes expected",
        )
        produced = {
            "status": status,
            "intentions": intentions,
            "routes": routes,
        }
        return EvalResult(
            case=self,
            score=self.resolved_eval_set().compose(self.family, produced),
            cancelled=result.cancelled,
            outcome=outcome,
        )

    def render_details(self, result: EvalResult) -> str:
        lines: list[str] = []
        for name in ("status", "intentions", "routes"):
            formatted = self._format_sequence_details(result.score.named(name))
            if formatted:
                lines.append(formatted)
        return "\n".join(lines)


class TableCardView:
    """Read table-card names from a Databot turn state."""

    _KEYS = ("approved_cards", "review_cards", "committed_cards")

    def names_from_state(self, state: Mapping[str, Any] | None) -> list[str]:
        if not state:
            return []
        for key in self._KEYS:
            names = [self._card_name(card) for card in (state.get(key) or [])]
            names = [name for name in names if name]
            if names:
                return names
        return []

    def _card_name(self, card: Any) -> str:
        if isinstance(card, dict):
            for key in ("model_name", "name", "urn"):
                value = card.get(key)
                if value:
                    return str(value).strip()
            return ""
        return str(card).strip()


class IntentRoutingView:
    """Normalize intent-graph state into status / intentions / routes."""

    def from_state(self, state: Mapping[str, Any] | None) -> dict[str, Any]:
        if not state:
            return {"status": "pending", "intentions": [], "routes": []}

        if state.get("__interrupt__"):
            return {
                "status": "clarify",
                "intentions": intentions_from_state(state),
                "routes": [],
            }

        status = str(state.get("status") or "").strip().lower()
        if status == "published":
            route_target = str(state.get("route_target") or "").strip()
            return {
                "status": "published",
                "intentions": [
                    str(item).strip().upper()
                    for item in (state.get("user_intentions") or [])
                    if str(item).strip()
                ],
                "routes": [route_target] if route_target else [],
            }

        if status == "rejected":
            return {"status": "rejected", "intentions": [], "routes": []}

        return {
            "status": status or "pending",
            "intentions": intentions_from_state(state),
            "routes": [],
        }


def extract_routing_outcome(state: Mapping[str, Any] | None) -> dict[str, Any]:
    """Normalize intent graph state into eval-friendly routing fields."""
    return IntentRoutingView().from_state(state)


class CaseTypeCatalog:
    """Map an agent name to the EvalCase subclass that scores it."""

    def __init__(self, case_types: Sequence[type[EvalCase]] | None = None) -> None:
        self._case_types = list(
            case_types
            or (
                DatabotEvalCase,
                IntentionEvalCase,
                ReactEvalCase,
            )
        )

    def case_type_for(self, agent_name: str) -> type[EvalCase]:
        for case_type in self._case_types:
            if agent_name in case_type.supported_agents:
                return case_type
        raise ValueError(f"no eval case type registered for agent {agent_name!r}")


class CaseFile:
    """One JSON fixture: optional file-level models plus a ``cases`` list."""

    def __init__(self, path: Path) -> None:
        self.path = path
        self.payload = json.loads(path.read_text(encoding="utf-8"))

    def default_models(self) -> list[str] | None:
        if not isinstance(self.payload, dict) or "models" not in self.payload:
            return None
        return ModelField().parse(
            self.payload["models"], label=f"case file {self.path.name}"
        )

    def records(self) -> list[dict[str, Any]]:
        payload = self.payload
        if isinstance(payload, list):
            return payload
        if isinstance(payload, dict):
            records = payload.get("cases")
            if not isinstance(records, list):
                raise ValueError(f"{self.path} must contain a top-level 'cases' list")
            return records
        raise ValueError(f"{self.path} must be a list or an object with a 'cases' list")


class ModelField:
    def parse(
        self,
        raw: Any,
        *,
        label: str,
        default: list[str] | None = None,
    ) -> list[str]:
        if raw is None:
            if default:
                return list(default)
            raise ValueError(
                f"{label} is missing required field 'models' "
                "(list of names from models/models.toml)"
            )
        if isinstance(raw, str):
            names = [raw.strip()] if raw.strip() else []
        elif isinstance(raw, list):
            names = [str(item).strip() for item in raw if str(item).strip()]
        else:
            raise ValueError(f"{label} field 'models' must be a string or list of strings")
        if not names:
            raise ValueError(f"{label} field 'models' must be a non-empty list")
        return names


class CaseRecordParser:
    def __init__(self) -> None:
        self._models = ModelField()

    def parse(
        self,
        raw: dict[str, Any],
        *,
        agent_name: str,
        eval_set: EvalSet,
        default_models: list[str] | None,
    ) -> EvalCase:
        raise NotImplementedError

    def require(self, raw: Mapping[str, Any], *keys: str, location: str) -> None:
        for key in keys:
            if key not in raw:
                raise ValueError(
                    f"case {raw.get('name', '?')!r} in {location} "
                    f"is missing required field {key!r}"
                )

    def models_of(
        self,
        raw: Mapping[str, Any],
        *,
        location: str,
        default_models: list[str] | None,
    ) -> list[str]:
        return self._models.parse(
            raw.get("models"),
            label=f"case {raw.get('name', '?')!r} in {location}",
            default=default_models,
        )


class ReactCaseRecordParser(CaseRecordParser):
    def parse(
        self,
        raw: dict[str, Any],
        *,
        agent_name: str,
        eval_set: EvalSet,
        default_models: list[str] | None,
    ) -> ReactEvalCase:
        location = f"{eval_set.name}/{agent_name}"
        self.require(raw, "name", "query", location=location)
        return self.build(
            raw,
            agent_name=agent_name,
            eval_set=eval_set,
            name=str(raw["name"]),
            prompt=str(raw["query"]),
            default_models=default_models,
        )

    def build(
        self,
        raw: Mapping[str, Any],
        *,
        agent_name: str,
        eval_set: EvalSet,
        name: str,
        prompt: str,
        default_models: list[str] | None,
    ) -> ReactEvalCase:
        location = f"{eval_set.name}/{agent_name}"
        tools_raw = raw.get("tools", raw.get("expected_tools"))
        max_raw = raw.get(
            "max_tool_calls",
            raw.get("expected_total_rounds", raw.get("total_rounds", 1)),
        )
        expected_raw = raw.get(
            "expected_output",
            raw.get("answer", raw.get("expected_answer")),
        )
        return ReactEvalCase(
            agent_name=agent_name,
            eval_set=eval_set,
            name=name,
            prompt=prompt,
            expected_output=parse_expected_output(expected_raw),
            models=self.models_of(raw, location=location, default_models=default_models),
            tools=ToolsSpec.from_raw(tools_raw, label=f"case {name!r} in {location} tools"),
            max_tool_calls=int(max_raw if max_raw is not None else 1),
        )


class DatabotCaseRecordParser(CaseRecordParser):
    def __init__(self, react_parser: ReactCaseRecordParser | None = None) -> None:
        super().__init__()
        self._react = react_parser or ReactCaseRecordParser()

    def parse(
        self,
        raw: dict[str, Any],
        *,
        agent_name: str,
        eval_set: EvalSet,
        default_models: list[str] | None,
    ) -> DatabotEvalCase:
        location = f"{eval_set.name}/{agent_name}"
        self.require(raw, "name", "query", location=location)
        name = str(raw["name"])
        prompt = str(raw["query"])
        models = self.models_of(raw, location=location, default_models=default_models)
        prepare_raw = raw.get("prepare_eval_case")
        if isinstance(prepare_raw, dict):
            prepare = self._stage(
                prepare_raw,
                agent_name=agent_name,
                eval_set=eval_set,
                name=f"{name}.prepare",
                prompt=prompt,
                default_models=models,
            )
        else:
            prepare = self._react.build(
                raw,
                agent_name=agent_name,
                eval_set=eval_set,
                name=name,
                prompt=prompt,
                default_models=models,
            )
        draft_raw = raw.get("draft_eval_case")
        draft = None
        if isinstance(draft_raw, dict):
            draft = self._stage(
                draft_raw,
                agent_name=agent_name,
                eval_set=eval_set,
                name=f"{name}.draft",
                prompt=prompt,
                default_models=models,
            )
        expected_raw = raw.get(
            "expected_output",
            raw.get("answer", raw.get("expected_answer")),
        )
        return DatabotEvalCase(
            agent_name=agent_name,
            eval_set=eval_set,
            name=name,
            prompt=prompt,
            expected_output=parse_expected_output(expected_raw),
            models=models,
            prepare_eval_case=prepare,
            draft_eval_case=draft,
            expected_table_cards=[
                str(item).strip()
                for item in (raw.get("expected_table_cards") or [])
                if str(item).strip()
            ],
        )

    def _stage(
        self,
        raw: Mapping[str, Any],
        *,
        agent_name: str,
        eval_set: EvalSet,
        name: str,
        prompt: str,
        default_models: list[str],
    ) -> ReactEvalCase:
        return self._react.build(
            raw,
            agent_name=agent_name,
            eval_set=eval_set,
            name=str(raw.get("name") or name),
            prompt=str(raw.get("query") or prompt),
            default_models=default_models,
        )


class IntentionCaseRecordParser(CaseRecordParser):
    def parse(
        self,
        raw: dict[str, Any],
        *,
        agent_name: str,
        eval_set: EvalSet,
        default_models: list[str] | None,
    ) -> IntentionEvalCase:
        location = f"{eval_set.name}/{agent_name}"
        self.require(raw, "name", "query", "expected_status", location=location)
        expected_raw = raw.get(
            "expected_output",
            raw.get("answer", raw.get("expected_answer")),
        )
        return IntentionEvalCase(
            agent_name=agent_name,
            eval_set=eval_set,
            name=str(raw["name"]),
            prompt=str(raw["query"]),
            expected_output=parse_expected_output(expected_raw),
            models=self.models_of(raw, location=location, default_models=default_models),
            expected_status=str(raw["expected_status"]),
            expected_intentions=list(raw.get("expected_intentions") or []),
            expected_routes=list(raw.get("expected_routes") or []),
        )


class CaseLoader:
    """Read ``{case_root}/{eval_set}/{agent}.json`` into cases keyed by agent then model."""

    def __init__(
        self,
        case_root: str | Path,
        agent_models: Mapping[str, str | Sequence[str]],
        *,
        catalog: CaseTypeCatalog | None = None,
        eval_sets: EvalSetCatalog | None = None,
    ) -> None:
        self.case_root_dir = Path(case_root)
        self.agent_models = {
            agent: self._as_models(models) for agent, models in agent_models.items()
        }
        self.catalog = catalog or CaseTypeCatalog()
        self.eval_sets = eval_sets or EvalSetCatalog()
        self._parsers: dict[type[EvalCase], CaseRecordParser] = {
            ReactEvalCase: ReactCaseRecordParser(),
            DatabotEvalCase: DatabotCaseRecordParser(),
            IntentionEvalCase: IntentionCaseRecordParser(),
        }

    def load(
        self,
        agents: set[str],
        models: set[str],
        eval_set: set[str],
    ) -> dict[str, dict[str, list[EvalCase]]]:
        loaded: dict[str, dict[str, list[EvalCase]]] = {}
        for group in eval_set:
            slice_ = self.eval_sets.resolve(group)
            set_dir = self.case_root_dir / slice_.name
            if not set_dir.is_dir():
                raise FileNotFoundError(
                    f"eval_set directory not found: {set_dir} "
                    f"(expected one of: {', '.join(self.eval_sets.canonical_names())})"
                )
            for agent, agent_model_list in self.agent_models.items():
                if agent not in agents:
                    continue
                path = set_dir / f"{agent}.json"
                if not path.is_file():
                    continue
                case_type = self.catalog.case_type_for(agent)
                parser = self._parsers[case_type]
                case_file = CaseFile(path)
                file_models = case_file.default_models()
                default_models = (
                    file_models if file_models is not None else list(agent_model_list)
                )
                for raw in case_file.records():
                    if not isinstance(raw, dict):
                        raise ValueError(
                            f"case in {slice_.name}/{agent} must be an object"
                        )
                    case = parser.parse(
                        raw,
                        agent_name=agent,
                        eval_set=slice_,
                        default_models=default_models,
                    )
                    for model_name in agent_model_list:
                        if model_name not in models or not case.allows_model(model_name):
                            continue
                        loaded.setdefault(agent, {}).setdefault(model_name, []).append(case)
        return loaded

    def list_eval_sets(self) -> list[str]:
        names = [
            name
            for name in self.eval_sets.canonical_names()
            if (self.case_root_dir / name).is_dir()
        ]
        return sorted(names)

    def list_cases(
        self,
        agents: set[str],
        eval_set: set[str],
    ) -> list[EvalCase]:
        """Parse matching fixtures once (no model expansion) and return sorted cases."""
        cases: list[EvalCase] = []
        for group in sorted(eval_set):
            slice_ = self.eval_sets.resolve(group)
            set_dir = self.case_root_dir / slice_.name
            if not set_dir.is_dir():
                raise FileNotFoundError(
                    f"eval_set directory not found: {set_dir} "
                    f"(expected one of: {', '.join(self.eval_sets.canonical_names())})"
                )
            for agent in sorted(agents):
                if agent not in self.agent_models:
                    continue
                path = set_dir / f"{agent}.json"
                if not path.is_file():
                    continue
                case_type = self.catalog.case_type_for(agent)
                parser = self._parsers[case_type]
                case_file = CaseFile(path)
                file_models = case_file.default_models()
                default_models = (
                    file_models
                    if file_models is not None
                    else list(self.agent_models[agent])
                )
                for raw in case_file.records():
                    if not isinstance(raw, dict):
                        raise ValueError(
                            f"case in {slice_.name}/{agent} must be an object"
                        )
                    cases.append(
                        parser.parse(
                            raw,
                            agent_name=agent,
                            eval_set=slice_,
                            default_models=default_models,
                        )
                    )
        return sorted(
            cases,
            key=lambda case: (
                case.resolved_eval_set().name,
                case.agent_name,
                case.name,
            ),
        )

    def _as_models(self, models: str | Sequence[str]) -> list[str]:
        if isinstance(models, str):
            names = [models.strip()] if models.strip() else []
        else:
            names = [str(item).strip() for item in models if str(item).strip()]
        if not names:
            raise ValueError("agent_models values must be a non-empty model name or list")
        return names

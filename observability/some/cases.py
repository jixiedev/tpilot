"""Eval case types: each subtype owns how it runs a turn and how it scores."""

from __future__ import annotations

import uuid
from collections.abc import Mapping
from dataclasses import dataclass, field
from typing import Any, ClassVar

from agent.intent.orchestrator import intentions_from_state
from agent.turn import AgentTurnResult, extract_turn_output
from observability.some.eval_set import EvalSet, EvalSetCatalog
from observability.some.observe import EvalReactListener, TracedAgentTurn
from observability.some.scoring import (
    AnswerMatcher,
    CaseScore,
    DimensionScore,
    ExactMatchScorer,
    OrderedSequenceScorer,
    RoundBudgetScorer,
)


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
    expected_answer: dict[str, Any]
    models: list[str] = field(default_factory=list)

    supported_agents: ClassVar[tuple[str, ...]] = ()
    family: ClassVar[str] = ""
    user_id: ClassVar[str] = "case_bot"

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
            f"[{status}] {self.resolved_eval_set().name}/{self.agent_name}/{self.name}{model_bit} "
            f"({result.score.summary()})"
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
        return self._answer_matcher.score(reply, self.expected_answer)

    def _answer_detail_lines(self, answer: DimensionScore) -> list[str]:
        lines: list[str] = []
        details = answer.details
        missing = details.get("missing") or []
        if missing:
            lines.append(f"  answer missing keys: {missing}")
        mismatched = details.get("mismatched") or []
        if mismatched:
            lines.append(f"  answer mismatched keys: {mismatched}")
        if details.get("skipped"):
            lines.append("  answer: skipped")
        parse_error = details.get("parse_error")
        if parse_error:
            lines.append(f"  answer parse error: {parse_error}")
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
    expected_tools: list[str] = field(default_factory=list)
    expected_total_rounds: int = 1

    supported_agents: ClassVar[tuple[str, ...]] = (
        "knowledge",
        "diagnostic",
        "data_analysis",
        "swe",
    )
    family: ClassVar[str] = "react"

    def __post_init__(self) -> None:
        super().__post_init__()
        self._sequence_scorer = OrderedSequenceScorer()
        self._round_scorer = RoundBudgetScorer()
        self._runner = TracedAgentTurn()

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
            "rounds": self._round_scorer.score(
                self.expected_total_rounds,
                listener.reason_round_count,
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
        formatted = self._format_sequence_details(tools)
        if formatted:
            lines.append(formatted)
        rounds = result.score.named("rounds")
        if rounds is not None:
            details = rounds.details
            lines.append(
                f"  rounds: expected={details.get('expected')} actual={details.get('actual')}"
            )
        answer = result.score.named("answer")
        if answer is not None:
            lines.extend(self._answer_detail_lines(answer))
        return "\n".join(lines)

    def _tool_dimension(self, listener: EvalReactListener) -> DimensionScore:
        return self._sequence_scorer.score(
            list(self.expected_tools),
            listener.tool_names(),
            name="tools",
            empty_reason="no tools expected",
        )


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
            "rounds": self._round_scorer.score(
                self.prepare_eval_case.expected_total_rounds,
                listener.reason_round_count,
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
            formatted = self._format_sequence_details(result.score.named(name))
            if formatted:
                lines.append(formatted)
        rounds = result.score.named("rounds")
        if rounds is not None:
            details = rounds.details
            lines.append(
                f"  rounds: expected={details.get('expected')} actual={details.get('actual')}"
            )
        answer = result.score.named("answer")
        if answer is not None:
            lines.extend(self._answer_detail_lines(answer))
        return "\n".join(lines)

    def _draft_is_active(self) -> bool:
        draft = self.draft_eval_case
        if draft is None:
            return False
        return bool(draft.expected_tools) or bool(draft.expected_answer)

    def _stage_tool_dimension(
        self,
        name: str,
        stage: ReactEvalCase,
        listener: EvalReactListener,
    ) -> DimensionScore:
        return self._sequence_scorer.score(
            list(stage.expected_tools),
            listener.tool_names(),
            name=name,
            empty_reason="no tools expected",
        )


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
            str(item).strip().upper() for item in self.expected_intentions if str(item).strip()
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

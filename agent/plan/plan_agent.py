"""Plan agent: prompts, state, and the orchestrator that delegates to specialists."""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from langchain_core.language_models import BaseChatModel
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph.state import CompiledStateGraph

from agent.agent import BaseAgent
from agent.catalog import AgentCatalog, AgentCatalogSettings
from agent.listener import AgentListener, CliListener, ListenerHub
from agent.prompt import SystemPromptAssembler
from agent.turn import AgentTurnResult, OnInterrupt
from agent.turn_messages import TurnMessagePolicy
from config.agent_config import AgentConfig, PlanAgentConfig, agent_config_path
from memory.session_runtime import SessionRuntime
from graph.state import ReactAgentState

STAGE_CREATE = "create"
STAGE_EXECUTE = "execute"
STAGE_ADJUST = "adjust"
STAGE_DONE = "done"

NODE_PREPARE_TURN = "prepare_turn"
NODE_CREATE_PLAN = "create_plan"
NODE_SUB_AGENT_ROUND = "sub_agent_round"
NODE_ADJUST_PLAN = "adjust_plan"
NODE_SUMMARY = "summary"

DEFAULT_MAX_SUBAGENT_ROUNDS = 8
DEFAULT_STAGE_MAX_TOOL_CALLS = 6

REGISTRY_NAME = "plan"
TOOL_ID_DEFAULT = "default"
TOOL_ID_CREATE = "create"
TOOL_ID_SUBAGENT = "subagent"
TOOL_ID_ADJUST = "adjust"

INVOKE_AGENT_TOOL_NAME = "invoke_agent"
_MAX_TASK_PREVIEW_CHARS = 120

DELEGATABLE_AGENTS = frozenset(
    name for name in AgentCatalog.names() if name not in {"intent", "plan"}
)


class PlanState(ReactAgentState):
    """Plan-and-execute turn state."""

    plan_id: str
    stage: str
    step_results: list[dict[str, Any]]
    subagent_rounds: int
    adjust_had_tool_calls: bool
    user_question: str

    @staticmethod
    def baseline() -> dict[str, Any]:
        """Reset per-turn plan fields and ReAct counters while keeping session messages."""
        return {
            **ReactAgentState.fresh_turn_defaults(),
            "plan_id": "",
            "stage": STAGE_CREATE,
            "step_results": [],
            "subagent_rounds": 0,
            "adjust_had_tool_calls": False,
            "user_question": "",
        }


    @staticmethod
    def stage_start(state: Mapping[str, Any]) -> dict[str, Any]:
        """Fresh tool budget for one stage run (create, each execute round, adjust)."""
        del state
        return {"tool_call_count": 0, "idle_reason_rounds": 0}


class PlanTurnMessagePolicy(TurnMessagePolicy):
    def history_state(self, prior: Mapping[str, Any] | None = None) -> dict[str, Any]:
        return dict(PlanState.baseline())


class PlanSystemPrompt(SystemPromptAssembler):
    """Plan orchestrator prompt with specialist catalog."""

    def __init__(self, config: AgentConfig | None = None) -> None:
        super().__init__(config or AgentConfig(agent_config_path("plan")))

    @staticmethod
    def agent_cards() -> str:
        """Human-readable specialist catalog for the system prompt."""
        lines = ["Available specialist agents (use `[agent_name]` prefix in plan steps):"]
        for name in sorted(DELEGATABLE_AGENTS):
            config = AgentCatalog.config(name)
            lines.append(f"- `{name}`: {config.description.strip()}")
        return "\n".join(lines)

    def build(self, user_profile=None) -> str:
        body = super().build(user_profile).rstrip()
        cards = self.agent_cards().strip()
        if not cards:
            return f"{body}\n"
        return f"{body}\n\n{cards}\n"


CREATE_PLAN_NEXT_STEP = (
    "Call `create_plan` with `plan_id`, `title`, and `steps`. "
    "Each step should name the specialist when not obvious."
)

SUBAGENT_NEXT_STEP = (
    "Review the current plan (`planning` command=get) and prior step results. "
    "Either call `invoke_agent` for the next actionable step, mark a step complete, "
    "or reply with plain text when this execution round is sufficient."
)

ADJUST_PLAN_NEXT_STEP = (
    "Decide whether the plan needs updates or more execution. "
    "Use `planning` (update / mark_step / get) when changes are required. "
    "Otherwise reply in plain text — no tools — to finish planning."
)

SUMMARY_SYSTEM_PROMPT = """\
You are Plan's summary voice. The planning pipeline already ran specialists.
Write one clear, user-facing answer that synthesizes step results and plan progress.
Use plain assistant text only — do not call tools.
"""


class PlanStepStatus:
    """One-line status before delegating a plan step to a specialist."""

    @staticmethod
    def format(agent_name: str, task: str) -> str:
        agent = (agent_name or "").strip() or "specialist"
        text = " ".join((task or "").split())
        if len(text) > _MAX_TASK_PREVIEW_CHARS:
            text = text[: _MAX_TASK_PREVIEW_CHARS - 1].rstrip() + "…"
        if text:
            return f"Running {agent}: {text}"
        return f"Running {agent}"


class PlanAgent(BaseAgent):
    """Plan-and-execute orchestrator: plan → specialist rounds → adjust → summary.

    Example checkpoint ``messages`` (same accept/boundary as ``BaseAgent``)::

        Turn 1::

            [SYS]   agent persona
            [HUMAN] user question
            [AI/TOOL …] create_plan ReAct
            [AI/TOOL …] subagent rounds
            [AI/TOOL …] adjust_plan (optional)
            [AI]    plan summary

        Turn 2::

            ┌─ Turn 1 ────────────────────────────────────────────
            │ … prior turns …
            ├─ Turn 2 ────────────────────────────────────────────
            │ [SYS]   turn boundary
            │ [HUMAN] q2
            └─ plan graph appends under q2
    """

    def __init__(
        self,
        *,
        model: BaseChatModel,
        checkpointer: BaseCheckpointSaver,
        session_runtime: SessionRuntime,
        agent_config: PlanAgentConfig,
        listener: AgentListener | ListenerHub | None = None,
    ) -> None:
        prompt = PlanSystemPrompt(agent_config)
        super().__init__(
            model=model,
            checkpointer=checkpointer,
            session_runtime=session_runtime,
            prompt_assembler=prompt,
            turn_message_policy=PlanTurnMessagePolicy(),
            agent_config=agent_config,
            listener=listener or CliListener(),
        )
        self.prompt_assembler = prompt
        self._catalog = AgentCatalog(
            AgentCatalogSettings(
                profile_store=session_runtime,
                model=model,
                checkpointer=checkpointer,
            )
        )

    async def run(
        self,
        user_prompt: str,
        session: str,
        user_id: str | None = None,
        on_interrupt: OnInterrupt | None = None,
        print_output: bool = True,
    ) -> AgentTurnResult:
        """Run one plan turn; delegated specialists share this run's ``on_interrupt``."""
        from agent.plan.stage_tools import SpecialistRunner

        with SpecialistRunner.interrupt_handler(on_interrupt):
            return await super().run(
                user_prompt,
                session=session,
                user_id=user_id,
                on_interrupt=on_interrupt,
                print_output=print_output,
            )

    def build_graph(self, **kwargs: Any) -> CompiledStateGraph:
        if self.graph is not None:
            return self.graph
        from agent.plan.graph import build_plan_graph
        from agent.plan.stage_tools import PlanSubagentListener, SpecialistRunner

        runner = SpecialistRunner(get_specialist=self._catalog.get_or_create)
        compiled = build_plan_graph(
            self.model,
            runner,
            checkpointer=self.checkpointer,
            max_tool_calls=self.agent_config.run_int(
                "max_tool_calls", DEFAULT_STAGE_MAX_TOOL_CALLS
            ),
            max_subagent_rounds=self.agent_config.run_int(
                "max_subagent_rounds", DEFAULT_MAX_SUBAGENT_ROUNDS
            ),
            max_idle_reason_rounds=self.agent_config.run_int("max_idle_reason_rounds", 1),
            profile_dir=self.session_runtime.filesystem_root(),
            listener=PlanSubagentListener.hub(self.listener),
        )
        self.graph = compiled
        return compiled

"""Lead prompts: the system prompt with the specialist roster, and the per-step prompt."""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from langchain_core.messages import ToolMessage

from tahoepilot.agent.lead.state import pending_steps, render_plan, render_work_record
from tahoepilot.agent.lead.tools import DELEGATE_TOOL_NAME
from tahoepilot.agent.prompt import SystemPromptAssembler
from tahoepilot.settings.agent_config import AgentConfig, agent_config_path

LEAD_AGENT_NAME = "lead"

STEP_GUIDANCE = """\
Decide the next step for the user's latest request:
- Answer directly only from this conversation or the work record below.
- If the request is ambiguous in a way that would change the result, ask one short clarifying question and stop.
- Otherwise `delegate` to the specialist that owns it, with a standalone `task`.
- Never state numbers, definitions or facts that no specialist returned.
- Write a plan (`write_plan`) only when the request needs two or more specialists, or one step's output feeds the next."""

PLAN_NUDGE_AFTER = 2


def delegatable_agents() -> frozenset[str]:
    """Registered specialists; front agents (lead, databot) are never delegated to."""
    from tahoepilot.agent.catalog import AgentCatalog

    return frozenset(
        name
        for name in AgentCatalog.names()
        if name != LEAD_AGENT_NAME and not AgentCatalog.config(name).front
    )


class LeadSystemPrompt(SystemPromptAssembler):
    """Lead persona plus one line per specialist (``delegate_when`` from each agent file)."""

    def __init__(self, config: AgentConfig | None = None) -> None:
        super().__init__(config or AgentConfig(agent_config_path(LEAD_AGENT_NAME)))

    @staticmethod
    def specialist_roster() -> str:
        from tahoepilot.agent.catalog import AgentCatalog

        lines = ["Specialists you can delegate to (`delegate(agent=...)`):"]
        for name in sorted(delegatable_agents()):
            config = AgentCatalog.config(name)
            when = (config.delegate_when or config.description).strip()
            lines.append(f"- `{name}`: {when}")
        return "\n".join(lines)

    def build(self, user_profile=None) -> str:
        body = super().build(user_profile).rstrip()
        return f"{body}\n\n{self.specialist_roster()}\n"


def _last_delegate_result(state: Mapping[str, Any]) -> bool:
    messages = list(state.get("messages") or [])
    return bool(messages) and isinstance(messages[-1], ToolMessage) and (
        messages[-1].name == DELEGATE_TOOL_NAME
    )


def lead_step_prompt(state: Mapping[str, Any]) -> str:
    """Ephemeral per-step prompt: guidance, work record, plan and nudges."""
    parts = [STEP_GUIDANCE]
    record = state.get("work_record") or []
    if record:
        parts.append("Work record (earlier specialist results, newest last):\n" + render_work_record(record))
    plan = list(state.get("plan") or [])
    if _last_delegate_result(state):
        parts.append(
            "A specialist just returned. Read its status and summary. "
            "If there is a plan, check whether the remaining steps still make sense "
            "and rewrite them with `write_plan` if not."
        )
    if plan:
        parts.append("Current plan:\n" + render_plan(plan))
        pending = pending_steps(plan)
        if pending:
            listed = ", ".join(str(i) for i in pending)
            parts.append(
                f"Steps {listed} are still pending. Do not give your final answer until they are "
                "done, or you decide to drop them — then say in the answer which ones and why."
            )
    elif int(state.get("turn_delegations") or 0) >= PLAN_NUDGE_AFTER:
        parts.append(
            "You have delegated several times this turn without a plan. "
            "If more steps remain, write one with `write_plan`."
        )
    return "\n\n".join(parts)

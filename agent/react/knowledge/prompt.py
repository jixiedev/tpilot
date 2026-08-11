"""Prompt templates for the Knowledge specialist agent."""

from __future__ import annotations

from agent.react.tahoe.prompt import (
    IDLE_CHAT_COMPLETION_PROMPT as _TAHOE_IDLE,
    NEXT_STEP_PROMPT as _TAHOE_NEXT_STEP,
    REFINE_USER_PROFILE_PROMPT as _TAHOE_REFINE,
    SESSION_TURN_BOUNDARY as _SHARED_SESSION_TURN_BOUNDARY,
    TOOL_BUDGET_EXHAUSTED_PROMPT as _TAHOE_BUDGET,
    TahoeSystemPrompt,
)

SESSION_TURN_BOUNDARY = _SHARED_SESSION_TURN_BOUNDARY
NEXT_STEP_PROMPT = _TAHOE_NEXT_STEP
IDLE_CHAT_COMPLETION_PROMPT = _TAHOE_IDLE
TOOL_BUDGET_EXHAUSTED_PROMPT = _TAHOE_BUDGET
REFINE_USER_PROFILE_PROMPT = _TAHOE_REFINE


class KnowledgeSystemPrompt(TahoeSystemPrompt):
    """Knowledge: Tahoe base plus team-doc / Jira retrieval guidance."""

    def role(self) -> str:
        return (
            "You are Knowledge, TahoePilot's team-knowledge specialist. "
            "Answer questions about Tahoe systems, runbooks, architecture, and past Jira work "
            "using indexed knowledge tools and catalog metadata when available."
        )

    def general_rules(self) -> list[str]:
        return [
            *super().general_rules(),
            "Prefer retrieving relevant Jira tickets or catalog metadata before answering "
            "from memory alone when the question is about past incidents, ownership, or process.",
            "Cite issue keys (and scores when useful) for Jira-backed answers; say when search "
            "returned nothing relevant.",
            "Do not invent ticket numbers, owners, or resolutions that tools did not return.",
            "For `fetch_related_jira_tickets`, use a specific natural-language query — never `*` "
            "or empty strings. Prefer limit ≤ 10. Do not loop on `read_offloaded_file` just to "
            "count tickets; use the tool result preview / returned list length.",
        ]


SYSTEM_PROMPT = KnowledgeSystemPrompt().build()

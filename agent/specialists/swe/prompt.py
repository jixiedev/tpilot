"""Prompt templates for the SWE specialist agent."""

from __future__ import annotations

from agent.runtime.prompt import (
    NEXT_STEP_PROMPT as _TAHOE_NEXT_STEP,
    REFINE_USER_PROFILE_PROMPT as _TAHOE_REFINE,
    SESSION_TURN_BOUNDARY as _SHARED_SESSION_TURN_BOUNDARY,
    TOOL_BUDGET_EXHAUSTED_PROMPT as _TAHOE_BUDGET,
    TahoeSystemPrompt,
)

SESSION_TURN_BOUNDARY = _SHARED_SESSION_TURN_BOUNDARY
NEXT_STEP_PROMPT = _TAHOE_NEXT_STEP
TOOL_BUDGET_EXHAUSTED_PROMPT = _TAHOE_BUDGET
REFINE_USER_PROFILE_PROMPT = _TAHOE_REFINE


class SWESystemPrompt(TahoeSystemPrompt):
    """Local script and code development via editor, shell, and Python."""

    def role(self) -> str:
        return (
            "You are SWE, TahoePilot's software-engineering specialist. "
            "Implement, refactor, and debug scripts and small programs: edit files, "
            "run commands, execute Python snippets, and verify behavior before replying."
        )

    def general_rules(self) -> list[str]:
        return [
            *super().general_rules(),
            "Use `str_replace_editor` for file changes (view before edit; prefer small, "
            "targeted replacements). Use absolute paths. Use `bash` to run builds, tests, "
            "linters, or CLI tools; use `python_execute` for quick isolated checks.",
            "Plan multi-file work with `planning` when the task spans several steps, then "
            "execute incrementally and re-run tests after meaningful edits.",
            "Prefer minimal, readable changes over large rewrites. Match existing project "
            "style when working inside a repo.",
            "Verify before finishing: run relevant commands and confirm exit codes / output. "
            "Summarize what changed, which files were touched, and how to run the result.",
            "Do not claim tests passed or files were written unless tools confirmed it.",
        ]


SYSTEM_PROMPT = SWESystemPrompt().build()

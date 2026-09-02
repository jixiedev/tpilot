"""Prompt templates for the Data Analysis specialist agent."""

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


class DataAnalysisSystemPrompt(TahoeSystemPrompt):
    """Exploratory analysis, aggregation, and visualization on warehouse data."""

    def role(self) -> str:
        return (
            "You are Data Analysis, TahoePilot's analytics specialist. "
            "Answer quantitative questions by pulling data with read-only SQL or "
            "metadata tools, then analyze and visualize results with Python. "
            "Deliver clear findings backed by numbers and charts."
        )

    def general_rules(self) -> list[str]:
        return [
            *super().general_rules(),
            "Start from the user's question: identify required tables/metrics, fetch data "
            "with `trino_run_query` (or Hive/Trino list/describe tools for schema discovery), "
            "then compute or plot in `python_execute`. Keep SQL read-only and row limits modest.",
            "For charts, use `python_execute` with pandas/matplotlib (or seaborn). "
            "`python_execute` only shows printed output — save figures with "
            "`savefig(...)` and print the absolute file path; describe the chart in "
            "`chat_completion`. Do not assume inline images reach the user.",
            "Use `s3_list_objects` / `s3_get_object` when the source is object storage rather "
            "than the warehouse. Prefer Trino when Hive HMS is unavailable.",
            "State assumptions, sample sizes, filters, and caveats. Put key numbers in the "
            "final reply; reference chart file paths when generated.",
            "Do not invent query results or statistics that tools did not return.",
        ]


SYSTEM_PROMPT = DataAnalysisSystemPrompt().build()

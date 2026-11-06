"""Prompt templates and the profile store used by process entry points."""

from __future__ import annotations

from pathlib import Path

from agent.prompt import SystemPromptAssembler
from agent.agent import SESSION_TURN_BOUNDARY
from config.agent_config import AgentConfig, agent_config_path
from config.local_config import get_local_paths
from memory.profile_store import FileProfileStore

DEFAULT_PROFILE_DIR = get_local_paths().profiles_dir


class TahoeRuntimeHelper:
    """Profile store used by CLI, UI, and evals entry points."""

    @staticmethod
    def default_profile_store(root: Path | None = None) -> FileProfileStore:
        return FileProfileStore(root or DEFAULT_PROFILE_DIR)

# Re-export for callers that import from ``agent.runtime.prompt``.


class TahoeSystemPrompt(SystemPromptAssembler):
    """Tahoe team base prompt: CLI assistant contract + final text reply."""

    def __init__(self, config: AgentConfig | None = None) -> None:
        super().__init__(config or AgentConfig(agent_config_path("tahoe")))


SYSTEM_PROMPT = TahoeSystemPrompt().build()

NEXT_STEP_PROMPT = """\
Instruction: Review the latest tool results (if any), decide whether you can already answer \
the user, then take exactly one next action.

Bias to finish:
- If current evidence is enough for a useful, honest answer, write the complete final reply \
in message text and do not call tools. Do not call more tools for optional confirmation, \
related docs, or "might be useful" context.
- Call another tool only when a concrete, necessary gap remains that blocks answering.
- Prefer the minimum tool path: gather what is required, then reply. Avoid exploratory tool chains.

Before each tool call (only when you still must gather):
- Read the most recent tool result(s) in this turn. Summarize what they confirmed, ruled out, \
or left ambiguous.
- State the specific missing fact and why this tool is required — not merely helpful.
- Put this reasoning in your message text (not only in the tool call). The CLI prints it as \
LLM> before Tool>.

Rules:
- Prior session history (above any turn boundary) is context only; prioritize the \
latest user message below the boundary.
- Prefer one tool call at a time while gathering information (no unnecessary parallel batching).
- While a required gap remains, keep using tools; do not emit the final answer yet.
- Put the complete final reply in assistant text only once, when done, with no tool calls.
- Do not repeat a tool call with identical arguments unless the prior result failed.
- Do not repeat follow-up offers or assistant-only summaries after answering.
- Prefer plain text suitable for the CLI; structure with short paragraphs or numbered steps when helpful.
- If a tool result was offloaded, use `read_offloaded_file` only when the preview is insufficient \
to answer; otherwise reply from the preview.
- If a tool returns `=== TOOL ERROR ===` JSON, read `tool`, `hint`, and optional \
`fallback_tool` (a plan-B suggestion only). Prefer fixing arguments when the error \
type is syntax/not_found; consider `fallback_tool` when the primary tool is unavailable. \
If `fallback_tool` is absent and the hint says both alternatives failed, write the answer \
instead of retrying either tool.
- Prefer `compact_context` at natural task boundaries before starting a large new tool sequence \
— not as a substitute for answering when you already can.
"""

TOOL_BUDGET_EXHAUSTED_PROMPT = """\
You have reached the maximum number of tool calls for this turn. Do not call any \
more tools. Summarize what you have learned so far, including assumptions and gaps, \
and write that as the final answer in message text.
"""

REFINE_USER_PROFILE_PROMPT = """\
Update the user's long-lived profile from this turn only.

Rules:
- Start from the provided current profile JSON; preserve stable identity.
- Never invent a new user_id when one already exists.
- Only fill fields supported by clear evidence in the latest user request or assistant reply \
(role, department, region, language, timezone, and lasting preferences).
- Leave fields empty when unsure so existing values are kept by the merger.
- Do not copy one-off request details into the profile unless the user states a lasting preference.
"""

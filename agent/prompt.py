"""Composable system-prompt builders loaded from ``config/agents/*.toml``."""

from __future__ import annotations

from config.agent_config import AgentConfig
from memory.profile import UserProfile


class SystemPromptAssembler:
    """Render ``[system_prompt]`` sections from an ``AgentConfig``.

    Each section is ``title`` plus ``text``. Pass ``user_profile`` to ``build``
    for a turn-specific User profile block after Role.
    """

    user_profile_section_title = "User profile"

    def __init__(self, config: AgentConfig) -> None:
        self.config = config

    def section_blocks(self) -> list[tuple[str, str]]:
        spec = self.config.system_prompt
        if spec is None:
            return []
        blocks: list[tuple[str, str]] = []
        for section_id in spec.layout:
            section = spec.section(section_id)
            text = section.text.strip()
            if not text:
                continue
            blocks.append((section.title, text))
        return blocks

    def build(self, user_profile: UserProfile | None = None) -> str:
        """Render the system prompt; optional ``user_profile`` adds the profile block."""
        blocks = list(self.section_blocks())
        if user_profile is not None:
            profile_body = user_profile.prompt_section_body()
            if profile_body:
                insert_at = 1 if blocks else 0
                blocks.insert(insert_at, (self.user_profile_section_title, profile_body))
        parts = [f"{title}:\n{body.strip()}" for title, body in blocks if body.strip()]
        return "\n\n".join(parts) + ("\n" if parts else "")

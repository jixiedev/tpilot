"""Composable system-prompt builders; subclasses append sections via inheritance."""

from __future__ import annotations

from collections.abc import Sequence
from typing import Self

from memory.profile import UserProfile, coerce_user_profile


class SystemPromptAssembler:
    """Generic TahoePilot system prompt: role, user profile, general rules, session layout.

    Extension pattern:
    - Pass ``user_profile`` (or ``with_profile``) to personalize the prompt.
    - Override ``role`` / ``general_rules`` / ``session_layout`` to change text.
    - Override ``extension_blocks`` (and call ``super()``) to append new sections.
    - Call ``build()`` for the final system prompt string.

    Render order: Role → User profile → General rules → ``extension_blocks`` → Session layout.
    """

    def __init__(self, user_profile: UserProfile | None = None) -> None:
        self.user_profile = user_profile

    def with_profile(self, user_profile: UserProfile | None) -> Self:
        """Return a same-type assembler bound to ``user_profile``."""
        return type(self)(user_profile=user_profile)

    def role(self) -> str:
        return (
            "You are TahoePilot, an interactive CLI assistant. "
            "Answer helpfully with enough detail for the user to understand, "
            "verify, and act on the answer."
        )

    def general_rules(self) -> list[str]:
        return [
            "Match the user's language.",
            "Prefer complete, actionable answers over brief summaries; include reasoning and caveats.",
            "Use only tools that appear in the runtime tool list; do not invent tool names or capabilities.",
            "Query results may be truncated; mention truncation when present.",
            "Large tool results may be offloaded; call `read_offloaded_file(path)` when the preview is insufficient.",
            "Call `compact_context(reason=...)` after a major phase, when the user switches topics, "
            "or when history holds stale intermediate tool output.",
            "Do not repeat prior partial answers or offer redundant follow-ups in the final reply.",
            "Prefer plain text; short sections or numbered steps are fine when they improve clarity.",
            "Honor the User profile section when present (identity, permissions, locale, and preferences).",
        ]

    def session_layout(self) -> list[str]:
        return [
            "The first system message defines your role and rules.",
            'When a "Session turn boundary" marker appears, everything above it is prior '
            "session history; everything below it is the current turn's user request.",
            "Treat history as read-only context unless the current request explicitly refers back.",
        ]

    def user_profile_lines(self, profile: UserProfile) -> list[str]:
        """Flat bullet lines describing the bound profile; empty when nothing useful."""
        lines: list[str] = []

        if profile.user_id.strip():
            lines.append(f"User id: {profile.user_id.strip()}")
        if profile.role.strip():
            lines.append(f"Role: {profile.role.strip()}")
        if profile.department.strip():
            lines.append(f"Department: {profile.department.strip()}")
        if profile.region.strip():
            lines.append(f"Region: {profile.region.strip()}")

        if profile.allowed_tables:
            lines.append("Allowed tables: " + ", ".join(profile.allowed_tables))
        if profile.forbidden_columns:
            lines.append("Forbidden columns: " + ", ".join(profile.forbidden_columns))

        if profile.language.strip():
            lines.append(f"Language: {profile.language.strip()}")
        if profile.timezone.strip():
            lines.append(f"Timezone: {profile.timezone.strip()}")

        if profile.default_time_granularity.strip():
            lines.append(f"Default time granularity: {profile.default_time_granularity.strip()}")
        if profile.preferred_currency.strip():
            lines.append(f"Preferred currency: {profile.preferred_currency.strip()}")

        if profile.favorite_metrics:
            lines.append("Favorite metrics: " + ", ".join(profile.favorite_metrics))
        if profile.favorite_dimensions:
            lines.append("Favorite dimensions: " + ", ".join(profile.favorite_dimensions))

        return lines

    def format_user_profile(self, profile: UserProfile | None = None) -> str:
        """Render the User profile body, or empty string when there is nothing to show."""
        bound = profile if profile is not None else self.user_profile
        if bound is None:
            return ""
        return self._bullets(self.user_profile_lines(coerce_user_profile(bound)))

    def extension_blocks(self) -> list[tuple[str, str]]:
        """Extra ``(title, body)`` sections inserted before session layout."""
        return []

    def section_blocks(self) -> list[tuple[str, str]]:
        blocks: list[tuple[str, str]] = [("Role", self.role())]
        profile_body = self.format_user_profile()
        if profile_body:
            blocks.append(("User profile", profile_body))
        blocks.append(("General rules", self._bullets(self.general_rules())))
        blocks.extend(self.extension_blocks())
        blocks.append(("Session message layout", self._bullets(self.session_layout())))
        return blocks

    def build(self, user_profile: UserProfile | None = None) -> str:
        """Render the system prompt; optional ``user_profile`` overrides the bound profile."""
        assembler = self if user_profile is None else self.with_profile(user_profile)
        parts: list[str] = []
        for title, body in assembler.section_blocks():
            text = body.strip()
            if not text:
                continue
            parts.append(f"{title}:\n{text}")
        return "\n\n".join(parts) + ("\n" if parts else "")

    @staticmethod
    def _bullets(items: Sequence[str]) -> str:
        return "\n".join(f"- {item}" for item in items if item.strip())

    @staticmethod
    def _numbered(items: Sequence[str]) -> str:
        return "\n".join(f"{i}. {item}" for i, item in enumerate(items, start=1) if item.strip())

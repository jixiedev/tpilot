"""Intent system prompt: toml sections plus the registered intention catalog."""

from __future__ import annotations

from agent.catalog import AgentCatalog
from agent.prompt import SystemPromptAssembler
from config.agent_config import AgentConfig, agent_config_path


class IntentSystemPrompt(SystemPromptAssembler):
    """Classifier prompt. Section text may contain catalog tokens.

    ``{intentions}`` bullet list, ``{prefer}`` preference lines, ``{labels}``
    quoted label list, ``{choices}`` "or" list, ``{threshold}`` clarification
    cutoff from ``run_context``.
    """

    def __init__(self, config: AgentConfig | None = None) -> None:
        super().__init__(config or AgentConfig(agent_config_path("intent")))

    def build(self, user_profile=None) -> str:
        catalog = AgentCatalog.intention_catalog()
        if not catalog:
            raise ValueError("intention catalog is empty; register agents with intention=...")
        labels = [label for label, _ in catalog]
        body = super().build(user_profile)
        return (
            body.replace("{intentions}", _bullets(catalog))
            .replace(
                "{prefer}",
                "\n".join(
                    f"- Prefer {label} when the request matches: {description}."
                    for label, description in catalog
                ),
            )
            .replace("{labels}", " | ".join(f'"{label}"' for label in labels))
            .replace("{choices}", " or ".join(labels))
            .replace("{threshold}", f"{self.config.run_float('clarification_threshold', 0.85):.2f}")
        )

    @staticmethod
    def clarification_question(catalog: list[tuple[str, str]] | None = None) -> str:
        """Fallback question when detection does not supply one."""
        rows = catalog if catalog is not None else AgentCatalog.intention_catalog()
        if not rows:
            return "Which specialist should handle this request?"
        return f"Which intention fits this request: {' or '.join(label for label, _ in rows)}?"


def _bullets(catalog: list[tuple[str, str]]) -> str:
    return "\n".join(f"- {label}: {description}" for label, description in catalog)

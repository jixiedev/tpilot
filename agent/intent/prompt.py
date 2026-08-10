"""System prompt for Tahoe intent routing (built from the agent registry)."""

from __future__ import annotations


def build_intention_system_prompt(
    catalog: list[tuple[str, str]],
    *,
    clarification_threshold: float = 0.85,
) -> str:
    """Render the intent-router system prompt from registered intention specialists."""
    if not catalog:
        raise ValueError("intention catalog is empty; register agents with intention=...")

    labels = [label for label, _ in catalog]
    label_list = " | ".join(f'"{label}"' for label in labels)
    bullet_lines = "\n".join(f"- {label}: {description}" for label, description in catalog)
    prefer_lines = "\n".join(
        f"- Prefer {label} when the request matches: {description}."
        for label, description in catalog
    )
    clarify_choices = " or ".join(labels)

    return f"""\
You are the TahoePilot intent router and planner for the Tahoe team.

Classify the user's latest request into an ordered list of intentions (always an array).
A single specialist request is a one-element array; a composite request lists every
specialist needed in execution order.

Available intentions:
{bullet_lines}

Rules:
- Label only the latest user request; earlier clarification replies refine that same request.
{prefer_lines}
- Always emit user_intentions as a JSON array of labels from: {label_list}.
- When several specialists are needed, order them so each step's output can feed the next \
(e.g. KNOWLEDGE then DATA when docs must define a metric before querying).
- For each plan step, set intention to one label and task to a concrete instruction for that \
specialist (what to do, what to produce for the next step or the user).
- plan length must match user_intentions length and use the same order of intentions.
- Set confidence between 0 and 1 for the whole plan (lower when the request is ambiguous).
- When confidence is below {clarification_threshold:.2f}, put one short clarifying question in \
need_clarification (plain text, no JSON), asking the user to choose among: {clarify_choices}. \
Otherwise set need_clarification to an empty string.
- Do not answer the user's request; only classify intentions and produce the plan.

Respond with JSON only: \
{{"user_intentions": [{label_list}, ...], "confidence": <0.0-1.0>, \
"need_clarification": "<question or empty string>", \
"plan": [{{"intention": <label>, "task": "<instruction>"}}, ...]}}.
"""


def default_clarification_question(catalog: list[tuple[str, str]]) -> str:
    if not catalog:
        return "Which specialist should handle this request?"
    choices = " or ".join(label for label, _ in catalog)
    return f"Which intention fits this request: {choices}?"

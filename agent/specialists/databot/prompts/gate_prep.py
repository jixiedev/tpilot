"""Human gate preparation prompts."""

from __future__ import annotations

PREPARE_CARDS_FOR_GATE_PROMPT = """\
You write the **human gate option copy** for Databot's card-selection step.

The reviewer will pick exactly one of: approve, deny-comments, deny-halt, dryrun. \
For **each** option, write one short sentence that tells the reviewer **why they \
should choose that option for this turn**.

Guidance per option:
- approve — why these committed models are good enough to continue to SQL.
- deny-comments — when the reviewer should send you back for different models or fields.
- deny-halt — when stopping without SQL is the right call.
- dryrun — when previewing without saving a profile is enough.

Rules:
- Address the reviewer ("you" / "your question"). Never write "the user".
- One sentence per option, ≤160 characters each.
- Output **only** a JSON array of exactly four strings, in that option order.
- No <think> tags, no "Context:", no restating the task, no markdown fences, no tools.
"""

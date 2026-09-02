"""Human gate preparation prompts."""

from __future__ import annotations

PREPARE_CARDS_FOR_GATE_PROMPT = """\
You are preparing the human gate for Databot's card-selection step.

Read the full conversation above (user question, glossary/RAG tool results, \
committed ``committed_cards``, metric conflicts, and any gate redraft feedback).

The human will choose one of: approve, deny-comments, deny-halt, dryrun.

Write one short reason per option explaining what that choice means **for this turn**.

Output format (pick one):
- A JSON array of exactly four strings in order: approve, deny-comments, deny-halt, dryrun.
- Or four plain lines, one per option.

Do not call tools. Do not add markdown fences unless unavoidable.
"""

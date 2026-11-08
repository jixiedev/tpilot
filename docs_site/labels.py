"""Reader-facing label mapping for the diagrams.

A label that names a source file is rewritten into the words a reader should see.
Every piece of text that ends up on the site goes through :func:`esc`.
"""

from __future__ import annotations

import re

_READER_LABELS: tuple[tuple[str, str], ...] = (
    ("python main.py", "command line"),
    ("python -m rag plan|run", "a scheduled ingest job"),
    ("python -m evals", "the evaluation runner"),
    ("AgentCatalog(settings).create(name)", "the agent catalog"),
    ("Query path is tools/rag/* · ingest is python -m rag plan|run",
     "A question reads the knowledge base; a scheduled job fills it"),
    ("agui_server.py", "AG-UI server"),
    ("langgraph.json", "graph definition"),
    ("langgraph dev", "local dev server"),
    ("parse_resume() accepts a decision string or {decision, comments}",
     "A decision, with optional comments"),
    ("on_interrupt asks in the terminal, then Command(resume=…)",
     "The terminal asks you, then the turn resumes"),
    ("gates.py payload", "the approval payload"),
    ("409 if the action is not allowed in the current stage",
     "The action is refused in the current stage"),
    ("EvalReactListener · intent cases stop after publish (handoff=False)",
     "Every case is scored; routing cases stop once the answer is published"),
    ("direct run()", "direct call"),
    ("RunAgentInput", "the request"),
    ("AgentTurnResult", "the turn result"),
    ("IntentionResponse", "the routing decision"),
    ("ToolMessages", "structured tool results"),
    ("interrupt()", "the approval request"),
    ("CopilotChat", "the chat panel"),
    ("CopilotRuntime", "the runtime"),
    ("GatePanel", "the approval panel"),
    ("agent.run", "the agent runs"),
    ("commit_turn", "save the turn"),
    ("new_turn_state", "the turn state"),
    ("begin_turn", "start the turn"),
    ("route_target", "the chosen specialist"),
    ("create_plan", "write the plan"),
    ("adjust_plan", "adjust the plan"),
    ("invoke_agent", "call the specialist"),
    ("sub_agent_round", "a specialist's turn"),
    ("plan_id", "the plan"),
    ("step_reason", "reason about what to do"),
    ("step_action", "choose an action"),
    ("end__", "end"),
    ("on_start", "at the start of a turn"),
    ("execute_sql", "run the query"),
    ("generate_sql", "write the query"),
    ("trino_run_query", "Trino: run query"),
    ("fetch_cards", "collect the result cards"),
    ("gate_cards", "approve the result cards"),
    ("gate_sql", "approve the query"),
    ("ingest_task", "the ingest job"),
    ("api/databot", "the databot endpoint"),
    ("api/copilotkit", "the chat endpoint"),
    ("request/actions", "approval requests"),
    ("agui/actions", "approval actions"),
    ("/api/databot/actions", "the databot approval endpoint"),
    ("__end__", "end"),
    ("aupdate_state", "update the state"),
    ("cli.py", "CLI"),
    ("main.py", "command line"),
    ("AgentCatalog", "agent catalog"),
    ("config/agents", "configuration"),
    ("config TOML", "configuration"),
    (".local/", "local storage"),
    ("agent/", "agents"),
    ("graph/", "orchestration"),
    ("tools/", "tools"),
    ("memory/", "memory"),
    ("rag/", "knowledge"),
    ("errors.py", "the error catalogue"),
    ("ToolErrorType", "the error type"),
    ("TOOL ERROR json", "a structured error"),
    ("bge-reranker-v2-m3", "the reranking model"),
    ("large ToolMessage", "a large tool result"),
    ("write-tool args", "write tool arguments"),
    ("prior-turn Q&A only", "earlier questions and answers only"),
    ("LLM head fold", "the model summarizes"),
    ("L1 offload", "first: offload"),
    ("L1b fold", "then: fold old answers"),
    ("L2 evict", "then: evict"),
    ("L3 summarize", "then: summarize"),
    ("if fill", "when the context fills"),
    ("agent tool", "the agent compacts"),
    ("text / budget", "context budget"),
    ("top_k hits", "top matches"),
    ("dense ∥ sparse", "vector ∥ keyword"),
    ("dedupe by key", "duplicates are removed"),
    ("You> prompt", "you ask a question"),
    ("POST /agui/actions", "an approval request"),
    ("POST /agui", "streaming request"),
    ("POST message", "send a message"),
    ("deny-comments", "comments on a rejection"),
    ("deny-halt", "stop"),
    ("frontend", "browser client"),
    ("run_repl", "interactive session"),
    ("turn_repl", "interactive session"),
    ("repl", "interactive session"),
)

_LABEL_PATTERN = re.compile(
    "|".join(
        r"(?<![\w])" + re.escape(source) + r"(?![\w])"
        for source, _ in sorted(_READER_LABELS, key=lambda pair: -len(pair[0]))
    )
)
_LABEL_LOOKUP = dict(_READER_LABELS)


def _reader_label(text: str) -> str:
    """Swap code-shaped labels for the words a reader should see."""
    return _LABEL_PATTERN.sub(lambda match: _LABEL_LOOKUP[match.group(0)], text)


def _esc(text: str) -> str:
    return _reader_label(text).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

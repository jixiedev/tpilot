"""RAG tools: Jira ticket search and dbt semantic model search."""

from tahoepilot.tools.rag.jira import TOOLS as jira_tools
from tahoepilot.tools.rag.jira import fetch_related_jira_tickets
from tahoepilot.tools.rag.dbt_models import (
    TOOLS as semantic_tools,
    commit_cards,
    dict_to_table_card,
    fetch_related_models,
)

TOOLS = [*jira_tools, *semantic_tools]

__all__ = [
    "TOOLS",
    "commit_cards",
    "dict_to_table_card",
    "fetch_related_jira_tickets",
    "fetch_related_models",
]

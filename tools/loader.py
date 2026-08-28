"""Shared tool loading for data-plane integrations."""

from __future__ import annotations

from langchain_core.tools import BaseTool

from tools.code import TOOLS as code_tools
from tools.data.hive import TOOLS as hive_tools
from tools.data.s3 import TOOLS as s3_tools
from tools.data.trino import TOOLS as trino_tools
from tools.external.datahub import TOOLS as datahub_tools
from tools.mcp.mcp import get_datahub_mcp_tools, get_mcp_tools
from tools.plan import TOOLS as plan_tools
from tools.web.search import tools_if_enabled as web_search_tools


def load_general_tools() -> list[BaseTool]:
    """Local coding / search / planning tools shared by Tahoe team agents."""
    return [*code_tools, *web_search_tools(), *plan_tools]


async def load_data_tools() -> list[BaseTool]:
    """Tools for the data-retrieval agent (MCP / DataHub / Hive / Trino / S3 / dbt RAG).

    RAG tools (``fetch_related_models`` + ``add_card_to_state``) are also
    exposed to KnowledgeAgent via ``load_knowledge_tools``; they live here
    because the canonical workflow (fetch TableCard → human approve → state
    → SQL) is the Databot path.
    """
    from tools.rag import TOOLS as rag_tools

    mcp_tools = await get_mcp_tools()
    return [*mcp_tools, *datahub_tools, *hive_tools, *trino_tools, *s3_tools, *rag_tools]


async def load_knowledge_tools() -> list[BaseTool]:
    """Tools for knowledge-oriented agents (DataHub MCP + K8s + indexed docs/Jira).

    Prefers the configured ``datahub`` MCP server. Falls back to native GraphQL
    DataHub tools when MCP is not configured or fails to load.
    """
    from tools.k8s import TOOLS as k8s_tools
    from tools.rag import TOOLS as rag_tools

    mcp_datahub = await get_datahub_mcp_tools()
    catalog_tools = mcp_datahub if mcp_datahub else datahub_tools
    return [*catalog_tools, *k8s_tools, *s3_tools, *rag_tools]

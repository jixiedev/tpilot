from __future__ import annotations

import compat  # noqa: F401 — TypedDict shim before agent / graph imports

from langgraph.checkpoint.memory import MemorySaver

from agent.catalog import AgentCatalog, AgentCatalogSettings
from config.local_config import ensure_local_dirs, get_local_paths
from agent.runtime import TahoeRuntimeHelper
from models.llm import get_default_model


async def ui_agent_graph(agent_name: str):
    profile_store = TahoeRuntimeHelper.default_profile_store(get_local_paths().profiles_dir)
    catalog = AgentCatalog(
        AgentCatalogSettings.for_agent(
            agent_name,
            profile_store=profile_store,
            model=get_default_model(),
            checkpointer=MemorySaver(),
            max_tool_calls=30,
        )
    )
    agent = await catalog.create(agent_name)
    return agent.graph


async def databot_ui_agent():
    ensure_local_dirs()
    return await ui_agent_graph("databot")


async def knowledge_ui_agent():
    ensure_local_dirs()
    return await ui_agent_graph("knowledge")


async def intent_ui_agent():
    ensure_local_dirs()
    return await ui_agent_graph("intent")

from langgraph.checkpoint.memory import MemorySaver

from agent.registry import get_agent
from memory import CompressionConfig
from models.models import get_default_model


async def databot_ui_agent():
    spec = get_agent("databot")
    agent = await spec.create_agent(max_tool_calls=30)
    checkpointer = MemorySaver()
    await agent.bind(get_default_model(), checkpointer=checkpointer, compression_config=CompressionConfig(enabled=True))
    return agent._graph

async def knowledge_ui_agent():
    spec = get_agent("knowledge")
    agent = await spec.create_agent(max_tool_calls=30)
    checkpointer = MemorySaver()
    await agent.bind(get_default_model(), checkpointer=checkpointer, compression_config=CompressionConfig(enabled=True))
    return agent._graph

async def intent_ui_agent():
    spec = get_agent("intent")
    agent = await spec.create_agent(max_tool_calls=30)
    checkpointer = MemorySaver()
    await agent.bind(get_default_model(), checkpointer=checkpointer, compression_config=CompressionConfig(enabled=True))
    return agent._graph
from langgraph.checkpoint.memory import MemorySaver

from agent.registry import get_agent
from memory import CompressionConfig
from models.models import default_model


async def ui_agent(agent_name: str ="tahoe"):
    spec = get_agent(agent_name)
    agent = await spec.create_agent(max_tool_calls=30)
    checkpointer = MemorySaver()
    await agent.bind(default_model, checkpointer=checkpointer, compression_config=CompressionConfig(enabled=True))
    return agent._graph
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.prebuilt import ToolNode, tools_condition
from langchain.chat_models import init_chat_model

from tools.mcp.mcp import get_mcp_tools
from tools.hive import TOOLS as hive_tools
from tools.trino import TOOLS as trino_tools

async def build_chat_graph():
    mcp_tools = await get_mcp_tools()
    inner_tools = [*hive_tools, *trino_tools]
    tools = mcp_tools + inner_tools
    def llm(state: MessagesState):
        return {}

    graph = StateGraph(MessagesState)
    graph.add_node("llm", llm)
    graph.add_node("tools", ToolNode(tools))
    graph.add_edge(START, "llm")
    graph.add_conditional_edges("llm", tools_condition)
    graph.add_edge("tools", "llm")
    graph.add_edge("llm", END)
    return graph.compile()


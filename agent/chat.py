from langchain_core.language_models import BaseChatModel
from langchain_core.messages import SystemMessage
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.prebuilt import ToolNode, tools_condition

from models.models import default_model
from tools.hive import TOOLS as hive_tools
from tools.mcp.mcp import get_mcp_tools
from tools.trino import TOOLS as trino_tools
from prompt import SYSTEM_PROMPT, NEXT_SYSTEM_PROMPT


def llm_node(model, system_prompt):
    def llm_call(state: MessagesState):
        messages = state["messages"]
        if system_prompt:
            messages = [SystemMessage(system_prompt)] + messages
        response = model.invoke(messages)
        return {"messages": [response]}

    return llm_call

async def build_chat_graph(system_prompt: str, next_step_prompt: str, model: BaseChatModel=default_model):
    mcp_tools = await get_mcp_tools()
    inner_tools = [*hive_tools, *trino_tools]
    tools = mcp_tools + inner_tools


    graph = StateGraph(MessagesState)
    graph.add_node("llm", llm_node(model, system_prompt))
    graph.add_node("step_llm", llm_node(model, next_step_prompt))
    graph.add_node("tools", ToolNode(tools))
    graph.add_edge(START, "llm")
    graph.add_edge("llm", "step_llm")
    graph.add_conditional_edges("step_llm", tools_condition)
    graph.add_edge("tools", "step_llm")
    graph.add_edge("step_llm", END)
    return graph.compile()

async def main():
    user_prompt = ""
    graph = await build_chat_graph(SYSTEM_PROMPT, NEXT_SYSTEM_PROMPT)
    final_state = graph.invoke({"messages": [("user", user_prompt)]})

import asyncio
asyncio.run(main())

from langgraph.graph import StateGraph, MessagesState, START, END

def mock_llm(state: MessagesState):
    print("function call")
    return {"message": [{"role": "ai", "content": "hello world"}]}


def main():
    graph = StateGraph(MessagesState)
    graph.add_node(mock_llm)
    graph.add_edge(START, "mock_llm")
    graph.add_edge("mock_llm", END)
    graph = graph.compile()
    s = graph.invoke({"messages": [{"role": "user", "content": "hi!"}]})
    print(s)


if __name__ == "__main__":
    main()

from __future__ import annotations


def test_inject_completion_as_ai_node_mirrors_tool_reply() -> None:
    from langchain_core.messages import HumanMessage, ToolMessage

    from agent.react import make_inject_completion_as_ai_node

    node = make_inject_completion_as_ai_node()
    state = {
        "messages": [
            HumanMessage(content="q"),
            ToolMessage(content="GMV was 1M.", name="chat_completion", tool_call_id="1"),
        ],
    }

    update = node(state)

    assert len(update["messages"]) == 1
    assert update["messages"][0].content == "GMV was 1M."


def test_inject_completion_as_ai_node_noop_without_completion() -> None:
    from langchain_core.messages import HumanMessage

    from agent.react import make_inject_completion_as_ai_node

    node = make_inject_completion_as_ai_node()
    state = {"messages": [HumanMessage(content="q")]}

    assert node(state) == {}

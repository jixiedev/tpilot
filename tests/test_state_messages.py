from __future__ import annotations

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

from state.state import has_prior_turns, last_ai_message, latest_human_text, message_text


def test_message_text_normalizes_blocks() -> None:
    assert message_text("  hi  ") == "hi"
    assert message_text([{"type": "text", "text": "a"}, "b"]) == "a\nb"
    assert message_text(None) == ""


def test_latest_human_text_and_last_ai_message() -> None:
    state = {
        "messages": [
            SystemMessage(content="sys"),
            HumanMessage(content="first"),
            AIMessage(content=""),
            AIMessage(content="answer"),
            HumanMessage(content="  latest  "),
        ]
    }
    assert latest_human_text(state) == "latest"
    assert last_ai_message(state).content == "answer"
    assert has_prior_turns(state["messages"])
    assert not has_prior_turns([SystemMessage(content="sys")])

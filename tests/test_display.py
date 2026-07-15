from __future__ import annotations

from langchain_core.messages import AIMessage

from agent.chatbot.display import format_llm_step, message_text_content, print_llm_step


def test_message_text_content_string() -> None:
    assert message_text_content("  hello  ") == "hello"


def test_message_text_content_blocks() -> None:
    content = [
        {"type": "text", "text": "plan step"},
        {"type": "thinking", "thinking": "internal reasoning"},
    ]
    assert message_text_content(content) == "plan step\ninternal reasoning"


def test_format_llm_step_skips_empty_content() -> None:
    assert format_llm_step(AIMessage(content="")) is None
    assert format_llm_step(AIMessage(content=[], tool_calls=[])) is None


def test_format_llm_step_renders_text() -> None:
    message = AIMessage(content="Search glossary for GMV first.")
    assert format_llm_step(message) == "LLM> Search glossary for GMV first."


def test_print_llm_step_writes_to_stdout(capsys) -> None:
    print_llm_step(AIMessage(content="Next: list tables."))
    assert capsys.readouterr().out == "LLM> Next: list tables.\n"

from __future__ import annotations

from langchain_core.messages import AIMessage

from agent.listener import CliReactListener
from agent.react.tahoe.tools import CHAT_COMPLETION_TOOL_NAME


def _listener() -> CliReactListener:
    return CliReactListener(completion_tool_name=CHAT_COMPLETION_TOOL_NAME)


def test_message_text_content_string() -> None:
    assert CliReactListener.message_text_content("  hello  ") == "hello"


def test_message_text_content_blocks() -> None:
    content = [
        {"type": "text", "text": "plan step"},
        {"type": "thinking", "thinking": "internal reasoning"},
    ]
    assert CliReactListener.message_text_content(content) == "plan step\ninternal reasoning"


def test_format_llm_step_skips_empty_content() -> None:
    listener = _listener()
    assert listener.format_llm_step(AIMessage(content="")) is None
    assert listener.format_llm_step(AIMessage(content=[], tool_calls=[])) is None


def test_format_llm_step_renders_text() -> None:
    listener = _listener()
    message = AIMessage(content="Search glossary for GMV first.")
    assert listener.format_llm_step(message) == "LLM> Search glossary for GMV first."


def test_print_llm_step_writes_to_stdout(capsys) -> None:
    _listener().print_llm_step(AIMessage(content="Next: list tables."))
    assert capsys.readouterr().out == "LLM> Next: list tables.\n"

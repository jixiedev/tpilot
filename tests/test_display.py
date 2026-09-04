from __future__ import annotations

from langchain_core.messages import AIMessage

from agent.listener import CliReactListener


def _listener() -> CliReactListener:
    return CliReactListener()


_TOOL_CALL = {
    "name": "datahub_search_glossary",
    "args": {"query": "GMV"},
    "id": "1",
    "type": "tool_call",
}


def test_message_text_content_string() -> None:
    assert CliReactListener.message_text_content("  hello  ") == "hello"


def test_message_text_content_skips_thinking_blocks() -> None:
    content = [
        {"type": "text", "text": "plan step"},
        {"type": "thinking", "thinking": "internal reasoning"},
    ]
    assert CliReactListener.message_text_content(content) == "plan step"


def test_message_reasoning_from_blocks_and_kwargs() -> None:
    message = AIMessage(
        content=[
            {"type": "text", "text": "plan step"},
            {"type": "thinking", "thinking": "from block"},
        ],
        additional_kwargs={"reasoning_content": "from kwargs"},
        tool_calls=[_TOOL_CALL],
    )
    reasoning = CliReactListener.message_reasoning(message)
    assert "from kwargs" in reasoning
    assert "from block" in reasoning


def test_format_reason_step_skips_empty_content() -> None:
    listener = _listener()
    assert listener.format_reason_step(AIMessage(content="")) is None
    assert listener.format_reason_step(AIMessage(content=[], tool_calls=[])) is None


def test_format_reason_step_skips_plain_text_without_tools() -> None:
    listener = _listener()
    message = AIMessage(content="I am Knowledge, a specialist.")
    assert listener.format_reason_step(message) is None


def test_format_reason_step_renders_text_with_tool_calls() -> None:
    listener = _listener()
    message = AIMessage(
        content="Search glossary for GMV first.",
        tool_calls=[_TOOL_CALL],
    )
    assert listener.format_reason_step(message) == "LLM> Search glossary for GMV first."


def test_format_reason_step_includes_reason_with_tool_calls() -> None:
    listener = _listener()
    message = AIMessage(
        content="Search glossary for GMV first.",
        additional_kwargs={"reasoning": "Need glossary before answering."},
        tool_calls=[_TOOL_CALL],
    )
    assert listener.format_reason_step(message) == (
        "Reason> Need glossary before answering.\n"
        "LLM> Search glossary for GMV first."
    )


def test_format_reason_step_reason_only_with_tool_calls() -> None:
    listener = _listener()
    message = AIMessage(
        content="",
        additional_kwargs={"reasoning_content": "Call Jira search."},
        tool_calls=[_TOOL_CALL],
    )
    assert listener.format_reason_step(message) == "Reason> Call Jira search."


def test_format_reason_start_includes_budget() -> None:
    listener = _listener()
    assert listener.format_reason_start(
        tool_call_count=3,
        max_tool_calls=30,
        idle_rounds=1,
    ) == "Status> LLM thinking (tools=3/30, idle=1)"


def test_on_reason_start_writes_to_stdout(capsys) -> None:
    _listener().on_reason_start(tool_call_count=0, max_tool_calls=10, idle_rounds=0)
    assert capsys.readouterr().out == "Status> LLM thinking (tools=0/10, idle=0)\n"


def test_on_status_writes_to_stdout(capsys) -> None:
    _listener().on_status("Intent routing…")
    assert capsys.readouterr().out == "Status> Intent routing…\n"


def test_on_reason_step_writes_to_stdout(capsys) -> None:
    _listener().on_reason_step(
        AIMessage(
            content="Next: list tables.",
            tool_calls=[
                {
                    "name": "hive_list_tables",
                    "args": {},
                    "id": "1",
                    "type": "tool_call",
                }
            ],
        )
    )
    assert capsys.readouterr().out == "LLM> Next: list tables.\n"


def test_on_reason_step_silent_without_tools(capsys) -> None:
    _listener().on_reason_step(AIMessage(content="plain idle answer"))
    assert capsys.readouterr().out == ""


def test_format_tool_result_preview() -> None:
    listener = CliReactListener(result_preview_chars=20)
    long = "x" * 50
    rendered = listener.format_tool_result("fetch_related_jira_tickets", long)
    assert rendered is not None
    assert rendered.startswith("Result> fetch_related_jira_tickets: ")
    assert "more chars)" in rendered


def test_on_tool_result_writes_to_stdout(capsys) -> None:
    _listener().on_tool_result("hive_list_tables", '["a","b"]')
    assert capsys.readouterr().out == 'Result> hive_list_tables: ["a","b"]\n'


def test_on_turn_output_uses_current_turn_assistant_text(capsys) -> None:
    from langchain_core.messages import HumanMessage

    listener = _listener()
    state = {
        "messages": [
            HumanMessage(content="old question"),
            AIMessage(content="old answer"),
            HumanMessage(content="new question"),
            AIMessage(content="plain idle answer this turn"),
        ]
    }
    listener.on_turn_output(state)
    assert capsys.readouterr().out == "Assistant> plain idle answer this turn\n"


def test_on_turn_output_without_current_reply(capsys) -> None:
    from langchain_core.messages import HumanMessage

    listener = _listener()
    state = {
        "messages": [
            HumanMessage(content="old question"),
            AIMessage(content="old answer"),
            HumanMessage(content="new question"),
        ]
    }
    listener.on_turn_output(state)
    assert capsys.readouterr().out == "Assistant> (no reply)\n"

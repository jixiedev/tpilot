from __future__ import annotations

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

from graph.classify import (
    TurnClassification,
    coerce_turn_classification,
    latest_human_text,
    make_classify_task_node,
    resolve_turn_task_type,
)
from state.state import DEFAULT_TURN_TASK_TYPE


class _FakeStructuredModel:
    def __init__(self, result: TurnClassification | dict):
        self._result = result
        self.invoke_calls: list[list] = []

    def invoke(self, messages):
        self.invoke_calls.append(messages)
        return self._result


class _FakeChatModel:
    def __init__(self, result: TurnClassification | dict):
        self.structured = _FakeStructuredModel(result)

    def with_structured_output(self, _schema):
        return self.structured


def test_latest_human_text_returns_most_recent_human() -> None:
    state = {
        "messages": [
            SystemMessage(content="sys"),
            HumanMessage(content="first"),
            AIMessage(content="ack"),
            HumanMessage(content="  latest question  "),
        ]
    }

    assert latest_human_text(state) == "latest question"


def test_latest_human_text_supports_block_content() -> None:
    state = {
        "messages": [
            HumanMessage(content=[{"type": "text", "text": "block request"}]),
        ]
    }

    assert latest_human_text(state) == "block request"


def test_latest_human_text_none_when_missing() -> None:
    assert latest_human_text({"messages": [SystemMessage(content="only sys")]}) is None
    assert latest_human_text({"messages": []}) is None


def test_resolve_turn_task_type_low_confidence_becomes_unclear() -> None:
    result = TurnClassification(turn_task_type="data_query", confidence=0.2)
    assert resolve_turn_task_type(result, min_confidence=0.5) == DEFAULT_TURN_TASK_TYPE


def test_resolve_turn_task_type_keeps_confident_label() -> None:
    result = TurnClassification(turn_task_type="table_meta", confidence=0.9)
    assert resolve_turn_task_type(result) == "table_meta"


def test_classify_task_node_writes_type_without_messages() -> None:
    model = _FakeChatModel(TurnClassification(turn_task_type="metric_def", confidence=0.8))
    node = make_classify_task_node("Classify the request.", model)
    state = {"messages": [HumanMessage(content="What does GMV mean?")]}

    update = node(state)

    assert update == {"turn_task_type": "metric_def"}
    assert "messages" not in update
    sent = model.structured.invoke_calls[0]
    assert isinstance(sent[0], SystemMessage)
    assert sent[0].content.startswith("Classify the request.")
    assert "JSON" in sent[0].content
    assert isinstance(sent[1], HumanMessage)
    assert sent[1].content == "What does GMV mean?"


def test_classify_task_node_defaults_when_no_human_message() -> None:
    model = _FakeChatModel(TurnClassification(turn_task_type="data_query", confidence=1.0))
    node = make_classify_task_node("Classify the request.", model)

    update = node({"messages": [SystemMessage(content="sys")]})

    assert update == {"turn_task_type": DEFAULT_TURN_TASK_TYPE}
    assert model.structured.invoke_calls == []


def test_classify_task_node_accepts_dict_structured_result() -> None:
    model = _FakeChatModel({"turn_task_type": "anomaly", "confidence": 0.95})
    node = make_classify_task_node("Classify the request.", model)

    update = node({"messages": [HumanMessage(content="Why did revenue drop?")]})

    assert update == {"turn_task_type": "anomaly"}


def test_coerce_turn_classification_parses_loose_text() -> None:
    result = coerce_turn_classification("data_query\n1")
    assert result.turn_task_type == "data_query"
    assert result.confidence == 1.0


def test_coerce_turn_classification_parses_json_string() -> None:
    result = coerce_turn_classification('{"turn_task_type": "metric_def", "confidence": 0.8}')
    assert result.turn_task_type == "metric_def"
    assert result.confidence == 0.8


class _LooseTextModel:
    def with_structured_output(self, _schema):
        class _Broken:
            def invoke(self, _messages):
                raise ValueError("Invalid JSON: expected value at line 1 column 1")

        return _Broken()

    def invoke(self, messages):
        self.last_messages = messages
        return "data_query\n0.9"


def test_classify_task_node_falls_back_to_plain_text() -> None:
    node = make_classify_task_node("Classify the request.", _LooseTextModel())
    update = node({"messages": [HumanMessage(content="GMV last month?")]})
    assert update == {"turn_task_type": "data_query"}


def test_classify_task_node_invokes_listener() -> None:
    seen: list[tuple[str, float | None, str | None]] = []

    def listener(resolved, confidence, model_label):
        seen.append((resolved, confidence, model_label))

    model = _FakeChatModel(TurnClassification(turn_task_type="data_query", confidence=0.2))
    node = make_classify_task_node("Classify the request.", model, on_classify=listener)
    update = node({"messages": [HumanMessage(content="GMV last month?")]})

    assert update == {"turn_task_type": DEFAULT_TURN_TASK_TYPE}
    assert seen == [(DEFAULT_TURN_TASK_TYPE, 0.2, "data_query")]

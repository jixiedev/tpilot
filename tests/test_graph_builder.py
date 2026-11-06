"""build_react_graph wiring and ReactLoopSpec parsing."""

from __future__ import annotations

from langchain_core.language_models.fake_chat_models import FakeMessagesListChatModel
from langchain_core.messages import AIMessage
from langgraph.graph import START

from agent.router import CompletionToolRouter
from graph.builder import (
    COMPRESS_ON_START,
    REACT_TURN_INIT,
    STEP_REASON,
    ReactLoopSpec,
    ReactStateSpec,
    build_react_graph,
)


class _Model(FakeMessagesListChatModel):
    def bind_tools(self, tools, **kwargs):  # type: ignore[override]
        return self


def _edges(compiled) -> set[tuple[str, str]]:
    return {(e.source, e.target) for e in compiled.get_graph().edges}


def _build(**kwargs):
    return build_react_graph(
        _Model(responses=[AIMessage(content="ok")]),
        [],
        router=CompletionToolRouter({}),
        loop=ReactLoopSpec("next"),
        **kwargs,
    )


def test_turn_init_and_compressor_are_both_wired_in_order():
    compiled = _build(
        state=ReactStateSpec(turn_init=lambda _s: {}),
        compressor=lambda _s: {},  # type: ignore[arg-type]
    )
    edges = _edges(compiled)
    assert (START, REACT_TURN_INIT) in edges
    assert (REACT_TURN_INIT, COMPRESS_ON_START) in edges
    assert (COMPRESS_ON_START, STEP_REASON) in edges


def test_plain_loop_starts_at_step_reason():
    assert (START, STEP_REASON) in _edges(_build())


def test_loop_spec_from_run_context_defaults():
    spec = ReactLoopSpec.from_run_context({"next_step": "go", "max_tool_calls": 4})
    assert spec == ReactLoopSpec("go", max_tool_calls=4)
    assert ReactLoopSpec.from_run_context({}).max_tool_calls == 10

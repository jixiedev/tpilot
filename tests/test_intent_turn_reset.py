"""Intent per-turn state: question and clarification rounds belong to one question."""

from __future__ import annotations

from typing import Any

from langgraph.checkpoint.memory import MemorySaver

from agent.catalog import AgentCatalog, AgentCatalogSettings
from agent.intent.orchestrator import IntentOrchestrator, IntentionResponse
from agent.turn import AgentTurnResult
from memory.profile_store import FileProfileStore


class _ScriptedIntentModel:
    """Structured intent model that returns scripted responses in order."""

    def __init__(self, results: list[IntentionResponse]) -> None:
        self._results = results
        self.calls = 0

    def with_structured_output(self, _schema):
        return self

    def bind_tools(self, tools, **kwargs):
        return self

    def invoke(self, _messages):
        result = self._results[min(self.calls, len(self._results) - 1)]
        self.calls += 1
        return result


def _confident(label: str) -> IntentionResponse:
    return IntentionResponse(user_intention=label, confidence=0.95, need_clarification="")


def _unsure() -> IntentionResponse:
    return IntentionResponse(
        user_intention="DATA",
        confidence=0.3,
        need_clarification="Warehouse data or team docs?",
    )


async def _intent(tmp_path, model: Any) -> IntentOrchestrator:
    catalog = AgentCatalog(
        AgentCatalogSettings.for_agent(
            "intent",
            profile_store=FileProfileStore(tmp_path),
            model=model,
            checkpointer=MemorySaver(),
        )
    )
    return await catalog.create("intent")  # type: ignore[return-value]


async def test_second_turn_routes_and_hands_off_its_own_question(tmp_path) -> None:
    agent = await _intent(tmp_path, _ScriptedIntentModel([_confident("DATA")]))
    handed_off: list[str] = []

    class _Target:
        async def run(self, prompt, *, session, user_id=None, on_interrupt=None):
            handed_off.append(prompt)
            return AgentTurnResult(state={"messages": []})

    async def _get(_name: str):
        return _Target()

    agent._catalog.get_or_create = _get  # type: ignore[method-assign]

    first = await agent.run("GMV yesterday?", session="s-q", print_output=False)
    second = await agent.run("Orders last week?", session="s-q", print_output=False)

    assert first.state["user_question"] == "GMV yesterday?"
    assert second.state["user_question"] == "Orders last week?"
    assert handed_off == ["GMV yesterday?", "Orders last week?"]


async def test_clarification_rounds_reset_for_each_new_question(tmp_path) -> None:
    agent = await _intent(tmp_path, _ScriptedIntentModel([_unsure()]))
    questions: list[str] = []

    async def on_interrupt(question: str) -> str:
        questions.append(question)
        return "not sure"

    first = await agent.run(
        "numbers?", session="s-c", on_interrupt=on_interrupt, print_output=False, handoff=False
    )
    assert first.state["status"] == "rejected"
    assert len(questions) == agent.max_clarification_rounds

    questions.clear()
    second = await agent.run(
        "other numbers?", session="s-c", on_interrupt=on_interrupt, print_output=False, handoff=False
    )
    assert second.state["status"] == "rejected"
    # Clarification is available again for the new question.
    assert len(questions) == agent.max_clarification_rounds
    assert second.state["clarification_rounds"] == agent.max_clarification_rounds


async def test_clarifying_answer_sent_as_new_turn_continues_the_question(tmp_path) -> None:
    model = _ScriptedIntentModel([_unsure(), _confident("KNOWLEDGE")])
    agent = await _intent(tmp_path, model)

    async def cancel(_question: str) -> None:
        return None

    paused = await agent.run(
        "How does tahoe deploy?", session="s-p", on_interrupt=cancel, print_output=False
    )
    assert paused.cancelled

    done = await agent.run("team docs", session="s-p", print_output=False, handoff=False)
    assert done.state["status"] == "published"
    assert done.state["route_target"] == "knowledge"
    # The answer completes the open clarification; the routed question is unchanged.
    assert done.state["user_question"] == "How does tahoe deploy?"
    assert done.state["clarification_rounds"] == 1


def test_begin_turn_node_resets_unless_clarification_pending() -> None:
    finished = {
        "status": "published",
        "user_question": "q1",
        "clarification_rounds": 2,
        "need_clarification": "",
    }
    assert IntentOrchestrator.begin_turn_node(finished) == {
        "user_question": "",
        "clarification_rounds": 0,
        "need_clarification": "",
    }
    pending = {
        "status": "pending",
        "user_question": "q1",
        "clarification_rounds": 0,
        "need_clarification": "Which one?",
    }
    assert IntentOrchestrator.begin_turn_node(pending) == {
        "clarification_rounds": 1,
        "need_clarification": "",
    }

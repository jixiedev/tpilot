from __future__ import annotations

import pytest
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage

from agent.turn import AgentTurnResult
from evals.routing_case import (
    LeadRoutingCase,
    extract_lead_outcome,
    find_routing_cases,
    format_routing_case_result,
)


def _case(**overrides) -> LeadRoutingCase:
    defaults = {
        "name": "sample",
        "case_group": "routing/lead",
        "query": "q",
        "expected_decision": "delegate",
        "expected_routes": ["warehouse"],
        "models": ["m"],
    }
    defaults.update(overrides)
    return LeadRoutingCase(**defaults)


def _delegate(agent: str, call_id: str) -> list:
    return [
        AIMessage(content="", tool_calls=[{"name": "delegate", "args": {"agent": agent, "task": "t"}, "id": call_id}]),
        ToolMessage(content="{}", tool_call_id=call_id, name="delegate"),
    ]


def test_outcome_classifies_each_decision() -> None:
    prior = [HumanMessage(content="old"), *_delegate("swe", "old"), AIMessage(content="old answer")]
    delegate = {"messages": [*prior, HumanMessage(content="q"), *_delegate("warehouse", "c1"), AIMessage(content="42")]}
    assert extract_lead_outcome(delegate)["decision"] == "delegate"
    assert extract_lead_outcome(delegate)["routes"] == ["warehouse"]  # prior turn not counted

    plan_call = AIMessage(content="", tool_calls=[{"name": "write_plan", "args": {"steps": []}, "id": "p"}])
    plan = {
        "messages": [
            HumanMessage(content="q"),
            plan_call,
            ToolMessage(content="Plan saved", tool_call_id="p", name="write_plan"),
            *_delegate("knowledge", "c2"),
            *_delegate("warehouse", "c3"),
            AIMessage(content="done"),
        ]
    }
    assert extract_lead_outcome(plan) == {
        "decision": "plan",
        "routes": ["knowledge", "warehouse"],
        "reply": "done",
    }
    assert extract_lead_outcome({"messages": [HumanMessage(content="q"), AIMessage(content="Which region?")]})[
        "decision"
    ] == "clarify"
    assert extract_lead_outcome({"messages": [HumanMessage(content="hi"), AIMessage(content="Hello!")]})[
        "decision"
    ] == "answer"


def test_score_and_format() -> None:
    state = {"messages": [HumanMessage(content="q"), *_delegate("warehouse", "c1"), AIMessage(content="42")]}
    result = _case().score(AgentTurnResult(state=state))
    assert result.score.tool_score == 1.0
    assert result.score.answer_score == 1.0
    assert result.score.round_score == 1.0
    text = format_routing_case_result(result)
    assert "decision: expected=delegate actual=delegate" in text

    wrong = _case(expected_decision="answer", expected_routes=[], max_delegations=0).score(
        AgentTurnResult(state=state)
    )
    assert wrong.score.tool_score == 0.0
    assert wrong.score.round_score == 0.0


def test_invalid_decision_rejected() -> None:
    with pytest.raises(ValueError, match="expected_decision"):
        _case(expected_decision="publish")


def test_routing_cases_file_loads() -> None:
    cases = find_routing_cases(["routing"])
    names = {case.name for case in cases}
    assert {"data_gmv_query", "composite_gmv_definition_then_query", "clarify_ambiguous_revenue"} <= names
    plan = next(c for c in cases if c.name == "composite_gmv_definition_then_query")
    assert plan.expected_decision == "plan"
    assert plan.expected_routes == ["knowledge", "warehouse"]

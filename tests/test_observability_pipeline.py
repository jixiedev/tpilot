"""EvalRunner and EvalPipeline end to end with fake agents."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from agent.turn import AgentTurnResult
from observability.case import CaseLoader, IntentEvalCase, ReactEvalCase
from observability.pipeline import EvalPipeline
from observability.runner import EvalRunner


class FakeAgent:
    """Emits scripted tool calls to secondary listeners and returns a fixed state."""

    def __init__(self, state: dict, tools: tuple[str, ...] = ()) -> None:
        self.state = state
        self.tools = tools
        self.listeners: list = []
        self.calls: list[dict] = []

    def register_secondary(self, listener) -> None:
        self.listeners.append(listener)

    def clear_secondaries(self) -> None:
        self.listeners.clear()

    async def run(self, prompt: str, **kwargs) -> AgentTurnResult:
        self.calls.append({"prompt": prompt, **kwargs})
        for name in self.tools:
            for listener in self.listeners:
                listener.on_tool_call(name, {})
        return AgentTurnResult(state=dict(self.state))


class FakeRunner(EvalRunner):
    def __init__(self, agents: dict[tuple[str, str], FakeAgent]) -> None:
        super().__init__()
        self.fakes = agents

    async def create_agent(self, agent_name: str, model_name: str) -> FakeAgent:
        return self.fakes[(agent_name, model_name)]


async def test_runner_records_tools_reply_and_kwargs() -> None:
    agent = FakeAgent({"reply": '{"x": 1}'}, tools=("planning", "bash"))
    case = ReactEvalCase(agent_name="knowledge", eval_set="harness", name="c", prompt="hi")
    result = await FakeRunner({("knowledge", "m"): agent}).run(case, "m")
    assert result.tool_names == ["planning", "bash"]
    assert result.reply == '{"x": 1}'
    assert agent.listeners == []
    assert agent.calls[0]["print_output"] is False
    assert "handoff" not in agent.calls[0]


async def test_runner_intent_is_untraced_without_handoff() -> None:
    agent = FakeAgent({"status": "rejected"}, tools=("ignored",))
    case = IntentEvalCase(
        agent_name="intent",
        eval_set="functional",
        name="c",
        prompt="hi",
        expected_status="rejected",
    )
    result = await FakeRunner({("intent", "m"): agent}).run(case, "m")
    assert agent.calls[0]["handoff"] is False
    assert result.tool_calls == []


async def test_pipeline_averages_across_models(tmp_path: Path) -> None:
    (tmp_path / "harness").mkdir()
    (tmp_path / "harness" / "knowledge.json").write_text(
        json.dumps(
            {
                "cases": [
                    {
                        "name": "arith",
                        "query": "1+1",
                        "tools": {"allowed": ["calc"]},
                        "max_tool_calls": 1,
                        "expected_output": {"result": 2},
                    }
                ],
            }
        ),
        encoding="utf-8",
    )
    runner = FakeRunner(
        {
            ("knowledge", "model-a"): FakeAgent({"reply": '{"result": 2}'}, tools=("calc",)),
            # wrong answer + disallowed tool + over budget → 0.0
            ("knowledge", "model-b"): FakeAgent({"reply": '{"result": 3}'}, tools=("bash", "bash")),
        }
    )
    pipeline = EvalPipeline(CaseLoader(tmp_path), runner)
    report = await pipeline.run(["knowledge"], ["harness"], ["model-a", "model-b"])

    assert [run.result.model_name for run in report.cases[0].runs] == ["model-a", "model-b"]
    assert report.average == pytest.approx(0.5)
    text = report.render()
    assert "case avg: 0.500" in text
    assert "model=model-a" in text
    assert "disallowed tool used" in text
    assert "Average score: 0.500" in text


async def test_runner_records_wall_time_and_report_renders_timing() -> None:
    agent = FakeAgent({"reply": '{"x": 1}'})
    case = ReactEvalCase(agent_name="knowledge", eval_set="harness", name="c", prompt="hi")
    result = await FakeRunner({("knowledge", "m"): agent}).run(case, "m")
    assert result.timing.wall_seconds > 0
    assert result.timing.calls == []

    pipeline = EvalPipeline(runner=FakeRunner({("knowledge", "m"): agent}))
    report = await pipeline.run_case(case, ["m"])
    assert "  timing: wall=" in report.render()

"""Bind eval agents and run loaded cases."""

from __future__ import annotations

from langchain_core.language_models import BaseChatModel

from agent.agent import BaseAgent
from observability.some.cases import CaseAggregate
from observability.some.loader import CaseLoader


class EvalSuiteReport:
    def __init__(self, aggregates: list[CaseAggregate]) -> None:
        self.aggregates = aggregates

    @property
    def average(self) -> float:
        if not self.aggregates:
            return 0.0
        return sum(item.average for item in self.aggregates) / len(self.aggregates)

    def render(self) -> str:
        lines = [item.render() for item in self.aggregates]
        model_runs = sum(len(item.model_results) for item in self.aggregates)
        lines.append(
            f"Average score: {self.average:.3f} "
            f"({len(self.aggregates)} case(s), {model_runs} model run(s))"
        )
        return "\n".join(lines)


class EvalAgentPool:
    """Create and cache bound agents for (agent_name, model_name) pairs."""

    def __init__(self) -> None:
        self._agents: dict[tuple[str, str], BaseAgent] = {}

    async def get(self, agent_name: str, model_name: str) -> BaseAgent:
        key = (agent_name, model_name)
        if key not in self._agents:
            self._agents[key] = await self.create(agent_name, model_name)
        return self._agents[key]

    async def create(self, agent_name: str, model_name: str) -> BaseAgent:
        from langgraph.checkpoint.memory import MemorySaver

        from agent.listener import ReactAgentListener
        from agent.registry import get_agent
        from agent.runtime.tahoe_runtime_helper import default_profile_store
        from memory import CompressionConfig

        model = self.resolve_model(model_name)
        spec = get_agent(agent_name)
        if agent_name == "intent":
            agent = await spec.create_agent()
            await agent.bind(model, MemorySaver())
            return agent

        agent = await spec.create_agent(
            profile_store=default_profile_store(),
            react_listener=ReactAgentListener(),
        )
        await agent.bind(
            model,
            MemorySaver(),
            compression_config=CompressionConfig(enabled=False),
        )
        return agent

    def resolve_model(self, model_name: str) -> BaseChatModel:
        from models.models import get_model_by_name

        try:
            return get_model_by_name(model_name)
        except KeyError as exc:
            raise ValueError(str(exc)) from exc


class EvalHarness:
    def __init__(self, loader: CaseLoader, agents: EvalAgentPool | None = None) -> None:
        self.loader = loader
        self.agents = agents or EvalAgentPool()

    async def run(
        self,
        agents: set[str],
        models: set[str],
        eval_set: set[str],
    ) -> EvalSuiteReport:
        loaded = self.loader.load(agents, models, eval_set)
        aggregates_by_key: dict[tuple[str, str, str], CaseAggregate] = {}
        order: list[tuple[str, str, str]] = []
        for agent_name, by_model in loaded.items():
            for model_name, cases in by_model.items():
                agent = await self.agents.get(agent_name, model_name)
                for case in cases:
                    key = (case.agent_name, case.resolved_eval_set().name, case.name)
                    aggregate = aggregates_by_key.get(key)
                    if aggregate is None:
                        aggregate = CaseAggregate(case=case)
                        aggregates_by_key[key] = aggregate
                        order.append(key)
                    result = await case.run(agent, model_name=model_name)
                    aggregate.model_results.append(result)
        return EvalSuiteReport([aggregates_by_key[key] for key in order])

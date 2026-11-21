"""Model selection agent: pick the dbt model for a data question, nothing else.

Built for evaluating retrieval, not for users: it has only retrieval tools and
answers with a JSON choice, so a run measures how well a retrieval setup leads
to the right model. ``run_context.retrieval`` picks the arm (see
:attr:`ModelSelectionAgentConfig.RETRIEVAL_ARMS`):

- ``rag``: ``fetch_related_models`` (vector search) only
- ``catalog``: ``search_metric_catalog`` + ``find_models_metrics`` only
- ``hybrid``: catalog first, ``fetch_related_models`` as fallback

The system prompt renders only the active arm's ``workflow_<arm>`` section.
"""

from __future__ import annotations

import json
import re

from collections.abc import Mapping
from typing import Annotated, Any

from langchain_core.tools import BaseTool, StructuredTool
from langgraph.graph.state import CompiledStateGraph
from langgraph.prebuilt import ToolRuntime
from langgraph.types import Command

from tahoepilot.agent.specialists.databot.card_staging import staging_cards_reducer
from tahoepilot.agent.prompt import SystemPromptAssembler
from tahoepilot.agent.react import BaseReactAgent
from tahoepilot.agent.subagent import SubagentResult
from tahoepilot.settings.agent_config import AgentConfig, ModelSelectionAgentConfig, agent_config_path
from tahoepilot.agent.graph.builder import ReactLoopSpec, ReactStateSpec, build_react_graph
from tahoepilot.agent.graph.messages import extract_json_object
from tahoepilot.agent.graph.state import ReactAgentState

REGISTRY_NAME = "model_selection"
_WORKFLOW_PREFIX = "workflow_"


class ModelSelectionState(ReactAgentState):
    """ReAct state plus the cards the retrieval tools staged."""

    staging_cards: Annotated[list[dict[str, Any]], staging_cards_reducer]


def _retrieval(config: AgentConfig) -> str:
    return str(
        (config.run_context or {}).get("retrieval") or ModelSelectionAgentConfig.DEFAULT_RETRIEVAL
    )


class ModelSelectionSystemPrompt(SystemPromptAssembler):
    """Keeps only the ``workflow_<arm>`` section of the active retrieval arm."""

    def __init__(self, config: AgentConfig | None = None) -> None:
        super().__init__(config or ModelSelectionAgentConfig(agent_config_path(REGISTRY_NAME)))

    def section_blocks(self) -> list[tuple[str, str]]:
        spec = self.config.system_prompt
        if spec is None:
            return []
        keep = f"{_WORKFLOW_PREFIX}{_retrieval(self.config)}"
        blocks: list[tuple[str, str]] = []
        for section_id in spec.layout:
            if section_id.startswith(_WORKFLOW_PREFIX) and section_id != keep:
                continue
            section = spec.section(section_id)
            text = section.text.strip()
            if text:
                blocks.append((section.title, text))
        return blocks


_THINK_RE = re.compile(r"<think>.*?</think>", re.DOTALL | re.IGNORECASE)


def parse_selection(reply: str) -> dict[str, Any]:
    """The agent's JSON choice (``model``, ``alternatives``, ...); ``{}`` if none.

    Reasoning models may prefix the answer with a ``<think>`` block that holds
    braces of its own, which defeats a first-to-last-brace match, so the
    block is dropped first. Failing that, the last balanced ``{...}`` that
    parses and has a ``model`` key wins.
    """
    text = _THINK_RE.sub("", reply or "")
    if "</think>" in text:  # unclosed opening tag: keep what follows the close
        text = text.rsplit("</think>", 1)[-1]
    parsed, _ = extract_json_object(text)
    if isinstance(parsed, dict) and "model" in parsed:
        return parsed
    for candidate in reversed(_balanced_objects(text)):
        try:
            payload = json.loads(candidate)
        except json.JSONDecodeError:
            continue
        if isinstance(payload, dict) and "model" in payload:
            return payload
    return parsed if isinstance(parsed, dict) else {}


def _balanced_objects(text: str) -> list[str]:
    """Top-level ``{...}`` spans in order (string-aware brace matching)."""
    spans: list[str] = []
    depth, start, in_str, escaped = 0, -1, False, False
    for i, ch in enumerate(text):
        if in_str:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == '"':
                in_str = False
            continue
        if ch == '"' and depth > 0:
            in_str = True
        elif ch == "{":
            if depth == 0:
                start = i
            depth += 1
        elif ch == "}" and depth > 0:
            depth -= 1
            if depth == 0:
                spans.append(text[start : i + 1])
    return spans


def staged_model_names(state: Mapping[str, Any]) -> list[str]:
    """Distinct model names the retrieval tools staged this run, in order."""
    names: list[str] = []
    for card in state.get("staging_cards") or []:
        name = str(card.get("name") or "") if isinstance(card, Mapping) else ""
        if name and name not in names:
            names.append(name)
    return names


FETCH_TOOL = "fetch_related_models"


def pinned_fetch_tool(collection: str) -> BaseTool:
    """``fetch_related_models`` that always searches ``collection`` (no ``layer`` arg)."""
    from tahoepilot.tools.rag.dbt_models import fetch_related_models, search_and_stage_models

    def _fetch(
        query: str,
        limit: int = 5,
        chunk_type: str = "any",
        runtime: ToolRuntime = None,  # type: ignore[assignment]
    ) -> Command:
        return search_and_stage_models(
            query, collection, limit=limit, chunk_type=chunk_type, runtime=runtime
        )

    description = fetch_related_models.description.split("Layer catalog:")[0].strip()
    return StructuredTool.from_function(
        _fetch,
        name=FETCH_TOOL,
        description=f"{description}\n\nSearches the `{collection}` collection.",
    )


class ModelSelectionAgent(BaseReactAgent):
    """ReAct loop over the retrieval tools of one arm; answers with a JSON choice."""

    prompt_factory = ModelSelectionSystemPrompt
    tool_ids = ("default",)

    @property
    def retrieval(self) -> str:
        return _retrieval(self.agent_config)

    @property
    def rag_collection(self) -> str:
        return str((self.run_context or {}).get("rag_collection") or "")

    def selection_tools(self) -> list[Any]:
        allowed = set(ModelSelectionAgentConfig.RETRIEVAL_ARMS[self.retrieval])
        tools = [tool for tool in self.tools if tool.name in allowed]
        if self.rag_collection:
            tools = [
                pinned_fetch_tool(self.rag_collection) if tool.name == FETCH_TOOL else tool
                for tool in tools
            ]
        missing = allowed - {tool.name for tool in tools}
        if missing:
            raise RuntimeError(
                f"model_selection arm {self.retrieval!r} is missing tools: {sorted(missing)}"
            )
        return tools

    def build_graph(self, **kwargs: Any) -> CompiledStateGraph:
        if self.graph is not None:
            return self.graph
        self.graph = build_react_graph(
            self.model,
            self.selection_tools(),
            checkpointer=self.checkpointer,
            router=self.router,
            listener=self.listener,
            compressor=self.compressor,
            loop=ReactLoopSpec.from_run_context(self.run_context),
            state=ReactStateSpec(state_class=ModelSelectionState),
        )
        return self.graph

    def result_from_state(self, state: Mapping[str, Any]) -> SubagentResult:
        base = super().result_from_state(state)
        return SubagentResult(
            agent=base.agent,
            status=base.status,
            summary=base.summary,
            artifacts={
                "retrieval": self.retrieval,
                "rag_collection": self.rag_collection,
                "selection": parse_selection(base.summary),
                "candidates": staged_model_names(state),
            },
        )

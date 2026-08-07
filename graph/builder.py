"""Generic LangGraph ReAct builder."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import SystemMessage
from langchain_core.tools import BaseTool
from langgraph.checkpoint.base import BaseCheckpointSaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import CompiledStateGraph
from langgraph.types import RetryPolicy

from graph.classify import ClassifyTaskListener, make_classify_task_node
from graph.node import LlmStepListener, StepToolsNode, ToolCallListener, make_step_llm_node
from graph.error_recovery import (
    default_tool_retry_policy,
    make_step_tools_error_handler,
)
from graph.refine_profile import make_refine_user_profile_node
from memory.profile_store import ProfileStore
from state.state import SessionAgentState

# Static prompt string, or a callable that renders from the current state (e.g. user profile).
SystemPromptSpec = str | Callable[[SessionAgentState], str]


def _resolve_system_prompt(system_prompt: SystemPromptSpec, state: SessionAgentState) -> str:
    if callable(system_prompt):
        return system_prompt(state)
    return system_prompt


def _has_system_prompt(messages, system_prompt: str) -> bool:
    return any(
        isinstance(message, SystemMessage) and message.content == system_prompt
        for message in messages
    )


def make_inject_system_prompt_node(
    system_prompt: SystemPromptSpec,
) -> Callable[[SessionAgentState], dict[str, Any]]:
    """Inject the session system prompt once; no model call."""

    def inject_system_prompt(state: SessionAgentState) -> dict[str, Any]:
        content = _resolve_system_prompt(system_prompt, state)
        if not content.strip():
            return {}
        if _has_system_prompt(state["messages"], content):
            return {}
        return {"messages": [SystemMessage(content=content)]}

    return inject_system_prompt


def build_react_graph(
    model: BaseChatModel,
    tools: list[BaseTool],
    *,
    checkpointer: BaseCheckpointSaver,
    system_prompt: SystemPromptSpec,
    next_step_prompt: str,
    route_after_step: Callable[[SessionAgentState], str],
    route_after_tools: Callable[[SessionAgentState], str],
    compressor: Callable[[SessionAgentState], dict[str, Any]] | None = None,
    refine_user_profile_prompt: str | None = None,
    profile_store: ProfileStore | None = None,
    classify_prompt: str | None = None,
    idle_nudge_prompt: str = "",
    tool_budget_exhausted_prompt: str = "",
    max_tool_calls: int = 10,
    tool_retry_policy: RetryPolicy | None = None,
    on_tool_call: ToolCallListener | None = None,
    on_classify: ClassifyTaskListener | None = None,
    on_llm_step: LlmStepListener | None = None,
) -> CompiledStateGraph:
    """Compile inject_system_prompt → (optional classify) → step_llm ↔ step_tools.

    When ``compressor`` is set, it runs at turn start and after every tool batch
    (Layer 1 always; Layers 2–3 when context fill is high or force-compacted).

    When ``classify_prompt`` is set, a structured-output node runs after
    ``inject_system_prompt`` and writes ``turn_task_type`` into state before the
    ReAct loop (does not append classification messages to history).

    When ``refine_user_profile_prompt`` is set, agents should route turn completion
    to ``refine_user_profile``, which merges profile updates then ends the turn.

    ``system_prompt`` may be a fixed string or a callable ``state -> str`` so agents
    can load ``UserProfile`` from ``ProfileStore`` via ``state["user_id"]``.
    """
    model_with_tools = model.bind_tools(tools)
    enable_classify = bool(classify_prompt and classify_prompt.strip())
    enable_refine_profile = bool(
        refine_user_profile_prompt
        and refine_user_profile_prompt.strip()
        and profile_store is not None
    )

    graph = StateGraph(SessionAgentState)
    if compressor:
        graph.add_node("compress_on_start", compressor)
        graph.add_node("compress_after_tools", compressor)
    graph.add_node("inject_system_prompt", make_inject_system_prompt_node(system_prompt))
    if enable_classify:
        graph.add_node(
            "classify_task",
            make_classify_task_node(
                classify_prompt.strip(),
                model,
                on_classify=on_classify,
            ),
        )
    graph.add_node(
        "step_llm",
        make_step_llm_node(
            model_with_tools,
            next_step_prompt,
            idle_nudge_prompt=idle_nudge_prompt,
            tool_budget_exhausted_prompt=tool_budget_exhausted_prompt,
            max_tool_calls=max_tool_calls,
            on_llm_step=on_llm_step,
        ),
    )
    graph.add_node(
        "step_tools",
        StepToolsNode(tools, on_tool_call=on_tool_call),
        retry_policy=tool_retry_policy or default_tool_retry_policy(),
        error_handler=make_step_tools_error_handler(),
    )
    if enable_refine_profile:
        graph.add_node(
            "refine_user_profile",
            make_refine_user_profile_node(
                refine_user_profile_prompt.strip(),
                model,
                profile_store,
            ),
        )

    if compressor:
        graph.add_edge(START, "compress_on_start")
        graph.add_edge("compress_on_start", "inject_system_prompt")
        graph.add_edge("step_tools", "compress_after_tools")
        graph.add_conditional_edges("compress_after_tools", route_after_tools)
    else:
        graph.add_edge(START, "inject_system_prompt")
        graph.add_conditional_edges("step_tools", route_after_tools)

    if enable_classify:
        graph.add_edge("inject_system_prompt", "classify_task")
        graph.add_edge("classify_task", "step_llm")
    else:
        graph.add_edge("inject_system_prompt", "step_llm")

    if enable_refine_profile:
        graph.add_edge("refine_user_profile", END)

    graph.add_conditional_edges("step_llm", route_after_step)
    return graph.compile(checkpointer=checkpointer)

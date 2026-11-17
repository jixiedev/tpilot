"""Find, show and patch a specialist that is paused (at a human gate) inside the lead's run.

A delegated specialist runs nested in the lead's ``step_action`` task, so its
checkpoints live in the lead's thread under ``step_action:<task id>``. The web
UI needs two things while it is paused:

- the specialist's live state (the lead's own state only gets the specialist's
  view once ``delegate`` returns), and
- a way to patch that state (databot's card selection and SQL edits).

LangGraph resolves a ``checkpoint_ns`` against the graph's *declared*
subgraphs, and a specialist invoked from a tool is not one. Passing the
checkpointer explicitly in the config (``CONFIG_KEY_CHECKPOINTER``) makes the
specialist graph read and write its namespace directly.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any

from langchain_core.messages import AIMessage, ToolMessage
from langchain_core.runnables import RunnableConfig
from langgraph.types import StateSnapshot

from agent.lead.tools import DELEGATE_TOOL_NAME
from graph.builder import STEP_ACTION

try:  # internal LangGraph constants; values are stable across 1.x
    from langgraph._internal._config import recast_checkpoint_ns
    from langgraph._internal._constants import CONFIG_KEY_CHECKPOINTER, NS_SEP
except ImportError:  # pragma: no cover - fallback for a moved module
    CONFIG_KEY_CHECKPOINTER = "__pregel_checkpointer"
    NS_SEP = "|"

    def recast_checkpoint_ns(ns: str) -> str:
        return NS_SEP.join(part.split(":")[0] for part in ns.split(NS_SEP))


@dataclass(frozen=True)
class PausedDelegation:
    """A ``delegate`` call whose specialist is waiting for human input."""

    agent_name: str
    specialist: Any  # BaseAgent
    #: Config addressing the specialist's root checkpoint inside the lead's thread.
    config: RunnableConfig
    tool_call_id: str


def pending_delegate_call(messages: list[Any]) -> dict[str, Any] | None:
    """The unanswered ``delegate`` call in the latest AI message, if any."""
    answered = {m.tool_call_id for m in messages if isinstance(m, ToolMessage)}
    for message in reversed(messages):
        if not isinstance(message, AIMessage):
            continue
        for call in message.tool_calls or []:
            if call.get("name") == DELEGATE_TOOL_NAME and call.get("id") not in answered:
                return call
        return None
    return None


def with_checkpointer(config: Mapping[str, Any], checkpointer: Any) -> RunnableConfig:
    configurable = dict((config or {}).get("configurable") or {})
    configurable[CONFIG_KEY_CHECKPOINTER] = checkpointer
    return {"configurable": configurable}


async def find_paused_delegation(lead: Any, config: RunnableConfig) -> PausedDelegation | None:
    """Return the specialist paused under the lead's thread in ``config``, or ``None``."""
    graph = lead.build_graph()
    snapshot = await graph.aget_state(config)
    task = next(
        (t for t in snapshot.tasks if t.name == STEP_ACTION and t.interrupts),
        None,
    )
    if task is None:
        return None
    call = pending_delegate_call(list((snapshot.values or {}).get("messages") or []))
    if call is None:
        return None
    name = str((call.get("args") or {}).get("agent") or "").strip().lower()
    if not name:
        return None
    specialist = await lead.specialists.get_or_create(name)
    thread_id = (config.get("configurable") or {}).get("thread_id")
    child = with_checkpointer(
        {"configurable": {"thread_id": thread_id, "checkpoint_ns": f"{task.name}:{task.id}"}},
        lead.checkpointer,
    )
    return PausedDelegation(
        agent_name=name, specialist=specialist, config=child, tool_call_id=str(call.get("id"))
    )


async def active_snapshot(paused: PausedDelegation) -> StateSnapshot:
    """The innermost paused snapshot of the specialist (databot: the gate's layer)."""
    return await paused.specialist.aget_active_snapshot(paused.config)


async def live_subagent_view(lead: Any, config: RunnableConfig) -> dict[str, Any] | None:
    """``{"name", "state", "paused": True}`` for a paused specialist, else ``None``."""
    paused = await find_paused_delegation(lead, config)
    if paused is None:
        return None
    snapshot = await active_snapshot(paused)
    return {
        "name": paused.agent_name,
        "state": paused.specialist.ui_view(snapshot.values or {}),
        "paused": True,
    }


async def _graph_for_snapshot(paused: PausedDelegation, snapshot: StateSnapshot) -> Any:
    """The (sub)graph that owns ``snapshot``: the specialist or one of its declared layers."""
    root_ns = str(paused.config["configurable"].get("checkpoint_ns") or "")
    ns = str((snapshot.config or {}).get("configurable", {}).get("checkpoint_ns") or "")
    graph = paused.specialist.build_graph()
    if ns == root_ns or not ns.startswith(root_ns + NS_SEP):
        return graph
    relative = recast_checkpoint_ns(ns[len(root_ns) + 1 :])
    async for _, subgraph in graph.aget_subgraphs(namespace=relative, recurse=True):
        return subgraph
    raise LookupError(f"no subgraph {relative!r} in {paused.agent_name}")


async def patch_paused_state(
    paused: PausedDelegation,
    snapshot: StateSnapshot,
    patch: Mapping[str, Any],
) -> None:
    """Write ``patch`` into the paused snapshot; the gate sees it when the run resumes."""
    target = await _graph_for_snapshot(paused, snapshot)
    checkpointer = paused.config["configurable"][CONFIG_KEY_CHECKPOINTER]
    await target.aupdate_state(with_checkpointer(snapshot.config, checkpointer), dict(patch))

"""Graduated automatic context compression for long-running agents.

Layer 1 — always-on tool-result offloading (disk I/O only)
Layer 1b — prior-turn Q&A fold (keep Human + chat_completion; drop tool trails)
Layer 2 — write-tool input eviction when context fill is high
Layer 3 — structured LLM summarization of the conversation head
Layer 4 — agent-initiated compact via ``compact_context`` (force=True)
"""

from __future__ import annotations

import json
import logging
import uuid
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import (
    AIMessage,
    BaseMessage,
    HumanMessage,
    RemoveMessage,
    SystemMessage,
    ToolMessage,
)

from memory.config import CompressionConfig
from memory.offload import OffloadStore
from memory.tokens import _content_to_text, context_fill, count_tokens, message_tokens
from memory.tools import AUTONOMOUS_COMPACT_MARKER, configure_offload_tools
from state.state import SessionAgentState

logger = logging.getLogger(__name__)

_SUMMARIZATION_PROMPT = """\
You compress an agent conversation so the agent can continue the task with fewer tokens.

Return ONLY valid JSON with these keys:
- session_intent: string — what the user wants
- progress_so_far: string — bullet-style progress already made
- key_facts: string — facts still needed to continue
- artifacts_created: string — files/paths/queries produced
- next_steps: string — what remains
- open_questions: string — unresolved questions

Preserve concrete identifiers (table names, SQL, paths, IDs). Omit stale intermediate chatter.
"""


def _preview(text: str, lines: int) -> str:
    split = text.splitlines()
    if len(split) <= lines:
        return text
    return "\n".join(split[:lines]) + "\n…"


def _message_id(message: BaseMessage) -> str | None:
    return getattr(message, "id", None)


def _with_id(message: BaseMessage, message_id: str | None) -> BaseMessage:
    if message_id and getattr(message, "id", None) != message_id:
        message.id = message_id
    return message


def _detect_autonomous_compact(messages: list[BaseMessage]) -> bool:
    for message in reversed(messages):
        if not isinstance(message, ToolMessage):
            if message.type == "ai":
                break
            continue
        content = _content_to_text(message.content)
        if AUTONOMOUS_COMPACT_MARKER in content:
            return True
    return False


def _ai_calls_tool(message: AIMessage, tool_name: str) -> bool:
    for call in message.tool_calls or []:
        if call.get("name") == tool_name:
            return True
    return False


def _is_turn_boundary(message: BaseMessage, marker: str) -> bool:
    if not isinstance(message, SystemMessage):
        return False
    text = _content_to_text(message.content)
    return bool(marker) and marker in text


def _last_human_index(messages: list[BaseMessage]) -> int | None:
    for index in range(len(messages) - 1, -1, -1):
        if isinstance(messages[index], HumanMessage):
            return index
    return None


def _serialize_messages(messages: list[BaseMessage]) -> str:
    payload: list[dict[str, Any]] = []
    for message in messages:
        item: dict[str, Any] = {
            "type": message.type,
            "content": _content_to_text(message.content),
        }
        if isinstance(message, ToolMessage):
            item["name"] = message.name
            item["tool_call_id"] = message.tool_call_id
        if isinstance(message, AIMessage) and message.tool_calls:
            item["tool_calls"] = message.tool_calls
        payload.append(item)
    return json.dumps(payload, ensure_ascii=False, indent=2)


def _format_history_for_summary(messages: list[BaseMessage]) -> str:
    parts: list[str] = []
    for message in messages:
        role = message.type.upper()
        body = _content_to_text(message.content)
        if isinstance(message, AIMessage) and message.tool_calls:
            body = (body + "\n" if body else "") + json.dumps(
                message.tool_calls, ensure_ascii=False
            )
        if isinstance(message, ToolMessage) and message.name:
            role = f"TOOL:{message.name}"
        parts.append(f"[{role}]\n{body}")
    return "\n\n".join(parts)


def _summary_to_system_content(raw: str, archive_path: str) -> str:
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        data = None

    if isinstance(data, dict):
        lines = [
            "=== CONTEXT COMPRESSED (Layer 3 Summarization) ===",
            f"Archive: {archive_path}",
            f"SESSION INTENT: {data.get('session_intent', '')}",
            f"PROGRESS SO FAR: {data.get('progress_so_far', '')}",
            f"KEY FACTS: {data.get('key_facts', '')}",
            f"ARTIFACTS CREATED: {data.get('artifacts_created', '')}",
            f"NEXT STEPS: {data.get('next_steps', '')}",
            f"OPEN QUESTIONS: {data.get('open_questions', '')}",
            "Use read_offloaded_file(path) to recover archived detail when needed.",
        ]
        return "\n".join(lines)

    return (
        "=== CONTEXT COMPRESSED (Layer 3 Summarization) ===\n"
        f"Archive: {archive_path}\n"
        f"{raw.strip()}\n"
        "Use read_offloaded_file(path) to recover archived detail when needed."
    )


class ContextCompressor:
    """Graduated compression pipeline used as a LangGraph node."""

    def __init__(
        self,
        config: CompressionConfig | None = None,
        *,
        llm: BaseChatModel | None = None,
        store: OffloadStore | None = None,
    ) -> None:
        self.config = config or CompressionConfig()
        self.llm = llm
        self.store = store or OffloadStore(self.config.offload_dir)
        configure_offload_tools(self.store)

    def __call__(self, state: SessionAgentState) -> dict[str, Any]:
        messages = list(state.get("messages", []))
        force = bool(state.get("autonomous_compact_requested")) or _detect_autonomous_compact(
            messages
        )
        updates = self.run(messages, force=force)
        result: dict[str, Any] = {"autonomous_compact_requested": False}
        if updates:
            result["messages"] = updates
        if force:
            logger.info("Context compression forced (autonomous compact)")
        return result

    def run(self, messages: list[BaseMessage], *, force: bool = False) -> list[BaseMessage]:
        """Apply layers and return LangGraph message updates (replace/remove/add)."""
        working = list(messages)
        updates: list[BaseMessage] = []

        layer1 = self.layer1_offload_tool_results(working)
        if layer1:
            updates.extend(layer1)
            working = self._apply_replacements(working, layer1)

        if self.config.prior_turns_qa_only:
            prior_qa = self.layer_prior_turns_qa_only(working)
            if prior_qa:
                updates.extend(prior_qa)
                working = self._apply_replacements(working, prior_qa)

        fill = context_fill(working, self.config.context_window)
        if force or fill >= self.config.fill_trigger:
            layer2 = self.layer2_offload_tool_inputs(working)
            if layer2:
                updates.extend(layer2)
                working = self._apply_replacements(working, layer2)
            fill = context_fill(working, self.config.context_window)

        if force or fill >= self.config.fill_trigger:
            layer3 = self.layer3_summarize(working)
            if layer3:
                updates.extend(layer3)

        return updates

    @staticmethod
    def _apply_replacements(
        messages: list[BaseMessage], replacements: list[BaseMessage]
    ) -> list[BaseMessage]:
        by_id = {
            mid: msg
            for msg in replacements
            if not isinstance(msg, RemoveMessage) and (mid := _message_id(msg))
        }
        remove_ids = {
            mid
            for msg in replacements
            if isinstance(msg, RemoveMessage) and (mid := getattr(msg, "id", None))
        }
        out: list[BaseMessage] = []
        for message in messages:
            mid = _message_id(message)
            if mid and mid in remove_ids:
                continue
            if mid and mid in by_id:
                out.append(by_id[mid])
            else:
                out.append(message)
        known_ids = {mid for m in messages if (mid := _message_id(m))}
        for msg in replacements:
            if isinstance(msg, RemoveMessage):
                continue
            mid = _message_id(msg)
            if mid is None or mid not in known_ids:
                out.append(msg)
        return out

    def layer1_offload_tool_results(self, messages: list[BaseMessage]) -> list[BaseMessage]:
        updates: list[BaseMessage] = []
        threshold = self.config.tool_result_offload_threshold
        for message in messages:
            if not isinstance(message, ToolMessage):
                continue
            if message.name in self.config.never_offload_tools:
                continue
            raw = _content_to_text(message.content)
            if AUTONOMOUS_COMPACT_MARKER in raw:
                continue
            tokens = count_tokens(raw)
            if tokens <= threshold:
                continue
            mid = _message_id(message)
            if not mid:
                continue
            path = self.store.write(raw, label=f"tool_{message.name or 'result'}")
            replacement = (
                f"[OFFLOADED — {tokens:,} tokens → {path}]\n"
                f"Preview (first {self.config.preview_lines} lines):\n"
                f"{_preview(raw, self.config.preview_lines)}\n"
                f"Use read_offloaded_file('{path.as_posix()}') to retrieve full content."
            )
            updates.append(
                _with_id(
                    ToolMessage(
                        content=replacement,
                        tool_call_id=message.tool_call_id,
                        name=message.name,
                    ),
                    mid,
                )
            )
            logger.debug("Layer 1 offloaded tool result %s (%s tokens)", message.name, tokens)
        return updates

    def layer_prior_turns_qa_only(self, messages: list[BaseMessage]) -> list[BaseMessage]:
        """Drop prior-turn tool trajectories; keep Human + chat_completion Q&A.

        The current turn starts at the last ``HumanMessage``. Everything before
        that is prior history. Within prior history keep:

        - leading role ``SystemMessage`` (if present)
        - turn-boundary ``SystemMessage`` markers
        - prior Layer-3 compression summaries (``CONTEXT COMPRESSED``)
        - ``HumanMessage`` questions
        - ``AIMessage`` that invoked ``chat_completion``
        - ``ToolMessage`` named ``chat_completion`` (the user-visible answer)

        All other prior AI/tool messages are removed (and archived). Current-turn
        messages after the last human are left untouched.
        """
        last_human = _last_human_index(messages)
        if last_human is None or last_human == 0:
            return []

        prior = messages[:last_human]
        completion_name = self.config.chat_completion_tool_name
        boundary_marker = self.config.turn_boundary_marker

        discard: list[BaseMessage] = []
        for index, message in enumerate(prior):
            mid = _message_id(message)
            if not mid:
                continue
            if index == 0 and isinstance(message, SystemMessage) and not _is_turn_boundary(
                message, boundary_marker
            ):
                continue
            if isinstance(message, HumanMessage):
                continue
            if isinstance(message, SystemMessage):
                # Keep turn boundaries and prior compression summaries.
                continue
            if isinstance(message, ToolMessage) and message.name == completion_name:
                continue
            if isinstance(message, AIMessage) and _ai_calls_tool(message, completion_name):
                continue
            discard.append(message)

        if not discard:
            return []

        archive_path = self.store.write(
            _serialize_messages(discard),
            label="prior_turn_tools_archive",
        )
        updates: list[BaseMessage] = [
            RemoveMessage(id=mid)
            for message in discard
            if (mid := _message_id(message))
        ]
        logger.info(
            "Prior-turn Q&A fold removed %s messages; archive=%s",
            len(discard),
            archive_path,
        )
        return updates

    def layer2_offload_tool_inputs(self, messages: list[BaseMessage]) -> list[BaseMessage]:
        updates: list[BaseMessage] = []
        threshold = self.config.tool_input_offload_threshold
        for message in messages:
            if not isinstance(message, AIMessage) or not message.tool_calls:
                continue
            mid = _message_id(message)
            if not mid:
                continue
            changed = False
            new_calls: list[dict[str, Any]] = []
            for call in message.tool_calls:
                name = call.get("name", "")
                args = call.get("args") or {}
                if name not in self.config.write_tools:
                    new_calls.append(call)
                    continue
                if isinstance(args, dict) and args.get("__offloaded__"):
                    new_calls.append(call)
                    continue
                args_str = json.dumps(args, ensure_ascii=False)
                tokens = count_tokens(args_str)
                if tokens <= threshold:
                    new_calls.append(call)
                    continue
                path = self.store.write(args_str, label=f"input_{name}")
                new_calls.append({**call, "args": {"__offloaded__": path.as_posix()}})
                changed = True
                logger.debug("Layer 2 offloaded tool input %s (%s tokens)", name, tokens)
            if changed:
                updates.append(
                    _with_id(
                        AIMessage(content=message.content, tool_calls=new_calls),
                        mid,
                    )
                )
        return updates

    def layer3_summarize(self, messages: list[BaseMessage]) -> list[BaseMessage]:
        """Summarize older history via LLM; keep the role prompt and a recent tail.

        Splitting is token-based, not turn-based. Turn-boundary SystemMessages and
        prior compression summaries are treated like any other message.

        Input (example: three CLI turns, fill already high)::

            messages[0]  preserved ─┐
            messages[1..k] head     │  one flat list
            messages[k+1..] tail  ──┘

            ┌──────────────── preserved (messages[0] only) ────────────────┐
            │ [0] SystemMessage  "You are TahoePilot..."                   │
            ├──────────────── head (LLM input, then deleted) ──────────────┤
            │ [1] HumanMessage   turn-1 question                           │
            │ [2] AIMessage + ToolMessages   turn-1 tool loop                │
            │ [3] SystemMessage  "--- Session turn boundary ---"            │
            │ [4] HumanMessage   turn-2 question                             │
            │ ...                earlier turns / old compression summaries   │
            ├──────────────── tail (~recent_messages_keep × context_window) ─┤
            │ [k] SystemMessage  turn boundary (if still within budget)      │
            │ [k+1] HumanMessage current-turn question                       │
            │ ...                latest ai / tool messages                   │
            └────────────────────────────────────────────────────────────────┘

        Steps::

            preserved + head + tail  ──write──►  conversation_archive (disk)
            head  ──LLM summarize──►  summary SystemMessage
            head + tail  ──RemoveMessage──►  deleted from state
            summary + tail  ──append──►  LangGraph updates

        Resulting order after ``add_messages`` merges updates::

            [preserved role prompt?, summary SystemMessage, ...tail unchanged]

        Returns RemoveMessage entries plus the new summary and re-appended tail.
        """
        if self.llm is None or len(messages) < 2:
            return []

        keep_budget = int(self.config.context_window * self.config.recent_messages_keep)
        preserved: list[BaseMessage] = []
        if messages and isinstance(messages[0], SystemMessage):
            # Keep the session role prompt; it is cheap and re-anchors behavior.
            preserved.append(messages[0])

        tail: list[BaseMessage] = []
        tail_tokens = 0
        start_index = len(preserved)
        for message in reversed(messages[start_index:]):
            tokens = message_tokens(message)
            if tail and tail_tokens + tokens > keep_budget:
                break
            tail.insert(0, message)
            tail_tokens += tokens

        head_end = len(messages) - len(tail)
        head = list(messages[start_index:head_end])
        if not head:
            return []

        archive_path = self.store.write(
            _serialize_messages(preserved + head + tail),
            label="conversation_archive",
        )

        history_text = _format_history_for_summary(head)
        try:
            response = self.llm.invoke(
                [
                    SystemMessage(content=_SUMMARIZATION_PROMPT),
                    HumanMessage(content=f"Summarize this conversation:\n\n{history_text}"),
                ]
            )
            raw_summary = _content_to_text(response.content)
        except Exception:
            logger.exception("Layer 3 summarization failed; skipping")
            return []

        summary = SystemMessage(
            content=_summary_to_system_content(raw_summary, archive_path.as_posix()),
            id=f"compression-summary-{uuid.uuid4().hex[:8]}",
        )

        # Remove head+tail then re-append summary+tail so ordering stays
        # [preserved system?, summary, ...tail] under add_messages.
        updates: list[BaseMessage] = []
        for message in head + tail:
            mid = _message_id(message)
            if mid:
                updates.append(RemoveMessage(id=mid))
        updates.append(summary)
        updates.extend(tail)
        logger.info(
            "Layer 3 summarized %s messages; archive=%s",
            len(head),
            archive_path,
        )
        return updates


def make_compressor(
    model: BaseChatModel,
    config: CompressionConfig | None = None,
) -> ContextCompressor:
    """Build a graph-ready compressor bound to ``model`` for Layer 3."""
    cfg = config or CompressionConfig()
    return ContextCompressor(config=cfg, llm=model, store=OffloadStore(cfg.offload_dir))

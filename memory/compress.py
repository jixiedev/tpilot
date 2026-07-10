from __future__ import annotations

from dataclasses import dataclass
from enum import Enum

from langchain_core.messages import (
    BaseMessage,
    ToolMessage,
    RemoveMessage,
)

from state.state import SessionAgentState


class RetentionAction(str, Enum):
    KEEP = "keep"
    DELETE = "delete"
    SUMMARIZE = "summarize"


@dataclass
class MemoryRecord:
    summary: str
    importance: int
    memory_type: str
    source_message_id: str | None = None


class CandidateSelector:

    @staticmethod
    def select(self, messages: list[BaseMessage]) -> list[BaseMessage]:
        candidates = []
        for msg in messages:
            if isinstance(msg, ToolMessage):
                candidates.append(msg)
        return candidates


class ImportanceEvaluator:
    def evaluate(self, message: BaseMessage) -> int:
        if not isinstance(message, ToolMessage):
            return 0
        size = len(str(message.content))
        if size < 200:
            return 1
        if size < 1000:
            return 3
        return 5


class MemoryExtractor:
    def extract(self, message: BaseMessage, importance: int) -> MemoryRecord:
        content = str(message.content)
        return MemoryRecord(
            summary=content[:200],
            importance=importance,
            memory_type="tool_result",
            source_message_id=getattr(
                message,
                "id",
                None,
            ),
        )


class RetentionPolicy:
    def decide(self, record: MemoryRecord) -> RetentionAction:
        if record.importance <= 2:
            return RetentionAction.DELETE

        if record.importance <= 5:
            return RetentionAction.SUMMARIZE

        return RetentionAction.KEEP


class CompressionNode:
    def __init__(
            self,
            selector: CandidateSelector,
            evaluator: ImportanceEvaluator,
            extractor: MemoryExtractor,
            policy: RetentionPolicy,
    ):
        self.selector = selector
        self.evaluator = evaluator
        self.extractor = extractor
        self.policy = policy

    def __call__(self, state: SessionAgentState):
        messages = state["messages"]
        candidates = self.selector.select(messages)
        new_memories = []
        removals = []
        for msg in candidates:
            importance = (self.evaluator.evaluate(msg))
            record = self.extractor.extract(msg, importance, )

            action = self.policy.decide(record)

            if action == RetentionAction.DELETE:
                removals.append(RemoveMessage(id=msg.id))
            elif action == RetentionAction.SUMMARIZE:
                new_memories.append(record)
                removals.append(RemoveMessage(id=msg.id))

            elif action == RetentionAction.KEEP:
                new_memories.append(record)

        return {
            "messages": removals,
            "memories": (
                    state.get("memories", [])
                    + new_memories
            ),
        }

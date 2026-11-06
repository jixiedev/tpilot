"""Per-user retrieval history: records on disk, cards in Databot state."""

from __future__ import annotations

import json
import logging
from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from agent.specialists.databot.ui_actions import user_question_from_messages
from memory.profile_store import resolve_user_id, safe_profile_filename

logger = logging.getLogger(__name__)

_MAX_RECORDS = 30
_SQL_SNIPPET = 220
_HISTORY_BRIEF_MARKER = "Prior retrieval cards for this user"


@dataclass(frozen=True)
class DataRetrievalRecord:
    """One completed retrieval: the question, table cards used, and SQL run."""

    question: str
    cards: tuple[dict[str, Any], ...]
    sql: str
    timestamp: str = ""
    session: str = ""

    def to_dict(self) -> dict[str, Any]:
        """JSON object written as one line of the per-user history file."""
        return {
            "question": self.question,
            "cards": [dict(card) for card in self.cards],
            "sql": self.sql,
            "timestamp": self.timestamp,
            "session": self.session,
        }

    @classmethod
    def from_dict(cls, data: Mapping[str, Any]) -> DataRetrievalRecord | None:
        """Load one history row. Returns ``None`` when it has neither cards nor SQL."""
        if not isinstance(data, Mapping):
            return None
        cards_raw = data.get("cards")
        if not isinstance(cards_raw, list):
            cards_raw = data.get("approved_cards") or []
        cards = tuple(dict(card) for card in cards_raw if isinstance(card, dict))
        sql = str(data.get("sql") or data.get("approved_sql") or "").strip()
        question = str(data.get("question") or "").strip()
        if not cards and not sql:
            return None
        return cls(
            question=question,
            cards=cards,
            sql=sql,
            timestamp=str(data.get("timestamp") or ""),
            session=str(data.get("session") or ""),
        )

    @classmethod
    def from_state(cls, state: Mapping[str, Any]) -> DataRetrievalRecord | None:
        """Build a record from an approved, non-dry-run turn. Otherwise return ``None``.

        A halted turn (``halt_reason`` set, e.g. cards approved then SQL
        ``deny-halt``) is never recorded, matching the refusal message.
        """
        if state.get("dryrun") or str(state.get("halt_reason") or "").strip():
            return None
        audit = state.get("gate_decisions") or []
        if not any(
            isinstance(entry, dict) and entry.get("decision") == "approve"
            for entry in audit
        ):
            return None
        cards = tuple(
            dict(card)
            for card in (state.get("approved_cards") or [])
            if isinstance(card, dict)
        )
        sql = str(state.get("approved_sql") or "").strip()
        if not cards and not sql:
            return None
        return cls(
            question=user_question_from_messages(list(state.get("messages") or [])),
            cards=cards,
            sql=sql,
            timestamp=datetime.now(timezone.utc).isoformat(),
            session=str(state.get("session_name") or ""),
        )

    @staticmethod
    def unpack_cards(records: Sequence[DataRetrievalRecord]) -> list[dict[str, Any]]:
        """Latest card per model name, with the question/SQL that last used it."""
        by_name: dict[str, dict[str, Any]] = {}
        for record in records:
            snippet = record.sql.strip()
            if len(snippet) > _SQL_SNIPPET:
                snippet = snippet[: _SQL_SNIPPET - 3] + "..."
            for card in record.cards:
                name = str(card.get("name") or "").strip()
                if not name:
                    continue
                packed = dict(card)
                packed["prior_question"] = record.question
                packed["prior_sql"] = snippet
                by_name[name] = packed
        return list(by_name.values())

    @staticmethod
    def briefing(cards: Sequence[Mapping[str, Any]]) -> str:
        """System-message text listing prior cards the fetch stage should prefer."""
        if not cards:
            return ""
        lines = [
            f"{_HISTORY_BRIEF_MARKER} "
            "(prefer committing these before calling fetch_related_models):"
        ]
        for card in cards:
            name = str(card.get("name") or "").strip() or "(unnamed)"
            sid = str(card.get("staging_id") or "").strip()
            metrics = ", ".join(
                str(m).strip()
                for m in (card.get("selected_metrics") or [])
                if str(m).strip()
            )[:80]
            dims = ", ".join(
                str(d).strip()
                for d in (card.get("selected_dimensions") or [])
                if str(d).strip()
            )[:80]
            bits: list[str] = []
            if sid:
                bits.append(f"staging_id={sid}")
            if metrics:
                bits.append(f"metrics: {metrics}")
            if dims:
                bits.append(f"dims: {dims}")
            detail = f" ({'; '.join(bits)})" if bits else ""
            question = str(card.get("prior_question") or "").strip()
            used = f' — used for "{question}"' if question else ""
            lines.append(f"- {name}{detail}{used}")
        lines.append(
            "If these models cannot answer the latest question, call fetch_related_models."
        )
        return "\n".join(lines)

    @staticmethod
    def briefing_already_injected(messages: Sequence[Any]) -> bool:
        """Whether this turn's messages already contain the history briefing."""
        for message in messages or []:
            content = getattr(message, "content", None)
            if isinstance(message, dict):
                content = message.get("content")
            text = content if isinstance(content, str) else ""
            if _HISTORY_BRIEF_MARKER in text:
                return True
        return False


class DataRetrievalStore:
    """JSONL sidecar of ``DataRetrievalRecord`` rows, one file per user."""

    def __init__(self, profile_dir: Path) -> None:
        self._root = profile_dir
        self._records: dict[str, tuple[DataRetrievalRecord, ...]] = {}

    def path_for(self, user_id: str) -> Path:
        """JSONL path for one user's retrieval history."""
        return self._root / f"{safe_profile_filename(user_id)}.databot_turns.jsonl"

    def append(self, user_id: str, record: DataRetrievalRecord) -> None:
        """Append one record and keep only the most recent rows in memory."""
        key = user_id.strip()
        current = self.load(key)
        path = self.path_for(key)
        try:
            path.parent.mkdir(parents=True, exist_ok=True)
            with path.open("a", encoding="utf-8") as fh:
                fh.write(json.dumps(record.to_dict(), ensure_ascii=False) + "\n")
        except OSError as exc:
            logger.warning("failed to persist data retrieval record: %s", exc)
        self._records[key] = (current + (record,))[-_MAX_RECORDS:]

    def load(self, user_id: str) -> tuple[DataRetrievalRecord, ...]:
        """Return cached history, reading the JSONL file on the first call."""
        key = user_id.strip()
        cached = self._records.get(key)
        if cached is not None:
            return cached
        records = self._read_disk(key)
        self._records[key] = records
        return records

    def _read_disk(self, user_id: str) -> tuple[DataRetrievalRecord, ...]:
        path = self.path_for(user_id)
        if not path.is_file():
            return ()
        records: list[DataRetrievalRecord] = []
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except OSError as exc:
            logger.warning("failed to read data retrieval history: %s", exc)
            return ()
        for line in lines:
            text = line.strip()
            if not text:
                continue
            try:
                payload = json.loads(text)
            except json.JSONDecodeError:
                continue
            record = DataRetrievalRecord.from_dict(payload)
            if record is not None:
                records.append(record)
        return tuple(records[-_MAX_RECORDS:])

    def history_cards(self, user_id: str) -> list[dict[str, Any]]:
        """Latest card per model name, ready to place on ``history_cards``."""
        return DataRetrievalRecord.unpack_cards(self.load(user_id))

    def persist_from_state(self, state: Mapping[str, Any]) -> list[dict[str, Any]] | None:
        """Append a record when the turn produced an approved retrieval.

        Returns the refreshed ``history_cards`` list, or ``None`` when nothing
        was written.
        """
        record = DataRetrievalRecord.from_state(state)
        if record is None:
            return None
        user_id = resolve_user_id(prior=state.get("user_id"))
        self.append(user_id, record)
        return self.history_cards(user_id)

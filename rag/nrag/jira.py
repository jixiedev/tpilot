"""Jira CSV rows as ``Document`` instances."""

from __future__ import annotations

import math
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterator

import pandas as pd

from rag.embeddings import truncate_text
from rag.nrag.data import Chunk, Document
from rag.nrag.loader import Reader

_SUMMARY_COLS = ("Summary", "summary", "title")
_DESCRIPTION_COLS = ("Description", "description")
_KEY_COLS = ("Issue key", "Issue Key", "key", "Key")
_ID_COLS = ("Issue id", "Issue Id", "id", "ID")
_PROJECT_COLS = ("Project key", "Project Key", "Project name", "Project")
_STATUS_COLS = ("Status",)
_PRIORITY_COLS = ("Priority",)
_ASSIGNEE_COLS = ("Assignee",)
_REPORTER_COLS = ("Reporter",)
_CREATED_COLS = ("Created",)
_UPDATED_COLS = ("Updated",)
_TYPE_COLS = ("Issue Type", "Issue Type Name")

_PAYLOAD_KEEP = (
    "issue_key",
    "issue_id",
    "summary",
    "description",
    "status",
    "priority",
    "assignee",
    "reporter",
    "created",
    "updated",
    "issue_type",
    "project",
    "comments",
)

_JIRA_BROWSE_BASE = "https://wishcloud.atlassian.net/browse"


def _is_empty(value: Any) -> bool:
    if value is None:
        return True
    if isinstance(value, float) and math.isnan(value):
        return True
    if pd.isna(value):
        return True
    return str(value).strip() == ""


def _as_str(value: Any) -> str:
    if _is_empty(value):
        return ""
    return str(value).strip()


def _first_present(row: pd.Series, names: tuple[str, ...]) -> Any:
    for name in names:
        if name in row.index and not _is_empty(row[name]):
            return row[name]
    return None


def _point_id(issue_id: Any, issue_key: str, fallback: int) -> int | str:
    if not _is_empty(issue_id):
        try:
            return int(float(issue_id))
        except (TypeError, ValueError):
            pass
    if issue_key:
        return abs(hash(issue_key)) % (2**63 - 1) or fallback
    return fallback


def _is_comment_column(name: str) -> bool:
    if name == "Comment" or re.fullmatch(r"Comment\.\d+", name):
        return True
    lowered = name.lower()
    return "comment" in lowered and not lowered.startswith("custom field (request")


def _collect_comments(row: pd.Series) -> str:
    parts: list[str] = []
    for col in row.index:
        if not _is_comment_column(str(col)):
            continue
        text = _as_str(row[col])
        if text:
            parts.append(text)
    seen: set[str] = set()
    unique: list[str] = []
    for part in parts:
        if part in seen:
            continue
        seen.add(part)
        unique.append(part)
    return "\n---\n".join(unique)


@dataclass(kw_only=True)
class JiraDocument(Document):
    issue_key: str = ""
    issue_id: str = ""
    summary: str = ""
    description: str = ""
    status: str = ""
    priority: str = ""
    assignee: str = ""
    reporter: str = ""
    created: str = ""
    updated: str = ""
    issue_type: str = ""
    project: str = ""
    comments: str = ""
    stored_point_id: int | str = 0

    def metadata(self) -> dict[str, Any]:
        return {name: getattr(self, name) for name in _PAYLOAD_KEEP}

    def source_payload(self) -> dict[str, Any]:
        payload = {
            "issue_key": self.issue_key,
            "issue_id": self.issue_id,
            "summary": self.summary,
            "description": truncate_text(self.description, max_chars=4000),
            "status": self.status,
            "priority": self.priority,
            "assignee": self.assignee,
            "reporter": self.reporter,
            "created": self.created,
            "updated": self.updated,
            "issue_type": self.issue_type,
            "project": self.project,
            "comments": truncate_text(self.comments, max_chars=4000),
        }
        return {k: payload[k] for k in _PAYLOAD_KEEP}

    def chunk_payload(self, chunk: Chunk) -> dict[str, Any]:
        return self.source_payload()

    def chunk_embed_text(self, chunk: Chunk) -> str:
        return self.content

    def chunk_point_id(self, chunk: Chunk) -> int | str:
        # One point per issue (IdentitySplitStrategy); keep the legacy int id
        # so re-ingest of an existing collection stays idempotent.
        if chunk.chunk_seq == 0 and chunk.next is None:
            return self.stored_point_id
        from rag.nrag.ids import stable_point_id

        return stable_point_id(chunk.primary_key)

    @classmethod
    def from_row(cls, row: pd.Series, *, fallback_id: int = 0) -> JiraDocument | None:
        summary = _as_str(_first_present(row, _SUMMARY_COLS))
        description = _as_str(_first_present(row, _DESCRIPTION_COLS))
        if not summary and not description:
            return None
        issue_key = _as_str(_first_present(row, _KEY_COLS))
        issue_id = _as_str(_first_present(row, _ID_COLS))
        comments = _collect_comments(row)
        embed_text = "\n\n".join(
            part
            for part in (
                f"Summary: {summary}" if summary else "",
                f"Description: {description}" if description else "",
                f"Comments: {comments}" if comments else "",
            )
            if part
        )
        browse = f"{_JIRA_BROWSE_BASE}/{issue_key}" if issue_key else ""
        return cls(
            doc_id=issue_id or issue_key or str(fallback_id),
            url=browse,
            title=issue_key or summary,
            content=embed_text,
            issue_key=issue_key,
            issue_id=issue_id,
            summary=summary,
            description=description,
            status=_as_str(_first_present(row, _STATUS_COLS)),
            priority=_as_str(_first_present(row, _PRIORITY_COLS)),
            assignee=_as_str(_first_present(row, _ASSIGNEE_COLS)),
            reporter=_as_str(_first_present(row, _REPORTER_COLS)),
            created=_as_str(_first_present(row, _CREATED_COLS)),
            updated=_as_str(_first_present(row, _UPDATED_COLS)),
            issue_type=_as_str(_first_present(row, _TYPE_COLS)),
            project=_as_str(_first_present(row, _PROJECT_COLS)),
            comments=comments,
            stored_point_id=_point_id(
                _first_present(row, _ID_COLS), issue_key, fallback_id
            ),
        )


def row_to_document(row: pd.Series, *, fallback_id: int = 0) -> JiraDocument | None:
    """Build a ``JiraDocument`` from one Jira CSV export row."""
    return JiraDocument.from_row(row, fallback_id=fallback_id)


class JiraCsvReader(Reader[JiraDocument]):
    def __init__(self, path: str | Path, *, start_line: int = 0) -> None:
        self.path = Path(path).expanduser()
        self.start_line = start_line
        self.row_count = 0

    def __iter__(self) -> Iterator[JiraDocument]:
        df = pd.read_csv(self.path, low_memory=False)
        df = df.dropna(axis=1, how="all")
        self.row_count = len(df)
        for idx, row in df.iloc[self.start_line :].iterrows():
            doc = JiraDocument.from_row(row, fallback_id=int(idx) + self.start_line)
            if doc is not None:
                yield doc

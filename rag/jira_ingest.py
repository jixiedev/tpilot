"""Ingest Jira CSV exports into Qdrant."""

from __future__ import annotations

import math
import re
from typing import Any

import pandas as pd
from qdrant_client.http import models as qmodels

from rag.config import get_rag_config
from rag.embeddings import get_embeddings, truncate_text
from rag.store import ensure_collection, upsert_points

# Standard Jira CSV export headers (and a few aliases used by older stubs).
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


def _first_present(row: pd.Series, names: tuple[str, ...]) -> Any:
    for name in names:
        if name in row.index and not _is_empty(row[name]):
            return row[name]
    return None


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


def _point_id(issue_id: Any, issue_key: str, fallback: int) -> int | str:
    if not _is_empty(issue_id):
        try:
            return int(float(issue_id))
        except (TypeError, ValueError):
            pass
    if issue_key:
        # Stable positive int from key when Issue id is missing.
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
    # Deduplicate while preserving order (exports often repeat).
    seen: set[str] = set()
    unique: list[str] = []
    for part in parts:
        if part in seen:
            continue
        seen.add(part)
        unique.append(part)
    return "\n---\n".join(unique)


def row_to_document(row: pd.Series) -> dict[str, Any] | None:
    summary = _as_str(_first_present(row, _SUMMARY_COLS))
    description = _as_str(_first_present(row, _DESCRIPTION_COLS))
    if not summary and not description:
        return None
    issue_key = _as_str(_first_present(row, _KEY_COLS))
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
    payload = {
        "issue_key": issue_key,
        "issue_id": _as_str(_first_present(row, _ID_COLS)),
        "summary": summary,
        "description": truncate_text(description, max_chars=4000),
        "status": _as_str(_first_present(row, _STATUS_COLS)),
        "priority": _as_str(_first_present(row, _PRIORITY_COLS)),
        "assignee": _as_str(_first_present(row, _ASSIGNEE_COLS)),
        "reporter": _as_str(_first_present(row, _REPORTER_COLS)),
        "created": _as_str(_first_present(row, _CREATED_COLS)),
        "updated": _as_str(_first_present(row, _UPDATED_COLS)),
        "issue_type": _as_str(_first_present(row, _TYPE_COLS)),
        "project": _as_str(_first_present(row, _PROJECT_COLS)),
        "comments": truncate_text(comments, max_chars=4000),
    }
    return {
        "embed_text": embed_text,
        "payload": {k: payload[k] for k in _PAYLOAD_KEEP},
        "issue_key": issue_key,
        "issue_id": _first_present(row, _ID_COLS),
    }


def upload_jira_csv(
    csv_path: str,
    collection_name: str,
    *,
    start_line: int = 0,
    batch_size: int | None = None,
) -> int:
    """Embed Jira CSV rows and upsert into ``collection_name``. Returns upserted count."""
    cfg = get_rag_config().embedding
    size = batch_size or cfg.batch_size
    df = pd.read_csv(csv_path, low_memory=False)
    df = df.dropna(axis=1, how="all")
    ensure_collection(collection_name)

    docs: list[tuple[int | str, dict[str, Any], str]] = []
    for idx, row in df.iloc[start_line:].iterrows():
        doc = row_to_document(row)
        if doc is None:
            continue
        point_id = _point_id(doc["issue_id"], doc["issue_key"], int(idx) + start_line)
        docs.append((point_id, doc["payload"], doc["embed_text"]))

    print(f"Loaded {len(df)} rows; {len(docs)} documents to embed into {collection_name!r}")
    uploaded = 0
    for offset in range(0, len(docs), size):
        batch = docs[offset : offset + size]
        try:
            vectors = get_embeddings([text for _, _, text in batch])
        except Exception as exc:  # noqa: BLE001 — continue remaining batches
            print(f"Embedding batch at offset {offset} failed: {exc}")
            continue
        points = [
            qmodels.PointStruct(id=point_id, vector=vector, payload=payload)
            for (point_id, payload, _), vector in zip(batch, vectors, strict=True)
        ]
        try:
            upsert_points(collection_name, points)
            uploaded += len(points)
            print(f"Upserted {uploaded}/{len(docs)}")
        except Exception as exc:  # noqa: BLE001
            print(f"Upsert failed at offset {offset}: {exc}")
    print(f"Upload complete: {uploaded} points in {collection_name!r}")
    return uploaded

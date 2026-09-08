from __future__ import annotations

from unittest.mock import MagicMock, patch

import pandas as pd
import pytest

from rag.jira import row_to_document
from tools.rag.jira import JIRA_PROFILES, fetch_related_jira_tickets


def test_row_to_document_uses_jira_csv_headers() -> None:
    row = pd.Series(
        {
            "Summary": "Hive metastore timeout",
            "Description": "Jobs fail after upgrade",
            "Issue key": "TAHOE-123",
            "Issue id": "10001",
            "Status": "Done",
            "Priority": "High",
            "Assignee": "alice",
            "Reporter": "bob",
            "Created": "2024-01-01",
            "Updated": "2024-01-02",
            "Issue Type": "Bug",
            "Project key": "TAHOE",
            "Comment": "Root cause was connection pool",
        }
    )

    doc = row_to_document(row)

    assert doc is not None
    assert doc.issue_key == "TAHOE-123"
    assert "Hive metastore timeout" in doc.content
    assert "Root cause was connection pool" in doc.content
    payload = doc.source_payload()
    assert payload["status"] == "Done"
    assert payload["assignee"] == "alice"


def test_row_to_document_skips_empty_rows() -> None:
    row = pd.Series({"Summary": "", "Description": None, "Issue key": "TAHOE-1"})
    assert row_to_document(row) is None


@patch("tools.rag.jira.qdrant_search")
def test_fetch_related_jira_tickets_formats_hits(mock_search: MagicMock) -> None:
    mock_search.return_value = [
        {
            "id": 1,
            "score": 0.91,
            "payload": {
                "issue_key": "TAHOE-9",
                "summary": "Flink checkpoint lag",
                "status": "Open",
                "priority": "Medium",
                "assignee": "carol",
                "reporter": "dave",
                "issue_type": "Task",
                "created": "2024-02-01",
                "updated": "2024-02-02",
                "description": "Lag spiked overnight",
                "comments": "",
            },
        }
    ]

    result = fetch_related_jira_tickets.invoke(
        {"query": "flink lag", "project": "tahoe", "limit": 3}
    )

    assert result == [
        {
            "score": 0.91,
            "issue_key": "TAHOE-9",
            "summary": "Flink checkpoint lag",
            "status": "Open",
            "priority": "Medium",
            "assignee": "carol",
            "reporter": "dave",
            "issue_type": "Task",
            "created": "2024-02-01",
            "updated": "2024-02-02",
            "description": "Lag spiked overnight",
        }
    ]
    mock_search.assert_called_once_with("jira_tahoe", "flink lag", limit=12)


@patch("tools.rag.jira.qdrant_search")
def test_fetch_related_jira_tickets_dedupes_issue_key(mock_search: MagicMock) -> None:
    mock_search.return_value = [
        {
            "id": "a",
            "score": 0.9,
            "payload": {
                "issue_key": "TAHOE-9",
                "summary": "first chunk",
                "status": "Open",
                "priority": "",
                "assignee": "",
                "reporter": "",
                "issue_type": "",
                "created": "",
                "updated": "",
                "description": "desc",
            },
        },
        {
            "id": "b",
            "score": 0.8,
            "payload": {
                "issue_key": "TAHOE-9",
                "summary": "comment chunk",
                "status": "Open",
                "priority": "",
                "assignee": "",
                "reporter": "",
                "issue_type": "",
                "created": "",
                "updated": "",
                "description": "desc",
            },
        },
        {
            "id": "c",
            "score": 0.7,
            "payload": {
                "issue_key": "CORE-1",
                "summary": "other",
                "status": "Open",
                "priority": "",
                "assignee": "",
                "reporter": "",
                "issue_type": "",
                "created": "",
                "updated": "",
                "description": "other",
            },
        },
    ]

    result = fetch_related_jira_tickets.invoke(
        {"query": "lag", "project": "tahoe", "limit": 5}
    )

    assert [row["issue_key"] for row in result] == ["TAHOE-9", "CORE-1"]
    mock_search.assert_called_once_with("jira_tahoe", "lag", limit=20)


def test_fetch_related_jira_tickets_rejects_wildcard_query() -> None:
    with pytest.raises(Exception, match="natural-language"):
        fetch_related_jira_tickets.invoke(
            {"query": "*", "project": "tahoe", "limit": 100}
        )


def test_fetch_related_jira_tickets_rejects_unknown_project() -> None:
    with pytest.raises(Exception):
        fetch_related_jira_tickets.invoke(
            {"query": "x", "project": "missing", "limit": 1}
        )


def test_jira_tool_description_includes_profile_catalog() -> None:
    description = fetch_related_jira_tickets.description or ""
    assert "Project catalog" in description
    for profile in JIRA_PROFILES:
        assert f"`{profile['project']}`" in description
        assert profile["jira_key"] in description
        assert profile["description"][:40] in description

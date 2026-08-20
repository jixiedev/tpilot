from __future__ import annotations

from datetime import datetime, timezone
from unittest.mock import MagicMock

import pytest

from tools.data import s3 as s3_mod


@pytest.fixture(autouse=True)
def _reset_s3_client() -> None:
    s3_mod.reset_s3_client()
    yield
    s3_mod.reset_s3_client()


def test_s3_list_objects(monkeypatch: pytest.MonkeyPatch) -> None:
    client = MagicMock()
    client.list_objects_v2.return_value = {
        "IsTruncated": False,
        "Contents": [
            {
                "Key": "logs/a.txt",
                "Size": 12,
                "LastModified": datetime(2026, 1, 1, tzinfo=timezone.utc),
            }
        ],
    }
    monkeypatch.setattr(s3_mod, "_s3_client", lambda: client)

    result = s3_mod.s3_list_objects.invoke(
        {"bucket": "lake", "prefix": "logs/", "max_keys": 10}
    )
    assert result["bucket"] == "lake"
    assert result["count"] == 1
    assert result["objects"][0]["key"] == "logs/a.txt"
    client.list_objects_v2.assert_called_once()


def test_s3_get_object_truncates(monkeypatch: pytest.MonkeyPatch) -> None:
    body = MagicMock()
    body.read.return_value = b"x" * (s3_mod.DEFAULT_MAX_BYTES + 1)
    client = MagicMock()
    client.get_object.return_value = {"Body": body}
    monkeypatch.setattr(s3_mod, "_s3_client", lambda: client)

    result = s3_mod.s3_get_object.invoke({"bucket": "lake", "key": "a.txt"})
    assert result["truncated"] is True
    assert result["size_bytes"] == s3_mod.DEFAULT_MAX_BYTES


def test_s3_head_object(monkeypatch: pytest.MonkeyPatch) -> None:
    client = MagicMock()
    client.head_object.return_value = {
        "ContentLength": 42,
        "ContentType": "text/plain",
        "ETag": '"abc"',
        "LastModified": datetime(2026, 1, 2, tzinfo=timezone.utc),
    }
    monkeypatch.setattr(s3_mod, "_s3_client", lambda: client)

    result = s3_mod.s3_head_object.invoke({"bucket": "lake", "key": "a.txt"})
    assert result["content_length"] == 42
    assert result["content_type"] == "text/plain"


def test_s3_missing_object(monkeypatch: pytest.MonkeyPatch) -> None:
    class _Missing(Exception):
        response = {"Error": {"Code": "NoSuchKey"}}

    client = MagicMock()
    client.head_object.side_effect = _Missing("missing")
    monkeypatch.setattr(s3_mod, "_s3_client", lambda: client)

    with pytest.raises(s3_mod.S3ToolError, match="Object not found"):
        s3_mod.s3_head_object.invoke({"bucket": "lake", "key": "gone"})


def test_s3_connection_kwargs_from_env(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("AWS_ACCESS_KEY_ID", "AKIATEST")
    monkeypatch.setenv("AWS_SECRET_ACCESS_KEY", "secret")
    monkeypatch.setenv("AWS_REGION", "us-west-2")
    monkeypatch.setenv("AWS_ENDPOINT_URL", "https://s3.local")
    kwargs = s3_mod.s3_connection_kwargs()
    assert kwargs["aws_access_key_id"] == "AKIATEST"
    assert kwargs["region_name"] == "us-west-2"
    assert kwargs["endpoint_url"] == "https://s3.local"
    assert kwargs["path_style"] is True


def test_s3_connection_kwargs_missing(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("AWS_ACCESS_KEY_ID", raising=False)
    monkeypatch.delenv("AWS_SECRET_ACCESS_KEY", raising=False)
    monkeypatch.delenv("AWS_REGION", raising=False)
    monkeypatch.delenv("AWS_DEFAULT_REGION", raising=False)
    monkeypatch.setattr(s3_mod, "s3_access_key_id", lambda: "")
    monkeypatch.setattr(s3_mod, "s3_secret_access_key", lambda: "")
    monkeypatch.setattr(s3_mod, "s3_region", lambda: "")
    with pytest.raises(s3_mod.S3ToolError, match="not configured"):
        s3_mod.s3_connection_kwargs()


def test_s3_tools_export_names() -> None:
    names = {tool.name for tool in s3_mod.TOOLS}
    assert names == {"s3_list_objects", "s3_get_object", "s3_head_object"}

"""Read-only S3 tools (Janus S3Tool: list / get / head)."""

from __future__ import annotations

import os
from functools import lru_cache
from typing import Any

from langchain.tools import tool

from config.tool_config import (
    s3_access_key_id,
    s3_endpoint_url,
    s3_region,
    s3_secret_access_key,
    tool_config,
)
from tools.errors import ToolErrorType, register_exception

DEFAULT_MAX_KEYS = 100
MAX_ALLOWED_KEYS = 1000
DEFAULT_MAX_BYTES = 65_536
MAX_ALLOWED_BYTES = 262_144


class S3ToolError(RuntimeError):
    """Raised when S3 configuration or an API call fails."""


def _classify_s3_tool_error(exc: BaseException) -> tuple[ToolErrorType, bool, str] | None:
    message = str(exc)
    lower = message.lower()
    if "not found" in lower or "nosuchkey" in lower or "404" in lower:
        return ToolErrorType.NOT_FOUND, False, message
    if any(token in lower for token in ("timeout", "timed out")):
        return ToolErrorType.TIMEOUT, True, message
    if any(token in lower for token in ("connection", "connect", "refused", "unreachable")):
        return ToolErrorType.CONNECTION, True, message
    if any(token in lower for token in ("access denied", "forbidden", "not authorized", "403")):
        return ToolErrorType.PERMISSION, False, message
    return ToolErrorType.UNKNOWN, False, message


register_exception(S3ToolError, classifier=_classify_s3_tool_error)

def _clamp(value: int | None, default: int, maximum: int) -> int:
    if value is None or value <= 0:
        return default
    return min(int(value), maximum)


def _require_bucket(bucket: str) -> str:
    text = (bucket or "").strip()
    if not text:
        raise ValueError("bucket must be a non-empty string")
    return text


def _require_key(key: str) -> str:
    text = (key or "").strip()
    if not text:
        raise ValueError("key must be a non-empty string")
    return text


def s3_connection_kwargs() -> dict[str, Any]:
    """Resolve explicit credentials from tools.toml / AWS_* env vars."""
    access_key = s3_access_key_id()
    secret = s3_secret_access_key()
    region = s3_region()
    if not access_key or not secret or not region:
        raise S3ToolError(
            "S3 credentials are not configured. Set tools.toml [s3] or environment "
            "variables AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION "
            "(optional AWS_ENDPOINT_URL, AWS_S3_PATH_STYLE_ACCESS)."
        )
    endpoint = s3_endpoint_url()
    path_style = bool(tool_config.s3.path_style_access)
    env_path_style = os.environ.get("AWS_S3_PATH_STYLE_ACCESS", "").strip().lower()
    if env_path_style in {"1", "true", "yes", "on"}:
        path_style = True
    if endpoint and not path_style:
        path_style = True
    return {
        "aws_access_key_id": access_key,
        "aws_secret_access_key": secret,
        "region_name": region,
        "endpoint_url": endpoint or None,
        "path_style": path_style,
    }


@lru_cache(maxsize=1)
def _s3_client():
    try:
        import boto3
        from botocore.config import Config
    except ImportError as exc:
        raise S3ToolError(
            "boto3 is required for S3 tools; install with `uv add boto3`"
        ) from exc

    kwargs = s3_connection_kwargs()
    config = Config(s3={"addressing_style": "path"}) if kwargs["path_style"] else None
    return boto3.client(
        "s3",
        aws_access_key_id=kwargs["aws_access_key_id"],
        aws_secret_access_key=kwargs["aws_secret_access_key"],
        region_name=kwargs["region_name"],
        endpoint_url=kwargs["endpoint_url"],
        config=config,
    )


def reset_s3_client() -> None:
    _s3_client.cache_clear()


def _client_error_code(exc: Exception) -> str:
    response = getattr(exc, "response", None)
    if isinstance(response, dict):
        error = response.get("Error") or {}
        return str(error.get("Code") or "")
    return ""


@tool
def s3_list_objects(
    bucket: str,
    prefix: str = "",
    max_keys: int = DEFAULT_MAX_KEYS,
) -> dict[str, Any]:
    """List objects in an S3 bucket under an optional prefix. Returns keys, sizes, and last modified times."""
    name = _require_bucket(bucket)
    limit = _clamp(max_keys, DEFAULT_MAX_KEYS, MAX_ALLOWED_KEYS)
    prefix_text = (prefix or "").strip()
    kwargs: dict[str, Any] = {"Bucket": name, "MaxKeys": limit}
    if prefix_text:
        kwargs["Prefix"] = prefix_text
    try:
        response = _s3_client().list_objects_v2(**kwargs)
    except Exception as exc:
        raise S3ToolError(f"S3 list failed: {exc}") from exc
    objects = []
    for item in response.get("Contents") or []:
        if len(objects) >= limit:
            break
        modified = item.get("LastModified")
        objects.append(
            {
                "key": item.get("Key"),
                "size": item.get("Size"),
                "modified": modified.isoformat() if hasattr(modified, "isoformat") else str(modified or ""),
            }
        )
    return {
        "bucket": name,
        "prefix": prefix_text or None,
        "truncated": bool(response.get("IsTruncated")),
        "count": len(objects),
        "objects": objects,
    }


@tool
def s3_get_object(
    bucket: str,
    key: str,
    max_bytes: int = DEFAULT_MAX_BYTES,
) -> dict[str, Any]:
    """Download an S3 object body as text (UTF-8). Binary objects may be truncated or garbled; use head first for metadata."""
    name = _require_bucket(bucket)
    object_key = _require_key(key)
    limit = _clamp(max_bytes, DEFAULT_MAX_BYTES, MAX_ALLOWED_BYTES)
    try:
        response = _s3_client().get_object(Bucket=name, Key=object_key)
        body = response["Body"].read(limit + 1)
    except Exception as exc:
        if _client_error_code(exc) in {"NoSuchKey", "404"}:
            raise S3ToolError(f"Object not found: s3://{name}/{object_key}") from exc
        raise S3ToolError(f"S3 get failed: {exc}") from exc
    truncated = len(body) > limit
    if truncated:
        body = body[:limit]
    return {
        "bucket": name,
        "key": object_key,
        "size_bytes": len(body),
        "truncated": truncated,
        "content": body.decode("utf-8", errors="replace"),
    }


@tool
def s3_head_object(bucket: str, key: str) -> dict[str, Any]:
    """Read S3 object metadata (size, etag, content type, last modified) without downloading the body."""
    name = _require_bucket(bucket)
    object_key = _require_key(key)
    try:
        response = _s3_client().head_object(Bucket=name, Key=object_key)
    except Exception as exc:
        code = _client_error_code(exc)
        if code in {"NoSuchKey", "404", "NotFound"}:
            raise S3ToolError(f"Object not found: s3://{name}/{object_key}") from exc
        raise S3ToolError(f"S3 head failed: {exc}") from exc
    modified = response.get("LastModified")
    return {
        "bucket": name,
        "key": object_key,
        "content_length": response.get("ContentLength"),
        "content_type": response.get("ContentType") or "",
        "etag": response.get("ETag") or "",
        "last_modified": modified.isoformat() if hasattr(modified, "isoformat") else str(modified or ""),
    }


TOOLS = [s3_list_objects, s3_get_object, s3_head_object]

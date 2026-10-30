"""User profile models for personalization (preferences across sessions)."""

from __future__ import annotations

import json
import re
from typing import Any

from pydantic import BaseModel, Field, ValidationError

_JSON_FENCE_RE = re.compile(
    r"```(?:json)?\s*\n?(.*?)```",
    flags=re.DOTALL | re.IGNORECASE,
)


class UserProfile(BaseModel):
    """Persistent personalization record for one user."""

    # Identity
    user_id: str = Field(default="", description="Stable user / login id")
    role: str = Field(default="", description="Job role (e.g. data analyst, SRE)")
    department: str = Field(default="", description="Org unit or team")
    region: str = Field(default="", description="Business or geographic region")

    # Permissions
    allowed_tables: list[str] = Field(
        default_factory=list,
        description="Tables this user may query (empty = no extra allow-list)",
    )
    forbidden_columns: list[str] = Field(
        default_factory=list,
        description="Columns that must not be selected or exposed",
    )

    # Localization
    language: str = Field(default="", description="Preferred reply language (e.g. zh-CN, en)")
    timezone: str = Field(default="", description="IANA timezone (e.g. Asia/Shanghai)")

    # Long-term preferences
    default_time_granularity: str = Field(
        default="",
        description="Default analysis grain (e.g. day, week, month)",
    )
    preferred_currency: str = Field(
        default="",
        description="Preferred currency code (e.g. CNY, USD)",
    )

    # Favorite analysis objects
    favorite_metrics: list[str] = Field(
        default_factory=list,
        description="Frequently used metrics / KPIs",
    )
    favorite_dimensions: list[str] = Field(
        default_factory=list,
        description="Frequently used dimensions (e.g. country, channel)",
    )


def _strip_json_fences(text: str) -> str:
    stripped = text.strip()
    match = _JSON_FENCE_RE.search(stripped)
    if match:
        return match.group(1).strip()
    return stripped


def _extract_json_object_text(text: str) -> str:
    stripped = _strip_json_fences(text)
    if stripped.startswith("{"):
        return stripped
    start = stripped.find("{")
    end = stripped.rfind("}")
    if start != -1 and end > start:
        return stripped[start : end + 1]
    return stripped


def parse_user_profile_update(raw: Any) -> UserProfile:
    """Parse structured, dict, JSON, or markdown-fenced JSON profile payloads."""
    if isinstance(raw, UserProfile):
        return raw
    if isinstance(raw, dict):
        return UserProfile.model_validate(raw)
    if hasattr(raw, "content"):
        return parse_user_profile_update(getattr(raw, "content"))

    if not isinstance(raw, str):
        raise TypeError(f"unsupported profile payload: {type(raw)!r}")

    text = raw.strip()
    if not text:
        raise ValueError("empty profile text")

    candidates: list[str] = []
    seen: set[str] = set()
    for candidate in (text, _extract_json_object_text(text)):
        if candidate not in seen:
            seen.add(candidate)
            candidates.append(candidate)

    last_error: Exception | None = None
    for candidate in candidates:
        if not candidate.startswith("{"):
            continue
        try:
            return UserProfile.model_validate(json.loads(candidate))
        except (json.JSONDecodeError, ValidationError) as exc:
            last_error = exc

    if last_error is not None:
        raise last_error
    raise ValueError("no JSON object found in profile payload")


def coerce_user_profile(value: UserProfile | dict | str | None = None) -> UserProfile:
    """Normalize checkpoint / node payloads into a ``UserProfile``.

    When ``value`` is missing, create a profile whose ``user_id`` comes from
    :func:`memory.profile_store.resolve_user_id`.
    """
    if value is None:
        from memory.profile_store import resolve_user_id

        return UserProfile(user_id=resolve_user_id())
    if isinstance(value, UserProfile):
        return value
    if isinstance(value, dict):
        return UserProfile.model_validate(value)
    if isinstance(value, str):
        return parse_user_profile_update(value)
    raise TypeError(f"unsupported profile value: {type(value)!r}")


def merge_user_profile(current: UserProfile, update: UserProfile) -> UserProfile:
    """Merge a model update into the current profile.

    Empty strings and empty lists in ``update`` leave the current value unchanged.
    ``user_id`` is never overwritten once already set.
    Non-empty list fields replace the previous list.
    """
    base = current.model_dump()
    incoming = update.model_dump()
    for key, value in incoming.items():
        if key == "user_id":
            if not base.get("user_id") and isinstance(value, str) and value.strip():
                base["user_id"] = value.strip()
            continue
        if isinstance(value, str):
            if value.strip():
                base[key] = value.strip()
            continue
        if isinstance(value, list):
            if value:
                base[key] = value
            continue
        if value is not None:
            base[key] = value
    return UserProfile.model_validate(base)

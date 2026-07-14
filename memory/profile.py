"""User profile models for personalization (preferences across sessions)."""

from __future__ import annotations

import getpass

from pydantic import BaseModel, Field


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


def coerce_user_profile(value: UserProfile | dict | None = None) -> UserProfile:
    """Normalize checkpoint / node payloads into a ``UserProfile``.

    When ``value`` is missing, create a new profile with the process user as ``user_id``.
    """
    if value is None:
        return UserProfile(user_id=getpass.getuser())
    if isinstance(value, UserProfile):
        return value
    return UserProfile.model_validate(value)


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

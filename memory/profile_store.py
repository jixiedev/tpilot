"""Filesystem-backed user profile store (keyed by user_id)."""

from __future__ import annotations

import getpass
import json
import os
import re
from collections.abc import Mapping
from pathlib import Path
from typing import Any, Protocol

from memory.profile import UserProfile

_USER_ID_ENV = "TAHOEPILOT_USER_ID"


def _user_id_text(value: object | None) -> str:
    if not isinstance(value, str):
        return ""
    return value.strip()


def resolve_user_id(
    explicit: str | None = None,
    *,
    prior: object | None = None,
    active: str | None = None,
) -> str:
    """Pick a user id: explicit value, then prior id, then the active id, then env, then the process user."""
    for candidate in (explicit, prior, active, os.getenv(_USER_ID_ENV)):
        text = _user_id_text(candidate)
        if text:
            return text
    return getpass.getuser()


class ProfileStore(Protocol):
    """Load and save ``UserProfile`` records outside session checkpoints.

    User id resolution (explicit value, checkpoint prior, env, process user) lives here.
    """

    def load(self, user_id: str) -> UserProfile: ...

    def save(self, user_id: str, profile: UserProfile) -> None: ...

    def resolve_user_id(
        self,
        explicit: str | None = None,
        *,
        prior: object | None = None,
    ) -> str: ...

    def activate_user(
        self,
        explicit: str | None = None,
        *,
        prior: object | None = None,
    ) -> str: ...

    def load_for_turn(
        self,
        state: Mapping[str, Any] | None = None,
        *,
        explicit: str | None = None,
    ) -> UserProfile: ...


def safe_profile_filename(user_id: str) -> str:
    """Map a user id to a safe single-segment filename (without extension)."""
    safe = re.sub(r"[^\w.\-@+]", "_", user_id.strip())
    return safe or "anonymous"


class FileProfileStore:
    """Persist one JSON file per user under ``root``."""

    def __init__(self, root: Path) -> None:
        self.root = root
        self._active_user_id: str | None = None

    def resolve_user_id(
        self,
        explicit: str | None = None,
        *,
        prior: object | None = None,
    ) -> str:
        """Resolve a user id, falling back to the user activated for this store."""
        return resolve_user_id(explicit, prior=prior, active=self._active_user_id)

    def activate_user(
        self,
        explicit: str | None = None,
        *,
        prior: object | None = None,
    ) -> str:
        """Resolve and remember the user for later loads in this process."""
        resolved = resolve_user_id(explicit, prior=prior)
        self._active_user_id = resolved
        return resolved

    def load_for_turn(
        self,
        state: Mapping[str, Any] | None = None,
        *,
        explicit: str | None = None,
    ) -> UserProfile:
        """Load the profile for a turn.

        ``state['user_id']`` is a prior id from the checkpoint. Resolution order
        is owned by :meth:`resolve_user_id`.
        """
        prior = state.get("user_id") if state is not None else None
        return self.load(self.resolve_user_id(explicit, prior=prior))

    def _path(self, user_id: str) -> Path:
        return self.root / f"{safe_profile_filename(user_id)}.json"

    def load(self, user_id: str) -> UserProfile:
        key = user_id.strip()
        if not key:
            return UserProfile()
        path = self._path(key)
        if not path.is_file():
            return UserProfile(user_id=key)
        data = json.loads(path.read_text(encoding="utf-8"))
        profile = UserProfile.model_validate(data)
        if not profile.user_id.strip():
            profile = profile.model_copy(update={"user_id": key})
        return profile

    def save(self, user_id: str, profile: UserProfile) -> None:
        key = user_id.strip()
        if not key:
            raise ValueError("user_id is required to save a profile")
        self.root.mkdir(parents=True, exist_ok=True)
        to_save = profile if profile.user_id.strip() else profile.model_copy(update={"user_id": key})
        self._path(key).write_text(
            to_save.model_dump_json(indent=2),
            encoding="utf-8",
        )

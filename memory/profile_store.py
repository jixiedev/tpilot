"""Filesystem-backed user profile store (keyed by user_id)."""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Protocol

from memory.profile import UserProfile


class ProfileStore(Protocol):
    """Load and save ``UserProfile`` records outside session checkpoints."""

    def load(self, user_id: str) -> UserProfile: ...

    def save(self, user_id: str, profile: UserProfile) -> None: ...


def safe_profile_filename(user_id: str) -> str:
    """Map a user id to a safe single-segment filename (without extension)."""
    safe = re.sub(r"[^\w.\-@+]", "_", user_id.strip())
    return safe or "anonymous"


class FileProfileStore:
    """Persist one JSON file per user under ``root``."""

    def __init__(self, root: Path) -> None:
        self.root = root

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

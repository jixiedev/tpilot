"""Process-local session state and user profiles."""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from memory.profile import UserProfile
from memory.profile_store import ProfileStore


def ensure_session_runtime(profiles: ProfileStore | SessionRuntime) -> SessionRuntime:
    """Return ``profiles`` when it is already a runtime; otherwise wrap disk storage."""
    if isinstance(profiles, SessionRuntime):
        return profiles
    return SessionRuntime(profiles)


@dataclass(frozen=True)
class SessionRecord:
    """One session as known in this process (checkpoint ``values`` + resolved ``user_id``)."""

    session_id: str
    user_id: str
    values: dict[str, Any]


class SessionRuntime:
    """In-process store for session checkpoints and user profiles.

    The LangGraph checkpointer and profile files are read only the first time a
    session or user is seen in this process. Later turns reuse this store.
    Saves still write through to disk so a new process can hydrate.
    """

    def __init__(self, profiles: ProfileStore) -> None:
        self.disk = profiles
        self._profiles: dict[str, UserProfile] = {}
        self._sessions: dict[str, SessionRecord] = {}

    def filesystem_root(self) -> Path:
        root = getattr(self.disk, "root", None)
        if isinstance(root, Path):
            return root
        raise TypeError(f"{type(self.disk).__name__} has no filesystem root")

    def known_session(self, session_id: str) -> bool:
        return session_id in self._sessions

    def session(self, session_id: str) -> SessionRecord | None:
        return self._sessions.get(session_id)

    def load(self, user_id: str) -> UserProfile:
        key = user_id.strip()
        if not key:
            return UserProfile()
        cached = self._profiles.get(key)
        if cached is not None:
            return cached
        profile = self.disk.load(key)
        self._profiles[key] = profile
        return profile

    def save(self, user_id: str, profile: UserProfile) -> None:
        self.disk.save(user_id, profile)
        key = user_id.strip()
        self._profiles[key] = profile

    def resolve_user_id(
        self,
        explicit: str | None = None,
        *,
        prior: object | None = None,
    ) -> str:
        return self.disk.resolve_user_id(explicit, prior=prior)

    def activate_user(
        self,
        explicit: str | None = None,
        *,
        prior: object | None = None,
    ) -> str:
        return self.disk.activate_user(explicit, prior=prior)

    def load_for_turn(
        self,
        state: Mapping[str, Any] | None = None,
        *,
        explicit: str | None = None,
    ) -> UserProfile:
        prior = state.get("user_id") if state is not None else None
        return self.load(self.resolve_user_id(explicit, prior=prior))

    def open(
        self,
        session_id: str,
        *,
        user_id: str | None = None,
        prior: Mapping[str, Any] | None = None,
    ) -> SessionRecord:
        """Return the in-memory session, creating it from ``prior`` on first sight."""
        existing = self._sessions.get(session_id)
        if existing is not None:
            resolved = self.activate_user(user_id, prior=existing.user_id)
            self.load(resolved)
            if resolved == existing.user_id:
                return existing
            record = SessionRecord(
                session_id=session_id,
                user_id=resolved,
                values=existing.values,
            )
            self._sessions[session_id] = record
            return record

        values = dict(prior or {})
        resolved = self.activate_user(user_id, prior=values.get("user_id"))
        self.load(resolved)
        record = SessionRecord(
            session_id=session_id,
            user_id=resolved,
            values=values,
        )
        self._sessions[session_id] = record
        return record

    def remember(
        self,
        session_id: str,
        values: Mapping[str, Any],
        *,
        user_id: str | None = None,
    ) -> SessionRecord:
        """Replace cached session values after a turn (does not read disk)."""
        existing = self._sessions.get(session_id)
        resolved = str(
            user_id
            or values.get("user_id")
            or (existing.user_id if existing is not None else "")
        )
        record = SessionRecord(
            session_id=session_id,
            user_id=resolved,
            values=dict(values),
        )
        self._sessions[session_id] = record
        return record

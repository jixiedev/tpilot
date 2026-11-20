"""Filesystem-backed user profile store (keyed by user_id)."""

from __future__ import annotations

import getpass
import json
import re
from collections.abc import Mapping
from pathlib import Path
from typing import Any, Protocol

from memory.profile import UserProfile



def _user_id_text(value: object | None) -> str:
    if not isinstance(value, str):
        return ""
    return value.strip()


#: ``configurable`` key carrying the run's user id (CLI: ``session_graph_config``;
#: web: ``agui_endpoint``). Nested specialists and tools inherit it.
RUN_USER_ID_KEY = "user_id"


def run_user_id() -> str:
    """The user id in the current graph run's config, or ``""`` outside a run.

    This is the user the run was started for, so tools (which see no state)
    and code inside nested specialists read it here.
    """
    from langgraph.config import get_config

    try:
        configurable = get_config().get("configurable") or {}
    except RuntimeError:  # not inside a graph run
        return ""
    return _user_id_text(configurable.get(RUN_USER_ID_KEY))


def resolve_user_id(
    explicit: str | None = None,
    *,
    prior: object | None = None,
    active: str | None = None,
) -> str:
    """Pick a user id, first non-empty of:

    1. ``explicit``: CLI ``-u``, the web request's user header, a delegated task's id;
    2. the current run's ``configurable.user_id`` (:func:`run_user_id`);
    3. ``prior``: the id stored in the thread's checkpoint state;
    4. ``active``: the user a CLI process activated;
    5. ``[user].default_id`` in runtime.toml;
    6. the OS user.

    The CLI and the web server both resolve once at the start of a run and put
    the result in state and in the run config, so later lookups agree.
    """
    from settings.runtime_config import default_user_id

    for candidate in (explicit, run_user_id(), prior, active, default_user_id()):
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


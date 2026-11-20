"""Login for the web UI: LDAP checks the password, a signed token carries the username.

``[auth]`` in ``<config dir>/server.toml`` turns it on. The flow:

1. The login page posts username and password to the Next.js route
   ``/api/auth/login``, which calls ``POST {AGUI_PATH}/auth/login`` here.
2. :func:`ldap_check` binds to the directory as that user. The password is
   used for that bind only and never stored.
3. :func:`issue_token` returns ``<payload>.<signature>``: the username and an
   expiry, signed with HMAC-SHA256 (key in the secrets file,
   ``TAHOEPILOT_SESSION_SECRET`` by default). Next.js keeps it in an
   ``httpOnly`` cookie and sends it back as ``Authorization: Bearer <token>``.
4. :func:`user_from_request` verifies it on every AG-UI request; the username
   becomes the run's ``user_id``.

With ``[auth].enabled = false`` nothing changes: the ``[agui].user_header``
header (set by an auth proxy) or the defaults identify the user.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import logging
import os
import re
import time
from collections.abc import Mapping
from dataclasses import dataclass

from settings.server_config import AuthConfig, get_server_config

logger = logging.getLogger("agui_server")

#: Usernames accepted at login: letters, digits and ``. _ @ -``.
USERNAME_RE = re.compile(r"^[A-Za-z0-9._@-]{1,128}$")


class AuthError(Exception):
    """Login failed or a session token is missing/invalid (HTTP 401)."""


class DirectoryUnavailable(Exception):
    """The LDAP server could not be reached (HTTP 503)."""


@dataclass(frozen=True)
class Session:
    user: str
    expires_at: int


def auth_config() -> AuthConfig:
    return get_server_config().auth


def _secret(cfg: AuthConfig) -> bytes:
    value = os.environ.get(cfg.session_secret_env, "")
    if len(value) < 32:
        raise RuntimeError(
            f"login is enabled but {cfg.session_secret_env} is missing or shorter than 32 "
            "characters; set it in the secrets file"
        )
    return value.encode()


def _b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def _unb64(text: str) -> bytes:
    return base64.urlsafe_b64decode(text + "=" * (-len(text) % 4))


# ---------------------------------------------------------------------------
# Session tokens
# ---------------------------------------------------------------------------


def issue_token(user: str, cfg: AuthConfig | None = None, *, now: float | None = None) -> tuple[str, Session]:
    """``(token, session)`` for ``user``, valid for ``[auth].session_hours``."""
    cfg = cfg or auth_config()
    expires_at = int((now if now is not None else time.time()) + cfg.session_hours * 3600)
    payload = _b64(json.dumps({"u": user, "exp": expires_at}, separators=(",", ":")).encode())
    signature = _b64(hmac.new(_secret(cfg), payload.encode(), hashlib.sha256).digest())
    return f"{payload}.{signature}", Session(user=user, expires_at=expires_at)


def verify_token(token: str, cfg: AuthConfig | None = None, *, now: float | None = None) -> Session:
    """The session in ``token``; raises :class:`AuthError` when forged, malformed or expired."""
    cfg = cfg or auth_config()
    payload, _, signature = (token or "").strip().partition(".")
    if not payload or not signature:
        raise AuthError("missing session token")
    expected = _b64(hmac.new(_secret(cfg), payload.encode(), hashlib.sha256).digest())
    if not hmac.compare_digest(expected, signature):
        raise AuthError("invalid session token")
    try:
        data = json.loads(_unb64(payload))
        user, expires_at = str(data["u"]), int(data["exp"])
    except (ValueError, KeyError, TypeError) as exc:
        raise AuthError("invalid session token") from exc
    if expires_at <= (now if now is not None else time.time()):
        raise AuthError("session expired; sign in again")
    return Session(user=user, expires_at=expires_at)


def user_from_request(headers: Mapping[str, str], cfg: AuthConfig | None = None) -> str:
    """The signed-in username from ``Authorization: Bearer <token>``."""
    cfg = cfg or auth_config()
    value = headers.get("authorization") or headers.get("Authorization") or ""
    scheme, _, token = value.partition(" ")
    if scheme.lower() != "bearer" or not token.strip():
        raise AuthError("not signed in")
    return verify_token(token, cfg).user


# ---------------------------------------------------------------------------
# LDAP
# ---------------------------------------------------------------------------


def user_dn(username: str, cfg: AuthConfig) -> str:
    from ldap3.utils.dn import escape_rdn

    if "{username}" not in cfg.user_dn_template:
        raise RuntimeError("[auth].user_dn_template must contain {username}")
    return cfg.user_dn_template.replace("{username}", escape_rdn(username))


def _bind(server, user: str, password: str, cfg: AuthConfig):
    """An open connection bound as ``user``, or ``None`` when the directory rejects it."""
    from ldap3 import Connection
    from ldap3.core.exceptions import LDAPException

    conn = Connection(
        server,
        user=user,
        password=password,
        receive_timeout=cfg.timeout_seconds,
        raise_exceptions=False,
    )
    try:
        conn.open()
        if cfg.start_tls:
            conn.start_tls()
        if conn.bind():
            return conn
    except LDAPException as exc:
        logger.warning("ldap bind as %s failed: %s", user, exc)
        _unbind(conn)
        raise DirectoryUnavailable("the directory could not be reached; try again later") from exc
    logger.info("ldap bind rejected for %s: %s", user, (conn.result or {}).get("description"))
    _unbind(conn)
    return None


def _unbind(conn) -> None:
    try:
        conn.unbind()
    except Exception:  # noqa: BLE001 - closing is best effort
        pass


def _search_user_dn(server, username: str, cfg: AuthConfig) -> str | None:
    """Find the user's DN with the service account (``bind_user``); ``None`` if not exactly one."""
    from ldap3.core.exceptions import LDAPException
    from ldap3.utils.conv import escape_filter_chars

    password = os.environ.get(cfg.bind_password_env, "") if cfg.bind_password_env else ""
    if not cfg.bind_user or not password:
        raise RuntimeError(
            f"[auth].user_search_filter needs bind_user and the {cfg.bind_password_env or 'bind_password_env'} "
            "secret to look users up"
        )
    conn = _bind(server, cfg.bind_user, password, cfg)
    if conn is None:
        logger.error("ldap service account %s was rejected; check bind_user and its password", cfg.bind_user)
        raise DirectoryUnavailable("sign-in is misconfigured; contact the administrator")
    try:
        query = cfg.user_search_filter.replace("{username}", escape_filter_chars(username))
        conn.search(cfg.user_base_dn, query, attributes=[], size_limit=2)
        entries = [e for e in (conn.response or []) if e.get("type") == "searchResEntry"]
    except LDAPException as exc:
        logger.warning("ldap search for %s failed: %s", username, exc)
        raise DirectoryUnavailable("the directory could not be reached; try again later") from exc
    finally:
        _unbind(conn)
    if len(entries) != 1:
        logger.info("ldap search for %s found %d entries", username, len(entries))
        return None
    return str(entries[0]["dn"])


def ldap_check(username: str, password: str, cfg: AuthConfig | None = None) -> None:
    """Bind as ``username``; raises :class:`AuthError` on bad credentials.

    The user's DN comes from ``user_search_filter`` (search with the service
    account, then bind as the found DN) when it is set, else from
    ``user_dn_template``. An empty password is refused before contacting the
    server: LDAP treats a bind with a DN and no password as an anonymous bind,
    which succeeds.
    """
    from ldap3 import Server

    cfg = cfg or auth_config()
    if not USERNAME_RE.match(username or "") or not password:
        raise AuthError("invalid username or password")
    if not cfg.ldap_url:
        raise RuntimeError("login is enabled but [auth].ldap_url is empty")
    server = Server(cfg.ldap_url, connect_timeout=cfg.timeout_seconds)
    if cfg.user_search_filter:
        dn = _search_user_dn(server, username, cfg)
        if dn is None:
            raise AuthError("invalid username or password")
    else:
        dn = user_dn(username, cfg)
    conn = _bind(server, dn, password, cfg)
    if conn is None:
        raise AuthError("invalid username or password")
    _unbind(conn)


def login(username: str, password: str, cfg: AuthConfig | None = None) -> tuple[str, Session]:
    """Check the password with LDAP and return ``(token, session)`` for the username."""
    cfg = cfg or auth_config()
    username = (username or "").strip()
    if cfg.skip_password_check:
        if not USERNAME_RE.match(username):
            raise AuthError("invalid username or password")
        logger.warning(
            "login: [auth].skip_password_check is on; %s signed in WITHOUT a password check", username
        )
    else:
        ldap_check(username, password, cfg)
    return issue_token(username, cfg)

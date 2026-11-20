"""AG-UI backend and Next.js frontend settings from ``<config dir>/server.toml``.

``python -m settings.server_config`` prints the frontend values as shell
``export`` lines; ``docker/entrypoint.sh`` evals them before starting Next.js,
whose server routes read ``AGUI_BACKEND_URL`` from the environment.
"""

from __future__ import annotations

import shlex
import tomllib
from functools import lru_cache
from typing import Literal

from pydantic import BaseModel, Field

from settings.paths import config_file


class AguiServerConfig(BaseModel):
    host: str = "0.0.0.0"
    port: int = 8000
    # Base path; each front agent is served at ``{path}/{name}``.
    path: str = "/agui"
    subagent_visibility: Literal["inline", "hidden", "attributed"] = "inline"
    emit_raw_events: bool = False
    # Request header naming the visitor; empty disables it (every run uses the
    # thread's stored id or ``[user].default_id``).
    user_header: str = "X-Tahoepilot-User"

    @property
    def base_path(self) -> str:
        return self.path.rstrip("/") or "/agui"


class FrontendServerConfig(BaseModel):
    host: str = "0.0.0.0"
    port: int = 3000
    # Where the Next.js server routes forward AG-UI requests.
    backend_url: str = "http://127.0.0.1:8000/agui"


class AuthConfig(BaseModel):
    """Login page: LDAP checks the password; only the username is kept."""

    enabled: bool = False
    # Development only: accept any password and skip LDAP (the username is still
    # validated and kept). Anyone can sign in as anyone; never set it in a deployment.
    skip_password_check: bool = False
    # e.g. "ldaps://ldap.example.com:636" or "ldap://ldap.example.com:389".
    ldap_url: str = ""
    # Bind DN for a username; ``{username}`` is replaced (DN-escaped).
    user_dn_template: str = ""
    # Search-then-bind instead of the template: the service account finds the
    # user's DN under ``user_base_dn`` with this filter (``{username}`` is
    # replaced, filter-escaped), then the user binds as that DN.
    user_base_dn: str = ""
    user_search_filter: str = ""
    bind_user: str = ""
    # Env variable holding the service account's password (secret).
    bind_password_env: str = "LDAP_BIND_PASSWORD"
    # Upgrade a plain ldap:// connection with StartTLS before binding.
    start_tls: bool = False
    timeout_seconds: int = 10
    # How long a login lasts (session token and cookie lifetime).
    session_hours: int = 12
    # Env variable holding the HMAC key that signs session tokens (secret).
    session_secret_env: str = "TAHOEPILOT_SESSION_SECRET"


class ServerConfig(BaseModel):
    agui: AguiServerConfig = Field(default_factory=AguiServerConfig)
    frontend: FrontendServerConfig = Field(default_factory=FrontendServerConfig)
    auth: AuthConfig = Field(default_factory=AuthConfig)


@lru_cache(maxsize=1)
def get_server_config() -> ServerConfig:
    path = config_file("server.toml")
    if not path.is_file():
        return ServerConfig()
    with path.open("rb") as f:
        return ServerConfig.model_validate(tomllib.load(f))


def frontend_env() -> dict[str, str]:
    """Environment for the Next.js process (``server.js`` reads HOSTNAME/PORT)."""
    cfg = get_server_config()
    fe = cfg.frontend
    return {
        "HOSTNAME": fe.host,
        "PORT": str(fe.port),
        "AGUI_BACKEND_URL": fe.backend_url,
        # Next.js proxy.ts sends visitors without a session cookie to /login.
        "TAHOEPILOT_AUTH_ENABLED": "true" if cfg.auth.enabled else "false",
    }


if __name__ == "__main__":
    for key, value in frontend_env().items():
        print(f"export {key}={shlex.quote(value)}")

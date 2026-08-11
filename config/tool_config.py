from __future__ import annotations

import os
import tomllib
from pathlib import Path

from pydantic import BaseModel, Field

_CONFIG_PATH = Path(__file__).resolve().parent / "tools.toml"


class HiveToolConfig(BaseModel):
    hms_host: str
    hms_port: int


class TrinoToolConfig(BaseModel):
    host: str
    port: int = 8080
    user: str
    password: str = ""
    password_env: str | None = None
    catalog: str = "hive"
    schema_name: str = "default"
    http_scheme: str = "https"


class DataHubToolConfig(BaseModel):
    """DataHub GraphQL client settings (query-only tools).

    Aligned with ``mcp-server-datahub`` env naming (``DATAHUB_GMS_URL`` +
    ``DATAHUB_GMS_TOKEN``). GraphQL is ``{gms_url}/api/graphql``.
    """

    gms_url: str = "http://localhost:8080"
    gms_url_env: str | None = "DATAHUB_GMS_URL"
    token: str = ""
    token_env: str | None = "DATAHUB_GMS_TOKEN"
    timeout_seconds: float = 30.0


class ToolConfig(BaseModel):
    hive: HiveToolConfig
    trino: TrinoToolConfig
    datahub: DataHubToolConfig = Field(default_factory=DataHubToolConfig)


def trino_password(cfg: TrinoToolConfig | None = None) -> str:
    trino = cfg or tool_config.trino
    if trino.password_env:
        env_value = os.environ.get(trino.password_env, "").strip()
        if env_value:
            return env_value
    if trino.password.strip():
        return trino.password.strip()
    env_hint = trino.password_env or "password"
    raise ValueError(
        f"Missing Trino password for user={trino.user!r}; "
        f"set environment variable {env_hint!r} or tools.toml password"
    )


def datahub_gms_url(cfg: DataHubToolConfig | None = None) -> str:
    """Resolve GMS base URL (env overrides toml), same source as MCP ``DATAHUB_GMS_URL``."""
    datahub = cfg or tool_config.datahub
    if datahub.gms_url_env:
        env_value = os.environ.get(datahub.gms_url_env, "").strip()
        if env_value:
            return env_value.rstrip("/")
    base = datahub.gms_url.strip().rstrip("/")
    if not base:
        raise ValueError(
            "Missing DataHub GMS URL; "
            f"set environment variable {datahub.gms_url_env or 'DATAHUB_GMS_URL'!r} "
            "or tools.toml [datahub].gms_url"
        )
    return base


def datahub_graphql_url(cfg: DataHubToolConfig | None = None) -> str:
    """GraphQL endpoint derived from GMS URL (``/api/graphql``)."""
    base = datahub_gms_url(cfg)
    if base.endswith("/api/graphql"):
        return base
    return f"{base}/api/graphql"


def datahub_token(cfg: DataHubToolConfig | None = None) -> str:
    datahub = cfg or tool_config.datahub
    if datahub.token_env:
        env_value = os.environ.get(datahub.token_env, "").strip()
        if env_value:
            return env_value
    if datahub.token.strip():
        return datahub.token.strip()
    env_hint = datahub.token_env or "DATAHUB_GMS_TOKEN"
    raise ValueError(
        f"Missing DataHub access token; "
        f"set environment variable {env_hint!r} or tools.toml [datahub].token"
    )


with open(_CONFIG_PATH, "rb") as f:
    tool_config = ToolConfig.model_validate(tomllib.load(f))

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

    Compatible with DataHub ~1.2.x ``POST /api/graphql`` + Bearer token auth.
    """

    graphql_url: str = "http://localhost:8080/api/graphql"
    token: str = ""
    token_env: str | None = "DATAHUB_TOKEN"
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


def datahub_token(cfg: DataHubToolConfig | None = None) -> str:
    datahub = cfg or tool_config.datahub
    if datahub.token_env:
        env_value = os.environ.get(datahub.token_env, "").strip()
        if env_value:
            return env_value
    if datahub.token.strip():
        return datahub.token.strip()
    env_hint = datahub.token_env or "DATAHUB_TOKEN"
    raise ValueError(
        f"Missing DataHub access token; "
        f"set environment variable {env_hint!r} or tools.toml [datahub].token"
    )


with open(_CONFIG_PATH, "rb") as f:
    tool_config = ToolConfig.model_validate(tomllib.load(f))

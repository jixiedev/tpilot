from __future__ import annotations

import os
import tomllib
from pathlib import Path

from pydantic import BaseModel

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


class ToolConfig(BaseModel):
    hive: HiveToolConfig
    trino: TrinoToolConfig


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


with open(_CONFIG_PATH, "rb") as f:
    tool_config = ToolConfig.model_validate(tomllib.load(f))

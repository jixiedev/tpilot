from __future__ import annotations

import os
import tomllib
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, Field

from settings.paths import config_file


class HiveToolConfig(BaseModel):
    hms_host: str
    hms_port: int


class TrinoToolConfig(BaseModel):
    host: str
    port: int = 8080
    user: str = ""
    user_env: str | None = None
    password: str = ""
    password_env: str | None = None
    catalog: str = "hive"
    schema_name: str = "default"
    http_scheme: str = "https"
    #: Seconds per HTTP request to the coordinator (each poll of a running query).
    request_timeout_seconds: float = 30.0
    #: Driver-level attempts per request. The tool wrapper already retries
    #: transient errors once, so the driver's default of 3 made an unreachable
    #: Trino block a single tool call for ~3 minutes (6 with the wrapper retry).
    max_attempts: int = 1
    #: Who queries run as. "service": the service user (``user_env``). "impersonate":
    #: the service account authenticates and each query runs as the run's signed-in
    #: user (``configurable.user_id``), with that user's Trino permissions; Trino
    #: must allow the service user to impersonate. Without a run user, the service user.
    user_identity: Literal["service", "impersonate"] = "service"
    #: Trino ``source`` shown in query history.
    source: str = "tahoepilot"


class DataHubToolConfig(BaseModel):
    """DataHub GraphQL client settings (query-only tools).

    Aligned with ``mcp-server-datahub`` env naming (``DATAHUB_GMS_URL`` +
    ``DATAHUB_GMS_TOKEN``). GraphQL is ``{gms_url}/api/graphql``.
    """

    gms_url: str = "http://localhost:8080"
    token: str = ""
    token_env: str | None = "DATAHUB_GMS_TOKEN"
    timeout_seconds: float = 30.0


class K8sToolConfig(BaseModel):
    """Kubernetes client settings for read-only cluster tools."""

    # Empty → the client's default discovery (in-cluster, else ~/.kube/config).
    config_file: str = ""
    default_namespace: str = "default"


class WebSearchToolConfig(BaseModel):
    """Public web search (Tavily / Brave / DuckDuckGo)."""

    enabled: bool = True
    provider: str = "duckduckgo"
    max_results: int = 5
    tavily_api_key: str = ""
    tavily_api_key_env: str | None = "TAVILY_API_KEY"
    brave_api_key: str = ""
    brave_api_key_env: str | None = "BRAVE_API_KEY"


class S3ToolConfig(BaseModel):
    """Read-only S3 client settings."""

    access_key_id: str = ""
    access_key_id_env: str | None = "AWS_ACCESS_KEY_ID"
    secret_access_key: str = ""
    secret_access_key_env: str | None = "AWS_SECRET_ACCESS_KEY"
    region: str = ""
    endpoint_url: str = ""
    path_style_access: bool = False


class ToolConfig(BaseModel):
    hive: HiveToolConfig
    trino: TrinoToolConfig
    datahub: DataHubToolConfig = Field(default_factory=DataHubToolConfig)
    k8s: K8sToolConfig = Field(default_factory=K8sToolConfig)
    web_search: WebSearchToolConfig = Field(default_factory=WebSearchToolConfig)
    s3: S3ToolConfig = Field(default_factory=S3ToolConfig)


def trino_user(cfg: TrinoToolConfig | None = None) -> str:
    """Trino user: the variable named by ``user_env`` (secrets file) first, then ``user``."""
    trino = cfg or tool_config.trino
    if trino.user_env:
        env_value = os.environ.get(trino.user_env, "").strip()
        if env_value:
            return env_value
    if trino.user.strip():
        return trino.user.strip()
    raise ValueError(
        f"Missing Trino user; set {trino.user_env or 'TRINO_USER'!r} in the secrets file "
        "or tools.toml [trino].user"
    )


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
        "Missing Trino password; "
        f"set {env_hint!r} in the secrets file or tools.toml password"
    )


def datahub_gms_url(cfg: DataHubToolConfig | None = None) -> str:
    """GMS base URL from tools.toml ``[datahub].gms_url``."""
    datahub = cfg or tool_config.datahub
    base = datahub.gms_url.strip().rstrip("/")
    if not base:
        raise ValueError("Missing DataHub GMS URL; set tools.toml [datahub].gms_url")
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


def k8s_config_file(cfg: K8sToolConfig | None = None) -> str:
    """kubeconfig path from tools.toml ``[k8s].config_file``. Empty means client default discovery."""
    k8s = cfg or tool_config.k8s
    return (k8s.config_file or "").strip()


def _env_or_value(env_name: str | None, inline: str) -> str:
    if env_name:
        env_value = os.environ.get(env_name, "").strip()
        if env_value:
            return env_value
    return (inline or "").strip()


def web_search_api_key(kind: str, cfg: WebSearchToolConfig | None = None) -> str:
    """Resolve Tavily or Brave API key (env overrides toml)."""
    search = cfg or tool_config.web_search
    if kind == "tavily":
        return _env_or_value(search.tavily_api_key_env, search.tavily_api_key)
    if kind == "brave":
        return _env_or_value(search.brave_api_key_env, search.brave_api_key)
    raise ValueError(f"Unknown web search key kind: {kind!r}")


def s3_access_key_id(cfg: S3ToolConfig | None = None) -> str:
    s3 = cfg or tool_config.s3
    return _env_or_value(s3.access_key_id_env, s3.access_key_id)


def s3_secret_access_key(cfg: S3ToolConfig | None = None) -> str:
    s3 = cfg or tool_config.s3
    return _env_or_value(s3.secret_access_key_env, s3.secret_access_key)


def s3_region(cfg: S3ToolConfig | None = None) -> str:
    s3 = cfg or tool_config.s3
    return s3.region.strip()


def s3_endpoint_url(cfg: S3ToolConfig | None = None) -> str:
    s3 = cfg or tool_config.s3
    return s3.endpoint_url.strip()


with open(config_file("tools.toml"), "rb") as f:
    tool_config = ToolConfig.model_validate(tomllib.load(f))

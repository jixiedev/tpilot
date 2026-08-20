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


class K8sToolConfig(BaseModel):
    """Kubernetes client settings for read-only cluster tools."""

    # Empty → default kubeconfig discovery (~/.kube/config or KUBECONFIG).
    config_file: str = ""
    config_file_env: str | None = "KUBECONFIG"
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
    region_env: str | None = "AWS_REGION"
    endpoint_url: str = ""
    endpoint_url_env: str | None = "AWS_ENDPOINT_URL"
    path_style_access: bool = False


class ToolConfig(BaseModel):
    hive: HiveToolConfig
    trino: TrinoToolConfig
    datahub: DataHubToolConfig = Field(default_factory=DataHubToolConfig)
    k8s: K8sToolConfig = Field(default_factory=K8sToolConfig)
    web_search: WebSearchToolConfig = Field(default_factory=WebSearchToolConfig)
    s3: S3ToolConfig = Field(default_factory=S3ToolConfig)


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


def k8s_config_file(cfg: K8sToolConfig | None = None) -> str:
    """Resolve kubeconfig path (env overrides toml). Empty means client default discovery."""
    k8s = cfg or tool_config.k8s
    if k8s.config_file_env:
        env_value = os.environ.get(k8s.config_file_env, "").strip()
        if env_value:
            return env_value
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
    region = _env_or_value(s3.region_env, s3.region)
    if region:
        return region
    return os.environ.get("AWS_DEFAULT_REGION", "").strip()


def s3_endpoint_url(cfg: S3ToolConfig | None = None) -> str:
    s3 = cfg or tool_config.s3
    return _env_or_value(s3.endpoint_url_env, s3.endpoint_url)


with open(_CONFIG_PATH, "rb") as f:
    tool_config = ToolConfig.model_validate(tomllib.load(f))

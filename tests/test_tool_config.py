from __future__ import annotations

import pytest

from config.tool_config import (
    DataHubToolConfig,
    K8sToolConfig,
    S3ToolConfig,
    TrinoToolConfig,
    WebSearchToolConfig,
    datahub_graphql_url,
    datahub_gms_url,
    datahub_token,
    k8s_config_file,
    s3_access_key_id,
    s3_region,
    trino_password,
    web_search_api_key,
)


def test_trino_password_from_env(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("TRINO_PASSWORD", "secret-from-env")
    cfg = TrinoToolConfig(
        host="localhost",
        user="alice",
        password_env="TRINO_PASSWORD",
    )

    assert trino_password(cfg) == "secret-from-env"


def test_trino_password_falls_back_to_toml() -> None:
    cfg = TrinoToolConfig(host="localhost", user="alice", password="inline-secret")

    assert trino_password(cfg) == "inline-secret"


def test_trino_password_env_takes_precedence_over_toml(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("TRINO_PASSWORD", "env-wins")
    cfg = TrinoToolConfig(
        host="localhost",
        user="alice",
        password="toml-value",
        password_env="TRINO_PASSWORD",
    )

    assert trino_password(cfg) == "env-wins"


def test_trino_password_missing_raises(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("TRINO_PASSWORD", raising=False)
    cfg = TrinoToolConfig(host="localhost", user="alice", password_env="TRINO_PASSWORD")

    with pytest.raises(ValueError, match="TRINO_PASSWORD"):
        trino_password(cfg)


def test_datahub_token_from_env(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DATAHUB_GMS_TOKEN", "token-from-env")
    cfg = DataHubToolConfig(token_env="DATAHUB_GMS_TOKEN")
    assert datahub_token(cfg) == "token-from-env"


def test_datahub_token_falls_back_to_toml(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("DATAHUB_GMS_TOKEN", raising=False)
    cfg = DataHubToolConfig(token="inline-token", token_env="DATAHUB_GMS_TOKEN")
    assert datahub_token(cfg) == "inline-token"


def test_datahub_token_missing_raises(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("DATAHUB_GMS_TOKEN", raising=False)
    cfg = DataHubToolConfig(token="", token_env="DATAHUB_GMS_TOKEN")
    with pytest.raises(ValueError, match="DATAHUB_GMS_TOKEN"):
        datahub_token(cfg)


def test_datahub_gms_url_from_env(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DATAHUB_GMS_URL", "https://gms.example:8080/")
    cfg = DataHubToolConfig(
        gms_url="http://localhost:8080",
        gms_url_env="DATAHUB_GMS_URL",
    )
    assert datahub_gms_url(cfg) == "https://gms.example:8080"
    assert datahub_graphql_url(cfg) == "https://gms.example:8080/api/graphql"


def test_datahub_graphql_url_from_toml(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("DATAHUB_GMS_URL", raising=False)
    cfg = DataHubToolConfig(gms_url="https://datahub.s.tahoe.wish.site:8080")
    assert datahub_graphql_url(cfg) == "https://datahub.s.tahoe.wish.site:8080/api/graphql"


def test_k8s_config_file_from_env(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("KUBECONFIG", "/tmp/custom.kubeconfig")
    cfg = K8sToolConfig(config_file="./k8s_config", config_file_env="KUBECONFIG")
    assert k8s_config_file(cfg) == "/tmp/custom.kubeconfig"


def test_k8s_config_file_falls_back_to_toml(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("KUBECONFIG", raising=False)
    cfg = K8sToolConfig(config_file="./k8s_config", config_file_env="KUBECONFIG")
    assert k8s_config_file(cfg) == "./k8s_config"


def test_web_search_api_key_from_env(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("TAVILY_API_KEY", "tvly-env")
    cfg = WebSearchToolConfig(tavily_api_key="toml", tavily_api_key_env="TAVILY_API_KEY")
    assert web_search_api_key("tavily", cfg) == "tvly-env"


def test_s3_access_key_from_env(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("AWS_ACCESS_KEY_ID", "AKIATEST")
    monkeypatch.setenv("AWS_REGION", "eu-west-1")
    cfg = S3ToolConfig(
        access_key_id="toml-key",
        access_key_id_env="AWS_ACCESS_KEY_ID",
        region="us-east-1",
        region_env="AWS_REGION",
    )
    assert s3_access_key_id(cfg) == "AKIATEST"
    assert s3_region(cfg) == "eu-west-1"

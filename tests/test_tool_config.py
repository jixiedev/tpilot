from __future__ import annotations

import pytest

from config.tool_config import TrinoToolConfig, trino_password


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

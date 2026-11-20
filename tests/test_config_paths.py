"""Every configuration file is read from the config directory."""

from __future__ import annotations

import shutil
from pathlib import Path

import pytest

from settings import agent_config, runtime_config, semantic_config
from settings.paths import CONFIG_DIR_ENV, DEFAULT_CONFIG_DIR, PROJECT_ROOT, config_dir, config_file
from settings.server_config import get_server_config
from tools.data import metrics
from tools.mcp import client as mcp_client


@pytest.fixture
def custom_config_dir(tmp_path, monkeypatch):
    target = tmp_path / "config"
    monkeypatch.setenv(CONFIG_DIR_ENV, str(target))
    runtime_config.reset_runtime_paths_cache()
    semantic_config.get_semantic_config.cache_clear()
    yield target
    runtime_config.reset_runtime_paths_cache()
    semantic_config.get_semantic_config.cache_clear()


def test_default_config_dir(monkeypatch):
    monkeypatch.delenv(CONFIG_DIR_ENV, raising=False)
    assert config_dir() == DEFAULT_CONFIG_DIR == Path("/tahoepilot/config")


def test_repo_config_dir_has_every_file():
    # conftest points TAHOEPILOT_CONFIG_DIR at the repo's config/.
    assert config_dir() == PROJECT_ROOT / "config"
    for name in ("tools.toml", "runtime.toml", "semantic.toml", "models.toml", "rag.toml", "server.toml", "tool_groups.toml"):
        assert config_file(name).is_file(), name
    assert config_file("agents", "base.toml").is_file()


def test_config_dir_env_relative_and_absolute(monkeypatch, tmp_path):
    monkeypatch.setenv(CONFIG_DIR_ENV, "some/rel")
    assert config_dir() == (PROJECT_ROOT / "some/rel").resolve()
    monkeypatch.setenv(CONFIG_DIR_ENV, str(tmp_path))
    assert config_dir() == tmp_path


def test_loaders_follow_config_dir(custom_config_dir):
    assert agent_config.agent_config_path("lead") == custom_config_dir / "agents" / "lead.toml"
    assert mcp_client.mcp_config_path() == custom_config_dir / "mcp.json"


def test_semantic_toml_from_config_dir(custom_config_dir):
    custom_config_dir.mkdir()
    (custom_config_dir / "semantic.toml").write_text(
        'models_dir = "/git/semantic"\nmetric_root = "/cfg/roots.csv"\n'
    )
    paths = semantic_config.get_semantic_paths()
    assert str(paths.models_dir) == "/git/semantic"
    assert str(paths.metric_root) == "/cfg/roots.csv"
    # unset keys keep their defaults
    assert paths.metric_member == PROJECT_ROOT / "config/metrics/root_member.csv"


def test_semantic_defaults():
    semantic_config.get_semantic_config.cache_clear()
    assert metrics.models_dir() == PROJECT_ROOT / "semantic_models"
    assert metrics.assign_path() == PROJECT_ROOT / "config/metrics/root_member_assign.json"
    assert metrics.roots_path().is_file()
    assert any(metrics.models_dir().glob("*/*.yml"))


def test_metric_catalog_reads_configured_files(custom_config_dir, tmp_path):
    custom_config_dir.mkdir()
    roots = tmp_path / "roots.csv"
    header = (PROJECT_ROOT / "config/metrics/final_root.csv").read_text(encoding="utf-8").splitlines()[0]
    roots.write_text(header + "\n", encoding="utf-8")  # header only -> no roots
    (custom_config_dir / "semantic.toml").write_text(f'metric_root = "{roots}"\n')
    metrics.load_roots.cache_clear()
    try:
        assert metrics.load_roots() == {}
    finally:
        metrics.load_roots.cache_clear()


def test_copied_config_dir_is_self_contained(custom_config_dir):
    """A copy of config/ alone (what a ConfigMap mount provides) loads agent configs."""
    shutil.copytree(PROJECT_ROOT / "config", custom_config_dir)
    cfg = agent_config.AgentConfig(agent_config.agent_config_path("lead"))
    assert cfg.system_prompt
    assert agent_config.tool_groups()


def test_server_settings_from_server_toml(custom_config_dir):
    custom_config_dir.mkdir()
    (custom_config_dir / "server.toml").write_text(
        '[agui]\nport = 9100\npath = "/x/"\n[frontend]\nbackend_url = "http://be:9100/x"\n'
    )
    get_server_config.cache_clear()
    try:
        cfg = get_server_config()
        assert cfg.agui.port == 9100 and cfg.agui.base_path == "/x"
        assert cfg.frontend.backend_url == "http://be:9100/x"
    finally:
        get_server_config.cache_clear()


def test_secrets_file_default_and_relative(monkeypatch, tmp_path):
    from settings.paths import DEFAULT_SECRETS_FILE, SECRETS_FILE_ENV, secrets_file

    monkeypatch.delenv(SECRETS_FILE_ENV, raising=False)
    assert secrets_file() == DEFAULT_SECRETS_FILE == Path("/tahoepilot/secrets/secrets.env")
    monkeypatch.setenv(SECRETS_FILE_ENV, "secrets.env")
    assert secrets_file() == PROJECT_ROOT / "secrets.env"


def test_secrets_file_loaded_without_overriding_env(monkeypatch, tmp_path):
    from settings.paths import SECRETS_FILE_ENV, load_env_files

    secrets = tmp_path / "s.env"
    secrets.write_text("TP_TEST_SECRET_A=from-file\nTP_TEST_SECRET_B=from-file\n")
    monkeypatch.setenv(SECRETS_FILE_ENV, str(secrets))
    monkeypatch.delenv("TP_TEST_SECRET_A", raising=False)
    monkeypatch.setenv("TP_TEST_SECRET_B", "from-env")
    load_env_files()
    import os

    assert os.environ["TP_TEST_SECRET_A"] == "from-file"
    assert os.environ["TP_TEST_SECRET_B"] == "from-env"  # real env wins
    monkeypatch.delenv("TP_TEST_SECRET_A")


def test_missing_secrets_file_is_fine(monkeypatch, tmp_path):
    from settings.paths import SECRETS_FILE_ENV, load_env_files

    monkeypatch.setenv(SECRETS_FILE_ENV, str(tmp_path / "absent.env"))
    load_env_files()  # no error

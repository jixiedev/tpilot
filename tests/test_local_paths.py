from __future__ import annotations

from config.local_config import (
    ensure_local_dirs,
    get_local_paths,
    reset_local_paths_cache,
)


def test_local_paths_defaults() -> None:
    paths = get_local_paths()
    assert paths.data_dir.name == ".local"
    assert paths.checkpoint_db == paths.data_dir / "checkpoints.sqlite"
    assert paths.profiles_dir == paths.data_dir / "profiles"
    assert paths.offload_dir == paths.data_dir / "offload_store"
    assert paths.logs_dir == paths.data_dir / "logs"
    assert paths.log_file == paths.logs_dir / "tahoepilot.log"


def test_local_paths_from_toml(tmp_path, monkeypatch) -> None:
    root = tmp_path / "project"
    root.mkdir()
    config_dir = root / "config"
    config_dir.mkdir()
    (config_dir / "local.toml").write_text(
        """
[paths]
data_dir = "runtime"
checkpoint_db = "runtime/sessions.db"
profiles_dir = "runtime/users"
offload_dir = "runtime/offload"
logs_dir = "runtime/log"
log_file = "runtime/log/app.log"
""".strip(),
        encoding="utf-8",
    )
    monkeypatch.setattr("config.local_config._CONFIG_PATH", config_dir / "local.toml")
    monkeypatch.setattr("config.local_config._PROJECT_ROOT", root)
    reset_local_paths_cache()

    paths = get_local_paths()
    assert paths.data_dir == (root / "runtime").resolve()
    assert paths.checkpoint_db == (root / "runtime/sessions.db").resolve()
    assert paths.profiles_dir == (root / "runtime/users").resolve()
    assert paths.offload_dir == (root / "runtime/offload").resolve()
    assert paths.logs_dir == (root / "runtime/log").resolve()
    assert paths.log_file == (root / "runtime/log/app.log").resolve()


def test_local_paths_env_overrides(tmp_path, monkeypatch) -> None:
    root = tmp_path / "project"
    root.mkdir()
    monkeypatch.setattr("config.local_config._CONFIG_PATH", root / "missing.toml")
    monkeypatch.setattr("config.local_config._PROJECT_ROOT", root)
    monkeypatch.setenv("TAHOEPILOT_LOCAL_DIR", str(root / "custom"))
    monkeypatch.setenv("TAHOEPILOT_CHECKPOINT_DB", str(root / "ckpt.db"))
    monkeypatch.setenv("TAHOEPILOT_PROFILE_DIR", str(root / "profiles"))
    monkeypatch.setenv("TAHOEPILOT_OFFLOAD_DIR", str(root / "offload"))
    monkeypatch.setenv("TAHOEPILOT_LOGS_DIR", str(root / "logs"))
    monkeypatch.setenv("TAHOEPILOT_LOG_FILE", str(root / "logs/run.log"))
    reset_local_paths_cache()

    paths = get_local_paths()
    assert paths.data_dir == (root / "custom").resolve()
    assert paths.checkpoint_db == (root / "ckpt.db").resolve()
    assert paths.profiles_dir == (root / "profiles").resolve()
    assert paths.offload_dir == (root / "offload").resolve()
    assert paths.logs_dir == (root / "logs").resolve()
    assert paths.log_file == (root / "logs/run.log").resolve()


def test_ensure_local_dirs_creates_subdirs(tmp_path, monkeypatch) -> None:
    root = tmp_path / "state"
    monkeypatch.setattr("config.local_config._CONFIG_PATH", root / "missing.toml")
    monkeypatch.setattr("config.local_config._PROJECT_ROOT", root)
    monkeypatch.setenv("TAHOEPILOT_LOCAL_DIR", str(root))
    reset_local_paths_cache()

    paths = ensure_local_dirs()
    assert paths.profiles_dir.is_dir()
    assert paths.offload_dir.is_dir()
    assert paths.logs_dir.is_dir()

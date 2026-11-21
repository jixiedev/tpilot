from __future__ import annotations

from tahoepilot.settings.runtime_config import (
    ensure_runtime_dirs,
    get_runtime_paths,
    reset_runtime_paths_cache,
)


def test_runtime_paths_defaults() -> None:
    paths = get_runtime_paths()
    assert paths.data_dir.name == ".local"
    assert paths.checkpoint_db == paths.data_dir / "checkpoints.sqlite"
    assert paths.profiles_dir == paths.data_dir / "profiles"
    assert paths.offload_dir == paths.data_dir / "offload_store"
    assert paths.logs_dir == paths.data_dir / "logs"
    assert paths.log_file == paths.logs_dir / "tahoepilot.log"
    assert paths.run_dir == paths.data_dir / "run"
    assert paths.langgraph_dir == paths.data_dir / "langgraph"
    assert paths.rag_jobs_dir == paths.data_dir / "rag-jobs"


def test_dev_paths_default_under_data_dir(tmp_path, monkeypatch) -> None:
    """Empty run/langgraph/rag-jobs paths fall under data_dir."""
    config_dir = tmp_path / "config"
    config_dir.mkdir()
    (config_dir / "runtime.toml").write_text('[paths]\ndata_dir = "/srv/data"\n', encoding="utf-8")
    monkeypatch.setenv("TAHOEPILOT_CONFIG_DIR", str(config_dir))
    reset_runtime_paths_cache()
    try:
        paths = get_runtime_paths()
        assert str(paths.run_dir) == "/srv/data/run"
        assert str(paths.langgraph_dir) == "/srv/data/langgraph"
        assert str(paths.rag_jobs_dir) == "/srv/data/rag-jobs"
    finally:
        monkeypatch.undo()
        reset_runtime_paths_cache()


def test_rag_bare_tasks_name_goes_to_rag_jobs_dir(tmp_path, monkeypatch) -> None:
    from tahoepilot.rag.__main__ import resolve_tasks_path

    config_dir = tmp_path / "config"
    config_dir.mkdir()
    jobs = tmp_path / "jobs"
    (config_dir / "runtime.toml").write_text(f'[paths]\nrag_jobs_dir = "{jobs}"\n', encoding="utf-8")
    monkeypatch.setenv("TAHOEPILOT_CONFIG_DIR", str(config_dir))
    reset_runtime_paths_cache()
    try:
        assert resolve_tasks_path("aug.json") == str(jobs / "aug.json")
        assert jobs.is_dir()
        assert resolve_tasks_path("./aug.json") == "./aug.json"
        assert resolve_tasks_path("/tmp/aug.json") == "/tmp/aug.json"
    finally:
        monkeypatch.undo()
        reset_runtime_paths_cache()


def test_runtime_paths_from_toml(tmp_path, monkeypatch) -> None:
    root = tmp_path / "project"
    root.mkdir()
    config_dir = root / "config"
    config_dir.mkdir()
    (config_dir / "runtime.toml").write_text(
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
    monkeypatch.setenv("TAHOEPILOT_CONFIG_DIR", str(config_dir))
    monkeypatch.setattr("tahoepilot.settings.runtime_config._PROJECT_ROOT", root)
    reset_runtime_paths_cache()

    paths = get_runtime_paths()
    assert paths.data_dir == (root / "runtime").resolve()
    assert paths.checkpoint_db == (root / "runtime/sessions.db").resolve()
    assert paths.profiles_dir == (root / "runtime/users").resolve()
    assert paths.offload_dir == (root / "runtime/offload").resolve()
    assert paths.logs_dir == (root / "runtime/log").resolve()
    assert paths.log_file == (root / "runtime/log/app.log").resolve()


def test_runtime_paths_ignore_env(tmp_path, monkeypatch) -> None:
    """runtime.toml is the only source; the old TAHOEPILOT_* path variables do nothing."""
    root = tmp_path / "project"
    root.mkdir()
    monkeypatch.setenv("TAHOEPILOT_CONFIG_DIR", str(root / "no-config"))
    monkeypatch.setattr("tahoepilot.settings.runtime_config._PROJECT_ROOT", root)
    monkeypatch.setenv("TAHOEPILOT_LOCAL_DIR", str(root / "custom"))
    monkeypatch.setenv("AGUI_CHECKPOINT_DB", str(root / "ckpt.db"))
    reset_runtime_paths_cache()

    paths = get_runtime_paths()
    assert paths.data_dir == (root / ".local").resolve()
    assert paths.checkpoint_db == paths.data_dir / "checkpoints.sqlite"


def test_ensure_runtime_dirs_creates_subdirs(tmp_path, monkeypatch) -> None:
    root = tmp_path / "state"
    monkeypatch.setenv("TAHOEPILOT_CONFIG_DIR", str(root / "no-config"))
    monkeypatch.setattr("tahoepilot.settings.runtime_config._PROJECT_ROOT", root)
    reset_runtime_paths_cache()

    paths = ensure_runtime_dirs()
    assert paths.profiles_dir.is_dir()
    assert paths.offload_dir.is_dir()
    assert paths.logs_dir.is_dir()

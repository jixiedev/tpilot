"""Prefetch and offline resolution for the two BAAI search models."""

from __future__ import annotations

from pathlib import Path

import pytest

from tahoepilot.rag.local_models import download_configured_models, model_ready, resolve_model_dir


def _write_model(path: Path, *, embedder: bool) -> None:
    path.mkdir(parents=True, exist_ok=True)
    (path / "config.json").write_text("{}", encoding="utf-8")
    (path / "model.safetensors").write_bytes(b"weights")
    (path / "tokenizer.json").write_text("{}", encoding="utf-8")
    if embedder:
        (path / "colbert_linear.pt").write_bytes(b"colbert")
        (path / "sparse_linear.pt").write_bytes(b"sparse")


def test_resolve_model_dir_requires_a_prefetch(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("tahoepilot.rag.local_models.models_root", lambda: tmp_path)
    with pytest.raises(FileNotFoundError, match="python -m tahoepilot.rag download"):
        resolve_model_dir("BAAI/bge-m3", embedder=True)


def test_resolve_model_dir_uses_prefetched_copy(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("tahoepilot.rag.local_models.models_root", lambda: tmp_path)
    dest = tmp_path / "BAAI" / "bge-m3"
    _write_model(dest, embedder=True)
    assert resolve_model_dir("BAAI/bge-m3", embedder=True) == str(dest)


def test_embedder_without_sparse_head_is_not_ready(tmp_path: Path) -> None:
    _write_model(tmp_path, embedder=False)
    assert model_ready(tmp_path, embedder=False)
    assert not model_ready(tmp_path, embedder=True)


def test_download_configured_models_skips_hub_when_cache_is_ready(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr("tahoepilot.rag.local_models.models_root", lambda: tmp_path)
    _write_model(tmp_path / "BAAI" / "bge-m3", embedder=True)
    _write_model(tmp_path / "BAAI" / "bge-reranker-v2-m3", embedder=False)

    def fail_download(repo_id: str, dest: Path) -> None:
        raise AssertionError(f"unexpected download of {repo_id} into {dest}")

    monkeypatch.setattr("tahoepilot.rag.local_models.download_repo", fail_download)
    lines = download_configured_models()
    assert any("BAAI/bge-m3" in line for line in lines)
    assert any("BAAI/bge-reranker-v2-m3" in line for line in lines)


def _config(startup: str = "download"):
    from tahoepilot.rag.config import LocalModelsConfig, RagConfig

    return RagConfig(local_models=LocalModelsConfig(startup=startup))


@pytest.fixture
def model_cache(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Path:
    monkeypatch.setattr("tahoepilot.rag.local_models.models_root", lambda: tmp_path)
    monkeypatch.setattr("tahoepilot.rag.local_models.get_rag_config", lambda: _config())
    monkeypatch.setattr("tahoepilot.rag.local_models.missing_libraries", lambda: [])
    return tmp_path


def test_startup_check_reports_missing_models(model_cache: Path) -> None:
    from tahoepilot.rag.local_models import startup_check

    _write_model(model_cache / "BAAI" / "bge-m3", embedder=True)
    state, policy, details = startup_check()
    assert (state, policy) == ("missing", "download")
    assert details == [f"rerank  BAAI/bge-reranker-v2-m3  missing at {model_cache / 'BAAI' / 'bge-reranker-v2-m3'}"]


def test_startup_check_is_ready_when_both_models_are_complete(model_cache: Path) -> None:
    from tahoepilot.rag.local_models import startup_check

    _write_model(model_cache / "BAAI" / "bge-m3", embedder=True)
    _write_model(model_cache / "BAAI" / "bge-reranker-v2-m3", embedder=False)
    assert startup_check()[:2] == ("ready", "download")


def test_startup_check_reports_missing_libraries_before_models(
    model_cache: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    from tahoepilot.rag.local_models import startup_check

    monkeypatch.setattr("tahoepilot.rag.local_models.missing_libraries", lambda: ["torch"])
    assert startup_check() == ("no-library", "download", ["not installed: torch"])


def test_startup_check_off_skips_everything(model_cache: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    from tahoepilot.rag.local_models import startup_check

    monkeypatch.setattr("tahoepilot.rag.local_models.get_rag_config", lambda: _config("off"))
    monkeypatch.setattr("tahoepilot.rag.local_models.missing_libraries", lambda: ["torch"])
    assert startup_check() == ("off", "off", [])


def test_check_cli_prints_state_and_policy(model_cache: Path, capsys: pytest.CaptureFixture[str]) -> None:
    from tahoepilot.rag.__main__ import main

    assert main(["check"]) == 0
    out, err = capsys.readouterr()
    assert out == "missing download\n"
    assert "BAAI/bge-m3  missing at" in err


def test_rag_package_imports_without_the_search_stack() -> None:
    """The entrypoint's check must run in an image built without the ``rag`` extra."""
    import subprocess
    import sys

    code = (
        "import sys\n"
        "class Block:\n"
        "    def find_spec(self, name, path=None, target=None):\n"
        "        if name.split('.')[0] in ('qdrant_client', 'FlagEmbedding', 'torch'):\n"
        "            raise ImportError(f'blocked {name}')\n"
        "sys.meta_path.insert(0, Block())\n"
        "from tahoepilot.rag.__main__ import main\n"
        "import tahoepilot.rag.local_models\n"
        "print('ok')\n"
    )
    result = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, check=False)
    assert result.stdout.strip() == "ok", result.stderr

"""Prefetch and offline resolution for the two BAAI search models."""

from __future__ import annotations

from pathlib import Path

import pytest

from rag.models import download_configured_models, model_ready, resolve_model_dir


def _write_model(path: Path, *, embedder: bool) -> None:
    path.mkdir(parents=True, exist_ok=True)
    (path / "config.json").write_text("{}", encoding="utf-8")
    (path / "model.safetensors").write_bytes(b"weights")
    (path / "tokenizer.json").write_text("{}", encoding="utf-8")
    if embedder:
        (path / "colbert_linear.pt").write_bytes(b"colbert")
        (path / "sparse_linear.pt").write_bytes(b"sparse")


def test_resolve_model_dir_requires_a_prefetch(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("TAHOEPILOT_MODELS_DIR", str(tmp_path))
    with pytest.raises(FileNotFoundError, match="python -m rag download"):
        resolve_model_dir("BAAI/bge-m3", embedder=True)


def test_resolve_model_dir_uses_prefetched_copy(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("TAHOEPILOT_MODELS_DIR", str(tmp_path))
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
    monkeypatch.setenv("TAHOEPILOT_MODELS_DIR", str(tmp_path))
    _write_model(tmp_path / "BAAI" / "bge-m3", embedder=True)
    _write_model(tmp_path / "BAAI" / "bge-reranker-v2-m3", embedder=False)

    def fail_download(repo_id: str, dest: Path) -> None:
        raise AssertionError(f"unexpected download of {repo_id} into {dest}")

    monkeypatch.setattr("rag.models.download_repo", fail_download)
    lines = download_configured_models()
    assert any("BAAI/bge-m3" in line for line in lines)
    assert any("BAAI/bge-reranker-v2-m3" in line for line in lines)

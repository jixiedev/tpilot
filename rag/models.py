"""Local copies of the BAAI models used by search.

Search loads ``BAAI/bge-m3`` (dense + sparse) and ``BAAI/bge-reranker-v2-m3``.
Download both before the first query with ``python -m rag download``. Runtime
loads those directories and does not call the Hub.
"""

from __future__ import annotations

import logging
import os
from pathlib import Path

from rag.config import get_rag_config

logger = logging.getLogger(__name__)

_HF_MIRROR = "https://hf-mirror.com"
_WEIGHT_FILES = ("model.safetensors", "pytorch_model.bin")
_TOKENIZER_FILES = ("tokenizer.json", "sentencepiece.bpe.model", "tokenizer.model")
_EMBED_FILES = ("config.json", "colbert_linear.pt", "sparse_linear.pt")
_IGNORE_PATTERNS = (
    "imgs/*",
    "**/.DS_Store",
    "*.DS_Store",
    "onnx/*",
    "*.onnx",
    "flax_model.msgpack",
    "rust_model.ot",
    "tf_model.h5",
)
_CONNECTION_ERROR_NAMES = {
    "ConnectError",
    "ConnectTimeout",
    "ConnectionError",
    "ConnectionResetError",
    "ProtocolError",
    "ReadTimeout",
    "TimeoutException",
}


def models_root() -> Path:
    """Directory that holds prefetched Hub snapshots."""
    override = os.environ.get("TAHOEPILOT_MODELS_DIR", "").strip()
    if override:
        return Path(override)
    return Path.home() / ".cache" / "tahoepilot" / "models"


def model_ready(path: Path, *, embedder: bool) -> bool:
    """True when the directory has the weights FlagEmbedding loads offline."""
    if not any((path / name).is_file() for name in _WEIGHT_FILES):
        return False
    if not any((path / name).is_file() for name in _TOKENIZER_FILES):
        return False
    if embedder and not all((path / name).is_file() for name in _EMBED_FILES):
        return False
    if not embedder and not (path / "config.json").is_file():
        return False
    return True


def resolve_model_dir(model: str, *, embedder: bool) -> str:
    """Return a local model directory. Refuse to download during a query."""
    cleaned = (model or "").strip()
    if not cleaned:
        raise FileNotFoundError("RAG model is empty. Set it in config/rag.toml.")
    path = Path(cleaned)
    if path.is_dir():
        if model_ready(path, embedder=embedder):
            return str(path)
        raise FileNotFoundError(
            f"{cleaned} is missing model files. Run `python -m rag download`."
        )
    cached = models_root() / cleaned
    if model_ready(cached, embedder=embedder):
        return str(cached)
    raise FileNotFoundError(
        f"{cleaned} is not downloaded. Run `python -m rag download` "
        f"(weights go to {cached})."
    )


def _hub_connection_failure(exc: BaseException) -> bool:
    seen: set[int] = set()
    current: BaseException | None = exc
    while current is not None and id(current) not in seen:
        seen.add(id(current))
        if isinstance(current, OSError) or type(current).__name__ in _CONNECTION_ERROR_NAMES:
            return True
        current = current.__cause__ or current.__context__
    return False


def _disable_xet_downloads() -> None:
    """Use plain HTTP. The mirror's Xet host rejects unauthenticated reconstruction."""
    os.environ["HF_HUB_DISABLE_XET"] = "1"
    import huggingface_hub.constants as hf_constants

    hf_constants.HF_HUB_DISABLE_XET = True


def _snapshot(repo_id: str, dest: Path, endpoint: str | None) -> None:
    from huggingface_hub import snapshot_download

    if endpoint and "hf-mirror.com" in endpoint:
        _disable_xet_downloads()
    kwargs: dict[str, object] = {
        "repo_id": repo_id,
        "local_dir": str(dest),
        "ignore_patterns": list(_IGNORE_PATTERNS),
    }
    if endpoint:
        kwargs["endpoint"] = endpoint
    snapshot_download(**kwargs)


def download_repo(repo_id: str, dest: Path) -> None:
    """Download one Hub repo into ``dest``, skipping junk files such as ``.DS_Store``."""
    dest.mkdir(parents=True, exist_ok=True)
    endpoint = os.environ.get("HF_ENDPOINT", "").strip()
    if endpoint:
        _snapshot(repo_id, dest, endpoint)
        return
    try:
        _snapshot(repo_id, dest, None)
    except Exception as exc:
        if not _hub_connection_failure(exc):
            raise
        logger.warning(
            "%s could not be downloaded from Hugging Face (%s); retrying via %s",
            repo_id,
            exc,
            _HF_MIRROR,
        )
        _snapshot(repo_id, dest, _HF_MIRROR)


def ensure_local_model(model: str, *, embedder: bool) -> Path:
    """Download ``model`` when it is a Hub id and the local copy is incomplete."""
    cleaned = (model or "").strip()
    if not cleaned:
        raise FileNotFoundError("RAG model is empty. Set it in config/rag.toml.")
    path = Path(cleaned)
    if path.is_dir():
        if model_ready(path, embedder=embedder):
            return path
        raise FileNotFoundError(
            f"{cleaned} is missing model files required to run offline."
        )
    dest = models_root() / cleaned
    if model_ready(dest, embedder=embedder):
        return dest
    download_repo(cleaned, dest)
    if not model_ready(dest, embedder=embedder):
        raise FileNotFoundError(
            f"Download of {cleaned} finished but {dest} is still missing weight files."
        )
    return dest


def download_configured_models() -> list[str]:
    """Download the embedding and rerank models named in ``config/rag.toml``."""
    cfg = get_rag_config()
    specs = (
        ("embedding", cfg.embedding.model, True),
        ("rerank", cfg.rerank.model, False),
    )
    lines: list[str] = []
    for role, model, embedder in specs:
        cleaned = (model or "").strip()
        if not cleaned:
            continue
        path = ensure_local_model(cleaned, embedder=embedder)
        lines.append(f"{role}  {cleaned}  ->  {path}")
    return lines

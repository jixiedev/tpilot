"""Disk overflow store for offloaded tool payloads and conversation archives."""

from __future__ import annotations

import logging
import re
import time
import uuid
from pathlib import Path

logger = logging.getLogger(__name__)

# Names produced by ``OffloadStore.write``: ``<sanitized label>_<8 hex>.txt``.
# Pruning only touches files matching this pattern, so a misconfigured
# ``offload_dir`` pointing at a shared directory never loses unrelated files.
_OFFLOAD_FILE_RE = re.compile(r"^[A-Za-z0-9_-]{0,64}_[0-9a-f]{8}\.txt$")

_SECONDS_PER_DAY = 86_400


class OffloadStore:
    """Write large content to disk and return a stable path for later retrieval."""

    def __init__(self, root: Path, *, max_age_days: float = 0) -> None:
        self.root = Path(root)
        self.root.mkdir(parents=True, exist_ok=True)
        if max_age_days and max_age_days > 0:
            self.prune(max_age_days)

    def write(self, content: str, *, label: str = "content") -> Path:
        safe_label = "".join(ch if ch.isalnum() or ch in "-_" else "_" for ch in label)[:64]
        path = self.root / f"{safe_label}_{uuid.uuid4().hex[:8]}.txt"
        path.write_text(content, encoding="utf-8")
        return path

    def contains(self, path: str | Path) -> bool:
        """True when ``path`` resolves inside this store's root."""
        return Path(path).resolve().is_relative_to(self.root.resolve())

    def read(self, path: str | Path) -> str:
        resolved = Path(path).resolve()
        root = self.root.resolve()
        if not resolved.is_relative_to(root):
            raise ValueError(f"Offload path escapes store root: {path}")
        if not resolved.is_file():
            raise FileNotFoundError(f"Offloaded file not found: {path}")
        return resolved.read_text(encoding="utf-8")

    def prune(self, max_age_days: float) -> int:
        """Delete offload files older than ``max_age_days``; return the count.

        Only regular files directly under ``root`` whose names match the
        store's own naming pattern are considered. Symlinks and
        subdirectories are never touched.
        """
        if max_age_days <= 0:
            return 0
        cutoff = time.time() - max_age_days * _SECONDS_PER_DAY
        removed = 0
        try:
            entries = list(self.root.iterdir())
        except OSError:
            logger.warning("Could not list offload store %s for pruning", self.root)
            return 0
        for entry in entries:
            if not _OFFLOAD_FILE_RE.match(entry.name):
                continue
            try:
                if entry.is_symlink() or not entry.is_file():
                    continue
                if entry.stat().st_mtime >= cutoff:
                    continue
                entry.unlink()
                removed += 1
            except OSError:
                logger.debug("Could not prune offload file %s", entry, exc_info=True)
        if removed:
            logger.info(
                "Pruned %s offload files older than %s days from %s",
                removed,
                max_age_days,
                self.root,
            )
        return removed

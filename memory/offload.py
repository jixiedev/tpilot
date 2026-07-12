"""Disk overflow store for offloaded tool payloads and conversation archives."""

from __future__ import annotations

import uuid
from pathlib import Path


class OffloadStore:
    """Write large content to disk and return a stable path for later retrieval."""

    def __init__(self, root: Path) -> None:
        self.root = Path(root)
        self.root.mkdir(parents=True, exist_ok=True)

    def write(self, content: str, *, label: str = "content") -> Path:
        safe_label = "".join(ch if ch.isalnum() or ch in "-_" else "_" for ch in label)[:64]
        path = self.root / f"{safe_label}_{uuid.uuid4().hex[:8]}.txt"
        path.write_text(content, encoding="utf-8")
        return path

    def read(self, path: str | Path) -> str:
        resolved = Path(path).resolve()
        root = self.root.resolve()
        if not resolved.is_relative_to(root):
            raise ValueError(f"Offload path escapes store root: {path}")
        if not resolved.is_file():
            raise FileNotFoundError(f"Offloaded file not found: {path}")
        return resolved.read_text(encoding="utf-8")

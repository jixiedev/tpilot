"""Stable Qdrant point ids derived from document/chunk keys."""

from __future__ import annotations

import hashlib


def stable_point_id(key: str) -> str:
    """Return a UUID-shaped SHA1 so re-ingest of the same key is idempotent."""
    digest = hashlib.sha1(key.encode("utf-8")).hexdigest()
    return (
        f"{digest[:8]}-{digest[8:12]}-{digest[12:16]}"
        f"-{digest[16:20]}-{digest[20:32]}"
    )

"""Metric catalog inputs from ``<config dir>/semantic.toml``.

Read by ``tahoepilot/tools/data/metrics.py``. Relative paths resolve against the project
root; ``~`` is expanded. The file is the only source.
"""

from __future__ import annotations

import tomllib
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel

from tahoepilot.settings.paths import config_file, resolve_project_path


class SemanticConfig(BaseModel):
    """``semantic.toml`` as written."""

    models_dir: str = "semantic_models"
    metric_root: str = "config/metrics/final_root.csv"
    metric_member: str = "config/metrics/root_member.csv"
    metric_assign: str = "config/metrics/root_member_assign.json"


@dataclass(frozen=True)
class SemanticPaths:
    """Resolved absolute paths built from :class:`SemanticConfig`."""

    models_dir: Path
    metric_root: Path
    metric_member: Path
    metric_assign: Path


@lru_cache(maxsize=1)
def get_semantic_config() -> SemanticConfig:
    path = config_file("semantic.toml")
    if not path.is_file():
        return SemanticConfig()
    with path.open("rb") as f:
        return SemanticConfig.model_validate(tomllib.load(f))


def get_semantic_paths(cfg: SemanticConfig | None = None) -> SemanticPaths:
    semantic = cfg or get_semantic_config()
    return SemanticPaths(
        models_dir=resolve_project_path(semantic.models_dir),
        metric_root=resolve_project_path(semantic.metric_root),
        metric_member=resolve_project_path(semantic.metric_member),
        metric_assign=resolve_project_path(semantic.metric_assign),
    )

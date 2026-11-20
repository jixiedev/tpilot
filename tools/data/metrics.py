"""Metric catalog: roots, members, and the dbt models that compute them.

A typical flow to find a metric for a user request:

1. Infer the most relevant ``root_id`` from the request (see :func:`list_roots`).
2. Infer the most relevant ``member_id`` under that root (see :func:`list_members`).
3. Find every dbt model assigned to ``(root_id, member_id)``, best match first
   (see :func:`find_models_metrics`).
4. Pick the model with the highest ``related_ratio``, or let the LLM choose
   using each model's description.

Locations come from ``config/semantic.toml`` (defaults shown):

- ``config/metrics/final_root.csv``           pipe-delimited metric roots
- ``config/metrics/root_member.csv``          pipe-delimited members of each root
- ``config/metrics/root_member_assign.json``  model -> metrics, tagged with root/member
- ``semantic_models/<db>/<model>.{yml,sql}``  dbt model definitions

Everything is loaded lazily on first use and cached.
"""

from __future__ import annotations

import csv
import json
import re
from collections import defaultdict
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path
from typing import Any

import yaml
from langchain_core.messages import ToolMessage
from langchain_core.tools import tool
from langgraph.prebuilt import ToolRuntime
from langgraph.types import Command

from settings.semantic_config import get_semantic_paths
from tools.registry import alternative_tool, encode_tool_summary, register_tool


def models_dir() -> Path:
    return get_semantic_paths().models_dir


def roots_path() -> Path:
    return get_semantic_paths().metric_root


def members_path() -> Path:
    return get_semantic_paths().metric_member


def assign_path() -> Path:
    return get_semantic_paths().metric_assign


def _split_list(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


@dataclass(frozen=True)
class Root:
    root_id: str
    name_zh: str
    kind: str
    definition: str
    not_a: list[str] = field(default_factory=list)
    aliases: list[str] = field(default_factory=list)


@dataclass(frozen=True)
class Member:
    root_id: str
    member_id: str
    name_zh: str
    definition: str
    is_default: bool
    scope_filter: str
    time_basis: str
    attribution: str
    aliases: list[str] = field(default_factory=list)


@dataclass(frozen=True)
class MetricAssignment:
    """One metric on a dbt model, mapped onto a (root_id, member_id)."""

    model: str
    metric: str
    root_id: str
    member_id: str
    related_ratio: float
    agg: str
    kind: str
    confidence: str
    description: str
    evidence: str


@dataclass(frozen=True)
class Model:
    name: str
    db: str
    hive_table: str | None
    description: str
    yml_path: Path
    sql_path: Path | None
    spec: dict[str, Any]  # the model entry from the dbt yml

    @property
    def sql(self) -> str | None:
        return self.sql_path.read_text(encoding="utf-8") if self.sql_path else None


# --------------------------------------------------------------------------- #
# Loaders (cached)
# --------------------------------------------------------------------------- #


def _read_pipe_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f, delimiter="|"))


@lru_cache(maxsize=1)
def load_roots() -> dict[str, Root]:
    return {
        row["root_id"]: Root(
            root_id=row["root_id"],
            name_zh=row["root_zh"],
            kind=row["kind"],
            definition=row["definition"],
            not_a=_split_list(row["not_a"]),
            aliases=_split_list(row["aliases"]),
        )
        for row in _read_pipe_csv(roots_path())
    }


@lru_cache(maxsize=1)
def load_members() -> dict[str, list[Member]]:
    members: dict[str, list[Member]] = defaultdict(list)
    for row in _read_pipe_csv(members_path()):
        members[row["root_id"]].append(
            Member(
                root_id=row["root_id"],
                member_id=row["member_id"],
                name_zh=row["member_zh"],
                definition=row["definition"],
                is_default=row["is_default"].strip().upper() == "Y",
                scope_filter=row["scope_filter"],
                time_basis=row["time_basis"],
                attribution=row["attribution"],
                aliases=_split_list(row["aliases"]),
            )
        )
    return dict(members)


@lru_cache(maxsize=1)
def load_root_member_assign() -> tuple[
    dict[str, tuple[str, list[MetricAssignment]]],
    dict[tuple[str, str], list[MetricAssignment]],
]:
    """Return ``(models, by_root_member)``.

    ``models``: model name -> (model description, its metric assignments).
    ``by_root_member``: (root_id, member_id) -> assignments, sorted by
    ``related_ratio`` descending.
    """
    with assign_path().open("r", encoding="utf-8") as f:
        data = json.load(f)

    models: dict[str, tuple[str, list[MetricAssignment]]] = {}
    by_root_member: dict[tuple[str, str], list[MetricAssignment]] = defaultdict(list)
    for entry in data["models"]:
        name = entry["model"]
        assignments = [
            MetricAssignment(
                model=name,
                metric=m["metric"],
                root_id=m["root_id"],
                member_id=m["member_id"],
                related_ratio=float(m["related_ratio"]),
                agg=m["agg"],
                kind=m["kind"],
                confidence=m["confidence"],
                description=m["metric_description"],
                evidence=m["evidence"],
            )
            for m in entry["metrics"]
        ]
        models[name] = (entry["model_description"], assignments)
        for a in assignments:
            by_root_member[(a.root_id, a.member_id)].append(a)

    for assignments in by_root_member.values():
        assignments.sort(key=lambda a: a.related_ratio, reverse=True)
    return models, dict(by_root_member)


@lru_cache(maxsize=1)
def _model_index() -> dict[str, Path]:
    """Model name -> yml path, scanning ``models/<db>/*.yml``."""
    return {p.stem: p for p in sorted(models_dir().glob("*/*.yml"))}


@lru_cache(maxsize=None)
def load_model(model_name: str) -> Model | None:
    """Load a dbt model's yml spec (and locate its sql) from the semantic models dir."""
    yml_path = _model_index().get(model_name)
    if yml_path is None:
        return None

    with yml_path.open("r", encoding="utf-8") as f:
        doc = yaml.safe_load(f) or {}
    spec = next(
        (m for m in doc.get("models", []) if m.get("name") == model_name),
        {},
    )
    meta = (spec.get("config") or {}).get("meta") or {}
    sql_path = yml_path.with_suffix(".sql")
    return Model(
        name=model_name,
        db=yml_path.parent.name,
        hive_table=meta.get("hive_table"),
        description=(spec.get("description") or "").strip(),
        yml_path=yml_path,
        sql_path=sql_path if sql_path.exists() else None,
        spec=spec,
    )


# --------------------------------------------------------------------------- #
# Lookup API
# --------------------------------------------------------------------------- #


def list_roots() -> list[Root]:
    return list(load_roots().values())


def list_members(root_id: str) -> list[Member]:
    """Members of a root, default member first."""
    members = load_members().get(root_id, [])
    return sorted(members, key=lambda m: not m.is_default)


def lookup_models_metrics(
    root_id: str,
    member_id: str,
    min_ratio: float = 0.0,
) -> list[tuple[Model | None, MetricAssignment]]:
    """Models assigned to ``(root_id, member_id)``, highest ``related_ratio`` first.

    Each item pairs the loaded dbt model (``None`` if its files are missing
    from the semantic models dir) with the metric assignment that matched.
    """
    _, by_root_member = load_root_member_assign()
    return [
        (load_model(a.model), a)
        for a in by_root_member.get((root_id, member_id), [])
        if a.related_ratio >= min_ratio
    ]


# --------------------------------------------------------------------------- #
# LLM tools
# --------------------------------------------------------------------------- #
UNASSIGNED_ROOT = "unassigned"
_SEARCH_SCOPES = ("roots", "members")
_DEFINITION_CHARS = 400


def _search_regex(pattern: str) -> re.Pattern[str]:
    try:
        return re.compile(pattern, re.IGNORECASE)
    except re.error:
        return re.compile(re.escape(pattern), re.IGNORECASE)


def _root_row(root: Root) -> dict[str, Any]:
    return {
        "root_id": root.root_id,
        "name_zh": root.name_zh,
        "kind": root.kind,
        "definition": root.definition[:_DEFINITION_CHARS],
        "not_a": root.not_a,
        "aliases": root.aliases,
    }


def _member_row(member: Member) -> dict[str, Any]:
    return {
        "root_id": member.root_id,
        "member_id": member.member_id,
        "name_zh": member.name_zh,
        "is_default": member.is_default,
        "definition": member.definition[:_DEFINITION_CHARS],
        "scope_filter": member.scope_filter,
        "time_basis": member.time_basis,
        "attribution": member.attribution,
        "aliases": member.aliases,
    }


def _root_catalog_line() -> str:
    return ", ".join(sorted(load_roots()))


def search_metric_catalog_impl(
    pattern: str,
    scope: str = "roots",
    root_id: str = "",
    limit: int = 20,
) -> dict[str, Any]:
    """Grep the metric catalog; see the ``search_metric_catalog`` tool."""
    scope = (scope or "roots").strip().lower()
    if scope not in _SEARCH_SCOPES:
        raise ValueError(f"scope must be one of {', '.join(_SEARCH_SCOPES)}; got {scope!r}")
    pattern = (pattern or "").strip()
    root_id = (root_id or "").strip()
    limit = max(1, min(int(limit), 60))
    regex = _search_regex(pattern) if pattern else None

    if scope == "roots":
        if regex is None:
            raise ValueError("pattern is required when scope='roots'")
        rows = [
            _root_row(r)
            for r in load_roots().values()
            if regex.search("|".join([r.root_id, r.name_zh, r.definition, *r.aliases]))
        ]
    else:
        if root_id:
            if root_id not in load_roots():
                raise ValueError(
                    f"unknown root_id {root_id!r}; search scope='roots' first"
                )
            candidates = list_members(root_id)
        else:
            if regex is None:
                raise ValueError("pass a pattern, a root_id, or both when scope='members'")
            candidates = [m for ms in load_members().values() for m in ms]
        rows = [
            _member_row(m)
            for m in candidates
            if regex is None
            or regex.search(
                "|".join([m.root_id, m.member_id, m.name_zh, m.definition, m.scope_filter, *m.aliases])
            )
        ]
    return {
        "scope": scope,
        "pattern": pattern,
        "root_id": root_id,
        "match_count": len(rows),
        "rows": rows[:limit],
        "truncated": len(rows) > limit,
    }


@register_tool(offload=False)
@tool(
    description=(
        "Grep the curated metric catalog to resolve a user's metric to a "
        "`root_id` and `member_id` before calling `find_models_metrics`.\n\n"
        "- `scope=\"roots\"`: search metric roots (root_id, Chinese name, "
        "definition, aliases). `not_a` lists roots that are commonly confused "
        "with this one.\n"
        "- `scope=\"members\"`: search the variants of a root (e.g. with/without "
        "LTD, distinct vs. row count, lifecycle filters). Pass `root_id` to list "
        "every member of that root; add `pattern` to narrow it.\n\n"
        "`pattern` is a case-insensitive regex (falls back to a literal match), "
        "matched against ids, Chinese names, definitions and aliases; try "
        "English and Chinese synonyms (e.g. `gmv|成交`). Members come back with "
        "the default member first.\n\n"
        "Known root_ids: " + _root_catalog_line()
    )
)
def search_metric_catalog(
    pattern: str = "",
    scope: str = "roots",
    root_id: str = "",
    limit: int = 20,
) -> str:
    """Search ``final_root.csv`` / ``root_member.csv``."""
    return encode_tool_summary(search_metric_catalog_impl(pattern, scope, root_id, limit))


def _card_for_model(model: Model, matches: list[MetricAssignment]) -> dict[str, Any] | None:
    from rag.dbt.ingest import build_model_payload
    from tools.rag.dbt_models import _hit_to_table_card_dict

    payload = build_model_payload(model=model.spec, yml_path=model.yml_path)
    if payload is None:
        return None
    best = max(a.related_ratio for a in matches)
    card = _hit_to_table_card_dict({"payload": {**payload, "chunk_type": "metric_catalog"}, "score": best})
    card["related_ratio"] = best
    card["matched_metrics"] = [
        {
            "metric": a.metric,
            "related_ratio": a.related_ratio,
            "agg": a.agg,
            "confidence": a.confidence,
            "description": a.description,
            "evidence": a.evidence,
        }
        for a in matches
    ]
    return card


def find_models_metrics_cards(
    root_id: str,
    member_id: str,
    limit: int = 8,
) -> tuple[list[dict[str, Any]], str]:
    """TableCard dicts for every model assigned to ``(root_id, member_id)``.

    Returns ``(cards, message)``; ``cards`` is empty when the pair is unknown or
    has no assigned model, and ``message`` says why and what to do next.
    """
    root_id = (root_id or "").strip()
    member_id = (member_id or "").strip()
    if not root_id or root_id == UNASSIGNED_ROOT or root_id not in load_roots():
        return [], (
            f"Unknown root_id {root_id!r}. Resolve it with search_metric_catalog "
            "(scope='roots'), or fall back to fetch_related_models."
        )
    members = {m.member_id for m in load_members().get(root_id, [])}
    if member_id not in members:
        return [], (
            f"Unknown member_id {member_id!r} for root {root_id!r}; valid: "
            f"{', '.join(sorted(members))}. Use search_metric_catalog "
            f"(scope='members', root_id={root_id!r})."
        )

    grouped: dict[str, list[MetricAssignment]] = {}
    for model, assignment in lookup_models_metrics(root_id, member_id):
        if model is not None:
            grouped.setdefault(model.name, []).append(assignment)
    cards: list[dict[str, Any]] = []
    for name, matches in grouped.items():
        card = _card_for_model(load_model(name), matches)  # type: ignore[arg-type]
        if card is not None:
            cards.append(card)
        if len(cards) >= max(1, min(int(limit), 20)):
            break
    if not cards:
        return [], (
            f"No model in the metric catalog computes {root_id}/{member_id}. "
            "Fall back to fetch_related_models with a concrete semantic query."
        )
    return cards, (
        f"Staged {len(cards)} model(s) for {root_id}/{member_id}. related_ratio is "
        "a curated preference, not the decision: compare description, grain, "
        "dimensions and matched metric definitions before commit_cards."
    )


def _staging_ref(card: dict[str, Any]) -> dict[str, Any]:
    return {
        "staging_id": card.get("staging_id", ""),
        "name": card.get("name", ""),
        "related_ratio": card.get("related_ratio"),
        "physical_tables": card.get("physical_tables", []),
        "description": (card.get("description") or "")[:400],
        "usage": (card.get("usage") or "")[:400],
        "agg_time_dimension": card.get("agg_time_dimension", ""),
        "matched_metrics": [
            {k: m[k] for k in ("metric", "related_ratio", "agg", "confidence", "description")}
            for m in card.get("matched_metrics", [])
        ],
        "dimensions": [
            c["name"] for c in card.get("columns", []) if c.get("dimension") or c.get("entity")
        ][:30],
        "metrics": [m.get("name", "") for m in card.get("metrics", [])][:30],
    }


@register_tool
@tool(
    description=(
        "Stage the dbt models that the curated metric catalog maps to a metric "
        "`root_id` + `member_id` (resolve both with `search_metric_catalog` "
        "first). Higher precision than `fetch_related_models` but covers fewer "
        "models: when the pair is unknown or nothing is staged, fall back to "
        "`fetch_related_models`.\n\n"
        "Each staged card carries `related_ratio` and the matched metric(s). "
        "`related_ratio` is only a preference: choose among all staged models "
        "by description, grain, available dimensions, time column and the "
        "matched metric definition. Commit the chosen ones with `commit_cards` "
        "using their `staging_id`."
    )
)
@alternative_tool("fetch_related_models")
def find_models_metrics(
    root_id: str,
    member_id: str,
    limit: int = 8,
    runtime: ToolRuntime = None,  # type: ignore[assignment]
) -> Command:
    """Catalog lookup that stages cards like ``fetch_related_models``."""
    from agent.specialists.databot.card_staging import merge_staging_cards, staging_entry_from_card

    cards, message = find_models_metrics_cards(root_id, member_id, limit)
    new_staging = [staging_entry_from_card(c) for c in cards]
    full_state = runtime.state if runtime is not None else {}
    existing = list(full_state.get("staging_cards") or []) if isinstance(full_state, dict) else []
    merged = merge_staging_cards(existing, new_staging)
    tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"
    return Command(
        update={
            "staging_cards": merged,
            "messages": [
                ToolMessage(
                    content=encode_tool_summary(
                        {
                            "root_id": root_id,
                            "member_id": member_id,
                            "staged": [_staging_ref(c) for c in new_staging],
                            "staging_total": len(merged),
                            "message": message,
                        }
                    ),
                    tool_call_id=tool_call_id,
                )
            ],
        }
    )


def _model_summary(card: dict[str, Any]) -> dict[str, Any]:
    """A model as a knowledge answer needs it: what it is and how it computes the metric."""
    ref = _staging_ref(card)
    ref.pop("staging_id", None)
    ref["matched_metrics"] = [
        {k: m.get(k) for k in ("metric", "related_ratio", "agg", "confidence", "description", "evidence")}
        for m in card.get("matched_metrics", [])
    ]
    return ref


@register_tool
@tool(
    description=(
        "Read-only: the dbt models that the curated metric catalog maps to a metric "
        "`root_id` + `member_id` (resolve both with `search_metric_catalog` first), "
        "and how each computes it: physical table, description, time column, "
        "dimensions and the matched metric's aggregation, description and evidence. "
        "For answering what a metric is and where it is calculated; stages nothing "
        "and runs no SQL."
    )
)
def describe_metric_models(root_id: str, member_id: str, limit: int = 8) -> str:
    """Catalog lookup for knowledge answers; unlike ``find_models_metrics`` it writes no state."""
    cards, message = find_models_metrics_cards(root_id, member_id, limit)
    # Drop the staging pipeline's fallback hints (fetch_related_models).
    message = re.split(r",? or fall back| Fall back", message)[0].rstrip(".") + "."
    if cards:
        message = (
            f"{len(cards)} model(s) compute {root_id}/{member_id}. related_ratio is the "
            "catalog's curated preference among them."
        )
    return encode_tool_summary(
        {
            "root_id": root_id,
            "member_id": member_id,
            "models": [_model_summary(c) for c in cards],
            "message": message,
        }
    )


TOOLS = [search_metric_catalog, find_models_metrics, describe_metric_models]

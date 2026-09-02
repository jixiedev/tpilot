"""dbt semantic model retrieval via Qdrant.

This module exposes the ``fetch_related_models`` tool Databot and Knowledge
agents use to find candidate dbt models for a user query. Each retrieved
model is returned as a ``TableCard``-shaped dict (the LLM-friendly
projection of ``TableCard``); downstream code can hydrate it into a full
``TableCard`` instance via ``dict_to_table_card`` and feed it to
``commit_cards``.

Databot's canonical flow: fetch TableCard → human approve → state →
SQL. Knowledge uses it to explain "which dbt model holds X".
"""

from __future__ import annotations

from typing import Any, Literal, TypedDict

from langchain_core.messages import ToolMessage
from langchain_core.tools import tool
from langgraph.prebuilt import ToolRuntime
from langgraph.types import Command
from pydantic import BaseModel
from qdrant_client.http import models as qmodels

from agent.react.databot.card_staging import (
    apply_add_card_selections,
    compact_staging_refs,
    merge_staging_cards,
    staging_entry_from_card,
)
from rag.store import search as qdrant_search
from tools.common import bind_tool_to_agent, encode_tool_summary

"""
thought 1:
(card is saved in state)
- fetch card using rag and mcp in parallel. each raw card has a data quality as confidence(such as lateness of partition tables)
- llm will choose the most related and proper cards and discard others(so this tool should be able to change agent state). if the metrics of a hive model contracts with datahub glossary, fix the metrics in hive models
- after choosing cards, ask a human to acknowledge("approve","deny-with-comments","deny-and-halt", "dryrun"). default is dryrun. In this step, llm must give reasons of each option
- if approve, add to user profile(a knowledge field), then generate a sql and ask human to acknowledge("approve","deny-with-comments","deny-and-halt", "dryrun")
- if approve, add to user profile(a sql field), then execute and get results
- (option) ask user whether to generate a graph and emit to superset
"""

"""
thought 2
can we use rag to get model name, then call metricflow directly to generate sql. the params of metricflow
is provided by llm. Not sure llm can use metricflow properly, maybe we need to provide usage instructions for it.
"""


class Dimension(BaseModel):
    type: Literal["categorical", "time"] | str = "categorical"
    label: str | None = None


class Entity(BaseModel):
    type: Literal["primary", "foreign"] | None = "foreign"
    name: str
    description: str | None = ""


class Column(BaseModel):
    name: str
    description: str | None = ""
    data_tests: str | None = ""
    entity: Entity | None = None
    dimension: Dimension | None = None


class Metric(BaseModel):
    name: str
    type: Literal["simple", "ratio", "derived", "cumulative", "conversion"] | None = "simple"
    label: str
    description: str
    agg: str | None = None
    expr: str | None = None
    numerator: str
    denominator: str


class Card:
    def __init__(self, name: str):
        self.name = name
        self.inlet: list[Card] = list()
        self.outlet: list[Card] = list()

    def add_in(self, card: Card):
        self.inlet.append(card)

    def add_out(self, card: Card):
        self.outlet.append(card)


# todo use pydantic
class TableCard(Card):
    def __init__(self, name: str, model_type: Literal["native", "derived"], physical_tables: list[str], cte: str, agg_time_dimension: str, columns: list[Column], metrics: list[Metric], owner: str, usage: str, doclink: str, confidence: str, llm_thoughts: str):
        """
            name: dbt model name
            model_type: indicates if it is a native level card or a derived card(tableau datasource)
            physical_table: for a hive model, physical table is itself, otherwise, they are related hive tables
            cte: dbt model definition sql
            agg_time_dimension: dbt semantic layer requirement
            columns: columns in this model
            metrics: metrics in this model
            owner: metadata
            usage: metadata
            doclink: documentation in datahub
            confidence: for a partitioned hive model, get its latest partitions and check it data quality. This field is setting by a step-llm node with proper prompts.
            llm_thoughts: llm concern or favor about using this model
        """
        super().__init__(name)
        self.cte = cte
        self.model_type = model_type
        self.physical_tables = physical_tables
        self.agg_time_dimension = agg_time_dimension
        self.columns = columns
        self.metrics = metrics
        self.usage = usage
        self.owner = owner
        self.doclink = doclink
        self.confidence = confidence

    def set_latest_partitions(self):
        """
        set latest partitions for each partitioned physical tables, if there is dt, hr or other columns
        """
        pass


class TableauDataSourceCard(TableCard):
    def __init__(self, name: str, physical_tables: list[str], cte: str, agg_time_dimension: str, columns: list[Column], metrics: list[Metric], owner: str, usage: str, doclink: str, project: str, workbook: str, view: str, confidence: str, llm_thoughts: str):
        """
        doclink: tableau link is available
        project: tableau project
        workbook: tableau
        """
        super().__init__(name, "derived", physical_tables, cte, agg_time_dimension, columns, metrics, owner, usage, doclink, confidence, llm_thoughts)
        self.project = project
        self.workbook = workbook
        self.view = view


# ---------------------------------------------------------------------------
# RAG retrieval: profiles, tool, hit -> TableCard dict mapping
# ---------------------------------------------------------------------------

SemanticLayer = Literal["hive_analytics"]
ChunkTypeFilter = Literal["any", "model+columns", "model+metrics"]

_VALID_CHUNK_TYPES: frozenset[str] = frozenset({"any", "model+columns", "model+metrics"})


class SemanticProfile(TypedDict):
    layer: SemanticLayer
    collection: str
    description: str


SEMANTIC_PROFILES: list[SemanticProfile] = [
    {
        "layer": "hive_analytics",
        "collection": "dbt_models",
        "description": (
            "Analytics-layer dbt semantic models in the Hive warehouse. "
            "Use for merchant, transaction, and product analytics tables; "
            "primary source for BI / Tableau / report work."
        ),
    },
]

_LAYER_BY_NAME: dict[str, SemanticProfile] = {p["layer"]: p for p in SEMANTIC_PROFILES}


def _layer_catalog_for_tool() -> str:
    """Human-readable layer catalog embedded in the tool description for the LLM."""
    lines: list[str] = []
    for profile in SEMANTIC_PROFILES:
        lines.append(
            f"- `{profile['layer']}` → collection `{profile['collection']}`: "
            f"{profile['description']}"
        )
    return "\n".join(lines)


def _tool_description() -> str:
    return (
        "Search indexed dbt semantic models and return candidate `TableCard`s.\n\n"
        "Use when the user asks which dbt model holds a column / dimension / metric, "
        "or how a metric is computed. Each model is indexed as two Qdrant points "
        "(`model+columns` and `model+metrics`); the `chunk_type` filter lets you "
        "narrow the search to one side.\n\n"
        "Pick `layer` from the catalog below. Default `chunk_type=\"any\"` searches "
        "both; use `\"model+columns\"` for column / entity / dimension matches, "
        "`\"model+metrics\"` for metric / aggregation matches.\n\n"
        "Write a concrete semantic query (e.g. 'distinct CedCommerce merchant count', "
        "'which model tracks merchant PII'). Do not use wildcards or empty strings — "
        "this is vector search, not JQL.\n\n"
        "Each returned dict mirrors the `TableCard` shape (name, model_type, "
        "physical_tables, cte, agg_time_dimension, columns, metrics, owner, usage) "
        "plus the Qdrant score and the matched chunk type. Each hit is saved to "
        "``state.staging_cards`` with a ``staging_id``. To commit a card for the "
        "human gate, call ``commit_cards`` with that ``staging_id`` and the "
        "dimensions/metrics you intend to use.\n\n"
        f"Layer catalog:\n{_layer_catalog_for_tool()}"
    )


def _normalize_chunk_type(chunk_type: str) -> ChunkTypeFilter:
    cleaned = (chunk_type or "any").strip()
    if cleaned not in _VALID_CHUNK_TYPES:
        known = ", ".join(sorted(_VALID_CHUNK_TYPES))
        raise ValueError(f"Unknown chunk_type {chunk_type!r}; choose one of: {known}")
    return cleaned  # type: ignore[return-value]


def _payload_filter(chunk_type: ChunkTypeFilter) -> qmodels.Filter | None:
    if chunk_type == "any":
        return None
    return qmodels.Filter(
        must=[
            qmodels.FieldCondition(
                key="chunk_type",
                match=qmodels.MatchValue(value=chunk_type),
            ),
        ],
    )


def _hit_to_table_card_dict(hit: dict[str, Any]) -> dict[str, Any]:
    """Project a Qdrant hit onto the LLM-friendly ``TableCard`` shape."""
    payload = hit.get("payload") or {}
    columns: list[dict[str, Any]] = []
    for c in payload.get("columns", []) or []:
        columns.append(
            {
                "name": c.get("name", ""),
                "description": c.get("description", "") or "",
                "data_tests": c.get("data_tests", "") or "",
                "entity": c.get("entity"),
                "dimension": c.get("dimension"),
            }
        )
    metrics: list[dict[str, Any]] = []
    for m in payload.get("metrics", []) or []:
        metrics.append(
            {
                "name": m.get("name", ""),
                "type": m.get("type", "simple"),
                "label": m.get("label", "") or "",
                "description": m.get("description", "") or "",
                "agg": m.get("agg"),
                "expr": m.get("expr"),
            }
        )
    return {
        "score": hit.get("score"),
        "name": payload.get("model_name", ""),
        "model_type": "native",
        "physical_tables": [payload["hive_table"]]
        if payload.get("hive_table")
        else [],
        "cte": payload.get("sql", "") or "",
        "agg_time_dimension": payload.get("agg_time_dimension", "") or "",
        "columns": columns,
        "metrics": metrics,
        "owner": payload.get("owner", "") or "",
        "usage": payload.get("usage", "") or "",
        "description": payload.get("description", "") or "",
        "doclink": "",
        # `confidence` is filled by a follow-up step-llm with partition freshness etc.
        "confidence": "unknown",
        "llm_thoughts": "",
        "matched_chunk_type": payload.get("chunk_type", ""),
        "yml_path": payload.get("yml_path", ""),
        "sql_path": payload.get("sql_path", ""),
    }


def dict_to_table_card(card: dict[str, Any]) -> TableCard:
    """Hydrate a ``TableCard``-shaped dict (from ``fetch_related_models``) into a real
    ``TableCard`` instance, ready to feed to ``commit_cards``.
    """
    columns: list[Column] = []
    for c in card.get("columns", []) or []:
        entity_dict = c.get("entity")
        entity_obj: Entity | None = None
        if entity_dict:
            entity_obj = Entity(
                type=entity_dict.get("type"),
                name=entity_dict.get("name", ""),
                description=entity_dict.get("description", "") or "",
            )
        dim_dict = c.get("dimension")
        dim_obj: Dimension | None = None
        if dim_dict:
            dim_obj = Dimension(
                type=dim_dict.get("type", "categorical"),
                label=dim_dict.get("label"),
            )
        columns.append(
            Column(
                name=c.get("name", ""),
                description=c.get("description", "") or "",
                data_tests=c.get("data_tests", "") or "",
                entity=entity_obj,
                dimension=dim_obj,
            )
        )
    metrics: list[Metric] = []
    for m in card.get("metrics", []) or []:
        metrics.append(
            Metric(
                name=m.get("name", ""),
                type=m.get("type", "simple"),
                label=m.get("label", "") or m.get("name", ""),
                description=m.get("description", "") or "",
                agg=m.get("agg"),
                expr=m.get("expr"),
                numerator="",
                denominator="",
            )
        )
    return TableCard(
        name=card.get("name", ""),
        model_type=card.get("model_type", "native"),
        physical_tables=list(card.get("physical_tables", []) or []),
        cte=card.get("cte", "") or "",
        agg_time_dimension=card.get("agg_time_dimension", "") or "",
        columns=columns,
        metrics=metrics,
        owner=card.get("owner", "") or "",
        usage=card.get("usage", "") or "",
        doclink=card.get("doclink", "") or "",
        confidence=card.get("confidence", "unknown"),
        llm_thoughts=card.get("llm_thoughts", "") or "",
    )


@bind_tool_to_agent("databot,default")
@bind_tool_to_agent("databot,rag")
@bind_tool_to_agent("databot,fetch")
@tool(description=_tool_description())
def fetch_related_models(
    query: str,
    layer: str = "hive_analytics",
    limit: int = 5,
    chunk_type: str = "any",
    runtime: ToolRuntime = None,  # type: ignore[assignment]
) -> Command:
    """Search indexed dbt semantic models; stages hits under ``staging_cards``.

    ``layer`` and ``chunk_type`` are plain strings (validated in-body) so
    strict OpenAI-compatible providers (GLM, MiniMax) do not reject
    ``Literal`` / ``Union`` tool schemas.
    """
    cleaned = (query or "").strip()
    if not cleaned or cleaned in {"*", "**", "?", ".*"}:
        raise ValueError(
            "query must be a natural-language phrase (e.g. 'distinct merchant count'); "
            "wildcards like '*' are not supported"
        )
    layer_name = (layer or "hive_analytics").strip()
    profile = _LAYER_BY_NAME.get(layer_name)  # type: ignore[arg-type]
    if profile is None:
        known = ", ".join(sorted(_LAYER_BY_NAME))
        raise ValueError(f"Unknown semantic layer {layer!r}; choose one of: {known}")
    chunk_filter = _normalize_chunk_type(chunk_type)
    limit = max(1, min(int(limit), 20))

    # Each model has 2 points (columns + metrics), so we over-fetch and
    # deduplicate by model_name to honor the requested `limit` of unique models.
    fetch_limit = max(limit * 2, 10)
    query_filter = _payload_filter(chunk_filter)
    hits = qdrant_search(
        profile["collection"],
        cleaned,
        limit=fetch_limit,
        query_filter=query_filter,
    )

    seen: set[str] = set()
    cards: list[dict[str, Any]] = []
    for hit in hits:
        payload = hit.get("payload") or {}
        model_name = payload.get("model_name", "")
        if not model_name or model_name in seen:
            continue
        seen.add(model_name)
        cards.append(_hit_to_table_card_dict(hit))
        if len(cards) >= limit:
            break

    new_staging = [staging_entry_from_card(c) for c in cards]
    full_state = runtime.state if runtime is not None else {}
    existing = (
        list(full_state.get("staging_cards") or [])
        if isinstance(full_state, dict)
        else []
    )
    merged_staging = merge_staging_cards(existing, new_staging)
    refs = compact_staging_refs(new_staging)

    tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"
    return Command(
        update={
            "staging_cards": merged_staging,
            "messages": [
                ToolMessage(
                    content=encode_tool_summary(
                        {
                            "staged": refs,
                            "staging_total": len(merged_staging),
                            "message": (
                                f"Staged {len(new_staging)} model(s). "
                                "Use staging_id in commit_cards."
                            ),
                        }
                    ),
                    tool_call_id=tool_call_id,
                )
            ],
        }
    )


@bind_tool_to_agent("databot,default")
@bind_tool_to_agent("databot,rag")
@bind_tool_to_agent("databot,fetch")
@tool
def commit_cards(
    selections: list[Any],
    runtime: ToolRuntime = None,  # type: ignore[assignment]
) -> Command:
    """Commit staged cards into ``committed_cards`` by ``staging_id``.

    Pass one object per card you want the human to review::

        {
          "staging_id": "<from fetch_related_models>",
          "selected_dimensions": ["order_date", "merchant_id"],
          "selected_metrics": ["commission_revenue"],
          "selection_notes": "optional one-line why"
        }

    Only cards passed here are added to ``committed_cards``. Full card
    bodies are resolved from ``state.staging_cards`` — do not echo the
    entire TableCard dict.

    Why ``list[Any]``: keeps the tool JSON schema provider-friendly.
    """
    full_state = runtime.state if runtime is not None else {}
    staging_cards = (
        list(full_state.get("staging_cards") or [])
        if isinstance(full_state, dict)
        else []
    )
    committed_cards = (
        list(full_state.get("committed_cards") or [])
        if isinstance(full_state, dict)
        else []
    )
    updated, note = apply_add_card_selections(
        staging_cards=staging_cards,
        committed_cards=committed_cards,
        selections=selections,
    )
    tool_call_id = (runtime.tool_call_id if runtime else None) or "missing"
    return Command(
        update={
            "committed_cards": updated,
            "messages": [
                ToolMessage(
                    content=note,
                    tool_call_id=tool_call_id,
                )
            ],
        }
    )


TOOLS = [fetch_related_models, commit_cards]

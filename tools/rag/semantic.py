"""dbt semantic model retrieval via Qdrant.

This module exposes the ``fetch_related_models`` tool Databot and Knowledge
agents use to find candidate dbt models for a user query. Each retrieved
model is returned as a ``TableCard``-shaped dict (the LLM-friendly
projection of ``TableCard``); downstream code can hydrate it into a full
``TableCard`` instance via ``dict_to_table_card`` and feed it to
``add_card_to_state``.

Databot's canonical flow: fetch TableCard → human approve → state →
SQL. Knowledge uses it to explain "which dbt model holds X".
"""

from __future__ import annotations

from typing import Any, Literal, TypedDict

from langchain_core.tools import tool
from langchain_protocol import Command
from pydantic import BaseModel
from qdrant_client.http import models as qmodels

from rag.store import search as qdrant_search

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
        "plus the Qdrant score and the matched chunk type. After the user picks "
        "cards, call `add_card_to_state` to commit them.\n\n"
        f"Layer catalog:\n{_layer_catalog_for_tool()}"
    )


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
    ``TableCard`` instance, ready to feed to ``add_card_to_state``.
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


@tool(description=_tool_description())
def fetch_related_models(
    query: str,
    layer: SemanticLayer = "hive_analytics",
    limit: int = 5,
    chunk_type: ChunkTypeFilter = "any",
) -> list[dict[str, Any]]:
    """Search indexed dbt semantic models; returns candidate ``TableCard`` dicts."""
    cleaned = (query or "").strip()
    if not cleaned or cleaned in {"*", "**", "?", ".*"}:
        raise ValueError(
            "query must be a natural-language phrase (e.g. 'distinct merchant count'); "
            "wildcards like '*' are not supported"
        )
    profile = _LAYER_BY_NAME.get(layer)
    if profile is None:
        known = ", ".join(sorted(_LAYER_BY_NAME))
        raise ValueError(f"Unknown semantic layer {layer!r}; choose one of: {known}")
    limit = max(1, min(int(limit), 20))

    # Each model has 2 points (columns + metrics), so we over-fetch and
    # deduplicate by model_name to honor the requested `limit` of unique models.
    fetch_limit = max(limit * 2, 10)
    query_filter = _payload_filter(chunk_type)
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
    return cards


@tool
def add_card_to_state(cards: list[Any]):
    """Commit picked ``TableCard``s into agent state under ``candidate_cards``.

    Accepts the dict shape returned by ``fetch_related_models``; hydrates
    each entry back to a real ``TableCard`` via ``dict_to_table_card``
    before storing. Call after the user has approved a subset of cards
    from a prior ``fetch_related_models`` result. The hydrated cards
    become the working set for downstream SQL generation / MetricFlow.

    Why ``list[Any]`` on the wire: ``list[dict]`` makes LangChain emit
    ``{"type": "array", "items": {"additionalProperties": true, "type":
    "object"}}`` which some OpenAI-compatible providers (GLM, MiniMax
    in their stricter 2025 builds) reject with a confusing
    ``typing.Union`` schema error. ``list[Any]`` collapses to
    ``{"type": "array"}`` and round-trips fine across providers.

    Why dicts on the wire: ``TableCard`` is a plain Python class (not
    Pydantic) and LangChain's tool binding cannot generate a JSON schema
    for ``list[TableCard]``. The LLM only ever has the dict projection
    anyway, so the hydration happens server-side here.
    """
    hydrated = [dict_to_table_card(c) for c in cards]
    import os, sys
    print(f"[DEBUG add_card_to_state] tool_call_id={(runtime.tool_call_id if runtime else None)!r} got {len(cards)} cards from LLM, hydrating to {len(hydrated)} TableCard", file=sys.stderr, flush=True)
    return Command(
        update={
            # ``state.candidate_cards`` is the canonical field for raw
            # RAG hits that the LLM can later subset into
            # ``selected_cards`` (via ``mark_cards_selected``) and the
            # human then approves. The old key ``"cards"`` was a typo
            # that never landed in ``DatabotState`` — calling this
            # tool previously dropped the data on the floor and left
            # the gate UI showing "0 candidate dbt model(s)" no matter
            # what the LLM said in its reasoning.
            "candidate_cards": hydrated,
        }
    )


TOOLS = [fetch_related_models, add_card_to_state]

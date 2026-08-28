from __future__ import annotations

from typing import Literal, Any

from langchain_core.tools import tool
from langchain_protocol import Command
from pydantic import BaseModel

"""
thoughts:
(card is saved in state)
- fetch card using rag and mcp in parallel. each raw card has a data quality as confidence(such as lateness of partition tables)
- llm will choose the most related and proper cards and discard others(so this tool should be able to change agent state). if the metrics of a hive model contracts with datahub glossary, fix the metrics in hive models
- after choosing cards, ask a human to acknowledge("approve","deny-with-comments","deny-and-halt", "dryrun"). default is dryrun. In this step, llm must give reasons of each option
- if approve, add to user profile(a knowledge field), then generate a sql and ask human to acknowledge("approve","deny-with-comments","deny-and-halt", "dryrun")
- if approve, add to user profile(a sql field), then execute and get results
- (option) ask user whether to generate a graph and emit to superset
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
        project: tableau project name
        workbook: tableau
        """
        super().__init__(name, "derived", physical_tables, cte, agg_time_dimension, columns, metrics, owner, usage, doclink, confidence, llm_thoughts)
        self.project = project
        self.workbook = workbook
        self.view = view


def _format_hit(card: Card) -> dict[str, Any]:
    pass


@tool
def fetch_related_models(
        query: str,
        limit: int = 10
) -> list[Card]:
    """
    remember to call set_latest_partitions for each partitioned hive tables
    """
    pass


@tool
def add_card_to_state(cards: list[TableCard]):
    return Command(
        update={
            "cards": cards
        }
    )

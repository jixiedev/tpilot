"""Jira ticket retrieval via Qdrant semantic search."""

from __future__ import annotations

from typing import Any, Literal, TypedDict

from langchain_core.tools import tool

from rag.store import search as qdrant_search

JiraProject = Literal["tahoe", "core", "de", "ds", "sqd"]


class JiraProfile(TypedDict):
    project: JiraProject
    jira_key: str
    jira_name: str
    collection: str
    description: str


JIRA_PROFILES: list[JiraProfile] = [
    {
        "project": "tahoe",
        "jira_key": "TAHOE",
        "jira_name": "Tahoe",
        "collection": "jira_tahoe",
        "description": (
            "Wish offline data platform / lakehouse operations (issue keys TAHOE-*). "
            "Use for Airflow DAGs & images, Hive/Presto/Trino queries & resource groups, "
            "Spark/EMR jobs, Flink & Kafka / MSK, Superset & Tableau, DataHub, "
            "Hudi incremental processing, logging (td-agent / td-aggregator), "
            "JupyterHub, Tahoe API/UX, infra & security reviews, onboarding, and "
            "pipeline migrations or cost work owned by the Tahoe team. "
            "Not for generic k8s/Mongo/Vitess platform tickets (prefer core) or "
            "product experiment / MRF / CX analytics tickets (prefer de or ds)."
        ),
    },
    {
        "project": "core",
        "jira_key": "CORE",
        "jira_name": "Infrastructure Core",
        "collection": "jira_core",
        "description": (
            "Company-wide infrastructure core (issue keys CORE-*). "
            "Use for Storage & Compute capacity, Kubernetes/k8s clusters & nodes, "
            "MongoDB / Vitess / RDS database operations, AWS cost & rightsizing, "
            "Prometheus/PagerDuty observability, platform services, tech-debt, "
            "SRE/CICD, and shared infra libraries. "
            "Choose this when the ticket is about platform runtime rather than "
            "Tahoe-specific lakehouse components (Airflow/Hive/Presto/Flink owned by tahoe)."
        ),
    },
    {
        "project": "de",
        "jira_key": "DSE",
        "jira_name": "Data Science and Engineering",
        "collection": "jira_data_engineer",
        "description": (
            "Data Science & Engineering delivery board (issue keys DSE-*; often labeled mde). "
            "Use for EXP / experimentation framework (assignment, metrics, stats, DQ), "
            "MRF and core data pipelines, Airflow pipeline work for product/DE teams, "
            "LakeView, merchant risk / payments / ads / attribution / pricing data, "
            "metric onboarding, backfills, and BI-DS style pipeline requests. "
            "Prefer tahoe for platform/cluster/Hive-Presto infra itself; prefer ds "
            "(CXDS) for consumer-experience analytics (video, checkout, post-purchase)."
        ),
    },
    {
        "project": "ds",
        "jira_key": "CXDS",
        "jira_name": "Consumer Data Science",
        "collection": "jira_data_science",
        "description": (
            "Consumer Data Science (issue keys CXDS-*). "
            "Use for CX product analytics and experiment analysis around Video / Wish Clips, "
            "Post-Purchase & returns/refunds, Checkout Experience, Homepage & Navigation, "
            "CS Operations, flat-rate shipping, NPS/WBR reporting, funnel metrics, "
            "merchandising data pulls, and dashboards supporting consumer product decisions. "
            "Smaller corpus than DSE; not the place for Tahoe platform ops or CORE infra."
        ),
    },
    {
        "project": "sqd",
        "jira_key": "SQD",
        "jira_name": "SQD",
        "collection": "jira_sqd",
        "description": (
            "SQD support / queue tickets (issue keys SQD-*) when indexed. "
            "Use for cross-team support requests and escalations filed in SQD rather than "
            "long-running Tahoe/CORE platform epics or DSE/CXDS product-data delivery work."
        ),
    },
]

_PROJECT_BY_NAME: dict[str, JiraProfile] = {p["project"]: p for p in JIRA_PROFILES}


def _project_catalog_for_tool() -> str:
    """Human-readable project catalog embedded in the tool description for the LLM."""
    lines: list[str] = []
    for profile in JIRA_PROFILES:
        lines.append(
            f"- `{profile['project']}` → Jira project {profile['jira_key']} "
            f"({profile['jira_name']}): {profile['description']}"
        )
    return "\n".join(lines)


def _tool_description() -> str:
    return (
        "Search indexed Jira tickets related to a natural-language query.\n\n"
        "Use for past incidents, ownership, migrations, on-call history, or how a change "
        "was tracked in Jira. Pick `project` from the catalog below (do not invent keys).\n\n"
        "Write a concrete semantic query (e.g. 'Hudi JupyterHub notebook', 'Airflow DAG OOM'). "
        "Do not use wildcards like `*` or empty queries — this is vector search, not JQL.\n"
        "Keep `limit` small (default 5, max 20). Results include truncated description only; "
        "do not repeatedly call `read_offloaded_file` to re-count the same preview.\n\n"
        f"Project catalog:\n{_project_catalog_for_tool()}"
    )


_DESC_PREVIEW_CHARS = 400


def _format_hit(hit: dict[str, Any]) -> dict[str, Any]:
    payload = hit.get("payload") or {}
    description = str(payload.get("description") or "")
    if len(description) > _DESC_PREVIEW_CHARS:
        description = description[:_DESC_PREVIEW_CHARS] + "…"
    return {
        "score": hit.get("score"),
        "issue_key": payload.get("issue_key") or "",
        "summary": payload.get("summary") or "",
        "status": payload.get("status") or "",
        "priority": payload.get("priority") or "",
        "assignee": payload.get("assignee") or "",
        "reporter": payload.get("reporter") or "",
        "issue_type": payload.get("issue_type") or "",
        "created": payload.get("created") or "",
        "updated": payload.get("updated") or "",
        "description": description,
    }


@tool(description=_tool_description())
def fetch_related_jira_tickets(
    query: str,
    project: JiraProject = "tahoe",
    limit: int = 5,
) -> list[dict[str, Any]]:
    """Search indexed Jira tickets; see tool description for the project catalog."""
    cleaned = (query or "").strip()
    if not cleaned or cleaned in {"*", "**", "?", ".*"}:
        raise ValueError(
            "query must be a natural-language search phrase "
            "(e.g. 'Hudi JupyterHub'); wildcards like '*' are not supported"
        )
    profile = _PROJECT_BY_NAME.get(project)
    if profile is None:
        known = ", ".join(sorted(_PROJECT_BY_NAME))
        raise ValueError(f"Unknown Jira project {project!r}; choose one of: {known}")
    limit = max(1, min(int(limit), 20))
    hits = qdrant_search(profile["collection"], cleaned, limit=limit)
    return [_format_hit(hit) for hit in hits]


TOOLS = [fetch_related_jira_tickets]

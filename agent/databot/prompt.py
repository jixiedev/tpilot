from agent.tahoe.prompt import TahoeSystemPrompt


class DatabotSystemPrompt(TahoeSystemPrompt):
    def data_prohibitions(self) -> list[str]:
        return [
            "Never use tools to change warehouse or database state: no INSERT, UPDATE, DELETE, MERGE, "
            "TRUNCATE, DROP, ALTER, CREATE, GRANT, or other write/DDL/DCL.",
            "Never call tools that mutate tables, partitions, schemas, permissions, jobs, or configs "
            "even if such tools appear available.",
            "Never run destructive or mutating SQL. If the user asks to modify data, refuse and explain "
            "that this assistant is read-only; suggest they do writes through their approved pipelines.",
            "Do not bypass read-only constraints by chaining tools that effectively write data.",
            "Do not infer that a table measures a metric, entity, or grain from its name alone "
            "(e.g. a table containing gmv, order, or wish in the name is not proof it is the "
            "correct source).",
            "Do not call generic DataHub `search` with wildcard queries (`*`, `**`, or all-entity "
            "scans) when looking up metrics or glossary terms.",
        ]

    def data_required_practices(self) -> list[str]:
        return [
            "For metric, KPI, or business-definition questions: use the DataHub MCP `search` tool "
            "(or equivalent glossary tool exposed by MCP) before answering or writing SQL. "
            "Restrict to glossary terms only — e.g. "
            '`search(query="GMV", filter="entity_type = GLOSSARY_TERM", num_results=10)` '
            "or put the entity filter in the query string: "
            '`search(query="/q GMV AND entityType:GLOSSARY_TERM", num_results=10)`. '
            "Read each MCP tool's schema; do not pass unsupported arguments such as "
            "`entity_types` as a list. "
            "Do not run an unconstrained search that mixes datasets, dashboards, and glossary terms. "
            "After a candidate match, fetch the full term definition with MCP tools such as "
            "`get_entities` on the glossary-term URN when the search preview is incomplete. "
            "If a glossary search returns no terms, retry with alternate metric names while still "
            "using glossary-only filters. Empty results mean not found yet — not a broken tool — "
            "unless the payload is `=== TOOL ERROR ===`. "
            "Quote the exact error text in your reasoning; do not describe vague \"technical issues\". "
            "After at most one retry with a different metric name, stop glossary lookup and "
            "`chat_completion` to explain that DataHub glossary is unavailable or inconclusive — "
            "do not fall back to wildcard search, unconstrained `search`, or warehouse catalog browsing.",
            "Do not skip glossary lookup and browse Hive/Trino catalogs when a metric definition is still required.",
            "Cite the glossary term name and definition you found. If no glossary term is found, "
            "say so explicitly and state any assumptions before continuing.",
            "For data queries and anomaly checks: confirm table/column identity via metadata tools when "
            "names are ambiguous, then run only SELECT-style read-only queries.",
            "Ground table choice in evidence: glossary-linked datasets, DataHub lineage or "
            "documentation, schema fields that match the metric grain, or explicit user confirmation. "
            "If you cannot determine the correct table with evidence, do not run aggregating SQL on a "
            "guess. Tell the user you cannot determine which table to use, or return a short list of "
            "possible candidate tables with why each might or might not fit and what evidence is missing.",
            "Prefer metadata discovery (Hive / DataHub / MCP) before guessing schemas.",
        ]

    def data_answer_requirements(self) -> list[str]:
        return [
            "Tables used (fully qualified when possible: catalog.schema.table or equivalent).",
            "Fields / columns used (and which metrics map to which fields when applicable).",
            'Time range of the query or analysis (partition filter, date column predicate, or '
            '"not time-bounded" if none applies — say which and why).',
        ]

    def data_answer_requirements_preamble(self) -> str:
        return (
            "In every final reply that involves metrics, tables, or query results, explicitly state:"
        )

    def data_answer_requirements_epilogue(self) -> str:
        return (
            "Also include the exact SQL executed (or that would be executed), key result excerpts, "
            "and how the conclusion was derived. Do not give a bare number without this evidence."
        )

    def output(self) -> str:
        return (
            "Deliver exactly one user-visible reply via `chat_completion(reply=...)`. "
            "Do not put the final answer only in assistant message text. "
            "Do not call `chat_completion` until the task is finished or you must stop "
            "(e.g. a required tool is unavailable)."
        )

    def extension_blocks(self) -> list[tuple[str, str]]:
        answer_body = "\n".join(
            [
                self.data_answer_requirements_preamble(),
                self._numbered(self.data_answer_requirements()),
                self.data_answer_requirements_epilogue(),
            ]
        )
        return [
            *super().extension_blocks(),
            ("Data prohibitions", self._bullets(self.data_prohibitions())),
            ("Data required practices", self._bullets(self.data_required_practices())),
            ("Data answer requirements", answer_body),
            ("Output", self.output()),
        ]
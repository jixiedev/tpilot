"""One eval case type and its batch files.

Layout: ``evals/cases/<agent>/<objective>.json``. The directory names the
agent under test; each file is a batch of cases with one objective (for
example ``knowledge/not_in_catalog.json``). A batch file is::

    {
      "description": "what this batch checks",
      "models": ["MiniMax-M3"],                  # default LLMs for every case
      "run": {                                    # optional run options
        "stub_specialists": true,                 # lead: record delegations, run no specialist
        "gate_reply": "dryrun",                   # answer every human gate with this reply
        "variants": {"rag": {"retrieval": "rag"}} # one agent per variant (run_context overrides)
      },
      "defaults": {"total_rounds": 4},            # merged under every case
      "cases": [ {"name": ..., "query": ..., <expectations>} ]
    }

Every case is the same :class:`EvalCase`; its expectation keys pick the checks
(``evals/checks.py``). A batch file may also be a bare list of cases.
"""

from __future__ import annotations

import json
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

CASES_DIR = Path(__file__).resolve().parent / "cases"

#: Case keys that are not expectations.
META_KEYS = frozenset({"name", "query", "models", "kind", "notes", "stub_results", "reference_sql"})


@dataclass
class BatchRun:
    """How every case in a batch is run."""

    stub_specialists: bool = False
    #: Reply to every human-gate interrupt (Databot: ``dryrun`` runs the SQL without
    #: saving history). ``None``: a gate interrupt fails the run.
    gate_reply: str | None = None
    #: ``variant name -> run_context overrides``; ``{"": {}}`` means a single plain run.
    variants: dict[str, dict[str, Any]] = field(default_factory=lambda: {"": {}})


@dataclass
class EvalCase:
    agent: str
    batch: str
    name: str
    query: str
    models: list[str]
    expect: dict[str, Any]
    run: BatchRun = field(default_factory=BatchRun)
    kind: str = ""
    notes: str = ""
    #: Lead runs: per specialist, ``{"status", "summary"}`` its stub returns.
    stub_results: dict[str, dict[str, Any]] = field(default_factory=dict)
    #: Reference SQL for the question (not scored; kept with the gold).
    reference_sql: str = ""

    @property
    def id(self) -> str:
        return f"{self.agent}/{self.batch}/{self.name}"

    def session_id(self, variant: str = "") -> str:
        tail = f"-{variant}" if variant else ""
        return f"eval-{self.agent}-{self.batch}-{self.name}{tail}-{uuid.uuid4().hex[:8]}"


# --------------------------------------------------------------------------- #
# Loading
# --------------------------------------------------------------------------- #


def list_agents(*, cases_dir: Path | None = None) -> list[str]:
    root = cases_dir or CASES_DIR
    return sorted(p.name for p in root.iterdir() if p.is_dir() and any(p.glob("*.json")))


def list_batches(agent: str, *, cases_dir: Path | None = None) -> list[str]:
    root = (cases_dir or CASES_DIR) / agent
    return sorted(p.stem for p in root.glob("*.json"))


def batch_path(agent: str, batch: str, *, cases_dir: Path | None = None) -> Path:
    path = (cases_dir or CASES_DIR) / agent / f"{batch}.json"
    if not path.is_file():
        known = ", ".join(list_batches(agent, cases_dir=cases_dir)) or "none"
        raise FileNotFoundError(f"no eval batch {agent}/{batch} (known for {agent}: {known})")
    return path


def parse_models(raw: Any, *, label: str, default: list[str] | None = None) -> list[str]:
    """A ``models`` value as a non-empty list of names from config/models.toml."""
    if raw is None:
        if default:
            return list(default)
        raise ValueError(f"{label} is missing required field 'models' (names from config/models.toml)")
    if isinstance(raw, str):
        names = [raw.strip()] if raw.strip() else []
    elif isinstance(raw, list):
        names = [str(item).strip() for item in raw if str(item).strip()]
    else:
        raise ValueError(f"{label} field 'models' must be a string or a list of strings")
    if not names:
        raise ValueError(f"{label} field 'models' must not be empty")
    return names


def _parse_run(raw: Any, *, label: str) -> BatchRun:
    if raw is None:
        return BatchRun()
    if not isinstance(raw, dict):
        raise ValueError(f"{label}: 'run' must be an object")
    variants = raw.get("variants")
    if variants is None:
        parsed = {"": {}}
    elif isinstance(variants, dict) and variants:
        parsed = {str(k): dict(v or {}) for k, v in variants.items()}
    else:
        raise ValueError(f"{label}: 'run.variants' must be a non-empty object of run_context overrides")
    gate_reply = raw.get("gate_reply")
    if gate_reply is not None and not isinstance(gate_reply, str):
        raise ValueError(f"{label}: 'run.gate_reply' must be a string")
    return BatchRun(stub_specialists=bool(raw.get("stub_specialists")), variants=parsed, gate_reply=gate_reply)


def load_batch(agent: str, batch: str, *, cases_dir: Path | None = None) -> list[EvalCase]:
    from evals.checks import expectation_keys

    path = batch_path(agent, batch, cases_dir=cases_dir)
    payload = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(payload, list):
        payload = {"cases": payload}
    if not isinstance(payload, dict) or not isinstance(payload.get("cases"), list):
        raise ValueError(f"{agent}/{batch}: a batch file needs a 'cases' list")
    label = f"{agent}/{batch}"
    default_models = parse_models(payload["models"], label=label) if "models" in payload else None
    run = _parse_run(payload.get("run"), label=label)
    defaults = dict(payload.get("defaults") or {})
    known = expectation_keys()

    cases: list[EvalCase] = []
    names: set[str] = set()
    for raw in payload["cases"]:
        if not isinstance(raw, dict):
            raise ValueError(f"{label}: every case must be an object")
        merged = {**defaults, **raw}
        for key in ("name", "query"):
            if not str(merged.get(key) or "").strip():
                raise ValueError(f"case in {label} is missing required field {key!r}")
        name = str(merged["name"])
        if name in names:
            raise ValueError(f"{label}: duplicate case name {name!r}")
        names.add(name)
        case_label = f"case {name!r} in {label}"
        expect = {k: v for k, v in merged.items() if k not in META_KEYS}
        unknown = sorted(set(expect) - known)
        if unknown:
            raise ValueError(f"{case_label}: unknown field(s) {unknown}; expectations are {sorted(known)}")
        if not any(_is_set(k, v) for k, v in expect.items()):
            raise ValueError(f"{case_label} has no expectation to score")
        cases.append(
            EvalCase(
                agent=agent,
                batch=batch,
                name=name,
                query=str(merged["query"]),
                models=parse_models(merged.get("models"), label=case_label, default=default_models),
                expect=expect,
                run=run,
                kind=str(merged.get("kind") or ""),
                notes=str(merged.get("notes") or ""),
                stub_results={str(k): dict(v) for k, v in (merged.get("stub_results") or {}).items()},
                reference_sql=str(merged.get("reference_sql") or ""),
            )
        )
    from evals.checks import validate_case

    for case in cases:
        validate_case(case)
    return cases


def _is_set(key: str, value: Any) -> bool:
    # ``answer: {}`` means "nothing to check"; every other present key is an expectation.
    return not (key == "answer" and not value)


def load_cases(
    agent: str, batches: list[str] | None = None, *, cases_dir: Path | None = None
) -> list[EvalCase]:
    """Cases of ``agent``, from the named batches or every batch in its folder."""
    names = batches or list_batches(agent, cases_dir=cases_dir)
    if not names:
        raise FileNotFoundError(f"no eval batches for agent {agent!r} under {(cases_dir or CASES_DIR) / agent}")
    cases: list[EvalCase] = []
    for batch in names:
        cases.extend(load_batch(agent, batch, cases_dir=cases_dir))
    return cases

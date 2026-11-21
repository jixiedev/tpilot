"""Checks: each expectation key of a case turns on one scored dimension.

| Key in the case        | Check         | Score                                                     |
|------------------------|---------------|-----------------------------------------------------------|
| ``expected_tools``     | ``tools``     | ordered subsequence of the tool calls (partial credit)    |
| ``total_rounds``       | ``rounds``    | tool-calling rounds within budget (soft penalty above)    |
| ``answer``             | ``answer``    | share of JSON keys in the reply that match                |
| ``expected_decision``  | ``decision``  | lead's first move: answer / clarify / delegate / plan     |
| ``expected_routes``    | ``routes``    | delegated specialists, in order (partial credit)          |
| ``max_delegations``    | ``delegations`` | delegations within budget (default: routes + 1)         |
| ``expected_models``    | ``selection`` | the reply's ``model`` is one of them (``[]`` = null)      |
|                        | ``recall``    | an expected model was among the staged candidates         |
| ``max_tool_calls``     | ``economy``   | tool calls within budget (soft penalty above)             |
| ``allowed_tools`` /    | ``tool_policy`` | 0 if any call is outside ``allowed_tools`` or in        |
| ``forbidden_tools``    |               | ``forbidden_tools``, else 1                               |
| ``expected_tables``    | ``tables``    | tables the turn settled on (Databot cards; Warehouse SQL tables, else staged models), by model name |
| ``expected_reply``     | ``reply``     | the trimmed reply equals this string exactly              |
| ``expect_sql_runs``    | ``sql_runs``  | the approved SQL executed without error (Databot or Warehouse) |
| ``expected_sql_tables`` | ``sql_tables`` | every expected table is read by the reply's ``proposed_sql`` |
| ``expect_sql_compiles`` | ``sql_compiles`` | share of the reply's ``proposed_sql`` that Trino can plan (``EXPLAIN``; nothing runs) |

A case scores the mean of its checks. A check that does not apply to a run
(for example ``recall`` when no model is expected) is left out of the mean.
"""

from __future__ import annotations

import re
from collections.abc import Callable
from dataclasses import dataclass, field
from typing import TYPE_CHECKING, Any

from evals.answer_match import score_answer

if TYPE_CHECKING:
    from evals.case import EvalCase
    from evals.runner import RunRecord

DECISIONS = ("answer", "clarify", "delegate", "plan")


@dataclass
class CheckResult:
    name: str
    #: ``None`` when the check does not apply to this run.
    score: float | None
    details: dict[str, Any] = field(default_factory=dict)
    #: One indented line for the CLI report.
    line: str = ""


# --------------------------------------------------------------------------- #
# Shared scoring helpers
# --------------------------------------------------------------------------- #


def is_subsequence(expected: list[str], actual: list[str]) -> bool:
    if not expected:
        return True
    index = 0
    for name in actual:
        if name == expected[index]:
            index += 1
            if index == len(expected):
                return True
    return False


def score_sequence(expected: list[str], actual: list[str], *, empty_reason: str) -> tuple[float, dict[str, Any]]:
    """Ordered match = 1.0; right items in the wrong order = 0.5 * coverage; ``[]`` = none allowed."""
    details: dict[str, Any] = {"expected": expected, "actual": actual}
    if not expected:
        details["reason"] = empty_reason
        return (1.0 if not actual else 0.0), details
    if is_subsequence(expected, actual):
        details["reason"] = "ordered match"
        return 1.0, details
    expected_set = set(expected)
    overlap = expected_set & set(actual)
    details["reason"] = "unordered partial"
    details["overlap"] = sorted(overlap)
    return 0.5 * len(overlap) / len(expected_set), details


def budget_score(actual: int, budget: int) -> float:
    """1.0 within ``budget``; ``1 - over / budget`` above it, floored at 0."""
    if actual <= budget:
        return 1.0
    return max(0.0, 1.0 - (actual - budget) / budget) if budget > 0 else 0.0


def normalize_model_name(name: Any) -> str:
    """``core_data.fct_dau`` / ``FCT_DAU`` -> ``fct_dau``; ``None`` -> ``""``."""
    if name is None:
        return ""
    return str(name).strip().rsplit(".", 1)[-1].lower()


def _models(value: Any) -> list[str]:
    items = [value] if isinstance(value, str) else list(value or [])
    return [normalize_model_name(m) for m in items]


# --------------------------------------------------------------------------- #
# Checks
# --------------------------------------------------------------------------- #


def check_tools(case: EvalCase, run: RunRecord) -> CheckResult:
    expected = [str(t) for t in case.expect["expected_tools"]]
    score, details = score_sequence(expected, run.tool_names, empty_reason="no tools expected")
    line = f"tools: expected={expected} actual={run.tool_names} ({details['reason']})"
    return CheckResult("tools", score, details, line)


def check_rounds(case: EvalCase, run: RunRecord) -> CheckResult:
    """``total_rounds: 0`` expects a direct answer; otherwise at least one tool round."""
    expected = max(0, int(case.expect["total_rounds"]))
    actual = run.rounds
    if expected == 0:
        score = 1.0 if actual <= 0 else 0.0
    elif actual <= 0:
        score = 0.0
    else:
        score = budget_score(actual, expected)
    return CheckResult("rounds", score, {"expected": expected, "actual": actual},
                       f"rounds: expected<={expected} actual={actual}")


def check_answer(case: EvalCase, run: RunRecord) -> CheckResult:
    score, details = score_answer(run.reply, dict(case.expect["answer"]))
    bits = []
    for key in ("missing", "mismatched"):
        if details.get(key):
            bits.append(f"{key}={details[key]}")
    if details.get("parse_error"):
        bits.append(f"parse error: {details['parse_error']}")
    return CheckResult("answer", score, details, "answer: " + ("; ".join(bits) or "all keys match"))


def check_decision(case: EvalCase, run: RunRecord) -> CheckResult:
    accepted = _decisions(case.expect["expected_decision"])
    actual = run.outcome["decision"]
    score = 1.0 if actual in accepted else 0.0
    return CheckResult("decision", score, {"expected": accepted, "actual": actual},
                       f"decision: expected={'|'.join(accepted)} actual={actual}")


def check_routes(case: EvalCase, run: RunRecord) -> CheckResult:
    expected = [str(r).strip() for r in case.expect["expected_routes"] if str(r).strip()]
    score, details = score_sequence(expected, run.outcome["routes"], empty_reason="no delegation expected")
    return CheckResult("routes", score, details,
                       f"routes: expected={expected} actual={run.outcome['routes']} ({details['reason']})")


def check_delegations(case: EvalCase, run: RunRecord) -> CheckResult:
    used = len(run.outcome["routes"])
    budget = case.expect.get("max_delegations")
    if budget is None:
        budget = len(case.expect.get("expected_routes") or []) + 1
    score = 1.0 if used <= int(budget) else 0.0
    return CheckResult("delegations", score, {"max": int(budget), "actual": used},
                       f"delegations: {used} (max {budget})")


def check_selection(case: EvalCase, run: RunRecord) -> CheckResult:
    expected = _models(case.expect["expected_models"])
    selection = run.selection
    chosen = normalize_model_name(selection.get("model"))
    if expected:
        score = 1.0 if chosen and chosen in expected else 0.0
    else:  # abstain case: right only when the agent answered and chose nothing
        score = 1.0 if selection and not chosen else 0.0
    details = {"expected": expected, "chosen": chosen, "parsed": bool(selection),
               "root_id": selection.get("root_id"), "member_id": selection.get("member_id")}
    note = "" if selection else " (reply had no JSON choice)"
    return CheckResult("selection", score, details,
                       f"selection: chosen={chosen or 'null'} expected={expected or 'null'}{note}")


def check_recall(case: EvalCase, run: RunRecord) -> CheckResult:
    expected = set(_models(case.expect["expected_models"]))
    if not expected:
        return CheckResult("recall", None, {}, "")
    hit = bool(expected & set(run.candidates))
    return CheckResult("recall", 1.0 if hit else 0.0, {"candidates": run.candidates},
                       f"recall: candidates={run.candidates}")


def check_economy(case: EvalCase, run: RunRecord) -> CheckResult:
    budget = max(1, int(case.expect["max_tool_calls"]))
    used = len(run.tool_names)
    return CheckResult("economy", budget_score(used, budget), {"max": budget, "actual": used},
                       f"economy: {used} tool call(s) (max {budget})")


def check_tool_policy(case: EvalCase, run: RunRecord) -> CheckResult:
    allowed = set(case.expect.get("allowed_tools") or [])
    forbidden = set(case.expect.get("forbidden_tools") or [])
    hits = [t for t in run.tool_names if t in forbidden]
    outside = [t for t in run.tool_names if allowed and t not in allowed]
    if hits:
        return CheckResult("tool_policy", 0.0, {"forbidden_hits": hits}, f"tool_policy: forbidden tool(s) used {hits}")
    if outside:
        return CheckResult("tool_policy", 0.0, {"disallowed": outside}, f"tool_policy: tool(s) outside the allowed set {outside}")
    return CheckResult("tool_policy", 1.0, {}, "tool_policy: ok")


#: Databot stages, furthest first: the cards the turn ended with.
CARD_KEYS = ("approved_cards", "review_cards", "committed_cards")


def tables_found(state: dict[str, Any]) -> tuple[list[str], str]:
    """Tables the turn settled on, and where they came from.

    Databot: the cards of the furthest stage reached. Warehouse: the tables of
    the reviewed SQL, else the models it staged from the metric catalog.
    """
    for key in CARD_KEYS:
        cards = state.get(key) or []
        if cards:
            return [str(card.get("name") or "") for card in cards if isinstance(card, dict)], key
    review = state.get("sql_review") or {}
    if review.get("tables"):
        return [str(t) for t in review["tables"]], "sql_review"
    staged = [str(card.get("name") or "") for card in state.get("staging_cards") or [] if isinstance(card, dict)]
    return (staged, "staging_cards") if staged else ([], "")


def check_tables(case: EvalCase, run: RunRecord) -> CheckResult:
    """Compared by model name: ``core_data.fct_dau`` matches ``fct_dau``."""
    expected = [normalize_model_name(c) for c in case.expect["expected_tables"]]
    found, source = tables_found(run.state)
    actual = list(dict.fromkeys(normalize_model_name(c) for c in found))
    score, details = score_sequence(expected, actual, empty_reason="no tables expected")
    details["source"] = source
    return CheckResult("tables", score, details,
                       f"tables: expected={expected} actual={actual} from {source or 'nothing'} ({details['reason']})")


def check_reply(case: EvalCase, run: RunRecord) -> CheckResult:
    """Strict: the reply must be exactly the requested value (the query states the format)."""
    expected = str(case.expect["expected_reply"]).strip()
    actual = run.reply.strip()
    score = 1.0 if actual == expected else 0.0
    shown = actual if len(actual) <= 120 else actual[:117] + "..."
    return CheckResult("reply", score, {"expected": expected, "actual": actual},
                       f"reply: expected={expected!r} actual={shown!r}")


def _execution(state: dict[str, Any]) -> tuple[bool, str, str] | None:
    """``(ran, why, sql)`` from Databot's ``execution_result`` or Warehouse's ``execution``."""
    databot = state.get("execution_result") or {}
    if databot:
        if databot.get("ok"):
            return True, f"{databot.get('row_count', 0)} row(s)", str(databot.get("sql") or "")
        return False, str(databot.get("error") or "failed")[:160], str(databot.get("sql") or "")
    warehouse = state.get("execution") or {}
    if warehouse.get("sql"):
        if warehouse.get("error"):
            return False, str(warehouse["error"])[:160], warehouse["sql"]
        return True, f"{warehouse.get('row_count', 0)} row(s)", warehouse["sql"]
    return None


def check_sql_runs(case: EvalCase, run: RunRecord) -> CheckResult:
    """Did the approved SQL execute? ``expect_sql_runs: false`` expects it not to."""
    wanted = bool(case.expect["expect_sql_runs"])
    execution = _execution(run.state)
    ran, why, sql = execution if execution else (False, "no SQL ran this turn", "")
    return CheckResult("sql_runs", 1.0 if ran == wanted else 0.0, {"ran": ran, "sql": sql},
                       f"sql_runs: {'ran' if ran else 'not run'} ({why})")


# --------------------------------------------------------------------------- #
# SQL in the reply (``proposed_sql``), checked without running it
# --------------------------------------------------------------------------- #

#: Reply JSON field holding the SQL the agent proposes (a string or a list of strings).
SQL_FIELD = "proposed_sql"

_TABLE_REF = re.compile(r"\b(?:from|join)\s+([A-Za-z_][\w]*(?:\.[A-Za-z_][\w]*){1,2})", re.IGNORECASE)


def reply_sql(reply: str) -> list[str]:
    """The non-empty SQL statements in the reply's ``proposed_sql`` field."""
    from evals.answer_match import extract_json_object

    parsed, _ = extract_json_object(reply)
    value = (parsed or {}).get(SQL_FIELD)
    items = [value] if isinstance(value, str) else list(value or []) if isinstance(value, list) else []
    return [str(s).strip() for s in items if str(s).strip()]


def sql_tables(sql: str) -> list[str]:
    """``db.table`` names after FROM / JOIN, lower-cased, without a catalog prefix."""
    out = []
    for ref in _TABLE_REF.findall(sql):
        parts = ref.lower().split(".")
        out.append(".".join(parts[-2:]))
    return list(dict.fromkeys(out))


def check_sql_tables(case: EvalCase, run: RunRecord) -> CheckResult:
    expected = [".".join(str(t).lower().split(".")[-2:]) for t in case.expect["expected_sql_tables"]]
    statements = reply_sql(run.reply)
    read = list(dict.fromkeys(t for s in statements for t in sql_tables(s)))
    if not statements:
        return CheckResult("sql_tables", 0.0, {"expected": expected, "actual": []}, "sql_tables: no proposed_sql")
    hit = [t for t in expected if t in read]
    score = len(hit) / len(expected) if expected else 1.0
    return CheckResult("sql_tables", score, {"expected": expected, "actual": read},
                       f"sql_tables: expected={expected} read={read}")


def explain_sql(sql: str) -> str:
    """``""`` when Trino can plan ``sql`` (EXPLAIN only, no data read), else the error."""
    from tahoepilot.tools.data.sql_guard import validate_plan_only_sql
    from tahoepilot.tools.data.trino import _execute_query

    try:
        _execute_query(validate_plan_only_sql(sql.rstrip().rstrip(";")), limit=1)
    except Exception as exc:  # noqa: BLE001 - the error text is the result
        return f"{type(exc).__name__}: {str(exc).splitlines()[0] if str(exc) else ''}"[:200]
    return ""


def check_sql_compiles(case: EvalCase, run: RunRecord) -> CheckResult:
    if not case.expect["expect_sql_compiles"]:
        return CheckResult("sql_compiles", None, {}, "")
    statements = reply_sql(run.reply)
    if not statements:
        return CheckResult("sql_compiles", 0.0, {"errors": []}, "sql_compiles: no proposed_sql")
    errors = [e for e in (explain_sql(s) for s in statements) if e]
    score = (len(statements) - len(errors)) / len(statements)
    note = "all plan" if not errors else f"{len(errors)} of {len(statements)} fail: {errors[0]}"
    return CheckResult("sql_compiles", score, {"errors": errors}, f"sql_compiles: {note}")


#: ``(trigger keys, check)``: a check runs when any trigger key is in the case.
CHECKS: list[tuple[tuple[str, ...], Callable[[EvalCase, RunRecord], CheckResult]]] = [
    (("expected_tools",), check_tools),
    (("total_rounds",), check_rounds),
    (("answer",), check_answer),
    (("expected_decision",), check_decision),
    (("expected_routes",), check_routes),
    (("expected_routes", "max_delegations"), check_delegations),
    (("expected_models",), check_selection),
    (("expected_models",), check_recall),
    (("max_tool_calls",), check_economy),
    (("allowed_tools", "forbidden_tools"), check_tool_policy),
    (("expected_tables",), check_tables),
    (("expected_reply",), check_reply),
    (("expect_sql_runs",), check_sql_runs),
    (("expected_sql_tables",), check_sql_tables),
    (("expect_sql_compiles",), check_sql_compiles),
]


def expectation_keys() -> set[str]:
    return {key for keys, _ in CHECKS for key in keys}


def active_checks(case: EvalCase) -> list[Callable[[EvalCase, RunRecord], CheckResult]]:
    out = []
    for keys, check in CHECKS:
        present = [k for k in keys if k in case.expect]
        if not present or (present == ["answer"] and not case.expect["answer"]):
            continue
        out.append(check)
    return out


def run_checks(case: EvalCase, run: RunRecord) -> list[CheckResult]:
    return [check(case, run) for check in active_checks(case)]


def _decisions(raw: Any) -> list[str]:
    items = raw if isinstance(raw, list) else [raw]
    return [str(item).strip().lower() for item in items]


def validate_case(case: EvalCase) -> None:
    """Shape errors in expectations fail at load time, before any LLM call."""
    label = f"case {case.id}"
    expect = case.expect
    if "expected_decision" in expect:
        decisions = _decisions(expect["expected_decision"])
        if not decisions or any(d not in DECISIONS for d in decisions):
            raise ValueError(f"{label}: expected_decision must be one of {DECISIONS} (or a list of them)")
    for key in ("expected_tools", "expected_routes", "allowed_tools", "forbidden_tools", "expected_tables",
                "expected_sql_tables"):
        if key in expect and not isinstance(expect[key], list):
            raise ValueError(f"{label}: {key} must be a list")
    if "expected_models" in expect and not isinstance(expect["expected_models"], (list, str)):
        raise ValueError(f"{label}: expected_models must be a list of dbt model names ([] = expect null)")
    if "expected_reply" in expect and not isinstance(expect["expected_reply"], str):
        raise ValueError(f"{label}: expected_reply must be a string")
    for key in ("expect_sql_runs", "expect_sql_compiles"):
        if key in expect and not isinstance(expect[key], bool):
            raise ValueError(f"{label}: {key} must be true or false")
    if "answer" in expect and not isinstance(expect["answer"], dict):
        raise ValueError(f"{label}: answer must be an object of expected JSON fields")
    for key in ("total_rounds", "max_delegations", "max_tool_calls"):
        if key in expect and (not isinstance(expect[key], int) or expect[key] < 0):
            raise ValueError(f"{label}: {key} must be a non-negative integer")

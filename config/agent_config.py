"""Load per-agent settings from ``config/agents/<name>.toml``.

Each registered agent has one file. Top-level keys are identity (name,
description, intention, MCP). Subclasses type ``run_context``
(``DatabotAgentConfig``, ``ReactAgentConfig``, ``StageReactConfig``, ``PlanAgentConfig``,
``IntentAgentConfig``). ``[system_prompt]`` is optional and is the
only table consumed by ``SystemPromptAssembler``.

``[system_prompt]`` may set ``extends = "tahoe"`` (or another file name).
The child's ``layout`` replaces the parent's when present; named sections
merge by id. Each section is ``title`` plus ``text``. A child section may
``append`` extra bullet lines onto the parent's text.

``[compression]`` holds context-compression thresholds. A file with no
table inherits ``base.toml``. ``extends`` merges another file first; keys
in the child replace the parent. ``offload_dir`` and the turn-boundary
marker are not file keys.

``base.toml`` / ``tahoe.toml`` are shared assembler parents, not registered
agents.

Construct from a file path::

    AgentConfig(agent_config_path("databot"))
"""

from __future__ import annotations

import tomllib
from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field, fields
from pathlib import Path
from typing import Any, ClassVar, Literal, Self

from agent.run_context import (
    DatabotGatesConfig,
    DatabotRunContext,
    HandoffRunContext,
    PlanRunContext,
    ReactRunContext,
)
from memory.config import CompressionConfig

_DEFAULT_AGENTS_DIR = Path(__file__).resolve().parent / "agents"

MCP_ALL_SERVERS = "*"


def agent_config_path(name: str) -> Path:
    """Return ``config/agents/<name>.toml``."""
    return _DEFAULT_AGENTS_DIR / f"{name}.toml"


def _read_toml(path: Path) -> dict[str, Any]:
    if not path.is_file():
        raise FileNotFoundError(f"agent config not found at {path}")
    with path.open("rb") as handle:
        data = tomllib.load(handle)
    if not isinstance(data, dict):
        raise ValueError(f"agent config {path} must be a table")
    return data


_TOOL_GROUPS_PATH = Path(__file__).resolve().parent / "tool_groups.toml"


def tool_groups(path: Path | None = None) -> dict[str, tuple[str, ...]]:
    """Named tool sets from ``config/tool_groups.toml`` (``@name`` in ``[tools]``)."""
    source = path or _TOOL_GROUPS_PATH
    if not source.is_file():
        return {}
    with source.open("rb") as handle:
        data = tomllib.load(handle)
    return {str(k): tuple(str(n) for n in v) for k, v in data.items()}


def agent_tool_scopes(
    name: str,
    *,
    groups: Mapping[str, Sequence[str]] | None = None,
) -> dict[str, list[str]]:
    """``[tools]`` of ``config/agents/<name>.toml``: scope id → tool names.

    ``"@group"`` entries expand from :func:`tool_groups`; duplicates are
    dropped keeping first position. Agents without a config file or a
    ``[tools]`` table have no built-in tools.
    """
    path = agent_config_path(name)
    if not path.is_file():
        return {}
    table = _read_toml(path).get("tools") or {}
    if not isinstance(table, dict):
        raise ValueError(f"[tools] in {path} must be a table of scope = [tool names]")
    known_groups = tool_groups() if groups is None else groups
    scopes: dict[str, list[str]] = {}
    for scope, entries in table.items():
        names: list[str] = []
        for entry in entries or ():
            entry = str(entry).strip()
            if entry.startswith("@"):
                group = entry[1:]
                if group not in known_groups:
                    raise ValueError(f"unknown tool group {entry!r} in [tools].{scope} of {path}")
                expanded = list(known_groups[group])
            else:
                expanded = [entry]
            names.extend(n for n in expanded if n and n not in names)
        scopes[str(scope)] = names
    return scopes


def _accepted_mcp(raw: object) -> dict[str, tuple[str, ...]]:
    """``[accepted_mcp]`` maps tool-scope id → MCP server names (or ``*``)."""
    if not isinstance(raw, dict):
        return {}
    out: dict[str, tuple[str, ...]] = {}
    for key, value in raw.items():
        if isinstance(value, str):
            servers = (value,) if value.strip() else ()
        else:
            servers = tuple(str(item).strip() for item in value or () if str(item).strip())
        out[str(key)] = servers
    return out


def _merged_prompt_table(path: Path, stack: tuple[str, ...] = ()) -> dict[str, Any]:
    key = str(path.resolve())
    if key in stack:
        raise ValueError(f"circular system_prompt extends: {' -> '.join((*stack, key))}")
    table = _read_toml(path).get("system_prompt")
    if not isinstance(table, dict):
        raise ValueError(f"agent config {path.name!r} is missing [system_prompt]")
    table = dict(table)
    parent_name = str(table.get("extends") or "").strip()
    if not parent_name:
        return table
    parent_path = path.parent / f"{parent_name}.toml"
    return _merge_prompt_tables(
        _merged_prompt_table(parent_path, (*stack, key)),
        table,
    )


def _merged_compression_table(path: Path, stack: tuple[str, ...] = ()) -> dict[str, Any]:
    """Resolve ``[compression]``, inheriting ``base.toml`` when the table is absent."""
    key = str(path.resolve())
    if key in stack:
        raise ValueError(f"circular compression extends: {' -> '.join((*stack, key))}")
    if not path.is_file():
        return {}
    table = _read_toml(path).get("compression")
    if not isinstance(table, dict):
        if path.name == "base.toml":
            return {}
        return _merged_compression_table(path.parent / "base.toml", (*stack, key))
    data = dict(table)
    parent_name = str(data.pop("extends", "") or "").strip()
    if parent_name:
        parent = _merged_compression_table(path.parent / f"{parent_name}.toml", (*stack, key))
        return {**parent, **data}
    if path.name != "base.toml":
        parent = _merged_compression_table(path.parent / "base.toml", (*stack, key))
        return {**parent, **data}
    return data


def _merged_run_context_table(path: Path, stack: tuple[str, ...] = ()) -> dict[str, Any]:
    key = str(path.resolve())
    if key in stack:
        raise ValueError(f"circular run_context extends: {' -> '.join((*stack, key))}")
    table = _read_toml(path).get("run_context")
    if not isinstance(table, dict):
        return {}
    return _resolve_run_context_mapping(path, dict(table), (*stack, key))


def _resolve_run_context_mapping(
    path: Path,
    table: Mapping[str, Any],
    stack: tuple[str, ...],
) -> dict[str, Any]:
    data = dict(table)
    parent_name = str(data.pop("extends", "") or "").strip()
    merged: dict[str, Any] = dict(data)
    if parent_name:
        parent_path = path.parent / f"{parent_name}.toml"
        parent = _merged_run_context_table(parent_path, stack)
        merged = {**parent, **data}
    for key, value in list(merged.items()):
        if isinstance(value, dict):
            merged[key] = _resolve_run_context_mapping(path, value, stack)
    return merged


def _merge_prompt_tables(parent: Mapping[str, Any], child: Mapping[str, Any]) -> dict[str, Any]:
    """Child ``layout`` wins when set; sections merge by id."""
    layout = child["layout"] if "layout" in child else parent.get("layout", [])
    sections = dict(parent.get("sections") or {})
    for key, value in dict(child.get("sections") or {}).items():
        current = sections.get(key)
        if isinstance(current, dict) and isinstance(value, dict):
            sections[key] = _merge_section_tables(current, value)
        else:
            sections[key] = value
    merged = dict(parent)
    merged.update({k: v for k, v in child.items() if k not in {"extends", "sections", "layout"}})
    merged["layout"] = layout
    merged["sections"] = sections
    return merged


def _bullet_lines(raw: object) -> str:
    lines = [
        f"- {' '.join(str(item).split())}"
        for item in (raw or ())
        if str(item).strip()
    ]
    return "\n".join(lines)


def _merge_section_tables(parent: Mapping[str, Any], child: Mapping[str, Any]) -> dict[str, Any]:
    """Child ``title`` / ``text`` overlay the parent; ``append`` adds bullet lines."""
    merged = dict(parent)
    if "title" in child:
        merged["title"] = child["title"]
    if "text" in child:
        merged["text"] = child["text"]
    extra = _bullet_lines(child.get("append"))
    if extra:
        base = str(merged.get("text") or "").rstrip()
        merged["text"] = f"{base}\n{extra}" if base else extra
    return merged


@dataclass(frozen=True)
class PromptSection:
    """One named block referenced by ``system_prompt.layout``: title plus body text."""

    id: str
    title: str = ""
    text: str = ""

    @classmethod
    def from_raw(cls, section_id: str, raw: Mapping[str, Any]) -> Self:
        """Parse one ``[system_prompt.sections.<id>]`` table."""
        title = str(raw.get("title") or "").strip() or cls.default_title(section_id)
        return cls(id=section_id, title=title, text=str(raw.get("text") or "").strip())

    @staticmethod
    def default_title(section_id: str) -> str:
        """``data_answer_requirements`` → ``Data answer requirements``."""
        return section_id.replace("_", " ").strip().capitalize()


@dataclass(frozen=True)
class PromptSpec:
    """Resolved system-prompt layout after ``extends`` has been applied.

    ``layout`` is the render order. Each section is title plus text.
    """

    name: str
    layout: tuple[str, ...]
    sections: Mapping[str, PromptSection]

    @classmethod
    def from_raw(cls, name: str, raw: Mapping[str, Any]) -> Self:
        """Build from an already-merged ``[system_prompt]`` table."""
        spec_name = str(raw.get("name") or name).strip() or name
        layout = tuple(str(item).strip() for item in raw.get("layout") or () if str(item).strip())
        sections = {
            section_id: PromptSection.from_raw(section_id, dict(value or {}))
            for section_id, value in dict(raw.get("sections") or {}).items()
        }
        missing = [section_id for section_id in layout if section_id not in sections]
        if missing:
            raise ValueError(
                f"system_prompt {spec_name!r} layout references unknown sections: {missing}"
            )
        return cls(name=spec_name, layout=layout, sections=sections)

    def section(self, section_id: str) -> PromptSection:
        """Return the section named in ``layout``."""
        try:
            return self.sections[section_id]
        except KeyError as exc:
            raise KeyError(f"prompt {self.name!r} has no section {section_id!r}") from exc


@dataclass(frozen=True, init=False)
class AgentConfig:
    """Identity, resolved system prompt, and run context for one agent file.

    Subclasses type ``run_context`` (ReAct, plan stages, databot pipeline, intent
    handoff). Construct from a file path; pass ``run_overrides`` to overlay
    catalog/CLI limits onto that file.
    """

    name: str
    description: str = ""
    intention: str | None = None
    intention_description: str = ""
    accepted_mcp: Mapping[str, tuple[str, ...]] = field(default_factory=dict)
    mcp_replace_identifiers: frozenset[str] = frozenset()
    system_prompt: PromptSpec | None = None
    run_context: Mapping[str, Any] = field(default_factory=dict)
    compression: CompressionConfig = field(default_factory=CompressionConfig)

    def __init__(
        self,
        path: str | Path,
        *,
        run_overrides: Mapping[str, Any] | None = None,
    ) -> None:
        path = Path(path)
        raw = _read_toml(path)
        name = str(raw.get("name") or path.stem).strip() or path.stem
        system_prompt = None
        if "system_prompt" in raw:
            system_prompt = PromptSpec.from_raw(name, _merged_prompt_table(path))
        table: dict[str, Any] = {}
        if "run_context" in raw:
            table = _merged_run_context_table(path)
        intention = str(raw.get("intention") or "").strip()
        object.__setattr__(self, "name", name)
        object.__setattr__(self, "description", str(raw.get("description") or "").strip())
        object.__setattr__(self, "intention", intention or None)
        object.__setattr__(
            self,
            "intention_description",
            str(raw.get("intention_description") or "").strip(),
        )
        object.__setattr__(self, "accepted_mcp", _accepted_mcp(raw.get("accepted_mcp")))
        object.__setattr__(
            self,
            "mcp_replace_identifiers",
            frozenset(
                str(item).strip()
                for item in raw.get("mcp_replace_identifiers") or ()
                if str(item).strip()
            ),
        )
        object.__setattr__(self, "system_prompt", system_prompt)
        object.__setattr__(
            self,
            "run_context",
            type(self).resolve_run_context(table, run_overrides),
        )
        object.__setattr__(
            self,
            "compression",
            CompressionConfig.from_mapping(_merged_compression_table(path)),
        )

    @classmethod
    def resolve_run_context(
        cls,
        raw: Mapping[str, Any],
        overrides: Mapping[str, Any] | None = None,
    ) -> Mapping[str, Any]:
        """Merge file table with optional overlays. Subclasses add defaults and types."""
        merged = dict(raw)
        if overrides:
            merged.update(
                {key: value for key, value in dict(overrides).items() if value is not None}
            )
        return merged

    @staticmethod
    def _as_int(value: object, default: int) -> int:
        if value is None:
            return default
        try:
            return int(value)
        except (TypeError, ValueError):
            return default

    @staticmethod
    def _as_float(value: object, default: float) -> float:
        if isinstance(value, bool) or not isinstance(value, (int, float, str)):
            return default
        try:
            return float(value)
        except ValueError:
            return default

    @staticmethod
    def _as_bool(value: object, default: bool) -> bool:
        if value is None:
            return default
        if isinstance(value, bool):
            return value
        if isinstance(value, (int, float)):
            return bool(value)
        text = str(value).strip().lower()
        if text in ("true", "1", "yes", "on", "enabled"):
            return True
        if text in ("false", "0", "no", "off", "disabled", "disable"):
            return False
        return default

    @staticmethod
    def _as_str(raw: Mapping[str, Any], key: str, default: str = "") -> str:
        value = raw.get(key)
        if value is None:
            return default
        return str(value)

    @staticmethod
    def _without_nested_react(raw: Mapping[str, Any]) -> dict[str, Any]:
        return {key: value for key, value in dict(raw).items() if key != "react"}

    @staticmethod
    def _overlay(
        overrides: Mapping[str, Any] | None,
        allowed: frozenset[str],
    ) -> dict[str, Any]:
        if not overrides:
            return {}
        return {
            key: overrides[key]
            for key in allowed
            if key in overrides and overrides[key] is not None
        }

    @classmethod
    def as_int(cls, ctx: Mapping[str, Any], key: str, default: int = 0) -> int:
        """Read an integer from a resolved run-context mapping."""
        return cls._as_int(ctx.get(key), default)

    @classmethod
    def as_str(cls, ctx: Mapping[str, Any], key: str, default: str = "") -> str:
        """Read a string from a resolved run-context mapping."""
        return cls._as_str(ctx, key, default)

    def run_int(self, key: str, default: int = 0) -> int:
        return type(self).as_int(self.run_context, key, default)

    def run_float(self, key: str, default: float = 0.0) -> float:
        return type(self)._as_float(self.run_context.get(key), default)

    def run_str(self, key: str, default: str = "") -> str:
        return type(self).as_str(self.run_context, key, default)

    def with_run_overrides(self, overrides: Mapping[str, Any] | None = None, **extra: Any) -> Self:
        """Return a copy with ``run_context`` re-resolved under extra overlays."""
        patch = {**(overrides or {}), **extra}
        patch = {key: value for key, value in patch.items() if value is not None}
        if not patch:
            return self
        clone = self._copy()
        object.__setattr__(
            clone,
            "run_context",
            type(self).resolve_run_context(dict(self.run_context), patch),
        )
        return clone

    def with_compression(self, compression: CompressionConfig | None) -> Self:
        """Return a copy that uses ``compression`` in place of the file table."""
        if compression is None:
            return self
        clone = self._copy()
        object.__setattr__(clone, "compression", compression)
        return clone

    def _copy(self) -> Self:
        clone = object.__new__(type(self))
        for item in fields(self):
            object.__setattr__(clone, item.name, getattr(self, item.name))
        return clone


@dataclass(frozen=True, init=False)
class ReactAgentConfig(AgentConfig):
    """Pure ReAct specialist loop settings (knowledge, diagnostic, SWE, data analysis).

    A pure specialist's router has no stage contract: the first plain-text reply
    is the answer and ends the turn. Idle retries (``max_idle_reason_rounds``,
    ``idle_nudge_prompt``) therefore never happen and are not resolved here;
    they belong to :class:`StageReactConfig` (staged loops such as databot layers).
    """

    run_context: ReactRunContext = field(default_factory=dict)

    #: Whether this loop has a stage contract (adds idle-retry and stage-opener keys).
    staged: ClassVar[bool] = False

    @classmethod
    def resolve_run_context(
        cls,
        raw: Mapping[str, Any],
        overrides: Mapping[str, Any] | None = None,
    ) -> ReactRunContext:
        defaults = cls._defaults()
        allowed = frozenset(defaults)
        merged: dict[str, Any] = {**defaults, **cls._without_nested_react(raw)}
        merged.update(cls._overlay(overrides, allowed))
        out: ReactRunContext = {
            "max_tool_calls": cls._as_int(merged.get("max_tool_calls"), defaults["max_tool_calls"]),
            "next_step": cls._as_str(merged, "next_step", defaults["next_step"]),
            "tool_budget_exhausted_prompt": cls._as_str(
                merged,
                "tool_budget_exhausted_prompt",
                defaults["tool_budget_exhausted_prompt"],
            ),
            "refine_user_profile_prompt": cls._as_str(
                merged,
                "refine_user_profile_prompt",
                defaults["refine_user_profile_prompt"],
            ),
        }
        if cls.staged:
            out["max_idle_reason_rounds"] = cls._as_int(
                merged.get("max_idle_reason_rounds"),
                defaults["max_idle_reason_rounds"],
            )
            out["idle_nudge_prompt"] = cls._as_str(merged, "idle_nudge_prompt")
            for key in ("fetch_instruction", "sql_instruction"):
                if key in merged:
                    out[key] = cls._as_str(merged, key, "")
        return out

    @classmethod
    def _defaults(cls) -> ReactRunContext:
        from agent.runtime.prompt import (
            NEXT_STEP_PROMPT,
            REFINE_USER_PROFILE_PROMPT,
            TOOL_BUDGET_EXHAUSTED_PROMPT,
        )

        defaults: ReactRunContext = {
            "max_tool_calls": 10,
            "next_step": NEXT_STEP_PROMPT,
            "tool_budget_exhausted_prompt": TOOL_BUDGET_EXHAUSTED_PROMPT,
            "refine_user_profile_prompt": REFINE_USER_PROFILE_PROMPT,
        }
        if cls.staged:
            defaults.update(
                {
                    "max_idle_reason_rounds": 1,
                    "idle_nudge_prompt": "",
                    "fetch_instruction": "",
                    "sql_instruction": "",
                }
            )
        return defaults


@dataclass(frozen=True, init=False)
class StageReactConfig(ReactAgentConfig):
    """ReAct loop with a stage contract (databot ``react.fetch`` / ``react.sql``).

    Adds ``max_idle_reason_rounds`` and ``idle_nudge_prompt`` (plain-text replies
    retried while the stage predicate is unmet) and the ``fetch_instruction`` /
    ``sql_instruction`` stage openers (kept only when present).
    """

    staged: ClassVar[bool] = True


@dataclass(frozen=True, init=False)
class PlanAgentConfig(AgentConfig):
    """Plan orchestrator stage budgets.

    ``max_tool_calls`` (tool batches per stage run) and ``max_subagent_rounds``
    (execute/adjust cycles per turn) are kept only when the file or a run
    override sets them; ``build_plan_graph`` falls back to
    ``DEFAULT_STAGE_MAX_TOOL_CALLS`` / ``DEFAULT_MAX_SUBAGENT_ROUNDS``.
    ``max_idle_reason_rounds`` applies to the create stage, the only plan stage
    with a stage contract.
    """

    run_context: PlanRunContext = field(default_factory=dict)

    @classmethod
    def resolve_run_context(
        cls,
        raw: Mapping[str, Any],
        overrides: Mapping[str, Any] | None = None,
    ) -> PlanRunContext:
        defaults: PlanRunContext = {"max_idle_reason_rounds": 1}
        optional = ("max_tool_calls", "max_subagent_rounds")
        merged: dict[str, Any] = {**defaults, **cls._without_nested_react(raw)}
        merged.update(cls._overlay(overrides, frozenset({*defaults, *optional})))
        out: PlanRunContext = {
            "max_idle_reason_rounds": cls._as_int(
                merged.get("max_idle_reason_rounds"),
                defaults["max_idle_reason_rounds"],
            ),
        }
        for key in optional:
            if merged.get(key) is None:
                continue
            value = cls._as_int(merged.get(key), 0)
            if value > 0:
                out[key] = value  # type: ignore[literal-required]
        return out


@dataclass(frozen=True, init=False)
class DatabotAgentConfig(AgentConfig):
    """Databot pipeline, nested per-stage ReAct, and human-gate toggles."""

    run_context: DatabotRunContext = field(default_factory=dict)

    @classmethod
    def resolve_run_context(
        cls,
        raw: Mapping[str, Any],
        overrides: Mapping[str, Any] | None = None,
    ) -> DatabotRunContext:
        data = dict(raw)
        react_raw = data.pop("react", None)
        gates_raw = data.pop("gates", None)
        flat = cls._without_nested_react(data)
        stage_defaults: PlanRunContext = {"max_tool_calls": 10, "max_idle_reason_rounds": 1}
        merged: dict[str, Any] = {**stage_defaults, **flat}
        if overrides:
            merged.update(cls._overlay(overrides, frozenset(stage_defaults)))
            nested_react = overrides.get("react")
            if isinstance(nested_react, Mapping):
                react_raw = {
                    **(react_raw if isinstance(react_raw, Mapping) else {}),
                    **nested_react,
                }
            nested_gates = overrides.get("gates")
            if isinstance(nested_gates, Mapping):
                gates_raw = {
                    **(gates_raw if isinstance(gates_raw, Mapping) else {}),
                    **nested_gates,
                }
            for key in ("prepare_cards_for_gate_prompt", "turn_summary_system_prompt"):
                if key in overrides and overrides[key] is not None:
                    flat[key] = overrides[key]
        tables = dict(react_raw) if isinstance(react_raw, Mapping) else {}
        react = {
            stage: StageReactConfig.resolve_run_context(
                dict(tables[stage]) if isinstance(tables.get(stage), Mapping) else {},
            )
            for stage in ("fetch", "sql")
        }
        gates_data = dict(gates_raw) if isinstance(gates_raw, Mapping) else {}
        return {
            "max_tool_calls": cls._as_int(
                merged.get("max_tool_calls"),
                stage_defaults["max_tool_calls"],
            ),
            "max_idle_reason_rounds": cls._as_int(
                merged.get("max_idle_reason_rounds"),
                stage_defaults["max_idle_reason_rounds"],
            ),
            "react": react,
            "gates": {
                "cards_enabled": cls._as_bool(gates_data.get("cards_enabled"), True),
                "sql_enabled": cls._as_bool(gates_data.get("sql_enabled"), True),
            },
            "prepare_cards_for_gate_prompt": cls._as_str(flat, "prepare_cards_for_gate_prompt"),
            "turn_summary_system_prompt": cls._as_str(flat, "turn_summary_system_prompt"),
        }

    @classmethod
    def gates_from(cls, run_context: Mapping[str, Any] | None) -> DatabotGatesConfig:
        """Human-gate toggles from a databot run context (defaults when unset)."""
        gates = (run_context or {}).get("gates")
        if not isinstance(gates, Mapping):
            return {"cards_enabled": True, "sql_enabled": True}
        return {
            "cards_enabled": cls._as_bool(gates.get("cards_enabled"), True),
            "sql_enabled": cls._as_bool(gates.get("sql_enabled"), True),
        }

    @classmethod
    def node_prompt_from(
        cls,
        run_context: Mapping[str, Any] | None,
        name: Literal["prepare_cards_for_gate", "turn_summary_system"],
    ) -> str:
        """Read a one-shot node system prompt, falling back to databot.toml."""
        key = f"{name}_prompt"
        text = cls.as_str(run_context or {}, key, "")
        if not text.strip():
            text = cls.as_str(cls(agent_config_path("databot")).run_context, key, "")
        if not text.strip():
            raise KeyError(f"databot run_context missing {key!r}")
        return text


@dataclass(frozen=True, init=False)
class IntentAgentConfig(AgentConfig):
    """Intent orchestrator handoff defaults for delegated specialists."""

    run_context: HandoffRunContext = field(default_factory=dict)

    @classmethod
    def resolve_run_context(
        cls,
        raw: Mapping[str, Any],
        overrides: Mapping[str, Any] | None = None,
    ) -> HandoffRunContext:
        default_max = 30
        default_threshold = 0.85
        default_rounds = 2
        allowed = frozenset(
            {"max_tool_calls", "clarification_threshold", "max_clarification_rounds"}
        )
        merged: dict[str, Any] = {
            "max_tool_calls": default_max,
            "clarification_threshold": default_threshold,
            "max_clarification_rounds": default_rounds,
            **cls._without_nested_react(raw),
        }
        merged.update(cls._overlay(overrides, allowed))
        return {
            "max_tool_calls": cls._as_int(merged.get("max_tool_calls"), default_max),
            "clarification_threshold": cls._as_float(
                merged.get("clarification_threshold"),
                default_threshold,
            ),
            "max_clarification_rounds": cls._as_int(
                merged.get("max_clarification_rounds"),
                default_rounds,
            ),
        }


AGENT_CONFIG_TYPES: dict[str, type[AgentConfig]] = {
    "databot": DatabotAgentConfig,
    "plan": PlanAgentConfig,
    "intent": IntentAgentConfig,
    "knowledge": ReactAgentConfig,
    "diagnostic": ReactAgentConfig,
    "data_analysis": ReactAgentConfig,
    "swe": ReactAgentConfig,
}


def agent_config_type(name: str) -> type[AgentConfig]:
    """Return the ``AgentConfig`` subclass for a registered agent file stem."""
    return AGENT_CONFIG_TYPES.get(name.strip().lower(), AgentConfig)

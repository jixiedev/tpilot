"""Load JSON eval records into typed EvalCase objects."""

from __future__ import annotations

import json
from collections.abc import Mapping, Sequence
from pathlib import Path
from typing import Any

from observability.some.cases import (
    DatabotEvalCase,
    EvalCase,
    IntentionEvalCase,
    ReactEvalCase,
)
from observability.some.eval_set import EvalSet, EvalSetCatalog


class CaseTypeCatalog:
    """Map an agent name to the EvalCase subclass that scores it."""

    def __init__(self, case_types: Sequence[type[EvalCase]] | None = None) -> None:
        self._case_types = list(
            case_types
            or (
                DatabotEvalCase,
                IntentionEvalCase,
                ReactEvalCase,
            )
        )

    def case_type_for(self, agent_name: str) -> type[EvalCase]:
        for case_type in self._case_types:
            if agent_name in case_type.supported_agents:
                return case_type
        raise ValueError(f"no eval case type registered for agent {agent_name!r}")


class CaseFile:
    """One JSON fixture: optional file-level models plus a ``cases`` list."""

    def __init__(self, path: Path) -> None:
        self.path = path
        self.payload = json.loads(path.read_text(encoding="utf-8"))

    def default_models(self) -> list[str] | None:
        if not isinstance(self.payload, dict) or "models" not in self.payload:
            return None
        return ModelField().parse(self.payload["models"], label=f"case file {self.path.name}")

    def records(self) -> list[dict[str, Any]]:
        payload = self.payload
        if isinstance(payload, list):
            return payload
        if isinstance(payload, dict):
            records = payload.get("cases")
            if not isinstance(records, list):
                raise ValueError(f"{self.path} must contain a top-level 'cases' list")
            return records
        raise ValueError(f"{self.path} must be a list or an object with a 'cases' list")


class ModelField:
    def parse(
        self,
        raw: Any,
        *,
        label: str,
        default: list[str] | None = None,
    ) -> list[str]:
        if raw is None:
            if default:
                return list(default)
            raise ValueError(
                f"{label} is missing required field 'models' "
                "(list of names from models/models.toml)"
            )
        if isinstance(raw, str):
            names = [raw.strip()] if raw.strip() else []
        elif isinstance(raw, list):
            names = [str(item).strip() for item in raw if str(item).strip()]
        else:
            raise ValueError(f"{label} field 'models' must be a string or list of strings")
        if not names:
            raise ValueError(f"{label} field 'models' must be a non-empty list")
        return names


class CaseRecordParser:
    def __init__(self) -> None:
        self._models = ModelField()

    def parse(
        self,
        raw: dict[str, Any],
        *,
        agent_name: str,
        eval_set: EvalSet,
        default_models: list[str] | None,
    ) -> EvalCase:
        raise NotImplementedError

    def require(self, raw: Mapping[str, Any], *keys: str, location: str) -> None:
        for key in keys:
            if key not in raw:
                raise ValueError(
                    f"case {raw.get('name', '?')!r} in {location} "
                    f"is missing required field {key!r}"
                )

    def models_of(
        self,
        raw: Mapping[str, Any],
        *,
        location: str,
        default_models: list[str] | None,
    ) -> list[str]:
        return self._models.parse(
            raw.get("models"),
            label=f"case {raw.get('name', '?')!r} in {location}",
            default=default_models,
        )


class ReactCaseRecordParser(CaseRecordParser):
    def parse(
        self,
        raw: dict[str, Any],
        *,
        agent_name: str,
        eval_set: EvalSet,
        default_models: list[str] | None,
    ) -> ReactEvalCase:
        location = f"{eval_set.name}/{agent_name}"
        self.require(raw, "name", "query", location=location)
        return self.build(
            raw,
            agent_name=agent_name,
            eval_set=eval_set,
            name=str(raw["name"]),
            prompt=str(raw["query"]),
            default_models=default_models,
        )

    def build(
        self,
        raw: Mapping[str, Any],
        *,
        agent_name: str,
        eval_set: EvalSet,
        name: str,
        prompt: str,
        default_models: list[str] | None,
    ) -> ReactEvalCase:
        location = f"{eval_set.name}/{agent_name}"
        return ReactEvalCase(
            agent_name=agent_name,
            eval_set=eval_set,
            name=name,
            prompt=prompt,
            expected_answer=dict(raw.get("answer") or raw.get("expected_answer") or {}),
            models=self.models_of(raw, location=location, default_models=default_models),
            expected_tools=list(raw.get("expected_tools") or []),
            expected_total_rounds=int(
                raw.get("expected_total_rounds") or raw.get("total_rounds") or 1
            ),
        )


class DatabotCaseRecordParser(CaseRecordParser):
    def __init__(self, react_parser: ReactCaseRecordParser | None = None) -> None:
        super().__init__()
        self._react = react_parser or ReactCaseRecordParser()

    def parse(
        self,
        raw: dict[str, Any],
        *,
        agent_name: str,
        eval_set: EvalSet,
        default_models: list[str] | None,
    ) -> DatabotEvalCase:
        location = f"{eval_set.name}/{agent_name}"
        self.require(raw, "name", "query", location=location)
        name = str(raw["name"])
        prompt = str(raw["query"])
        models = self.models_of(raw, location=location, default_models=default_models)
        prepare_raw = raw.get("prepare_eval_case")
        if isinstance(prepare_raw, dict):
            prepare = self._stage(
                prepare_raw,
                agent_name=agent_name,
                eval_set=eval_set,
                name=f"{name}.prepare",
                prompt=prompt,
                default_models=models,
            )
        else:
            prepare = self._react.build(
                raw,
                agent_name=agent_name,
                eval_set=eval_set,
                name=name,
                prompt=prompt,
                default_models=models,
            )
        draft_raw = raw.get("draft_eval_case")
        draft = None
        if isinstance(draft_raw, dict):
            draft = self._stage(
                draft_raw,
                agent_name=agent_name,
                eval_set=eval_set,
                name=f"{name}.draft",
                prompt=prompt,
                default_models=models,
            )
        return DatabotEvalCase(
            agent_name=agent_name,
            eval_set=eval_set,
            name=name,
            prompt=prompt,
            expected_answer=dict(raw.get("answer") or raw.get("expected_answer") or {}),
            models=models,
            prepare_eval_case=prepare,
            draft_eval_case=draft,
            expected_table_cards=[
                str(item).strip()
                for item in (raw.get("expected_table_cards") or [])
                if str(item).strip()
            ],
        )

    def _stage(
        self,
        raw: Mapping[str, Any],
        *,
        agent_name: str,
        eval_set: EvalSet,
        name: str,
        prompt: str,
        default_models: list[str],
    ) -> ReactEvalCase:
        return self._react.build(
            raw,
            agent_name=agent_name,
            eval_set=eval_set,
            name=str(raw.get("name") or name),
            prompt=str(raw.get("query") or prompt),
            default_models=default_models,
        )


class IntentionCaseRecordParser(CaseRecordParser):
    def parse(
        self,
        raw: dict[str, Any],
        *,
        agent_name: str,
        eval_set: EvalSet,
        default_models: list[str] | None,
    ) -> IntentionEvalCase:
        location = f"{eval_set.name}/{agent_name}"
        self.require(raw, "name", "query", "expected_status", location=location)
        return IntentionEvalCase(
            agent_name=agent_name,
            eval_set=eval_set,
            name=str(raw["name"]),
            prompt=str(raw["query"]),
            expected_answer=dict(raw.get("answer") or raw.get("expected_answer") or {}),
            models=self.models_of(raw, location=location, default_models=default_models),
            expected_status=str(raw["expected_status"]),
            expected_intentions=list(raw.get("expected_intentions") or []),
            expected_routes=list(raw.get("expected_routes") or []),
        )


class CaseLoader:
    """Read ``{case_root}/{eval_set}/{agent}.json`` into cases keyed by agent then model."""

    def __init__(
        self,
        case_root: str | Path,
        agent_models: Mapping[str, str | Sequence[str]],
        *,
        catalog: CaseTypeCatalog | None = None,
        eval_sets: EvalSetCatalog | None = None,
    ) -> None:
        self.case_root_dir = Path(case_root)
        self.agent_models = {
            agent: self._as_models(models) for agent, models in agent_models.items()
        }
        self.catalog = catalog or CaseTypeCatalog()
        self.eval_sets = eval_sets or EvalSetCatalog()
        self._parsers: dict[type[EvalCase], CaseRecordParser] = {
            ReactEvalCase: ReactCaseRecordParser(),
            DatabotEvalCase: DatabotCaseRecordParser(),
            IntentionEvalCase: IntentionCaseRecordParser(),
        }

    def load(
        self,
        agents: set[str],
        models: set[str],
        eval_set: set[str],
    ) -> dict[str, dict[str, list[EvalCase]]]:
        loaded: dict[str, dict[str, list[EvalCase]]] = {}
        for group in eval_set:
            slice_ = self.eval_sets.resolve(group)
            set_dir = self.case_root_dir / slice_.name
            if not set_dir.is_dir():
                raise FileNotFoundError(
                    f"eval_set directory not found: {set_dir} "
                    f"(expected one of: {', '.join(self.eval_sets.canonical_names())})"
                )
            for agent, agent_model_list in self.agent_models.items():
                if agent not in agents:
                    continue
                path = set_dir / f"{agent}.json"
                if not path.is_file():
                    continue
                case_type = self.catalog.case_type_for(agent)
                parser = self._parsers[case_type]
                case_file = CaseFile(path)
                file_models = case_file.default_models()
                default_models = (
                    file_models if file_models is not None else list(agent_model_list)
                )
                for raw in case_file.records():
                    if not isinstance(raw, dict):
                        raise ValueError(
                            f"case in {slice_.name}/{agent} must be an object"
                        )
                    case = parser.parse(
                        raw,
                        agent_name=agent,
                        eval_set=slice_,
                        default_models=default_models,
                    )
                    for model_name in agent_model_list:
                        if model_name not in models or not case.allows_model(model_name):
                            continue
                        loaded.setdefault(agent, {}).setdefault(model_name, []).append(case)
        return loaded

    def list_eval_sets(self) -> list[str]:
        names = [
            name
            for name in self.eval_sets.canonical_names()
            if (self.case_root_dir / name).is_dir()
        ]
        return sorted(names)

    def _as_models(self, models: str | Sequence[str]) -> list[str]:
        if isinstance(models, str):
            names = [models.strip()] if models.strip() else []
        else:
            names = [str(item).strip() for item in models if str(item).strip()]
        if not names:
            raise ValueError("agent_models values must be a non-empty model name or list")
        return names

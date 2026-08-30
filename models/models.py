from __future__ import annotations

import os
import tomllib
from functools import lru_cache
from pathlib import Path
from typing import Any

from langchain.chat_models import init_chat_model
from langchain_core.language_models import BaseChatModel
from pydantic import BaseModel, Field

_CONFIG_PATH = Path(__file__).resolve().parent / "models.toml"

DEFAULT_TEMPERATURE = 0.5
DEFAULT_MAX_TOKENS = 8192
DEFAULT_TIMEOUT = 120
DEFAULT_MAX_RETRIES = 3


class ModelConfig(BaseModel):
    base_url: str
    provider: str
    api_key: str = ""
    api_key_env: str | None = None
    temperature: float = DEFAULT_TEMPERATURE
    max_tokens: int = DEFAULT_MAX_TOKENS
    timeout_seconds: int = DEFAULT_TIMEOUT
    max_retries: int = DEFAULT_MAX_RETRIES
    kwargs: dict[str, Any] = Field(default_factory=dict)


def _resolve_api_key(model_config: ModelConfig) -> str:
    if model_config.api_key_env:
        env_value = os.environ.get(model_config.api_key_env, "").strip()
        if env_value:
            return env_value
    if model_config.api_key.strip():
        return model_config.api_key.strip()
    env_hint = model_config.api_key_env or "api_key"
    raise ValueError(
        f"Missing API key for model provider={model_config.provider!r}; "
        f"set environment variable {env_hint!r} or models.toml api_key"
    )


def get_model(model_name: str, model_config: ModelConfig) -> BaseChatModel:
    return init_chat_model(
        model=model_name,
        model_provider=model_config.provider,
        api_key=_resolve_api_key(model_config),
        temperature=model_config.temperature,
        max_tokens=model_config.max_tokens,
        timeout=model_config.timeout_seconds,
        max_retries=model_config.max_retries,
        base_url=model_config.base_url,
        **model_config.kwargs,
    )


def get_model_by_name(model_name: str) -> BaseChatModel:
    """Build the named chat model from the registered ``ModelConfig``s.

    Raises ``KeyError`` (with a friendly message) when the name is
    unknown; raises the same error as ``get_model`` if instantiation
    fails (e.g. missing API key).
    """
    if model_name not in _model_configs:
        known = ", ".join(sorted(_model_configs))
        raise KeyError(
            f"Unknown model {model_name!r}; known models: {known}"
        )
    return get_model(model_name, _model_configs[model_name])


@lru_cache(maxsize=1)
def _load_registry() -> tuple[str, dict[str, ModelConfig]]:
    """Read models.toml and return the default name + a name -> ``ModelConfig`` map.

    We intentionally do **not** call ``get_model`` here. Instantiating a
    chat model pulls an HTTP-capable client and validates the API key at
    construction time. That made ``models`` import-time eager: a single
    model with a missing key would crash the whole registry and break
    ``langgraph dev`` even when the user had a *different* model with a
    valid key. Now ``default_model`` is built lazily on first access.
    """
    with _CONFIG_PATH.open("rb") as f:
        config = tomllib.load(f)

    default_name = config["basic"]["default_model_name"].strip()
    configs: dict[str, ModelConfig] = {}
    for model_name, raw in config["model"].items():
        configs[model_name] = ModelConfig(**raw)

    if default_name and default_name not in configs:
        raise ValueError(
            f"default_model_name={default_name!r} is not defined under [model.*]"
        )

    return default_name, configs


default_model_name, _model_configs = _load_registry()


def _resolve_default_model() -> BaseChatModel:
    """Build the configured default chat model, lazily.

    Tries ``[basic].default_model_name`` first; if its key is missing
    or instantiation fails, falls back to the first model in the
    registry whose key is currently set, then to any other model.
    Surfaces the last-seen error if no model can be built.
    """
    errors: list[str] = []
    candidates: list[str] = []
    if default_model_name:
        candidates.append(default_model_name)
    for name in _model_configs:
        if name not in candidates:
            candidates.append(name)

    last_error: Exception | None = None
    for name in candidates:
        cfg = _model_configs[name]
        try:
            return get_model(name, cfg)
        except Exception as exc:  # missing key, init failure, etc.
            last_error = exc
            errors.append(f"{name}: {type(exc).__name__}: {exc}")
            continue

    raise RuntimeError(
        "No chat model could be instantiated. Tried: "
        + "; ".join(errors)
        + (
            f"; last error: {type(last_error).__name__}: {last_error}"
            if last_error
            else ""
        )
    )


# ``default_model`` is a lazy proxy so ``import models`` never blocks on
# a missing API key. Downstream code should still treat it as a
# ``BaseChatModel | None``-style accessor (``agent._graph`` etc.
# already call ``default_model.invoke`` which raises if not built).
default_model: BaseChatModel | None = None


def get_default_model() -> BaseChatModel:
    """Module-level accessor that builds the default model on demand.

    Replaces the previous eager ``default_model`` singleton. Callers
    that previously did ``default_model.invoke(...)`` should now do
    ``get_default_model().invoke(...)`` (or call this at the top of
    their function and cache the result themselves).
    """
    global default_model
    if default_model is None:
        default_model = _resolve_default_model()
    return default_model

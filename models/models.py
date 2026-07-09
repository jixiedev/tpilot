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


@lru_cache(maxsize=1)
def _load_registry() -> tuple[str, dict[str, BaseChatModel]]:
    with _CONFIG_PATH.open("rb") as f:
        config = tomllib.load(f)

    default_name = config["basic"]["default_model_name"].strip()
    models: dict[str, BaseChatModel] = {}

    for model_name, raw in config["model"].items():
        models[model_name] = get_model(model_name, ModelConfig(**raw))

    if default_name and default_name not in models:
        raise ValueError(
            f"default_model_name={default_name!r} is not defined under [model.*]"
        )

    return default_name, models


default_model_name, models = _load_registry()
default_model: BaseChatModel | None = models.get(default_model_name) if default_model_name else None

if default_model is None and models:
    default_model_name = next(iter(models))
    default_model = models[default_model_name]

if default_model is None:
    raise RuntimeError(
        "No chat models configured. Add entries to models/models.toml "
        "and set [basic].default_model_name."
    )

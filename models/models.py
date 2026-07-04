import tomllib
from pathlib import Path
from langchain.chat_models import init_chat_model
from langchain_core.language_models import BaseChatModel

from pydantic import BaseModel

_CONFIG_PATH = Path(__file__).resolve().parent / "models.toml"

default_temperature = 0.5
default_max_tokens = 10000000
default_timeout = 120
default_max_retries = 10

class ModelConfig(BaseModel):
    base_url: str
    provider: str
    api_key: str
    temperature: float
    max_tokens: int
    timeout_seconds: int
    max_retries: int
    kwargs: {}

def get_model(model_name: str, model_config: ModelConfig)-> BaseChatModel:
    return init_chat_model(
        model = model_name,
        model_provider = model_config.provider,
        temperature = model_config.temperature or default_temperature,
        max_tokens = model_config.max_tokens or default_max_tokens,
        timeout = model_config.timeout_seconds or default_timeout,
        max_retries = model_config.max_retries or default_max_retries,
        base_url = model_config.base_url
    )

with open(_CONFIG_PATH, "rb") as f:
    config = tomllib.load(f)

default_model_name = config['basic']['default_model_name']
models = {}
default_model = None
for model_name, model_config in config['model'].items():
    model = get_model(model_name, ModelConfig(**model_config))
    models[model_name] = model
    if model_name == default_model_name:
        default_model = model


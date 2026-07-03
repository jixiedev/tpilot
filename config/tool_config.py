import tomllib
from pathlib import Path

from pydantic import BaseModel

_CONFIG_PATH = Path(__file__).resolve().parent / "tools.toml"


class HiveToolConfig(BaseModel):
    hms_host: str
    hms_port: int


class TrinoToolConfig(BaseModel):
    host: str
    port: int = 8080
    user: str
    catalog: str = "hive"
    schema_name: str = "default"
    http_scheme: str = "https"


class ToolConfig(BaseModel):
    hive: HiveToolConfig
    trino: TrinoToolConfig


with open(_CONFIG_PATH, "rb") as f:
    tool_config = ToolConfig.model_validate(tomllib.load(f))

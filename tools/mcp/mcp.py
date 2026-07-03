import json
import os
import re
from pathlib import Path

from langchain_core.tools import BaseTool
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_mcp_adapters.tools import load_mcp_tools

_CONFIG_PATH = Path(__file__).resolve().parent / "mcp.json"
_ENV_VAR_RE = re.compile(r"\$\{([^}]+)\}")

_client: MultiServerMCPClient | None = None


def _expand_env_vars(value: str) -> str:
    return _ENV_VAR_RE.sub(lambda m: os.environ.get(m.group(1), m.group(0)), value)


def _expand_config(value):
    if isinstance(value, str):
        return _expand_env_vars(value)
    if isinstance(value, dict):
        return {k: _expand_config(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_expand_config(v) for v in value]
    return value


def load_mcp_config() -> dict:
    if not _CONFIG_PATH.exists():
        example = _CONFIG_PATH.with_suffix(".json.example")
        raise FileNotFoundError(
            f"MCP config not found: {_CONFIG_PATH}. "
            f"Copy {example.name} to mcp.json and configure your servers."
        )
    with open(_CONFIG_PATH) as f:
        return _expand_config(json.load(f))


def get_client() -> MultiServerMCPClient:
    global _client
    if _client is None:
        _client = MultiServerMCPClient(load_mcp_config())
    return _client


async def get_mcp_tools() -> list[BaseTool]:
    """Load tools from all configured MCP servers (stateless, one session per call)."""
    return await get_client().get_tools()


async def get_tools_for_server(server_name: str) -> list[BaseTool]:
    """Load tools from a single MCP server using a persistent session."""
    client = get_client()
    async with client.session(server_name) as session:
        return await load_mcp_tools(session)

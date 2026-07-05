from __future__ import annotations

import json
import logging
import os
import re
from pathlib import Path

from langchain_core.tools import BaseTool
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_mcp_adapters.tools import load_mcp_tools

_CONFIG_PATH = Path(__file__).resolve().parent / "mcp.json"
_ENV_VAR_RE = re.compile(r"\$\{([^}]+)\}")
_logger = logging.getLogger(__name__)

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


def mcp_config_path() -> Path:
    return _CONFIG_PATH


def load_mcp_config() -> dict:
    with mcp_config_path().open(encoding="utf-8") as f:
        return _expand_config(json.load(f))


def get_client() -> MultiServerMCPClient:
    global _client
    if _client is None:
        _client = MultiServerMCPClient(load_mcp_config())
    return _client


async def get_mcp_tools() -> list[BaseTool]:
    """Load MCP tools; return an empty list when config is missing or unreachable."""
    if not mcp_config_path().is_file():
        _logger.info("MCP config not found at %s; skipping MCP tools", _CONFIG_PATH)
        return []

    try:
        return await get_client().get_tools()
    except Exception:
        _logger.exception("Failed to load MCP tools; continuing with Hive/Trino only")
        return []


async def get_tools_for_server(server_name: str) -> list[BaseTool]:
    """Load tools from a single MCP server using a persistent session."""
    client = get_client()
    async with client.session(server_name) as session:
        return await load_mcp_tools(session)

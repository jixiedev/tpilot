from __future__ import annotations

import json
import logging
import os
import re
import sys
from contextlib import asynccontextmanager
from dataclasses import dataclass
from pathlib import Path

from langchain_core.tools import BaseTool
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_mcp_adapters.tools import load_mcp_tools

from config.logging_config import DEFAULT_LOG_FILE

_CONFIG_PATH = Path(__file__).resolve().parent / "mcp.json"
_ENV_VAR_RE = re.compile(r"\$\{([^}]+)\}")
_logger = logging.getLogger(__name__)

_client: MultiServerMCPClient | None = None
_stdio_stderr_redirected = False


@dataclass(frozen=True)
class McpServerStatus:
    """Result of probing one MCP server at startup."""

    name: str
    available: bool
    tool_count: int = 0
    error: str = ""


def _redirect_stdio_server_stderr(log_file: Path = DEFAULT_LOG_FILE) -> None:
    """Send MCP stdio subprocess stderr to the log file instead of the terminal."""
    global _stdio_stderr_redirected
    if _stdio_stderr_redirected:
        return

    import mcp.client.stdio as mcp_stdio

    log_file.parent.mkdir(parents=True, exist_ok=True)
    stderr_sink = log_file.open("a", encoding="utf-8")
    original = mcp_stdio.stdio_client

    @asynccontextmanager
    async def stdio_client(server, errlog=sys.stderr):
        target = stderr_sink if errlog is sys.stderr else errlog
        async with original(server, errlog=target) as streams:
            yield streams

    mcp_stdio.stdio_client = stdio_client
    _stdio_stderr_redirected = True


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
        config = _expand_config(json.load(f))
    return _quiet_stdio_servers(config)


def _quiet_stdio_servers(config: dict) -> dict:
    """Reduce uv/MCP subprocess noise on the terminal."""
    servers = config.get("mcpServers")
    if not isinstance(servers, dict):
        return config
    for server in servers.values():
        if not isinstance(server, dict) or server.get("transport") != "stdio":
            continue
        env = server.get("env")
        if env is None:
            server["env"] = {"UV_NO_PROGRESS": "1"}
        elif isinstance(env, dict):
            env.setdefault("UV_NO_PROGRESS", "1")
    return config


def get_client() -> MultiServerMCPClient:
    global _client
    if _client is None:
        _redirect_stdio_server_stderr()
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


def configured_mcp_server_names() -> list[str]:
    """Return MCP server names from config, or an empty list when unset."""
    if not mcp_config_path().is_file():
        return []
    config = load_mcp_config()
    servers = config.get("mcpServers")
    if not isinstance(servers, dict):
        return []
    return sorted(name for name in servers if isinstance(name, str) and name.strip())


async def check_mcp_servers() -> list[McpServerStatus]:
    """Probe each configured MCP server by opening a session and listing tools."""
    names = configured_mcp_server_names()
    if not names:
        return []

    statuses: list[McpServerStatus] = []
    for name in names:
        try:
            tools = await get_tools_for_server(name)
        except Exception as exc:
            _logger.warning("MCP server %s unavailable: %s", name, exc)
            statuses.append(
                McpServerStatus(name=name, available=False, error=str(exc).strip() or type(exc).__name__)
            )
            continue
        statuses.append(McpServerStatus(name=name, available=True, tool_count=len(tools)))
    return statuses


def format_mcp_startup_lines(statuses: list[McpServerStatus]) -> list[str]:
    """Human-readable MCP availability summary for CLI startup."""
    if not statuses:
        path = mcp_config_path()
        if not path.is_file():
            return [f"MCP: not configured ({path})"]
        return [f"MCP: no servers in config ({path})"]

    lines = ["MCP servers:"]
    for status in statuses:
        if status.available:
            lines.append(f"  {status.name}: ok ({status.tool_count} tools)")
            continue
        detail = status.error or "unavailable"
        if len(detail) > 120:
            detail = detail[:117] + "..."
        lines.append(f"  {status.name}: unavailable ({detail})")
    return lines

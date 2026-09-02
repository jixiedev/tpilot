from __future__ import annotations

from threading import local

from hmsclient import HMSClient
from langchain.tools import tool

from config.tool_config import tool_config
from tools.common import alternative_tool, bind_tool_to_agent

_thread_local = local()


def get_client() -> HMSClient:
    client = getattr(_thread_local, "client", None)
    if client is None:
        client = HMSClient(
            host=tool_config.hive.hms_host,
            port=tool_config.hive.hms_port,
        )
        client.open()
        _thread_local.client = client
    return client


@bind_tool_to_agent("databot,default")
@tool
@alternative_tool("trino_list_tables")
def hive_list_tables(database: str) -> list[str]:
    """List all table names in a Hive database via HMS."""
    return get_client().get_all_tables(database)


@bind_tool_to_agent("databot,default")
@bind_tool_to_agent("databot,sql")
@tool
@alternative_tool("trino_desc_table")
def hive_desc_table(database: str, table: str):
    """Describe a Hive table schema via HMS."""
    return get_client().get_table(database, table)


TOOLS = [hive_list_tables, hive_desc_table]

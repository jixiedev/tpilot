from langchain.tools import tool
from threading import local
from hmsclient import HMSClient
from config.tool_config import tool_config

_thread_local = local()


def get_client():
    client = getattr(_thread_local, "client", None)
    if client is None:
        client = HMSClient(host=tool_config.hive.hms_host, port=tool_config.hive.hms_port)
        client.open()
        _thread_local.client = client
    return client


@tool
def list_tables(database: str):
    client = get_client()
    return client.get_all_tables(database)


@tool
def desc_table(database: str, table: str):
    client = get_client()
    table_obj = client.get_table(database, table)
    return table_obj

TOOLS = [list_tables, desc_table]
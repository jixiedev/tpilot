from __future__ import annotations

from unittest.mock import MagicMock, patch

from tools.data.hive import hive_desc_table, hive_list_tables


@patch("tools.data.hive.get_client")
def test_hive_list_tables(mock_get_client: MagicMock) -> None:
    client = MagicMock()
    client.get_all_tables.return_value = ["users", "orders"]
    mock_get_client.return_value = client

    result = hive_list_tables.invoke({"database": "analytics"})

    assert result == ["users", "orders"]
    client.get_all_tables.assert_called_once_with("analytics")


@patch("tools.data.hive.get_client")
def test_hive_desc_table(mock_get_client: MagicMock) -> None:
    table_meta = {"tableName": "users", "cols": []}
    client = MagicMock()
    client.get_table.return_value = table_meta
    mock_get_client.return_value = client

    result = hive_desc_table.invoke({"database": "analytics", "table": "users"})

    assert result == table_meta
    client.get_table.assert_called_once_with("analytics", "users")

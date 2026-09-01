"""Provider-safe JSON schema for fetch_related_models."""

from __future__ import annotations

import json

from langchain_core.utils.function_calling import convert_to_openai_function

from tools.rag.semantic import fetch_related_models


def test_fetch_related_models_openai_schema_has_no_literal_or_union_traps() -> None:
    spec = convert_to_openai_function(fetch_related_models)
    params = spec["parameters"]["properties"]

    layer = params["layer"]
    assert layer["type"] == "string"
    assert "const" not in layer

    chunk_type = params["chunk_type"]
    assert chunk_type["type"] == "string"
    assert "enum" not in chunk_type

    assert fetch_related_models.func.__annotations__["return"] is not None
    ret = fetch_related_models.func.__annotations__["return"]
    assert "Union" not in str(ret)


def test_fetch_related_models_tool_call_schema_serializes() -> None:
    schema = fetch_related_models.tool_call_schema.model_json_schema()
    dumped = json.dumps(schema)
    assert "query" in dumped

"""Pydantic 2.13 on Python 3.11 rejects ``typing.TypedDict``; LangGraph and AG-UI still use it."""

from __future__ import annotations

import typing

import typing_extensions

if not getattr(typing, "_tpilot_typed_dict_shim_applied", False):
    typing.TypedDict = typing_extensions.TypedDict  # type: ignore[misc]
    typing._tpilot_typed_dict_shim_applied = True  # type: ignore[attr-defined]

TypedDict = typing_extensions.TypedDict

__all__ = ["TypedDict"]

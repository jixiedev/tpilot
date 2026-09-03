from __future__ import annotations

import pytest

from agent.session import specialist_session_id


def test_specialist_session_id_default_kind() -> None:
    assert specialist_session_id("abc", "databot") == "abc:databot"


def test_specialist_session_id_chain_kind() -> None:
    assert specialist_session_id("abc", 1, kind="chain") == "abc:chain:1"


def test_specialist_session_id_plan_kind() -> None:
    assert (
        specialist_session_id("abc", 2, kind="plan", run="run-1")
        == "abc:plan:run-1:step:2"
    )


def test_specialist_session_id_plan_defaults_run() -> None:
    assert specialist_session_id("abc", 0, kind="plan") == "abc:plan:pending:step:0"


def test_specialist_session_id_unknown_kind() -> None:
    with pytest.raises(ValueError, match="unknown session kind"):
        specialist_session_id("abc", "databot", kind="other")  # type: ignore[arg-type]

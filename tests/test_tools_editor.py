from __future__ import annotations

from pathlib import Path

import pytest

from tools.code.str_replace_editor import (
    EditorError,
    clear_history,
    run_editor,
    str_replace_editor,
)


@pytest.fixture(autouse=True)
def _reset_editor() -> None:
    clear_history()
    yield
    clear_history()


def test_create_writes_file(tmp_path: Path) -> None:
    file = tmp_path / "new.txt"
    result = run_editor("create", str(file), file_text="hello\nworld")
    assert file.read_text() == "hello\nworld"
    assert "File created successfully" in result


def test_create_requires_file_text(tmp_path: Path) -> None:
    with pytest.raises(EditorError, match="file_text"):
        run_editor("create", str(tmp_path / "missing.txt"), file_text=None)


def test_create_rejects_existing_file(tmp_path: Path) -> None:
    file = tmp_path / "exists.txt"
    file.write_text("old")
    with pytest.raises(EditorError, match="already exists"):
        run_editor("create", str(file), file_text="new")


def test_view_file_shows_numbered_lines(tmp_path: Path) -> None:
    file = tmp_path / "view.txt"
    file.write_text("alpha\nbeta")
    result = run_editor("view", str(file))
    assert "cat -n" in result
    assert "     1\talpha" in result
    assert "     2\tbeta" in result


def test_view_file_with_range(tmp_path: Path) -> None:
    file = tmp_path / "range.txt"
    file.write_text("one\ntwo\nthree")
    result = run_editor("view", str(file), view_range=[2, 2])
    assert "     2\ttwo" in result
    assert "     1\tone" not in result
    assert "three" not in result


def test_view_directory_lists_entries(tmp_path: Path) -> None:
    sub = tmp_path / "sub"
    sub.mkdir()
    (tmp_path / "a.txt").write_text("a")
    (sub / "b.txt").write_text("b")
    result = run_editor("view", str(tmp_path))
    assert "a.txt" in result
    assert "sub" in result
    assert "b.txt" in result


def test_str_replace_replaces_unique_match(tmp_path: Path) -> None:
    file = tmp_path / "edit.txt"
    file.write_text("foo bar\nbaz")
    run_editor("str_replace", str(file), old_str="bar", new_str="qux")
    assert file.read_text() == "foo qux\nbaz"


def test_str_replace_fails_when_old_str_missing(tmp_path: Path) -> None:
    file = tmp_path / "nomatch.txt"
    file.write_text("content")
    with pytest.raises(EditorError, match="did not appear"):
        run_editor("str_replace", str(file), old_str="nope", new_str="x")


def test_str_replace_fails_when_old_str_not_unique(tmp_path: Path) -> None:
    file = tmp_path / "dup.txt"
    file.write_text("aa\naa")
    with pytest.raises(EditorError, match="Multiple occurrences"):
        run_editor("str_replace", str(file), old_str="aa", new_str="b")


def test_insert_inserts_at_index(tmp_path: Path) -> None:
    file = tmp_path / "insert.txt"
    file.write_text("line0\nline1")
    run_editor("insert", str(file), new_str="inserted", insert_line=1)
    assert file.read_text() == "line0\ninserted\nline1"


def test_undo_edit_reverts_last_change(tmp_path: Path) -> None:
    file = tmp_path / "undo.txt"
    file.write_text("original")
    run_editor("str_replace", str(file), old_str="original", new_str="changed")
    assert file.read_text() == "changed"
    run_editor("undo_edit", str(file))
    assert file.read_text() == "original"


def test_undo_edit_fails_without_history(tmp_path: Path) -> None:
    file = tmp_path / "nohist.txt"
    file.write_text("x")
    with pytest.raises(EditorError, match="No edit history"):
        run_editor("undo_edit", str(file))


def test_rejects_relative_path() -> None:
    with pytest.raises(EditorError, match="not an absolute path"):
        run_editor("view", "relative.txt")


def test_rejects_unknown_command(tmp_path: Path) -> None:
    file = tmp_path / "cmd.txt"
    file.write_text("x")
    with pytest.raises(EditorError, match="Unrecognized command"):
        run_editor("unknown", str(file))


def test_tool_create_via_invoke(tmp_path: Path) -> None:
    file = tmp_path / "via-tool.txt"
    result = str_replace_editor.invoke(
        {"command": "create", "path": str(file), "file_text": "ok"}
    )
    assert "File created successfully" in result
    assert file.read_text() == "ok"

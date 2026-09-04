"""Local filesystem view/create/replace/insert/undo (Janus StrReplaceEditor)."""

from __future__ import annotations

from collections import defaultdict, deque
from pathlib import Path

from langchain.tools import tool

from config.local_config import ensure_dir
from tools.common import bind_tool_to_agent
from tools.errors import ToolErrorType, register_exception

SNIPPET_LINES = 4
MAX_RESPONSE_LEN = 16_000
TRUNCATED_MESSAGE = (
    "<response clipped><NOTE>To save on context only part of this file has been shown to you. "
    "You should retry this tool after you have searched inside the file with `grep -n` "
    "in order to find the line numbers of what you are looking for.</NOTE>"
)

DESCRIPTION = """\
Custom editing tool for viewing, creating and editing files
* State is persistent across command calls and discussions with the user
* If `path` is a file, `view` displays the result of applying `cat -n`. If `path` is a directory, `view` lists non-hidden files and directories up to 2 levels deep
* The `create` command cannot be used if the specified `path` already exists as a file
* If a `command` generates a long output, it will be truncated and marked with `<response clipped>`
* The `undo_edit` command will revert the last edit made to the file at `path`
Notes for using the `str_replace` command:
* The `old_str` parameter should match EXACTLY one or more consecutive lines from the original file. Be mindful of whitespaces!
* If the `old_str` parameter is not unique in the file, the replacement will not be performed. Make sure to include enough context in `old_str` to make it unique
* The `new_str` parameter should contain the edited lines that should replace the `old_str`
"""

_file_history: dict[str, deque[str]] = defaultdict(deque)


class EditorError(ValueError):
    """Raised when an editor command cannot be applied."""


register_exception(EditorError, error_type=ToolErrorType.UNKNOWN, retryable=False)


def clear_history() -> None:
    _file_history.clear()


def _expand_tabs(text: str) -> str:
    return text.replace("\t", "        ")


def _maybe_truncate(content: str) -> str:
    if len(content) <= MAX_RESPONSE_LEN:
        return content
    return content[:MAX_RESPONSE_LEN] + TRUNCATED_MESSAGE


def _make_output(file_content: str, file_descriptor: str, init_line: int = 1) -> str:
    file_content = _maybe_truncate(_expand_tabs(file_content))
    lines = file_content.split("\n")
    numbered = "\n".join(
        f"{init_line + i:6d}\t{line}" for i, line in enumerate(lines)
    )
    return f"Here's the result of running `cat -n` on {file_descriptor}:\n{numbered}\n"


def _count_occurrences(haystack: str, needle: str) -> int:
    if not needle:
        return 0
    count = 0
    idx = 0
    while True:
        idx = haystack.find(needle, idx)
        if idx < 0:
            return count
        count += 1
        idx += len(needle)


def _is_hidden_in_tree(root: Path, candidate: Path) -> bool:
    if candidate == root:
        return False
    try:
        rel = candidate.relative_to(root)
    except ValueError:
        return False
    return any(part.startswith(".") for part in rel.parts)


def _validate_path(command: str, path: Path) -> None:
    if not path.is_absolute():
        raise EditorError(f"The path {path} is not an absolute path")
    if command == "create":
        if path.exists():
            raise EditorError(
                f"File already exists at: {path}. Cannot overwrite files using command `create`."
            )
        return
    if not path.exists():
        raise EditorError(f"The path {path} does not exist. Please provide a valid path.")
    if path.is_dir() and command != "view":
        raise EditorError(
            f"The path {path} is a directory and only the `view` command can be used on directories"
        )


def _view_directory(path: Path) -> str:
    lines = [
        f"Here's the files and directories up to 2 levels deep in {path}, excluding hidden items:"
    ]
    for candidate in sorted(path.rglob("*")):
        try:
            rel = candidate.relative_to(path)
        except ValueError:
            continue
        if rel.parts and len(rel.parts) > 2:
            continue
        if _is_hidden_in_tree(path, candidate):
            continue
        lines.append(rel.as_posix())
    return _maybe_truncate("\n".join(lines))


def _view_file(path: Path, view_range: list[int] | None) -> str:
    file_content = path.read_text(encoding="utf-8")
    init_line = 1
    if view_range:
        if len(view_range) != 2:
            raise EditorError("Invalid `view_range`. It should be a list of two integers.")
        file_lines = file_content.split("\n")
        n_lines = len(file_lines)
        init, fin = int(view_range[0]), int(view_range[1])
        if init < 1 or init > n_lines:
            raise EditorError(
                f"Invalid `view_range`: first element should be within [1, {n_lines}]"
            )
        if fin != -1 and fin > n_lines:
            raise EditorError(
                f"Invalid `view_range`: second element should be <= {n_lines}"
            )
        if fin != -1 and fin < init:
            raise EditorError("Invalid `view_range`: second element should be >= first")
        end = n_lines if fin == -1 else fin
        file_content = "\n".join(file_lines[init - 1 : end])
        init_line = init
    return _make_output(file_content, str(path), init_line)


def _view(path: Path, view_range: list[int] | None) -> str:
    if path.is_dir():
        if view_range:
            raise EditorError(
                "The `view_range` parameter is not allowed when `path` points to a directory."
            )
        return _view_directory(path)
    return _view_file(path, view_range)


def _create(path: Path, file_text: str | None) -> str:
    if file_text is None:
        raise EditorError("Parameter `file_text` is required for command: create")
    parent = path.parent if path.parent else Path(".")
    # Creating a directory is a blocking syscall; ``ensure_dir`` only calls
    # ``os.mkdir`` when the parent is really missing, so writing into an
    # existing directory stays safe inside the ASGI event loop.
    ensure_dir(parent)
    path.write_text(file_text, encoding="utf-8")
    _file_history[str(path)].append(file_text)
    return f"File created successfully at: {path}"


def _str_replace(path: Path, old_str: str | None, new_str: str | None) -> str:
    if old_str is None:
        raise EditorError("Parameter `old_str` is required for command: str_replace")
    file_content = _expand_tabs(path.read_text(encoding="utf-8"))
    old_expanded = _expand_tabs(old_str)
    new_expanded = _expand_tabs(new_str) if new_str is not None else ""
    occurrences = _count_occurrences(file_content, old_expanded)
    if occurrences == 0:
        raise EditorError(
            f"No replacement was performed, old_str did not appear verbatim in {path}"
        )
    if occurrences > 1:
        line_nums = [
            i + 1
            for i, line in enumerate(file_content.split("\n"))
            if old_expanded in line
        ]
        raise EditorError(
            f"No replacement was performed. Multiple occurrences of old_str in lines {line_nums}"
        )
    new_file_content = file_content.replace(old_expanded, new_expanded, 1)
    path.write_text(new_file_content, encoding="utf-8")
    _file_history[str(path)].append(file_content)

    replacement_line = file_content.split(old_expanded, 1)[0].count("\n")
    new_lines = new_file_content.split("\n")
    inserted = new_expanded.split("\n")
    start = max(0, replacement_line - SNIPPET_LINES)
    end = min(len(new_lines), replacement_line + SNIPPET_LINES + len(inserted))
    snippet = "\n".join(new_lines[start:end])
    return (
        f"The file {path} has been edited. "
        + _make_output(snippet, f"a snippet of {path}", start + 1)
        + "Review the changes and make sure they are as expected. Edit the file again if necessary."
    )


def _insert(path: Path, insert_line: int | None, new_str: str | None) -> str:
    if insert_line is None:
        raise EditorError("Parameter `insert_line` is required for command: insert")
    if new_str is None:
        raise EditorError("Parameter `new_str` is required for command: insert")
    file_text = _expand_tabs(path.read_text(encoding="utf-8"))
    new_expanded = _expand_tabs(new_str)
    file_lines = file_text.split("\n")
    n_lines = len(file_lines)
    if insert_line < 0 or insert_line > n_lines:
        raise EditorError(
            f"Invalid `insert_line`: {insert_line}. It should be within [0, {n_lines}]"
        )
    new_str_lines = new_expanded.split("\n")
    merged = file_lines[:insert_line] + new_str_lines + file_lines[insert_line:]
    snippet_lines = (
        file_lines[max(0, insert_line - SNIPPET_LINES) : insert_line]
        + new_str_lines
        + file_lines[insert_line : min(n_lines, insert_line + SNIPPET_LINES)]
    )
    new_file_text = "\n".join(merged)
    path.write_text(new_file_text, encoding="utf-8")
    _file_history[str(path)].append(file_text)
    return (
        f"The file {path} has been edited. "
        + _make_output(
            "\n".join(snippet_lines),
            "a snippet of the edited file",
            max(1, insert_line - SNIPPET_LINES + 1),
        )
        + "Review the changes and make sure they are as expected. Edit the file again if necessary."
    )


def _undo_edit(path: Path) -> str:
    history = _file_history.get(str(path))
    if not history:
        raise EditorError(f"No edit history found for {path}")
    old_text = history.pop()
    path.write_text(old_text, encoding="utf-8")
    return (
        f"Last edit to {path} undone successfully. "
        + _make_output(old_text, str(path))
    )


def run_editor(
    command: str,
    path: str,
    file_text: str | None = None,
    old_str: str | None = None,
    new_str: str | None = None,
    insert_line: int | None = None,
    view_range: list[int] | None = None,
) -> str:
    original = Path(path).expanduser()
    if not original.is_absolute():
        raise EditorError(f"The path {original} is not an absolute path")
    file_path = original.resolve()
    _validate_path(command, file_path)
    if command == "view":
        return _view(file_path, view_range)
    if command == "create":
        return _create(file_path, file_text)
    if command == "str_replace":
        return _str_replace(file_path, old_str, new_str)
    if command == "insert":
        return _insert(file_path, insert_line, new_str)
    if command == "undo_edit":
        return _undo_edit(file_path)
    raise EditorError(
        f"Unrecognized command '{command}'. Allowed: view, create, str_replace, insert, undo_edit"
    )


@bind_tool_to_agent("databot,default")
@bind_tool_to_agent("knowledge,default")
@bind_tool_to_agent("swe,default")
@tool(description=DESCRIPTION)
def str_replace_editor(
    command: str,
    path: str,
    file_text: str | None = None,
    old_str: str | None = None,
    new_str: str | None = None,
    insert_line: int | None = None,
    view_range: list[int] | None = None,
) -> str:
    """View, create, replace, insert, or undo edits on a local file.

    ``command`` is one of: view, create, str_replace, insert, undo_edit.
    ``path`` must be an absolute file or directory path.
    """
    return run_editor(
        command,
        path,
        file_text=file_text,
        old_str=old_str,
        new_str=new_str,
        insert_line=insert_line,
        view_range=view_range,
    )


TOOLS = [str_replace_editor]

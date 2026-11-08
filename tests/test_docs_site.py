"""Guards for the published docs site.

The site is read by data-team users, not engineers. These tests keep it that way:
no module files, no source snippets, no code-shaped identifiers, and no links that
send a reader off to a file on GitHub.
"""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

import pytest
import yaml

ROOT = Path(__file__).resolve().parent.parent
PAGES = ROOT / "docs_site" / "pages"
DIAGRAMS = PAGES / "assets" / "diagrams"
KEPT_TERMS_DOC = ROOT / "docs_site" / "kept_terms.md"
MKDOCS_CONFIG = ROOT / "mkdocs.yml"

MODULE_FILE = re.compile(r"\.py\b")
IDENTIFIER = re.compile(r"[a-z]+_[a-z_]+|\b[A-Z][a-z]+[A-Z][A-Za-z]*\b|\w+\(\)|\.\w+\(")
GITHUB_FILE_LINK = re.compile(r"https://github\.com/[^/\s]+/[^/\s]+/blob/")
FENCE = re.compile(r"^```(\w*)", re.M)
INLINE_CODE = re.compile(r"`([^`\n]+)`")

SHELL_FENCES = {"", "bash", "sh", "shell", "console", "text"}


class _NavLoader(yaml.SafeLoader):
    """Reads mkdocs.yml, ignoring the python/name tag used by the mermaid fence."""


_NavLoader.add_multi_constructor(
    "tag:yaml.org,2002:python/name:",
    lambda loader, suffix, node: None,
)


def _allowed(text: str) -> bool:
    """True when every code-shaped token in the text is on the kept-terms list."""
    return all(token in KEPT_TERMS for token in IDENTIFIER.findall(text))


def _kept_terms() -> set[str]:
    """Terms the reader pages may keep: product names and agent names."""
    text = KEPT_TERMS_DOC.read_text(encoding="utf-8")
    terms = set(re.findall(r"`([^`\n]+)`", text))
    terms |= {"ReAct", "FastAPI", "CopilotKit", "TahoePilot"}
    return terms


KEPT_TERMS = _kept_terms()


def _nav_entries() -> list[str]:
    config = yaml.load(MKDOCS_CONFIG.read_text(encoding="utf-8"), Loader=_NavLoader)
    entries: list[str] = []

    def walk(node) -> None:
        if isinstance(node, str):
            entries.append(node)
        elif isinstance(node, list):
            for item in node:
                walk(item)
        elif isinstance(node, dict):
            for value in node.values():
                walk(value)

    walk(config["nav"])
    return entries


def _reader_pages() -> list[Path]:
    return sorted(PAGES.rglob("*.md"))


@pytest.fixture(scope="module")
def built_site(tmp_path_factory) -> Path:
    """Build the site the way the workflow does, into a temporary directory."""
    target = tmp_path_factory.mktemp("site")
    result = subprocess.run(
        [sys.executable, "-m", "mkdocs", "build", "--strict", "--site-dir", str(target)],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0, result.stdout + result.stderr
    return target


def test_build_is_strict_clean(built_site: Path) -> None:
    assert (built_site / "index.html").is_file()


def test_nav_entries_resolve() -> None:
    for entry in _nav_entries():
        assert (PAGES / entry).is_file(), f"nav entry has no page: {entry}"


def test_every_page_is_in_the_nav() -> None:
    nav = set(_nav_entries())
    for page in _reader_pages():
        relative = page.relative_to(PAGES).as_posix()
        assert relative in nav, f"page is not reachable from the nav: {relative}"


def test_no_module_names(built_site: Path) -> None:
    offenders = []
    for html in sorted(built_site.rglob("*.html")):
        for number, line in enumerate(html.read_text(encoding="utf-8").splitlines(), 1):
            if MODULE_FILE.search(line):
                offenders.append(f"{html.name}:{number}")
    assert not offenders, f"module names reached the site: {offenders}"


def test_no_source_snippets() -> None:
    offenders = []
    for page in _reader_pages():
        for language in FENCE.findall(page.read_text(encoding="utf-8")):
            if language not in SHELL_FENCES:
                offenders.append(f"{page.name}: {language or '(unlabelled)'}")
    assert not offenders, f"source snippets reached the site: {offenders}"


def test_no_identifier_code_spans() -> None:
    offenders = []
    for page in _reader_pages():
        for number, line in enumerate(page.read_text(encoding="utf-8").splitlines(), 1):
            for span in INLINE_CODE.findall(line):
                if IDENTIFIER.search(span) and not _allowed(span):
                    offenders.append(f"{page.name}:{number}: {span}")
    assert not offenders, f"code-shaped spans reached the site: {offenders}"


def test_no_links_to_files_on_github(built_site: Path) -> None:
    offenders = []
    for html in sorted(built_site.rglob("*.html")):
        for href in re.findall(r'href="([^"]+)"', html.read_text(encoding="utf-8")):
            if GITHUB_FILE_LINK.search(href):
                offenders.append(f"{html.name}: {href}")
    assert not offenders, f"links point at files on GitHub: {offenders}"


def test_diagram_labels_are_reader_facing() -> None:
    offenders = []
    for svg in sorted(DIAGRAMS.glob("*.svg")):
        text = svg.read_text(encoding="utf-8")
        if MODULE_FILE.search(text):
            offenders.append(f"{svg.name}: names a module file")
        for label in re.findall(r">([^<>]+)<", text):
            if IDENTIFIER.search(label) and not _allowed(label):
                offenders.append(f"{svg.name}: {label}")
    assert not offenders, f"diagram labels are not reader-facing: {offenders}"


def test_changelog_is_not_published() -> None:
    assert "changelog" not in "\n".join(_nav_entries())
    assert not list(PAGES.rglob("*changelog*"))


def test_kept_terms_doc_lists_what_the_tests_allow() -> None:
    """The writing rules and the tests must agree on the allow-list."""
    documented = set(re.findall(r"`([^`\n]+)`", KEPT_TERMS_DOC.read_text(encoding="utf-8")))
    missing = sorted(term for term in documented if term not in KEPT_TERMS)
    assert not missing, f"kept terms not allowed by the tests: {missing}"

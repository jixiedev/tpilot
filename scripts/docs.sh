#!/usr/bin/env bash
# Build or preview the GitHub Pages documentation site.
#
# Usage:
#   ./scripts/docs.sh install   # pip install docs_site/requirements.txt
#   ./scripts/docs.sh serve     # http://127.0.0.1:8000 (default)
#   ./scripts/docs.sh build     # write ./site

set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
cd "$ROOT"

cmd="${1:-serve}"

python_bin() {
  if [ -x "$ROOT/.venv/bin/python" ]; then
    echo "$ROOT/.venv/bin/python"
  else
    echo "python3"
  fi
}

mkdocs_bin() {
  if [ -x "$ROOT/.venv/bin/mkdocs" ]; then
    echo "$ROOT/.venv/bin/mkdocs"
  else
    echo "mkdocs"
  fi
}

case "$cmd" in
  install)
    if command -v uv >/dev/null 2>&1; then
      uv sync --extra docs
    else
      "$(python_bin)" -m pip install -r "$ROOT/docs_site/requirements.txt"
    fi
    ;;
  serve)
    "$(mkdocs_bin)" serve
    ;;
  build)
    "$(mkdocs_bin)" build --strict
    ;;
  *)
    echo "Usage: $0 {install|serve|build}" >&2
    exit 2
    ;;
esac

"""``python -m tahoepilot``: the terminal chat (same as the ``tahoepilot`` command)."""

from __future__ import annotations

import tahoepilot.settings.paths  # noqa: F401 — loads .env and the secrets file first
from tahoepilot.cli import main

if __name__ == "__main__":
    main()

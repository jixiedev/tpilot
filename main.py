from __future__ import annotations

import settings.paths  # noqa: F401 — loads .env and the secrets file first
from cli import main

if __name__ == "__main__":
    main()

from __future__ import annotations

import logging
from pathlib import Path

_PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_LOG_FILE = _PROJECT_ROOT / "logs" / "tahoepilot.log"


def configure_logging(
    *,
    log_file: Path | str | None = None,
    verbose: bool = False,
) -> Path:
    """Write logs to a file only; no console handler."""
    path = Path(log_file) if log_file is not None else DEFAULT_LOG_FILE
    path.parent.mkdir(parents=True, exist_ok=True)

    level = logging.DEBUG if verbose else logging.INFO
    handler = logging.FileHandler(path, encoding="utf-8")
    handler.setFormatter(
        logging.Formatter(
            fmt="%(asctime)s %(levelname)s %(name)s: %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
    )
    handler.setLevel(level)

    root = logging.getLogger()
    root.handlers.clear()
    root.setLevel(level)
    root.addHandler(handler)
    return path

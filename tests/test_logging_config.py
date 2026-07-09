from __future__ import annotations

import logging

from config.logging_config import configure_logging


def test_configure_logging_writes_to_file_only(tmp_path) -> None:
    log_file = tmp_path / "test.log"
    path = configure_logging(log_file=log_file, verbose=False)

    assert path == log_file
    root = logging.getLogger()
    assert len(root.handlers) == 1
    assert isinstance(root.handlers[0], logging.FileHandler)

    logger = logging.getLogger("tahoepilot.test")
    logger.info("hello file")

    for handler in root.handlers:
        handler.flush()

    assert "hello file" in log_file.read_text(encoding="utf-8")

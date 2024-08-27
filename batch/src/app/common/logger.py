import logging
from functools import wraps
import sys
from typing import Callable

import structlog
from structlog.contextvars import bound_contextvars


def init_logger(log_level: str):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.CallsiteParameterAdder(
                [
                    structlog.processors.CallsiteParameter.FILENAME,
                    structlog.processors.CallsiteParameter.FUNC_NAME,
                    structlog.processors.CallsiteParameter.LINENO,
                ],
            ),
            structlog.processors.JSONRenderer(ensure_ascii=False),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(
            # TODO: deprecated修正
            logging.getLevelName(log_level),
        ),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=False,
    )


def bind_context(include_args: list[str], **ctx) -> Callable:
    def wrap(fn: Callable):
        @wraps(fn)
        def wrappers(*args, **kwargs):
            bind_ctx = {k: v for k, v in kwargs.items() if k in include_args} | ctx
            with bound_contextvars(**bind_ctx):
                return fn(*args, **kwargs)

        return wrappers

    return wrap

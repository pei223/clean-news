import os
from dataclasses import dataclass
from typing import Any, Literal, Optional


@dataclass
class Config:
    open_api_key: str
    firebase_admin_sdk_credential_file_path: str
    article_max_char_len_for_predict: int
    clean_up_threshold_days: int

    log_level: Literal[
        "CRITICAL",
        "ERROR",
        "WARNING",
        "INFO",
        "DEBUG",
    ]
    debug: bool

    @staticmethod
    def load() -> "Config":
        return Config(
            open_api_key=_get_env_variable("OPENAI_API_KEY"),
            firebase_admin_sdk_credential_file_path=_get_env_variable(
                "FIREBASE_ADMIN_SDK_CREDENTIAL_FILE_PATH"
            ),
            article_max_char_len_for_predict=int(
                _get_env_variable("ARTICLE_MAX_CHAR_LEN_FOR_PREDICT")
            ),
            clean_up_threshold_days=int(_get_env_variable("CLEAN_UP_THRESHOLD_DAYS")),
            debug=_get_env_variable("DEBUG", False),
            log_level=_get_env_variable("LOG_LEVEL", "DEBUG"),
        )


def _get_env_variable(var_name: str, default: Optional[Any] = None) -> Any:
    try:
        return os.environ[var_name]
    except KeyError:
        if default is not None:
            return default
        else:
            raise EnvironmentError(
                f"Required environment variable '{var_name}' not set."
            )

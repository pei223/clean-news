from datetime import datetime, timedelta, timezone

from structlog import get_logger

from app.common.config import Config
from app.common.logger import init_logger
from app.infra.article_repo_impl import FirestoreArticleRepo

config = Config.load()

init_logger(config.log_level)
logger = get_logger()

repo = FirestoreArticleRepo(config.firebase_admin_sdk_credential_file_path)


old_created_at = datetime.now(timezone.utc) + timedelta(days=1)
logger.info("clean articles", old_created_at=old_created_at)
repo.delete_old_by_created_at(old_created_at)
logger.info("clean articles finished", old_created_at=old_created_at)

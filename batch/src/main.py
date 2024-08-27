import time
from datetime import datetime, timedelta, timezone

from structlog import get_logger

from app.common.config import Config
from app.common.logger import init_logger
from app.infra.article_repo_impl import FirestoreArticleRepo
from app.modules.predicts.predictor import Predictor
from app.modules.scraper.scraper import LivedoorNewsScraper

config = Config.load()

init_logger(config.log_level)
logger = get_logger()


scraper = LivedoorNewsScraper()
predictor = Predictor(config.open_api_key, config.article_max_char_len_for_predict)
repo = FirestoreArticleRepo(config.firebase_admin_sdk_credential_file_path)

limit_min_date = datetime.now(timezone.utc) - timedelta(days=1)

logger.info("get summaries", limit_min_date=limit_min_date)
article_summaries = scraper.get_article_summaries(limit_min_date)

for i, article_summary in enumerate(article_summaries):
    logger.info("get detail", idx=i, max_len=len(article_summaries))
    article = scraper.get_article(article_summary)
    logger.info("predict article", idx=i, max_len=len(article_summaries))
    article_with_feature = predictor.memorize_article(article).predict(article)
    logger.debug(
        "predicted",
        article_title=article.title,
        topics=article_with_feature.topics,
        careful_labels=article_with_feature.careful_labels,
    )
    logger.info("save article", idx=i, max_len=len(article_summaries))
    repo.save(article_with_feature, "20240827-1")
    time.sleep(0.5)
logger.info("save finished", limit_min_date=limit_min_date)


old_created_at = datetime.now(timezone.utc) - timedelta(
    days=config.clean_up_threshold_days
)
logger.info("clean old job", old_created_at=old_created_at)
repo.delete_old_by_created_at(old_created_at)
logger.info("clean old job finished", old_created_at=old_created_at)

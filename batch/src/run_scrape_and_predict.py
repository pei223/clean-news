from datetime import datetime, timedelta
from pprint import pprint

from app.modules.predicts.predictor import Predictor
from app.modules.scraper.scraper import LivedoorNewsScraper
from app.common.config import Config

config = Config.load()


scraper = LivedoorNewsScraper()
predictor = Predictor(config.open_api_key, config.article_max_char_len_for_predict)

articles = scraper.get_article_summaries(
    datetime.now() - timedelta(hours=4, minutes=30)
)
pprint(articles)
pprint(len(articles))

article = scraper.get_article(articles[-1])

article_with_feature = predictor.memorize_article(article).predict(article)

pprint(article)
pprint(article_with_feature)

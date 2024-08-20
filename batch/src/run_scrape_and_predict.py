from datetime import datetime, timedelta
from pprint import pprint

from app.modules.predicts.predictor import Predictor
from app.modules.scraper.scraper import LivedoorNewsScraper

scraper = LivedoorNewsScraper()
predictor = Predictor()

articles = scraper.get_article_summaries(
    datetime.now() - timedelta(hours=4, minutes=30)
)
pprint(articles)
pprint(len(articles))

article = scraper.get_article(articles[-1])

article_with_feature = predictor.memorize_article(article).predict(article)

pprint(article)
pprint(article_with_feature)

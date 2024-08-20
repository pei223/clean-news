from dataclasses import dataclass
from datetime import datetime
from hashlib import md5


@dataclass
class Article:
    article_id: str
    title: str
    summary: str
    body: str
    thumbnail_url: str
    url: str
    created_at: datetime

    @staticmethod
    def new(
        title: str,
        summary: str,
        body: str,
        thumbnail_url: str,
        url: str,
        created_at: datetime,
    ) -> "Article":
        # NOTE:
        # タイトルが差し替えられる可能性もあるがそこは考慮しない
        article_id = md5(title.encode()).hexdigest()
        return Article(
            article_id=article_id,
            title=title,
            summary=summary,
            body=body,
            thumbnail_url=thumbnail_url,
            url=url,
            created_at=created_at,
        )


@dataclass
class ArticleWithFeature(Article):
    careful_labels: list[str]
    topics: list[str]

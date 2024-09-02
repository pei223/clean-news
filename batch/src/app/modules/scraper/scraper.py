import time
from dataclasses import asdict, dataclass
from datetime import datetime

import requests
from bs4 import BeautifulSoup, ResultSet, Tag
from structlog import get_logger
from tenacity import retry, stop_after_attempt, wait_random_exponential

from app.common.logger import bind_context
from app.domain.articles import Article

_base_url = "https://news.livedoor.com/topics/category/main/"
_user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36"

_logger = get_logger()


@dataclass
class ArticleSummary:
    title: str
    summary: str
    thumbnail_url: str | None
    url: str
    created_at: datetime

    def to_article(self, body: str, keywords: list[str]) -> Article:
        return Article.new(**asdict(self), body=body, keywords=keywords)


class LivedoorNewsScraper:
    def __init__(self, wait_sec_per_article: float = 1, articles_page_limit=10):
        # 暴走しないための上限
        self._articles_page_limit = articles_page_limit
        self._wait_sec_per_article = wait_sec_per_article

    @bind_context(include_args=["limit_min_date"])
    def get_article_summaries(self, limit_min_date: datetime) -> list[ArticleSummary]:
        finished = False
        articles = []
        page = 1
        while page < self._articles_page_limit and not finished:
            url = f"{_base_url}?p={page}"
            response = self._get_with_retry(url)
            _logger.debug("access news summary page", url=url)

            response.raise_for_status()
            soup = BeautifulSoup(response.text, "html.parser")

            for article_elm in soup.select_one(".articleList").select("li"):
                article = self._parse_article_summary(article_elm)
                if article is None:
                    _logger.info("parsed article is none")
                    continue
                if limit_min_date > article.created_at:
                    # 広告だけ作成日時順に並んでいないため、途中でもそのページ内は実行するようにする
                    finished = True
                    continue
                articles.append(article)
            time.sleep(self._wait_sec_per_article)
            page += 1
        return articles

    def _parse_article_summary(
        self, article_elm: ResultSet[Tag]
    ) -> ArticleSummary | None:
        title_element = article_elm.select_one(".articleListTtl")
        summary_element = article_elm.select_one(".articleListSummary")
        thumbnail_element = article_elm.select_one(".articleListImg img")
        link_element = article_elm.select_one("a")
        created_at_elm = article_elm.select_one(".articleListDate")

        if title_element is None or link_element is None:
            _logger.info("title or link is none")
            return None

        summary = summary_element.get_text(strip=True)
        title = title_element.get_text(strip=True)
        thumbnail_url = None
        if thumbnail_element:
            thumbnail_url = thumbnail_element["src"]
        # 本文を読むボタンを押す前はtopicsで押した後はarticleになるため
        article_url = link_element["href"].replace("topics", "article")
        created_at_str = created_at_elm.get_text(strip=True)
        created_at = datetime.strptime(
            created_at_str + " +09:00", "%Y年%m月%d日 %H時%M分 %z"
        )
        return ArticleSummary(
            title=title,
            summary=summary,
            thumbnail_url=thumbnail_url,
            url=article_url,
            created_at=created_at,
        )

    def get_article(self, article_summary: ArticleSummary) -> Article:
        response = self._get_with_retry(article_summary.url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        body_elm = soup.select_one(".articleBody")
        keywords_elm = soup.select_one(".articleHeadKeyword")
        body = ""
        for body_row in body_elm.select("p"):
            body += body_row.get_text(strip=True)
        keywords = []
        for keyword_elm in keywords_elm.select("a"):
            keywords.append(keyword_elm.get_text(strip=True))
        return article_summary.to_article(body, keywords)

    @retry(
        stop=stop_after_attempt(5), wait=wait_random_exponential(multiplier=1, max=60)
    )
    def _get_with_retry(self, url: str):
        try:
            # 本当はステータスコードによってリトライ考えたほうがいいけど、一時的なもの以外はそうそうないと思うので無条件にしている
            response = requests.get(url, headers={"User-Agent": _user_agent})
            response.raise_for_status()
            return response
        except Exception as e:
            _logger.warn("access error", url=url, status_code=response.status_code)
            raise e

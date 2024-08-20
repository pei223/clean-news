import os
import random
from dataclasses import asdict
from typing import Self

from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.output_parsers import (
    CommaSeparatedListOutputParser,
    StrOutputParser,
)
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_openai import ChatOpenAI
from structlog import get_logger

from app.domain.articles import Article, ArticleWithFeature
from app.domain.parameters import CAREFUL_LABELS, TOPICS
from app.modules.predicts.utils import filter_by_candidates

_logger = get_logger()


_article_input_template = """
このあと以下の記事について質問するので、詳細に記憶してください。
返信は不要なので""と出力してください。
タイトル: {title}
本文
---
{body}
---
"""

_topic_input = f"""
記事の内容で以下の中から一致するトピックを全て選んでください。
選択肢にないものや疑わしいものは絶対に選ばないでください。
[{",".join(TOPICS)}]

回答はCSV形式で教えてください。
"""

_careful_label_input = f"""
記事の内容で以下の中から一致する選択肢を全て選んでください。
選択肢にないものや疑わしいものは絶対に選ばないでください。
[{",".join(CAREFUL_LABELS)}]

回答はCSV形式で教えてください。
一致するものがなければ空文字を出力してください。
"""


class Predictor:
    def __init__(
        self, open_ai_api_key: str, article_max_char_len_for_predict: int
    ) -> None:
        os.environ["OPEN_API_KEY"] = open_ai_api_key
        model = ChatOpenAI(model="gpt-4o-mini")
        self._session_id = str(random.randint(0, 1000000))
        history = InMemoryChatMessageHistory()
        self._memorize_chain = RunnableWithMessageHistory(
            model | StrOutputParser(),
            lambda x: history,
        )
        self._topic_chain = RunnableWithMessageHistory(
            model | CommaSeparatedListOutputParser(),  # type: ignore
            lambda x: history,
        )
        self._careful_label_chain = RunnableWithMessageHistory(
            model | CommaSeparatedListOutputParser(),  # type: ignore
            lambda x: history,
        )
        self._article_max_char_len_for_predict = article_max_char_len_for_predict

    def memorize_article(self, article: Article) -> Self:
        article_input = _article_input_template.format(
            title=article.title,
            body=article.body[: self._article_max_char_len_for_predict],
        )
        memorize_res = self._memorize_chain.invoke(
            article_input, config={"configurable": {"session_id": self._session_id}}
        )
        _logger.debug("memorize res", res=memorize_res)
        return self

    def predict(self, article: Article) -> ArticleWithFeature:
        return ArticleWithFeature(
            **asdict(article),
            topics=self._predict_topics(),
            careful_labels=self._predict_careful_labels(),
        )

    def _predict_topics(self) -> list[str]:
        topic_res = self._topic_chain.invoke(
            _topic_input, config={"configurable": {"session_id": self._session_id}}
        )
        _logger.debug("topics res", res=topic_res)
        return filter_by_candidates(topic_res, TOPICS)

    def _predict_careful_labels(self) -> list[str]:
        careful_labels_res = self._careful_label_chain.invoke(
            _careful_label_input,
            config={"configurable": {"session_id": self._session_id}},
        )
        _logger.debug("careful labels res", res=careful_labels_res)
        return filter_by_candidates(careful_labels_res, CAREFUL_LABELS)

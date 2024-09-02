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

_topic_and_careful_label_input_template = f"""
トピックの一覧を提示します。
この後にニュース記事がどのトピックに合うか複数回質問するので長期間詳細に記憶してください。
返信は不要なので""と出力してください。
---
[{",".join(TOPICS + CAREFUL_LABELS)}]
"""

_article_input_template = """
このあと以下の記事について質問するので、詳細に記憶してください。
返信は不要なので""と出力してください。
タイトル: {title}
キーワード: {keywords}
本文: {body}
"""

_topic_prediction_input = f"""
記事の内容でトピックの中から一致するものを全て選んでください。
選択肢にないものや疑わしいものは絶対に選ばないでください。

回答はCSV形式で教えてください。CSV以外の文字は出力しないでください。
"""

_careful_label_prediction_input = f"""
記事の内容でトピックBの中から一致するものを全て選んでください。
選択肢にないものや疑わしいものは絶対に選ばないでください。

回答はCSV形式で教えてください。CSV以外の文字は出力しないでください。
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
        self._prediction_count = 0

    def memorize_for_init(self):
        memorize_for_init_res = self._memorize_chain.invoke(
            _topic_and_careful_label_input_template,
            config={"configurable": {"session_id": self._session_id}},
        )
        _logger.debug("memorize for init res", res=memorize_for_init_res)
        return self

    def memorize_article(self, article: Article) -> Self:
        if self._prediction_count > 0 and self._prediction_count % 60 == 0:
            # NOTE: 100件あたりから記憶したトピックを忘れるため、再度記憶
            _logger.debug("re-memorize for init", count=self._prediction_count)
            self.memorize_for_init()
        article_input = _article_input_template.format(
            title=article.title,
            body=article.body[: self._article_max_char_len_for_predict],
            keywords=",".join(article.keywords),
        )
        memorize_article_res = self._memorize_chain.invoke(
            article_input, config={"configurable": {"session_id": self._session_id}}
        )
        _logger.debug("memorize article res", res=memorize_article_res)
        return self

    def predict(self, article: Article) -> ArticleWithFeature:
        self._prediction_count += 1
        topic_res = self._topic_chain.invoke(
            _topic_prediction_input,
            config={"configurable": {"session_id": self._session_id}},
        )
        _logger.debug("topics res", res=topic_res)
        return ArticleWithFeature(
            **asdict(article),
            topics=filter_by_candidates(topic_res, TOPICS),
            careful_labels=filter_by_candidates(topic_res, CAREFUL_LABELS),
        )

    def _predict_topics(self) -> list[str]:
        topic_res = self._topic_chain.invoke(
            _topic_prediction_input,
            config={"configurable": {"session_id": self._session_id}},
        )
        _logger.debug("topics res", res=topic_res)
        return filter_by_candidates(topic_res, TOPICS)

    def _predict_careful_labels(self) -> list[str]:
        careful_labels_res = self._careful_label_chain.invoke(
            _careful_label_prediction_input,
            config={"configurable": {"session_id": self._session_id}},
        )
        _logger.debug("careful labels res", res=careful_labels_res)
        return filter_by_candidates(careful_labels_res, CAREFUL_LABELS)

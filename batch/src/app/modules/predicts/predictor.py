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
from langchain_google_genai import ChatGoogleGenerativeAI
from structlog import get_logger

from app.domain.articles import Article, ArticleWithFeature
from app.domain.parameters import CAREFUL_LABELS, TOPICS
from app.modules.predicts.utils import filter_by_candidates
from app.modules.predicts.memory import SaveSwitchableChatMessageHistory

_logger = get_logger()

_topic_and_careful_label_input_template = f"""
トピックの一覧を提示します。
この後にニュース記事がどのトピックに合うか複数回質問するので長期間詳細に記憶してください。
---
[{",".join(TOPICS + CAREFUL_LABELS)}]
"""

_topic_prediction_input = """
記事の内容でトピックの中から一致するものを全て選んでください。最低1件は選んでください。
選択肢にないものや疑わしいものは絶対に選ばないでください。

回答はCSV形式で教えてください。CSV以外の文字は出力しないでください。
---
タイトル: {title}
キーワード: {keywords}
本文: {body}
"""


class Predictor:
    def __init__(
        self, gemini_api_key: str, article_max_char_len_for_predict: int
    ) -> None:
        os.environ["GOOGLE_API_KEY"] = gemini_api_key
        model = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
        self._session_id = str(random.randint(0, 1000000))
        self._history = SaveSwitchableChatMessageHistory()
        self._memorize_chain = RunnableWithMessageHistory(
            model | StrOutputParser(),
            lambda x: self._history,
        )
        self._topic_chain = RunnableWithMessageHistory(
            model | CommaSeparatedListOutputParser(),  # type: ignore
            lambda x: self._history,
        )
        self._article_max_char_len_for_predict = article_max_char_len_for_predict

    def memorize_for_init(self):
        self._history.save_memory_mode()
        memorize_for_init_res = self._memorize_chain.invoke(
            _topic_and_careful_label_input_template,
            config={"configurable": {"session_id": self._session_id}},
        )
        _logger.info("memorize for init res", res=memorize_for_init_res)
        self._history.disable_save_memory_mode()
        return self

    def predict(self, article: Article) -> ArticleWithFeature:
        _logger.debug("debug output history", messages=self._history.messages)
        input_for_prediction = _topic_prediction_input.format(
            title=article.title,
            body=article.body[: self._article_max_char_len_for_predict],
            keywords=",".join(article.keywords),
        )
        topic_res = self._topic_chain.invoke(
            input_for_prediction,
            config={"configurable": {"session_id": self._session_id}},
        )

        if self._is_topics_empty(topic_res) or self._too_many_topics(topic_res):
            # たまに大量にトピック選択されたり空だったり変な返答があるので1度だけやり直す
            _logger.info("too many topics or empty topics. retry", res=topic_res)
            topic_res = self._topic_chain.invoke(
                input_for_prediction,
                config={"configurable": {"session_id": self._session_id}},
            )

        _logger.debug("topics res", res=topic_res, article_title=article.title)
        return ArticleWithFeature(
            **asdict(article),
            topics=filter_by_candidates(topic_res, TOPICS),
            careful_labels=filter_by_candidates(topic_res, CAREFUL_LABELS),
        )

    def _is_topics_empty(self, res: list[str]) -> bool:
        return len(res) == 0

    def _too_many_topics(self, res: list[str]) -> bool:
        # 閾値は経験則
        return len(res) > 20

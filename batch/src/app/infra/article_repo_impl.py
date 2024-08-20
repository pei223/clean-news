import os
from dataclasses import asdict
from datetime import datetime

import firebase_admin
from firebase_admin import credentials, firestore
from structlog import get_logger

from app.domain.article_repo import IArticleRepo
from app.domain.articles import ArticleWithFeature

_logger = get_logger()


class FirestoreArticleRepo(IArticleRepo):
    def __init__(self, firebase_admin_sdk_credential_file_path: str):
        # Firebase Admin SDKの初期化
        cred = credentials.Certificate(
            f"{os.getcwd()}/{firebase_admin_sdk_credential_file_path}"
        )
        firebase_admin.initialize_app(cred)

        # Firestoreクライアントの作成
        self._db = firestore.client()
        self._collection_name = "news-articles"

    def _transfer_article_for_firestore(self, article: ArticleWithFeature) -> dict:
        ret_dict = asdict(article)
        ret_dict["body"] = ret_dict["body"][
            :100
        ]  # firestoreに保存する都合上あまり長い文字列を入れたくないので
        return ret_dict

    def save(self, article: ArticleWithFeature):
        article_ref = self._db.collection(self._collection_name).document(
            article.article_id
        )
        article_ref.set(self._transfer_article_for_firestore(article))

    def delete_old_by_created_at(self, created_at: datetime):
        batch = self._db.batch()
        article_ref = self._db.collection(self._collection_name)
        q = article_ref.where("created_at", "<", created_at)
        docs = q.stream()
        cnt = 0
        for doc in docs:
            batch.delete(doc.reference)
            cnt += 1
        batch.commit()
        _logger.warn("old articles deleted", count=cnt)

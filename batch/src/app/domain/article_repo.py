from abc import ABC, abstractmethod
from datetime import datetime

from app.domain.articles import ArticleWithFeature


class IArticleRepo(ABC):
    @abstractmethod
    def save(self, article: ArticleWithFeature):
        pass

    @abstractmethod
    def delete_old_by_created_at(self, created_at: datetime):
        pass

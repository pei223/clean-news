import firebase from "firebase/compat/app";
import { db } from "../firebase";
import { Timestamp } from "firebase/firestore";
import { Article } from "../domain/article";

export type ArticleFirestoreRes = {
  article_id: string;
  title: string;
  summary: string;
  body: string;
  url: string;
  thumbnail_url: string;
  created_at: Timestamp;
  topics: string[];
  careful_labels: string[];
  version?: string;
};

const COLLECTION_NAME = "news-articles";

export class ArticleRepo {
  private collectionRef(): firebase.firestore.CollectionReference {
    return db.collection(COLLECTION_NAME);
  }

  async fetchArticles(): Promise<Article[]> {
    const v = await this.collectionRef().get();
    return v.docs.map((v) => {
      const _v = v.data() as ArticleFirestoreRes;
      return {
        articleId: _v.article_id,
        title: _v.title,
        summary: _v.summary,
        body: _v.body,
        url: _v.url,
        thumbnailUrl: _v.thumbnail_url,
        createdAt: _v.created_at.toDate(),
        topics: _v.topics,
        carefulLabels: _v.careful_labels,
        version: _v.version,
      } as Article;
    });
  }
}

import { useEffect, useState } from "react";
import { ArticleRepo } from "../repos/articleRepo";
import Layout from "../components/layout";
import {
  Article,
  BlockedArticleVisibility,
  SortKinds,
  filterAndSortArticles,
} from "../domain/article";
import { ArticleRow } from "../components/articles/ArticleRow";
import { Divider } from "@mui/material";
import { FilterForm } from "../components/articles/FilterForm";

export const IndexPage = () => {
  const [blockedArticleVisibility, setBlockedArticleVisibility] =
    useState<BlockedArticleVisibility>("remove");
  const [filterTopics, setFilterTopics] = useState<string[]>([
    "芸能",
    "トレンド",
  ]);
  const [filterCarefulLabels, setCarefulLabels] = useState<string[]>([
    "死去",
    "暴力",
    "不祥事",
  ]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [sortKind, setSortKind] = useState<SortKinds>("created-at-desc");

  useEffect(() => {
    new ArticleRepo().fetchArticles().then((result: Article[]) => {
      setArticles(
        filterAndSortArticles(
          result,
          filterTopics,
          filterCarefulLabels,
          sortKind,
          blockedArticleVisibility
        )
      );
    });
  }, [sortKind, filterTopics, filterCarefulLabels]);

  return (
    <Layout>
      <FilterForm sortKind={sortKind} onSortKindChange={setSortKind} />
      {articles.map((v) => (
        <div key={v.articleId}>
          <ArticleRow
            filterTopics={filterTopics}
            filterCarefulLabels={filterCarefulLabels}
            article={v}
          />
          <Divider />
        </div>
      ))}
    </Layout>
  );
};

import { useEffect, useState } from "react";
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
import { useArticles } from "../swrs/article";
import LoadingScreen from "../components/common/LoadingScreen";

export const IndexPage = () => {
  const { data: sourceArticles, loading } = useArticles();

  const [blockedArticleVisibility, _setBlockedArticleVisibility] =
    useState<BlockedArticleVisibility>("remove");
  const [filterTopics, _setFilterTopics] = useState<string[]>([
    "芸能",
    "トレンド",
  ]);
  const [filterCarefulLabels, _setCarefulLabels] = useState<string[]>([
    "死去",
    "暴力",
    "不祥事",
  ]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [sortKind, setSortKind] = useState<SortKinds>("created-at-desc");

  useEffect(() => {
    if (sourceArticles == null) {
      return;
    }
    setArticles(
      filterAndSortArticles(
        sourceArticles,
        filterTopics,
        filterCarefulLabels,
        sortKind,
        blockedArticleVisibility
      )
    );
  }, [
    sourceArticles,
    sortKind,
    filterTopics,
    filterCarefulLabels,
    blockedArticleVisibility,
  ]);

  return (
    <Layout>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
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
        </>
      )}
    </Layout>
  );
};

import { useCallback, useContext, useEffect, useState } from "react";
import Layout from "../components/layout";
import {
  ArticleWithDisplayDisable,
  FilterAndSortCriteria,
  filterAndSortArticles,
} from "../domain/article";
import { ArticleRow } from "../components/articles/ArticleRow";
import { Box, Button, Divider, Pagination } from "@mui/material";
import { FilterForm } from "../components/articles/FilterForm";
import { removeArticlesCache, useArticles } from "../stores/article";
import LoadingScreen from "../components/common/LoadingScreen";
import { useSearchParams } from "react-router-dom";
import { calcMaxPages } from "../utils/viewUtil";
import { usePaginatedData } from "../utils/customHooks";
import { AppContext } from "../App";

export const IndexPage = () => {
  const { developperMode } = useContext(AppContext);
  const { data: sourceArticles, loading, mutate } = useArticles();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const countPerPage = Number(searchParams.get("countPerPage")) || 10;

  const [criteria, setCriteria] = useState<FilterAndSortCriteria>({
    blockedArticleVisibility: "remove",
    filterTopics: ["芸能", "トレンド"],
    filterCarefulLabels: ["死去", "暴力", "不祥事"],
    sortKind: "created-at-desc",
  });

  const [articles, setArticles] = useState<ArticleWithDisplayDisable[]>([]);

  const paginatedData = usePaginatedData(articles, page, countPerPage);

  useEffect(() => {
    if (sourceArticles == null) {
      return;
    }
    const filteredArticles = filterAndSortArticles(sourceArticles, criteria);
    setArticles(filteredArticles);
  }, [sourceArticles, criteria, page, countPerPage]);

  const setPage = useCallback(
    (newPage: number) => {
      searchParams.set("page", newPage.toString());
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  return (
    <Layout>
      {loading ? (
        <LoadingScreen />
      ) : (
        <Box
          sx={{
            marginTop: 2,
            marginBottom: "160px",
          }}
        >
          {developperMode && (
            <Button
              onClick={() => {
                removeArticlesCache();
                mutate();
              }}
              variant="contained"
            >
              Clear cache
            </Button>
          )}
          <FilterForm
            criteria={criteria}
            onCriteriaChange={(v) => setCriteria(v)}
          />
          <Box
            component="section"
            sx={{
              marginBottom: 4,
            }}
          >
            {paginatedData.map((v) => (
              <div key={v.articleId}>
                <ArticleRow
                  article={v}
                  showPredictionVersion={developperMode}
                />
                <Divider />
              </div>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              page={page}
              color="primary"
              onChange={(_, page) => setPage(page)}
              count={calcMaxPages(articles.length, countPerPage)}
            />
          </Box>
        </Box>
      )}
    </Layout>
  );
};

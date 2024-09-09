import useSWR, { SWRConfiguration } from "swr";
import { Article } from "../domain/article";
import { ArticleRepo } from "../repos/articleRepo";
import { ApiHookResult } from "./helper/types";

const articlesFetcher = (): Promise<Article[]> => {
  console.log("fetch articles");
  return new ArticleRepo().fetchArticles();
};

// 6時間
const REFETCH_INTERVAL_SEC = 60 * 60 * 6;

export const useArticles = (
  options?: SWRConfiguration
): ApiHookResult<Article[]> => {
  const { data, error, mutate } = useSWR<Article[]>(
    ["articles"],
    articlesFetcher,
    {
      ...options,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: REFETCH_INTERVAL_SEC * 1000,
      focusThrottleInterval: REFETCH_INTERVAL_SEC * 1000,
    }
  );

  return {
    data,
    loading: !error && !data,
    error,
    mutate,
  };
};

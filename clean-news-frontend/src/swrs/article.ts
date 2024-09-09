import useSWR, { SWRConfiguration } from "swr";
import { Article } from "../domain/article";
import { ArticleRepo } from "../repos/articleRepo";
import { ApiHookResult } from "./helper/types";
import dayjs from "dayjs";
import {
  CacheRecord,
  parseConsideringDate,
  stringifyConsideringDate,
} from "./helper/cache";

const articlesCacheKey = "articles";

const setArticlesToCache = (v: Article[], expiredAt: Date) => {
  const vStr = JSON.stringify(
    {
      expiredAt: expiredAt.getTime(),
      item: v,
    } as CacheRecord<Article[]>,
    stringifyConsideringDate
  );
  localStorage.setItem(articlesCacheKey, vStr);
};

const getArticlesFromCache = (): Article[] | null => {
  const cache = localStorage.getItem(articlesCacheKey);
  if (cache == null) {
    return null;
  }
  const cacheRecord = JSON.parse(cache, parseConsideringDate) as CacheRecord<
    Article[]
  >;
  const expiredAt = dayjs(cacheRecord.expiredAt);
  if (dayjs().isAfter(expiredAt)) {
    return null;
  }
  return cacheRecord.item;
};

const articlesFetcher = async (): Promise<Article[]> => {
  const cacheValue = getArticlesFromCache();
  if (cacheValue == null) {
    console.log("fetch articles from external");
    const v = await new ArticleRepo().fetchArticles();
    setArticlesToCache(v, dayjs().add(REFETCH_HOURS, "hour").toDate());
    return v;
  }
  console.log("fetch articles from cache");
  return cacheValue;
};

const REFETCH_HOURS = 6;

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
      dedupingInterval: REFETCH_HOURS * 60 * 60 * 1000,
      focusThrottleInterval: REFETCH_HOURS * 60 * 60 * 1000,
    }
  );

  return {
    data,
    loading: !error && !data,
    error,
    mutate,
  };
};

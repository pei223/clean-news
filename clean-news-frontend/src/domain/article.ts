import { intersection } from "lodash";

export const validSortKinds = ["created-at-desc", "created-at-asc"] as const;
export type SortKinds = (typeof validSortKinds)[number];

export const validBlockedArticleVisibility = ["remove", "disable"] as const;
export type BlockedArticleVisibility =
  (typeof validBlockedArticleVisibility)[number];

export type Article = {
  articleId: string;
  title: string;
  summary: string;
  body: string;
  url: string;
  thumbnailUrl: string | null;
  createdAt: Date;
  topics: string[];
  carefulLabels: string[];
  version?: string;
};

export function filterAndSortArticles(
  articles: Article[],
  filterTopics: string[],
  filterCarefulLabels: string[],
  sortKind: SortKinds,
  blockedArticleVisibility: BlockedArticleVisibility
): Article[] {
  let v = articles;
  if (blockedArticleVisibility === "remove") {
    v = v.filter(
      (row) =>
        intersection(row.topics, filterTopics).length === 0 &&
        intersection(row.carefulLabels, filterCarefulLabels).length === 0
    );
  }
  switch (sortKind) {
    case "created-at-desc":
      v.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    case "created-at-asc":
      v.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      break;
  }
  return v.filter((r) => r.version === "20240827-6");
}

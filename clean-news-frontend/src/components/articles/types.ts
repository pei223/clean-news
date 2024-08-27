import { BlockedArticleVisibility, SortKinds } from "../../domain/article";

export const sortKindLabel: Record<SortKinds, string> = {
  "created-at-asc": "作成日昇順",
  "created-at-desc": "作成日降順",
};

export const blockedArticleVisibilityLabel: Record<
  BlockedArticleVisibility,
  string
> = {
  remove: "除外",
  disable: "無効表示",
};

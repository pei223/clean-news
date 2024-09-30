import { intersection } from 'lodash'

export const validSortKinds = ['created-at-desc', 'created-at-asc'] as const
export type SortKinds = (typeof validSortKinds)[number]

export const validBlockedArticleVisibility = ['remove', 'disable'] as const
export type BlockedArticleVisibility = (typeof validBlockedArticleVisibility)[number]

export interface Article {
  articleId: string
  title: string
  summary: string
  body: string
  url: string
  thumbnailUrl: string | null
  createdAt: Date
  topics: string[]
  carefulLabels: string[]
  version?: string
}

export interface ArticleWithDisplayDisable extends Article {
  displayDisabled: boolean
}

export interface FilterAndSortCriteria {
  filterTopics: string[]
  filterCarefulLabels: string[]
  sortKind: SortKinds
  blockedArticleVisibility: BlockedArticleVisibility
}

export function filterAndSortArticles(
  articles: Article[],
  criteria: FilterAndSortCriteria,
  predictionVersion?: string,
): ArticleWithDisplayDisable[] {
  let v: ArticleWithDisplayDisable[]

  const blockedByTopics = (row: Article) =>
    intersection(row.topics, criteria.filterTopics).length > 0
  const blockedByCarefulLabels = (row: Article) =>
    intersection(row.carefulLabels, criteria.filterCarefulLabels).length > 0

  if (criteria.blockedArticleVisibility === 'remove') {
    v = articles
      .filter((row) => !blockedByTopics(row) && !blockedByCarefulLabels(row))
      .map((v) => ({
        ...v,
        displayDisabled: false,
      }))
  } else {
    v = articles.map((row) => ({
      ...row,
      displayDisabled: blockedByTopics(row) || blockedByCarefulLabels(row),
    }))
  }

  switch (criteria.sortKind) {
    case 'created-at-desc':
      v.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      break
    case 'created-at-asc':
      v.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      break
  }

  return predictionVersion ? v.filter((r) => r.version === predictionVersion) : v
}

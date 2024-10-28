import { Timestamp } from 'firebase/firestore'
import { BlockedArticleVisibility, SortKinds } from './article'

export interface UserData {
  filterTopics: string[]
  filterCarefulLabels: string[]
  blockedArticleVisibility: BlockedArticleVisibility
  sortKind: SortKinds
  freeKeywords: string[]
  updatedAt: Timestamp
}

export const DefaultUserData: UserData = {
  filterTopics: ['芸能', 'ゴシップ'],
  filterCarefulLabels: ['暴力', '広告'],
  blockedArticleVisibility: 'disable',
  sortKind: 'created-at-desc',
  freeKeywords: [],
  updatedAt: Timestamp.now(),
}

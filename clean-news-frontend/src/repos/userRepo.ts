import firebase from 'firebase/compat/app'
import { db } from '../firebase'
import { Timestamp } from 'firebase/firestore'
import { BlockedArticleVisibility, SortKinds } from '../domain/article'
import { UserData } from '../domain/user'

export type UserFirestoreRes = {
  filter_topics: string[]
  filter_careful_labels: string[]
  blocked_article_visibility: BlockedArticleVisibility
  sort_kind: SortKinds
  free_keywords: string[]
}

export type UserFirestoreData = {
  filter_topics: string[]
  filter_careful_labels: string[]
  blocked_article_visibility: BlockedArticleVisibility
  sort_kind: SortKinds
  free_keywords?: string[]
  updated_at: Timestamp
}

export type UpdateUserDataArgs = Omit<UserData, 'updatedAt'>

const COLLECTION_NAME = 'users'

export class UserRepo {
  private docRef(userId: string): firebase.firestore.DocumentReference {
    return db.collection(COLLECTION_NAME).doc(userId)
  }

  async fetchUserData(userId: string): Promise<UserData | null> {
    const v = await this.docRef(userId).get()
    if (!v.exists) {
      return null
    }
    const data = v.data() as UserFirestoreData
    return {
      filterTopics: data.filter_topics,
      filterCarefulLabels: data.filter_careful_labels,
      blockedArticleVisibility: data.blocked_article_visibility,
      sortKind: data.sort_kind,
      freeKeywords: data.free_keywords || [],
      updatedAt: data.updated_at,
    }
  }

  async saveUserData(userId: string, userData: UpdateUserDataArgs): Promise<UserData> {
    const v: UserFirestoreData = {
      filter_topics: userData.filterTopics,
      filter_careful_labels: userData.filterCarefulLabels,
      blocked_article_visibility: userData.blockedArticleVisibility,
      sort_kind: userData.sortKind,
      free_keywords: userData.freeKeywords,
      updated_at: Timestamp.now(),
    }
    await this.docRef(userId).set(v)
    return { ...userData, updatedAt: v.updated_at }
  }
}

import useSWR, { SWRConfiguration } from 'swr'
import { ApiHookResult } from './swr-helper/types'
import { parseConsideringDate, stringifyConsideringDate } from './swr-helper/cache'
import { DefaultUserData, UserData } from '../domain/user'
import { UpdateUserDataArgs, UserRepo } from '../repos/userRepo'

const userCacheKey = 'userData'

const setUserToCache = (v: UserData) => {
  console.log('save user cache', v)
  const vStr = JSON.stringify(v, stringifyConsideringDate)
  localStorage.setItem(userCacheKey, vStr)
}

export const removeUserCache = () => {
  localStorage.removeItem(userCacheKey)
}

const getUserFromCache = (): UserData | null => {
  const cache = localStorage.getItem(userCacheKey)
  if (cache == null) {
    return null
  }
  const cacheRecord = JSON.parse(cache, parseConsideringDate) as UserData
  return cacheRecord
}

const userFetcher = async ([userId]: [string]): Promise<UserData> => {
  const cacheValue = getUserFromCache()
  if (cacheValue == null) {
    const v = await new UserRepo().fetchUserData(userId)
    console.log('fetch user from external', v)
    if (v == null) {
      console.log('external user data is null')
      setUserToCache(DefaultUserData)
      return DefaultUserData
    }
    setUserToCache(v)
    return v
  }
  console.log('fetch user from cache', cacheValue)
  return cacheValue
}

const REFETCH_HOURS = 6

export const useUserData = (
  userId: string,
  options?: SWRConfiguration,
): ApiHookResult<UserData> => {
  const { data, error, mutate } = useSWR<UserData>([userId], userFetcher, {
    ...options,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: REFETCH_HOURS * 60 * 60 * 1000,
    focusThrottleInterval: REFETCH_HOURS * 60 * 60 * 1000,
  })

  return {
    data,
    loading: !error && !data,
    error,
    mutate,
  }
}

export const updateUserData = async (userId: string, args: UpdateUserDataArgs): Promise<void> => {
  const repo = new UserRepo()
  const data = await repo.saveUserData(userId, args)
  setUserToCache(data)
}

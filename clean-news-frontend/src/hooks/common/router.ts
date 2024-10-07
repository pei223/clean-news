import { useCallback } from 'react'

type QueryValue = string | number | string[]

export function useStateBySearchParams<T extends QueryValue>(
  searchParams: URLSearchParams,
  query: string,
  defaultValue: T,
): [T, (newSearchParams: URLSearchParams, v: T) => URLSearchParams] {
  const queryV = searchParams.get(query) || defaultValue
  const queryValueBySearchParams = (typeof defaultValue === 'number' ? Number(queryV) : queryV) as T

  const updateSearchParams = useCallback((newSearchParams: URLSearchParams, v: T) => {
    newSearchParams.set(query, v.toString())
    return newSearchParams
  }, [])

  return [queryValueBySearchParams, updateSearchParams]
}

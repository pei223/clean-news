import { useCallback } from 'react'

type QueryValue = string | number | string[]

export function useStateBySearchParams<T extends QueryValue>(
  searchParams: URLSearchParams,
  query: string,
  defaultValue: T,
): [T, (newSearchParams: URLSearchParams, v: T) => URLSearchParams] {
  const queryV = searchParams.get(query) || defaultValue
  const queryValueBySearchParams = (typeof defaultValue === 'number' ? Number(queryV) : queryV) as T

  const updateSearchParams = useCallback(
    (newSearchParams: URLSearchParams, v: T) => {
      newSearchParams.set(query, v.toString())
      return newSearchParams
    },
    // queryがないと怒られるがそれ自体を更新するので不要
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return [queryValueBySearchParams, updateSearchParams]
}

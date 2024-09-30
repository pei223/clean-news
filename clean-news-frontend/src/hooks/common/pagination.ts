import { useState, useEffect } from 'react'

export function usePaginatedData<T>(data: T[], page: number, itemsPerPage: number): T[] {
  const [paginatedData, setPaginatedData] = useState<T[]>([])

  useEffect(() => {
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    setPaginatedData(data.slice(start, end))
  }, [data, page, itemsPerPage])

  return paginatedData
}

import { Cache } from 'swr'
import { logger } from '../../utils/logger'

const timestampExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

// providerの初期化前に取得が走るため意味がない
export function localStorageProvider(): Cache {
  const map = new Map(
    JSON.parse(localStorage.getItem('app-cache') || '[]', (_, v) => {
      if (typeof v === 'string' && timestampExp.test(v)) {
        return new Date(v)
      }
      return v
    }),
  )

  // アプリが終了する前に、すべてのデータを `localStorage` に保存します。
  window.addEventListener('beforeunload', () => {
    logger.log('save cache')
    const appCache = JSON.stringify(Array.from(map.entries()), (_, v) => {
      if (v != null && typeof v.toISOString === 'function') {
        return v.toISOString()
      }
      return v
    })
    localStorage.setItem('app-cache', appCache)
  })

  // パフォーマンスのために、書き込みと読み取りには引き続き Map を使用します。
  return map as Cache
}

export type CacheRecord<T> = {
  expiredAt: number
  item: T
}

export function parseConsideringDate(_: unknown, v: unknown): unknown {
  if (typeof v === 'string' && timestampExp.test(v)) {
    return new Date(v)
  }
  return v
}

// JSON.stringifyで使われる想定で、そちらのIFがanyなので
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stringifyConsideringDate(_: unknown, v: any): unknown {
  if (v != null && typeof v.toISOString === 'function') {
    return v.toISOString()
  }
  return v
}

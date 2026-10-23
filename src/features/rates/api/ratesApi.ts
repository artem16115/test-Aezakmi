import { API_BASE_URL, BASE_CURRENCY } from '../config'
import { fetchJson } from './client'
import { ratesResponseSchema, type RatePoint } from './schemas'

interface RatesParams {
  quotes: readonly string[]
  /** 'YYYY-MM-DD'; без `from` API вернёт только последние курсы. */
  from?: string
  /** Группировка ряда (для длинных периодов): точка на неделю вместо точки на день. */
  group?: 'week' | 'month'
}

/** Курсы к USD: GET /v2/rates?base=USD&quotes=EUR,JPY&from=2026-10-12 */
export function fetchRates({ quotes, from, group }: RatesParams, signal?: AbortSignal) {
  const params = new URLSearchParams({ base: BASE_CURRENCY, quotes: quotes.join(',') })
  if (from) params.set('from', from)
  if (group) params.set('group', group)

  return fetchJson<RatePoint[]>(
    `${API_BASE_URL}/rates?${params.toString()}`,
    ratesResponseSchema,
    signal,
  )
}

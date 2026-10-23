import { useQuery } from '@tanstack/react-query'
import { isoDateAgo } from '@/shared/lib/format'
import { fetchRates } from '../api/ratesApi'
import { CURRENCY_CODES, TABLE_HISTORY_DAYS } from '../config'
import { buildRatesTable } from '../lib/table'
import { ratesKeys } from './queryKeys'

/** Курсы для таблицы: ряд за ~10 дней одним запросом → последние курсы и Change. */
export function useRatesTable() {
  return useQuery({
    queryKey: ratesKeys.table,
    queryFn: ({ signal }) =>
      fetchRates(
        { quotes: CURRENCY_CODES, from: isoDateAgo({ days: TABLE_HISTORY_DAYS }) },
        signal,
      ),
    select: buildRatesTable,
  })
}

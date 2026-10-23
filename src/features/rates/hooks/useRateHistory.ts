import { useQuery } from '@tanstack/react-query'
import { isoDateAgo } from '@/shared/lib/format'
import { fetchRates } from '../api/ratesApi'
import { getPeriod, type CurrencyCode, type PeriodId } from '../config'
import { buildRateHistory } from '../lib/history'
import { ratesKeys } from './queryKeys'

/** Ряд выбранной валюты за период — для графика. */
export function useRateHistory(code: CurrencyCode, periodId: PeriodId) {
  const period = getPeriod(periodId)

  return useQuery({
    queryKey: ratesKeys.history(code, periodId),
    queryFn: ({ signal }) =>
      fetchRates({ quotes: [code], from: isoDateAgo(period.offset), group: period.group }, signal),
    select: buildRateHistory,
    // При смене периода старый график остаётся на экране до прихода нового (без мигания пустотой).
    // При смене валюты — нет: показывать чужой ряд под новым заголовком было бы неправдой.
    placeholderData: (previous, previousQuery) =>
      previousQuery?.queryKey[2] === code ? previous : undefined,
  })
}

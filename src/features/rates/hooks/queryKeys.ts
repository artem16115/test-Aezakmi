import type { CurrencyCode, PeriodId } from '../config'

export const ratesKeys = {
  table: ['rates', 'table'] as const,
  history: (code: CurrencyCode, period: PeriodId) => ['rates', 'history', code, period] as const,
}

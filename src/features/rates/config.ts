import aud from 'flag-icons/flags/4x3/au.svg'
import brl from 'flag-icons/flags/4x3/br.svg'
import cad from 'flag-icons/flags/4x3/ca.svg'
import chf from 'flag-icons/flags/4x3/ch.svg'
import cny from 'flag-icons/flags/4x3/cn.svg'
import eur from 'flag-icons/flags/4x3/eu.svg'
import gbp from 'flag-icons/flags/4x3/gb.svg'
import jpy from 'flag-icons/flags/4x3/jp.svg'

export const API_BASE_URL = 'https://api.frankfurter.dev/v2'

/** Базовая валюта: «Course» = сколько единиц валюты за 1 USD. */
export const BASE_CURRENCY = 'USD'

/**
 * Валюты таблицы (как в макете). Чтобы добавить валюту — код ISO 4217 и флаг из flag-icons.
 * BGN из макета заменён на CNY: Болгария с 01.01.2026 перешла на евро и Frankfurter больше не отдаёт BGN.
 * Флаги импортируются по одному, а не CSS-ом flag-icons, — иначе в сборку попадут все ~270 флагов.
 */
export const CURRENCIES = [
  { code: 'AUD', flag: aud },
  { code: 'BRL', flag: brl },
  { code: 'CAD', flag: cad },
  { code: 'CHF', flag: chf },
  { code: 'CNY', flag: cny },
  { code: 'EUR', flag: eur },
  { code: 'GBP', flag: gbp },
  { code: 'JPY', flag: jpy },
] as const satisfies readonly { code: string; flag: string }[]

export type CurrencyCode = (typeof CURRENCIES)[number]['code']

export const CURRENCY_CODES: readonly CurrencyCode[] = CURRENCIES.map(({ code }) => code)

/**
 * Бесплатные API отдают один средний курс, поэтому спред имитируем фиксированными коэффициентами
 * (так же посчитаны цифры в макете: Surrender = Course × 1.02, Buy = Course × 0.985).
 */
export const SPREAD = {
  surrender: 1.02,
  buy: 0.985,
} as const

/** Глубина ряда для таблицы: из него берём две последние даты, чтобы посчитать Change. */
export const TABLE_HISTORY_DAYS = 10

export const RATE_DIGITS = 4

/** Компактная таблица рядом с графиком: числа ≥ 100 — с 2 знаками (163.49), остальные — с 4. */
export const COMPACT_LARGE_VALUE = 100
export const COMPACT_LARGE_DIGITS = 2

export interface PeriodConfig {
  id: string
  /** Глубина ряда от сегодняшней даты. */
  offset: { days?: number; months?: number }
  /** Подпись под заголовком панели графика. */
  title: string
  /** Группировка точек ряда в API. */
  group?: 'week'
}

/** Периоды графика. Для года — недельные точки (`group=week`): 53 вместо ~366, вид графика тот же. */
export const PERIODS = [
  { id: '1W', offset: { days: 7 }, title: 'Weekly dynamics' },
  { id: '1M', offset: { months: 1 }, title: 'Monthly dynamics' },
  { id: '3M', offset: { months: 3 }, title: '3-month dynamics' },
  { id: '6M', offset: { months: 6 }, title: '6-month dynamics' },
  { id: '1Y', offset: { months: 12 }, title: 'Yearly dynamics', group: 'week' },
] as const satisfies readonly PeriodConfig[]

export type PeriodId = (typeof PERIODS)[number]['id']

export function getPeriod(id: PeriodId): PeriodConfig {
  return PERIODS.find((period) => period.id === id) ?? PERIODS[0]
}

export const DEFAULT_PERIOD: PeriodId = '1M'

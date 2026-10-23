import type { RatePoint } from '../api/schemas'

export interface ChartPoint {
  date: string
  rate: number
}

export interface RateHistory {
  points: ChartPoint[]
  /** Последний курс периода (крупное значение в панели); null, если ряд пуст. */
  last: number | null
  /** Изменение за период в %: (последнее − первое) / первое × 100. */
  changePercent: number
}

/** Ряд одной валюты → точки графика (по возрастанию даты) и изменение за период. */
export function buildRateHistory(points: readonly RatePoint[]): RateHistory {
  const sorted = points
    .map(({ date, rate }) => ({ date, rate }))
    .sort((a, b) => a.date.localeCompare(b.date))
  const first = sorted.at(0)
  const last = sorted.at(-1)

  return {
    points: sorted,
    last: last?.rate ?? null,
    changePercent: first && last ? ((last.rate - first.rate) / first.rate) * 100 : 0,
  }
}

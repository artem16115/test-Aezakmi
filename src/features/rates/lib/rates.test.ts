import { describe, expect, it } from 'vitest'
import type { RatePoint } from '../api/schemas'
import { buildRateHistory } from './history'
import { buildRatesTable } from './table'

const point = (quote: string, date: string, rate: number): RatePoint => ({
  date,
  base: 'USD',
  quote,
  rate,
})

describe('buildRatesTable', () => {
  // Точки нарочно не по порядку дат — так их может вернуть API.
  const table = buildRatesTable([
    point('EUR', '2026-03-30', 0.9234),
    point('EUR', '2026-03-27', 0.9222),
    point('EUR', '2026-03-26', 0.95),
    point('JPY', '2026-03-27', 151.0),
    point('JPY', '2026-03-26', 151.5),
  ])
  const row = (code: string) => table.rows.find((item) => item.code === code)

  it('Course — курс последней даты, Surrender = ×1.02, Buy = ×0.985', () => {
    const eur = row('EUR')
    expect(eur?.course).toBe(0.9234)
    expect(eur?.surrender).toBeCloseTo(0.941868, 10)
    expect(eur?.buy).toBeCloseTo(0.909549, 10)
  })

  it('Change — разница с предыдущей доступной датой, со знаком, 4 знака', () => {
    expect(row('EUR')?.change).toBe(0.0012)
    expect(row('JPY')?.change).toBe(-0.5)
  })

  it('дата таблицы — самая поздняя дата в ответе', () => {
    expect(table.date).toBe('2026-03-30')
  })

  it('порядок строк — как в конфиге, валюты без данных пропускаются', () => {
    expect(table.rows.map(({ code }) => code)).toEqual(['EUR', 'JPY'])
  })

  it('одна точка — Change 0; пустой ответ — пустая таблица', () => {
    expect(buildRatesTable([point('GBP', '2026-03-30', 0.79)]).rows[0]?.change).toBe(0)
    expect(buildRatesTable([])).toEqual({ date: null, rows: [] })
  })
})

describe('buildRateHistory', () => {
  it('% за период = (последний − первый) / первый × 100, точки по возрастанию даты', () => {
    const history = buildRateHistory([
      point('EUR', '2026-03-30', 0.9234),
      point('EUR', '2026-03-01', 0.9205),
      point('EUR', '2026-03-15', 0.93),
    ])
    expect(history.points.map(({ date }) => date)).toEqual([
      '2026-03-01',
      '2026-03-15',
      '2026-03-30',
    ])
    expect(history.last).toBe(0.9234)
    expect(history.changePercent).toBeCloseTo(0.315, 3)
  })

  it('падение курса — отрицательный процент', () => {
    const history = buildRateHistory([
      point('JPY', '2026-03-01', 160),
      point('JPY', '2026-03-30', 152),
    ])
    expect(history.changePercent).toBeCloseTo(-5, 10)
  })

  it('пустой ряд — нет значения и 0%', () => {
    expect(buildRateHistory([])).toEqual({ points: [], last: null, changePercent: 0 })
  })
})

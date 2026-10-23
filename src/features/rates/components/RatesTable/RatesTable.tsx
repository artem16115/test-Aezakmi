import type { KeyboardEvent } from 'react'
import { clsx } from 'clsx'
import { formatSigned, formatTime } from '@/shared/lib/format'
import {
  COMPACT_LARGE_DIGITS,
  COMPACT_LARGE_VALUE,
  RATE_DIGITS,
  type CurrencyCode,
} from '../../config'
import type { RateRow } from '../../lib/table'
import { CurrencyFlag } from '../CurrencyFlag'
import styles from './RatesTable.module.scss'

interface RatesTableProps {
  rows: readonly RateRow[]
  /** Время последнего успешного обновления данных (колонка Time). */
  updatedAt: number
  /** Компактная версия рядом с графиком (2.2): только Currency · Surrender · Buy · Course. */
  compact?: boolean
  selectedCode: CurrencyCode | null
  /** Клик / Enter / Space по строке. Повторный выбор той же строки снимает выделение (решает вызывающий). */
  onSelect: (code: CurrencyCode) => void
}

function changeTone(change: number) {
  if (change > 0) return styles.up
  if (change < 0) return styles.down
  return undefined
}

/**
 * Таблица курсов. Строки свёрстаны CSS grid (равные колонки с общим паддингом строки, как в макете),
 * поэтому роли заданы явно: при смене display браузеры могут терять семантику <table>.
 * Строки выбираемые — это grid с aria-selected (у роли table выбора строк нет).
 * Планшет — без колонки Time; мобилка — строки-карточки, шапка только для скринридеров.
 */
export function RatesTable({
  rows,
  updatedAt,
  compact = false,
  selectedCode,
  onSelect,
}: RatesTableProps) {
  const time = formatTime(updatedAt)
  const formatRate = (value: number) =>
    value.toFixed(compact && value >= COMPACT_LARGE_VALUE ? COMPACT_LARGE_DIGITS : RATE_DIGITS)

  const handleKeyDown = (event: KeyboardEvent, code: CurrencyCode) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(code)
    }
  }

  return (
    <table
      className={clsx(styles.table, compact && styles.compact)}
      role="grid"
      aria-label="Exchange rates to USD"
    >
      <thead role="rowgroup">
        <tr role="row" className={clsx(styles.row, styles.headRow)}>
          <th role="columnheader" scope="col">
            Currency
          </th>
          <th role="columnheader" scope="col">
            Surrender
          </th>
          <th role="columnheader" scope="col">
            Buy
          </th>
          <th role="columnheader" scope="col">
            Course
          </th>
          {!compact && (
            <>
              <th role="columnheader" scope="col">
                Change
              </th>
              <th role="columnheader" scope="col" className={styles.time}>
                Time
              </th>
            </>
          )}
        </tr>
      </thead>
      <tbody role="rowgroup">
        {rows.map((row) => {
          const selected = row.code === selectedCode
          return (
            <tr
              key={row.code}
              role="row"
              tabIndex={0}
              aria-selected={selected}
              className={clsx(styles.row, styles.bodyRow, selected && styles.selected)}
              onClick={() => {
                onSelect(row.code)
              }}
              onKeyDown={(event) => {
                handleKeyDown(event, row.code)
              }}
            >
              <th role="rowheader" scope="row" className={styles.currency}>
                <CurrencyFlag src={row.flag} size={compact ? 'xs' : 'sm'} />
                {row.code}
              </th>
              <td role="gridcell" className={styles.surrender} data-label="Surrender">
                {formatRate(row.surrender)}
              </td>
              <td role="gridcell" className={styles.buy} data-label="Buy">
                {formatRate(row.buy)}
              </td>
              <td role="gridcell" className={styles.course}>
                {formatRate(row.course)}
              </td>
              {!compact && (
                <>
                  <td role="gridcell" className={clsx(styles.change, changeTone(row.change))}>
                    {formatSigned(row.change, RATE_DIGITS)}
                  </td>
                  <td role="gridcell" className={styles.time}>
                    {time}
                  </td>
                </>
              )}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

import { clsx } from 'clsx'
import { PERIODS, type PeriodId } from '../../config'
import styles from './PeriodTabs.module.scss'

interface PeriodTabsProps {
  value: PeriodId
  onChange: (period: PeriodId) => void
}

/** Переключатель периода графика: группа кнопок-переключателей (aria-pressed). */
export function PeriodTabs({ value, onChange }: PeriodTabsProps) {
  return (
    <div role="group" aria-label="Chart period" className={styles.tabs}>
      {PERIODS.map(({ id }) => (
        <button
          key={id}
          type="button"
          aria-pressed={id === value}
          className={clsx(styles.tab, id === value && styles.active)}
          onClick={() => {
            onChange(id)
          }}
        >
          {id}
        </button>
      ))}
    </div>
  )
}

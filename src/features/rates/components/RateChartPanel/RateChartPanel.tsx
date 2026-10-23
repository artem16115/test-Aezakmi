import { useId } from 'react'
import { X } from 'lucide-react'
import { clsx } from 'clsx'
import { formatSigned, roundTo } from '@/shared/lib/format'
import { ErrorState, Skeleton } from '@/shared/ui'
import {
  BASE_CURRENCY,
  CURRENCIES,
  RATE_DIGITS,
  getPeriod,
  type CurrencyCode,
  type PeriodId,
} from '../../config'
import { useRateHistory } from '../../hooks/useRateHistory'
import { CurrencyFlag } from '../CurrencyFlag'
import { PeriodTabs } from '../PeriodTabs'
import { RateAreaChart } from '../RateAreaChart'
import styles from './RateChartPanel.module.scss'

interface RateChartPanelProps {
  code: CurrencyCode
  period: PeriodId
  onPeriodChange: (period: PeriodId) => void
  onClose: () => void
  className?: string
}

/** Треугольник ▲/▼ из макета (в lucide нет залитого треугольника нужных пропорций). */
function TrendTriangle({ direction }: { direction: 'up' | 'down' }) {
  return (
    <svg width="13" height="11" viewBox="0 0 13 11" aria-hidden className={styles[direction]}>
      <path d="M6.5 0 13 11H0z" fill="currentColor" />
    </svg>
  )
}

/** Панель динамики курса выбранной валюты к USD за период (макет 2.2). */
export function RateChartPanel({
  code,
  period,
  onPeriodChange,
  onClose,
  className,
}: RateChartPanelProps) {
  const titleId = useId()
  const flag = CURRENCIES.find((currency) => currency.code === code)?.flag
  const { data, error, isPending, isFetching, isPlaceholderData, refetch } = useRateHistory(
    code,
    period,
  )

  let content
  if (data && data.last !== null) {
    // Цвет по округлённому значению: -0.001% показываем как 0.00% и зелёным (≥ 0).
    const trend = roundTo(data.changePercent, 2) >= 0 ? 'up' : 'down'
    content = (
      <>
        <div className={styles.value}>
          <span className={styles.rate}>{data.last.toFixed(RATE_DIGITS)}</span>
          <span className={clsx(styles.change, styles[trend])}>
            <TrendTriangle direction={trend} />
            {`${formatSigned(data.changePercent, 2)}%`}
          </span>
        </div>
        <RateAreaChart points={data.points} trend={trend} dimmed={isPlaceholderData} />
      </>
    )
  } else if (data) {
    content = <p className={styles.empty}>No data available</p>
  } else if (isPending) {
    content = (
      <div className={styles.loading} aria-busy="true" aria-label="Loading chart">
        <Skeleton width={200} height={44} radius={10} />
        <Skeleton height={200} radius={14} />
      </div>
    )
  } else {
    content = (
      <ErrorState
        title="Failed to load exchange rates"
        message={error.message}
        retrying={isFetching}
        onRetry={() => void refetch()}
      />
    )
  }

  return (
    <section className={clsx(styles.panel, className)} aria-labelledby={titleId}>
      <header className={styles.header}>
        <div>
          <h2 id={titleId} className={styles.title}>
            {flag && <CurrencyFlag src={flag} size="md" />}
            {code} / {BASE_CURRENCY}
          </h2>
          <p className={styles.subtitle}>{getPeriod(period).title}</p>
        </div>
        <button type="button" className={styles.close} aria-label="Close chart" onClick={onClose}>
          <X size={18} aria-hidden />
        </button>
      </header>

      {content}

      <PeriodTabs value={period} onChange={onPeriodChange} />
    </section>
  )
}

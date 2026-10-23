import { formatLongDate } from '@/shared/lib/format'
import { Badge, Skeleton, Spinner } from '@/shared/ui'
import styles from './RatesDateBadge.module.scss'

interface RatesDateBadgeProps {
  /** 'YYYY-MM-DD' — дата курсов из ответа API. */
  date: string | null | undefined
  loading: boolean
  /** Фоновое обновление: данные остаются на экране, рядом крутится индикатор. */
  refreshing: boolean
}

export function RatesDateBadge({ date, loading, refreshing }: RatesDateBadgeProps) {
  if (loading) return <Skeleton width={128} height={30} radius={10} />
  if (!date) return null

  return (
    <div className={styles.root}>
      {refreshing && <Spinner size={16} label="Updating rates" className={styles.spinner} />}
      <Badge tone="accent" size="md">
        <time dateTime={date}>{formatLongDate(date)}</time>
      </Badge>
    </div>
  )
}

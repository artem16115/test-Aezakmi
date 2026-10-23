import { clsx } from 'clsx'
import { ErrorState, Skeleton, Spinner } from '@/shared/ui'
import type { CurrencyCode } from '../../config'
import type { useRatesTable } from '../../hooks/useRatesTable'
import { RatesTable } from '../RatesTable'
import styles from './RatesTableCard.module.scss'

const SKELETON_ROWS = 8

interface RatesTableCardProps {
  query: ReturnType<typeof useRatesTable>
  compact: boolean
  selectedCode: CurrencyCode | null
  onSelect: (code: CurrencyCode) => void
}

/** Белая карточка с таблицей курсов и состояниями loading / error / empty. */
export function RatesTableCard({ query, compact, selectedCode, onSelect }: RatesTableCardProps) {
  const { data, error, isPending, isFetching, dataUpdatedAt, refetch } = query

  let content
  if (data) {
    content =
      data.rows.length > 0 ? (
        <RatesTable
          rows={data.rows}
          updatedAt={dataUpdatedAt}
          compact={compact}
          selectedCode={selectedCode}
          onSelect={onSelect}
        />
      ) : (
        <p className={styles.empty}>No data available</p>
      )
  } else if (isPending) {
    content = (
      <div className={styles.skeleton} aria-busy="true">
        <Spinner label="Loading exchange rates" className={styles.srOnly} />
        <Skeleton height={15} width="40%" className={styles.skeletonHead} />
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <div key={index} className={styles.skeletonRow}>
            <Skeleton height={17} />
          </div>
        ))}
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
    <section
      className={clsx(styles.card, compact && styles.compact)}
      aria-label="Exchange rates table"
    >
      {content}
    </section>
  )
}

import { useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import {
  RateChartPanel,
  RatesDateBadge,
  RatesTableCard,
  useRatesSelection,
  useRatesTable,
  type CurrencyCode,
} from '@/features/rates'
import { PageHeader } from '@/shared/layout/PageHeader'
import { DESKTOP_QUERY, useMediaQuery } from '@/shared/lib/useMediaQuery'
import styles from './RatesPage.module.scss'

export function RatesPage() {
  const ratesQuery = useRatesTable()
  const { currency, period, selectCurrency, selectPeriod } = useRatesSelection()
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const panelRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  // Компактная таблица — только в раскладке «таблица | график» на десктопе (2.2).
  const compact = currency !== null && isDesktop

  // Планшет/мобилка: панель над таблицей — после выбора плавно прокручиваем к ней.
  useEffect(() => {
    if (!currency || isDesktop) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    panelRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }, [currency, isDesktop])

  const handleSelect = (code: CurrencyCode) => {
    selectCurrency(code === currency ? null : code)
  }

  // Кнопка X исчезает вместе с панелью — возвращаем фокус на строку закрытой валюты.
  const handleClose = () => {
    const row = tableRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')
    selectCurrency(null)
    row?.focus()
  }

  return (
    <div className={clsx(styles.page, currency && styles.withChart)}>
      <PageHeader
        title="Exchange rates"
        className={styles.header}
        aside={
          <RatesDateBadge
            date={ratesQuery.data?.date}
            loading={ratesQuery.isPending}
            refreshing={ratesQuery.isFetching && !ratesQuery.isPending}
          />
        }
      />
      {currency && (
        // Обёртка есть сразу, даже пока грузится чанк с графиком, — к ней и прокручиваем.
        <div ref={panelRef} className={styles.panel}>
          <RateChartPanel
            code={currency}
            period={period}
            onPeriodChange={selectPeriod}
            onClose={handleClose}
            className={styles.panelFill}
          />
        </div>
      )}
      <div ref={tableRef} className={styles.table}>
        <RatesTableCard
          query={ratesQuery}
          compact={compact}
          selectedCode={currency}
          onSelect={handleSelect}
        />
      </div>
    </div>
  )
}

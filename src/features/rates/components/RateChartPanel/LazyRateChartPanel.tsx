import { lazy, Suspense, type ComponentProps } from 'react'
import { clsx } from 'clsx'
import { Skeleton } from '@/shared/ui'
import styles from './RateChartPanel.module.scss'

// recharts — самая тяжёлая зависимость (~400 kB): грузим панель графика отдельным чанком,
// только когда выбрана валюта. Таблица курсов открывается без неё.
const RateChartPanel = lazy(() =>
  import('./RateChartPanel').then((module) => ({ default: module.RateChartPanel })),
)

type LazyRateChartPanelProps = ComponentProps<typeof RateChartPanel>

/** Заглушка той же высоты, что и панель: без скачка вёрстки и с верной прокруткой к панели на мобилке. */
function PanelFallback({ className }: { className?: string }) {
  return (
    <div className={clsx(styles.panel, className)} aria-busy="true" aria-label="Loading chart">
      <Skeleton width={160} height={44} radius={10} />
      <Skeleton width={200} height={44} radius={10} />
      <Skeleton height={200} radius={14} />
      <Skeleton width={290} height={32} radius={10} />
    </div>
  )
}

export function LazyRateChartPanel(props: LazyRateChartPanelProps) {
  return (
    <Suspense fallback={<PanelFallback className={props.className} />}>
      <RateChartPanel {...props} />
    </Suspense>
  )
}

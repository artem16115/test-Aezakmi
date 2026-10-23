import { Area, AreaChart, Tooltip, XAxis, YAxis, type TooltipContentProps } from 'recharts'
import { clsx } from 'clsx'
import { formatShortDate } from '@/shared/lib/format'
import { RATE_DIGITS } from '../../config'
import type { ChartPoint } from '../../lib/history'
import styles from './RateAreaChart.module.scss'

interface RateAreaChartProps {
  points: readonly ChartPoint[]
  trend: 'up' | 'down'
  /** Пока грузится новый период, старый график приглушён. */
  dimmed?: boolean
}

// Геометрия из макета 2.2: область 200px, линия с отступами 11px по бокам и 5px сверху,
// размах линии — верхние 140px из 190px заливки (ниже минимума остаётся «подушка» 50px).
const MARGIN = { top: 5, right: 11, bottom: 5, left: 11 }
const LINE_SHARE = 140 / 190

function yDomain(points: readonly ChartPoint[]): [number, number] {
  const rates = points.map(({ rate }) => rate)
  const min = Math.min(...rates)
  const max = Math.max(...rates)
  // Ровный ряд: даём небольшой размах, иначе домен вырождается в точку.
  const range = max - min || Math.abs(max) * 0.001 || 1
  return [min - (range / LINE_SHARE - range), min + range]
}

function ChartTooltip({ active, payload }: TooltipContentProps) {
  const point = payload[0]?.payload as ChartPoint | undefined
  if (!active || !point) return null

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipDate}>{formatShortDate(point.date)}</span>
      <span className={styles.tooltipValue}>{point.rate.toFixed(RATE_DIGITS)}</span>
    </div>
  )
}

/**
 * Площадной график без осей и сетки (как в макете); цвет — через currentColor от тренда.
 * Анимация `auto`: recharts сам выключает её при prefers-reduced-motion: reduce.
 */
export function RateAreaChart({ points, trend, dimmed = false }: RateAreaChartProps) {
  return (
    <div className={clsx(styles.chart, styles[trend], dimmed && styles.dimmed)}>
      <AreaChart responsive data={points} margin={MARGIN} style={{ width: '100%', height: '100%' }}>
        <XAxis dataKey="date" hide />
        <YAxis hide domain={yDomain(points)} />
        <Tooltip
          content={ChartTooltip}
          cursor={{ stroke: 'currentColor', strokeOpacity: 0.3 }}
          isAnimationActive="auto"
        />
        <Area
          type="monotone"
          dataKey="rate"
          stroke="currentColor"
          strokeWidth={2}
          fill="currentColor"
          fillOpacity={0.08}
          activeDot={{ r: 4, fill: 'currentColor', strokeWidth: 2 }}
          isAnimationActive="auto"
        />
      </AreaChart>
    </div>
  )
}

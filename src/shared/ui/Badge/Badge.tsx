import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import styles from './Badge.module.scss'

/** Цветовые пары фон/текст из DESIGN.md (§1, «Цвета бейджей»). */
export type BadgeTone = 'accent' | 'success' | 'danger' | 'warning' | 'purple' | 'red' | 'neutral'

interface BadgeProps {
  tone: BadgeTone
  /** md — бейдж в шапке страницы (7/14, r10, 13px), sm — теги и статусы (5/10, r8, 12px). */
  size?: 'sm' | 'md'
  icon?: ReactNode
  className?: string
  children: ReactNode
}

export function Badge({ tone, size = 'sm', icon, className, children }: BadgeProps) {
  return (
    <span className={clsx(styles.badge, styles[tone], styles[size], className)}>
      {icon && (
        <span className={styles.icon} aria-hidden>
          {icon}
        </span>
      )}
      {children}
    </span>
  )
}

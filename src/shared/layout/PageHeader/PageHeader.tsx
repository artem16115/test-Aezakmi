import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import { documentTitle } from '@/shared/lib/documentTitle'
import styles from './PageHeader.module.scss'

interface PageHeaderProps {
  title: string
  /** Слот справа от заголовка (бейдж даты, «Card Created»). */
  aside?: ReactNode
  className?: string
}

export function PageHeader({ title, aside, className }: PageHeaderProps) {
  return (
    <header className={clsx(styles.header, className)}>
      {/* React 19 сам переносит <title> в <head>: тайтл вкладки = заголовок страницы. */}
      <title>{documentTitle(title)}</title>
      <h1 className={styles.title}>{title}</h1>
      {aside}
    </header>
  )
}

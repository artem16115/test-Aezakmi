import { RotateCw, TriangleAlert } from 'lucide-react'
import { clsx } from 'clsx'
import { Button } from '../Button'
import styles from './ErrorState.module.scss'

interface ErrorStateProps {
  title: string
  /** Технические детали (текст ошибки) — мелко под заголовком. */
  message?: string
  onRetry?: () => void
  retrying?: boolean
  className?: string
}

export function ErrorState({ title, message, onRetry, retrying, className }: ErrorStateProps) {
  return (
    <div role="alert" className={clsx(styles.root, className)}>
      <TriangleAlert size={28} className={styles.icon} aria-hidden />
      <p className={styles.title}>{title}</p>
      {message && <p className={styles.message}>{message}</p>}
      {onRetry && (
        <Button variant="outline" onClick={onRetry} loading={retrying} className={styles.retry}>
          {!retrying && <RotateCw size={16} aria-hidden />}
          Retry
        </Button>
      )}
    </div>
  )
}

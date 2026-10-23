import { LoaderCircle } from 'lucide-react'
import { clsx } from 'clsx'
import styles from './Spinner.module.scss'

interface SpinnerProps {
  size?: number
  /** Текст для скринридеров; без него спиннер декоративный (aria-hidden). */
  label?: string
  className?: string
}

export function Spinner({ size = 18, label, className }: SpinnerProps) {
  if (!label) {
    return <LoaderCircle size={size} className={clsx(styles.spinner, className)} aria-hidden />
  }

  return (
    <span role="status" className={clsx(styles.wrapper, className)}>
      <LoaderCircle size={size} className={styles.spinner} aria-hidden />
      <span className={styles.label}>{label}</span>
    </span>
  )
}

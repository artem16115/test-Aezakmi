import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import styles from './FieldError.module.scss'

interface FieldErrorProps {
  id?: string
  className?: string
  children: ReactNode
}

export function FieldError({ id, className, children }: FieldErrorProps) {
  return (
    <p id={id} className={clsx(styles.error, className)}>
      {children}
    </p>
  )
}

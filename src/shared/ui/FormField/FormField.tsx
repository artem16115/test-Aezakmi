import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import { FieldError } from '../FieldError'
import { fieldErrorId } from './fieldErrorId'
import styles from './FormField.module.scss'

interface FormFieldProps {
  /** id контрола: на него ссылается label, от него строится id ошибки. */
  id: string
  label: ReactNode
  /** Лейбл только для скринридеров (у полей логина в макете нет подписей). */
  hideLabel?: boolean
  /** Показать «*» после лейбла (для скринридеров обязательность передаёт `required` у контрола). */
  required?: boolean
  error?: string
  className?: string
  children: ReactNode
}

/** Обёртка поля формы: лейбл → контрол → текст ошибки (gap 6, DESIGN.md §5). */
export function FormField({
  id,
  label,
  hideLabel,
  required,
  error,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={clsx(styles.field, className)}>
      <label
        htmlFor={id}
        className={clsx(styles.label, hideLabel && styles.hidden, error && styles.labelInvalid)}
      >
        {label}
        {required && <span aria-hidden> *</span>}
      </label>
      {children}
      {error && <FieldError id={fieldErrorId(id)}>{error}</FieldError>}
    </div>
  )
}

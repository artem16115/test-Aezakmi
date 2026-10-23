import { useId, type ComponentProps, type MouseEvent } from 'react'
import { clsx } from 'clsx'
import { formatLongDate } from '@/shared/lib/format'
import { Emoji } from '../Emoji'
import { FormField, fieldErrorId } from '../FormField'
import styles from './DateField.module.scss'

type DateFieldProps = Omit<ComponentProps<'input'>, 'type' | 'value' | 'placeholder'> & {
  label: string
  /** 'YYYY-MM-DD' или '' */
  value: string
  placeholder: string
  error?: string
}

/**
 * Нативный `<input type="date">` (пикер браузера), но его локальный текст скрыт:
 * поверх показываем дату в формате макета («April 15, 2026») или плейсхолдер (DESIGN.md §5).
 */
export function DateField({
  label,
  value,
  placeholder,
  error,
  className,
  id,
  onClick,
  ...rest
}: DateFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  const openPicker = (event: MouseEvent<HTMLInputElement>) => {
    onClick?.(event)
    try {
      event.currentTarget.showPicker()
    } catch {
      // showPicker недоступен (старый браузер) — остаётся обычный ввод с клавиатуры.
    }
  }

  return (
    <FormField
      id={inputId}
      label={label}
      required={rest.required}
      error={error}
      className={className}
    >
      <div className={clsx(styles.control, error && styles.invalid)}>
        <span className={clsx(styles.display, !value && styles.placeholder)} aria-hidden>
          {value ? formatLongDate(value) : placeholder}
        </span>
        {!value && <Emoji name="calendar" size={16} />}
        <input
          id={inputId}
          type="date"
          value={value}
          className={styles.input}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? fieldErrorId(inputId) : undefined}
          onClick={openPicker}
          {...rest}
        />
      </div>
    </FormField>
  )
}

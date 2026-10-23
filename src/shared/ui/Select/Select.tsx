import { useId, type ComponentProps } from 'react'
import { ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'
import { FormField, fieldErrorId } from '../FormField'
import styles from './Select.module.scss'

export interface SelectOption {
  value: string
  label: string
}

type SelectProps = Omit<ComponentProps<'select'>, 'children'> & {
  label: string
  options: readonly SelectOption[]
  /** Текст пустого варианта (value=""), показывается серым. */
  placeholder: string
  error?: string
}

/** Нативный select со своей стрелкой (DESIGN.md §5). */
export function Select({
  label,
  options,
  placeholder,
  error,
  className,
  id,
  ...rest
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <FormField
      id={selectId}
      label={label}
      required={rest.required}
      error={error}
      className={className}
    >
      <div className={clsx(styles.control, error && styles.invalid)}>
        <select
          id={selectId}
          className={styles.select}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? fieldErrorId(selectId) : undefined}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className={styles.chevron} aria-hidden />
      </div>
    </FormField>
  )
}

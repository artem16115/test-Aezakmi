import { useId, type ComponentProps } from 'react'
import { clsx } from 'clsx'
import { FormField, fieldErrorId } from '../FormField'
import styles from './TextArea.module.scss'

type TextAreaProps = ComponentProps<'textarea'> & {
  label: string
  error?: string
}

export function TextArea({ label, error, className, id, ...rest }: TextAreaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId

  return (
    <FormField
      id={textareaId}
      label={label}
      required={rest.required}
      error={error}
      className={className}
    >
      <textarea
        id={textareaId}
        className={clsx(styles.textarea, error && styles.invalid)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? fieldErrorId(textareaId) : undefined}
        {...rest}
      />
    </FormField>
  )
}

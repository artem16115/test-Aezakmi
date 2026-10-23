import type { ComponentProps } from 'react'
import { Spinner } from '../Spinner'
import { buttonClassName, type ButtonStyleProps } from './buttonClassName'

type ButtonProps = ComponentProps<'button'> &
  ButtonStyleProps & {
    loading?: boolean
  }

export function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  disabled,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled === true || loading}
      aria-busy={loading || undefined}
      className={buttonClassName({ variant, size, fullWidth }, className)}
      {...rest}
    >
      {loading && <Spinner size={size === 'lg' ? 18 : 16} />}
      {children}
    </button>
  )
}

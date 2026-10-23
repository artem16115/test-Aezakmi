import { clsx } from 'clsx'
import styles from './Button.module.scss'

export type ButtonVariant = 'primary' | 'outline'
/** lg — кнопка логина (56px), md — кнопки форм и страниц (43px). */
export type ButtonSize = 'lg' | 'md'

export interface ButtonStyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

export function buttonClassName(
  { variant = 'primary', size = 'md', fullWidth = false }: ButtonStyleProps,
  className?: string,
) {
  return clsx(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    className,
  )
}

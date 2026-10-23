import { clsx } from 'clsx'
import styles from './CurrencyFlag.module.scss'

interface CurrencyFlagProps {
  src: string
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

/** Флаг валюты (SVG из flag-icons): эмодзи-флаги не отображаются на Windows. Декоративный — код валюты рядом. */
export function CurrencyFlag({ src, size = 'sm', className }: CurrencyFlagProps) {
  return <img src={src} alt="" className={clsx(styles.flag, styles[size], className)} />
}

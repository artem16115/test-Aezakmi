import { clsx } from 'clsx'
import calendar from '@/shared/assets/emoji/calendar.svg'
import clipboard from '@/shared/assets/emoji/clipboard.svg'
import cloud from '@/shared/assets/emoji/cloud.svg'
import currencyExchange from '@/shared/assets/emoji/currency-exchange.svg'
import door from '@/shared/assets/emoji/door.svg'
import downArrow from '@/shared/assets/emoji/down-arrow.svg'
import fire from '@/shared/assets/emoji/fire.svg'
import minus from '@/shared/assets/emoji/minus.svg'
import moneyBag from '@/shared/assets/emoji/money-bag.svg'
import policeCarLight from '@/shared/assets/emoji/police-car-light.svg'
import styles from './Emoji.module.scss'

// Цветные эмодзи макета — Microsoft Fluent Emoji, стиль Color (MIT), локальные SVG.
const EMOJI = {
  calendar,
  clipboard,
  cloud,
  'currency-exchange': currencyExchange,
  door,
  'down-arrow': downArrow,
  fire,
  minus,
  'money-bag': moneyBag,
  'police-car-light': policeCarLight,
} as const

export type EmojiName = keyof typeof EMOJI

interface EmojiProps {
  name: EmojiName
  size: number
  className?: string
}

/** Декоративная картинка-эмодзи: смысл всегда несёт соседний текст или aria-label. */
export function Emoji({ name, size, className }: EmojiProps) {
  return (
    <img
      src={EMOJI[name]}
      width={size}
      height={size}
      alt=""
      aria-hidden
      draggable={false}
      className={clsx(styles.emoji, className)}
    />
  )
}

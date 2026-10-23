// Даты без времени ('YYYY-MM-DD') форматируем в UTC — без сдвига на день из-за часового пояса.
const longDateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

const shortDateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

const pad = (value: number) => String(value).padStart(2, '0')

const fromIsoDate = (isoDate: string) => new Date(`${isoDate}T00:00:00Z`)

/** 'YYYY-MM-DD' → 'March 30, 2026'. */
export function formatLongDate(isoDate: string): string {
  return longDateFormat.format(fromIsoDate(isoDate))
}

/** 'YYYY-MM-DD' → 'Mar 30, 2026' (тултип графика). */
export function formatShortDate(isoDate: string): string {
  return shortDateFormat.format(fromIsoDate(isoDate))
}

/** Метка времени → 'HH:mm' (локальное время). */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** Округление до `digits` знаков; -0 превращается в 0, чтобы не печатать «-0.0000». */
export function roundTo(value: number, digits: number): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor || 0
}

/** Число со знаком: '+0.0012', '-0.0012', '0.0000'. */
export function formatSigned(value: number, digits: number): string {
  const rounded = roundTo(value, digits)
  return `${rounded > 0 ? '+' : ''}${rounded.toFixed(digits)}`
}

/** Локальная дата в формате 'YYYY-MM-DD', сдвинутая назад на `days` дней и `months` месяцев. */
export function isoDateAgo(
  { days = 0, months = 0 }: { days?: number; months?: number },
  now: Date = new Date(),
): string {
  const date = new Date(now.getFullYear(), now.getMonth() - months, now.getDate() - days)
  return `${String(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

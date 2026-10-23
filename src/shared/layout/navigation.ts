import { ArrowLeftRight, ClipboardList, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  /** Подпись в свёрнутом сайдбаре и нижней панели. */
  shortLabel: string
  /** Подпись в раскрытом сайдбаре. */
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: readonly NavItem[] = [
  { to: '/rates', shortLabel: 'Rates', label: 'Exchange Rates', icon: ArrowLeftRight },
  { to: '/cards', shortLabel: 'Cards', label: 'Kanban Cards', icon: ClipboardList },
]

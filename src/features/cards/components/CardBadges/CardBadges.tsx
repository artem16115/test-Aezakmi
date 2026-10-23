import { AlertTriangle, ArrowDown, Flame, Minus, type LucideIcon } from 'lucide-react'
import { Badge, type BadgeTone } from '@/shared/ui'
import { PRIORITY_LABELS, STATUS_LABELS } from '../../model/constants'
import type { Priority, Status } from '../../model/types'

// Цвета и иконки бейджей — DESIGN.md §5, «Цвета бейджей».
const PRIORITY_STYLE: Record<Priority, { tone: BadgeTone; icon: LucideIcon }> = {
  low: { tone: 'success', icon: ArrowDown },
  medium: { tone: 'accent', icon: Minus },
  high: { tone: 'warning', icon: Flame },
  urgent: { tone: 'red', icon: AlertTriangle },
}

const STATUS_TONE: Record<Status, BadgeTone> = {
  todo: 'neutral',
  in_progress: 'accent',
  review: 'purple',
  done: 'success',
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { tone, icon: Icon } = PRIORITY_STYLE[priority]
  return (
    <Badge tone={tone} icon={<Icon size={12} strokeWidth={2.5} />}>
      {PRIORITY_LABELS[priority]}
    </Badge>
  )
}

export function StatusBadge({ status }: { status: Status }) {
  return <Badge tone={STATUS_TONE[status]}>{STATUS_LABELS[status]}</Badge>
}

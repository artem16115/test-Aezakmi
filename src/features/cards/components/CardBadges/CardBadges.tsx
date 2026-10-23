import { Badge, Emoji, type BadgeTone, type EmojiName } from '@/shared/ui'
import { PRIORITY_LABELS, STATUS_LABELS } from '../../model/constants'
import type { Priority, Status } from '../../model/types'

// Цвета и иконки бейджей — DESIGN.md §5, «Цвета бейджей».
const PRIORITY_STYLE: Record<Priority, { tone: BadgeTone; emoji: EmojiName }> = {
  low: { tone: 'success', emoji: 'down-arrow' },
  medium: { tone: 'accent', emoji: 'minus' },
  high: { tone: 'warning', emoji: 'fire' },
  urgent: { tone: 'red', emoji: 'police-car-light' },
}

const STATUS_TONE: Record<Status, BadgeTone> = {
  todo: 'neutral',
  in_progress: 'accent',
  review: 'purple',
  done: 'success',
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { tone, emoji } = PRIORITY_STYLE[priority]
  return (
    <Badge tone={tone} icon={<Emoji name={emoji} size={12} />}>
      {PRIORITY_LABELS[priority]}
    </Badge>
  )
}

export function StatusBadge({ status }: { status: Status }) {
  return <Badge tone={STATUS_TONE[status]}>{STATUS_LABELS[status]}</Badge>
}

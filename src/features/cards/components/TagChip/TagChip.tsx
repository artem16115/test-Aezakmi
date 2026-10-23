import { X } from 'lucide-react'
import { Badge } from '@/shared/ui'
import { tagTone } from '../../model/constants'
import styles from './TagChip.module.scss'

interface TagChipProps {
  tag: string
  /** Порядковый номер тега в карточке — от него зависит цвет. */
  index: number
  /** Если задан — у чипа есть крестик удаления. */
  onRemove?: () => void
}

export function TagChip({ tag, index, onRemove }: TagChipProps) {
  return (
    <Badge tone={tagTone(index)} className={styles.chip}>
      {tag}
      {onRemove && (
        <button
          type="button"
          className={styles.remove}
          aria-label={`Remove tag ${tag}`}
          onClick={onRemove}
        >
          <X size={12} strokeWidth={2.5} aria-hidden />
        </button>
      )}
    </Badge>
  )
}

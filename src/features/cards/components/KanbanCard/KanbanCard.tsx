import { useId } from 'react'
import { formatLongDate } from '@/shared/lib/format'
import { ButtonLink } from '@/shared/ui'
import { ASSIGNEE_NAMES } from '../../model/constants'
import type { Card, CardImage } from '../../model/types'
import { PriorityBadge, StatusBadge } from '../CardBadges'
import { DeleteCardButton } from '../DeleteCardButton'
import { FileImage } from '../FileImage'
import { TagChip } from '../TagChip'
import styles from './KanbanCard.module.scss'

interface KanbanCardProps {
  card: Card
  /** Картинки есть только в текущей сессии; после перезагрузки ряд скрыт. */
  images: readonly CardImage[]
  /** После удаления карточки; `remaining` — сколько карточек осталось. */
  onDeleted: (remaining: number) => void
}

/** Превью карточки (экран 3.4). Пустые необязательные поля не оставляют пустых блоков. */
export function KanbanCard({ card, images, onDeleted }: KanbanCardProps) {
  const titleId = useId()
  const { id, title, description, priority, status, assignee, deadline, tags } = card
  const hasMeta = Boolean(assignee ?? deadline)

  return (
    <article className={styles.card} aria-labelledby={titleId}>
      <div className={styles.badges}>
        {status && <StatusBadge status={status} />}
        <PriorityBadge priority={priority} />
      </div>

      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      <p className={styles.description}>{description}</p>

      {hasMeta && (
        <dl className={styles.meta}>
          {assignee && (
            <div className={styles.metaItem}>
              <dt className={styles.metaLabel}>Assignee</dt>
              <dd className={styles.metaValue}>{ASSIGNEE_NAMES[assignee]}</dd>
            </div>
          )}
          {deadline && (
            <div className={styles.metaItem}>
              <dt className={styles.metaLabel}>Deadline</dt>
              <dd className={styles.metaValue}>
                <time dateTime={deadline}>{formatLongDate(deadline)}</time>
              </dd>
            </div>
          )}
        </dl>
      )}

      {tags.length > 0 && (
        <ul className={styles.tags} aria-label="Tags">
          {tags.map((tag, index) => (
            // Статичный список: ключ по позиции (дубли из подделанного localStorage не ломают рендер).
            <li key={index}>
              <TagChip tag={tag} index={index} />
            </li>
          ))}
        </ul>
      )}

      {images.length > 0 && (
        <ul className={styles.images} aria-label="Images">
          {images.map(({ id: imageId, file }) => (
            <li key={imageId}>
              <FileImage file={file} alt={file.name} className={styles.image} />
            </li>
          ))}
        </ul>
      )}

      <div className={styles.actions}>
        <ButtonLink to={`/cards/${id}/edit`} aria-describedby={titleId}>
          Edit Card
        </ButtonLink>
        <DeleteCardButton card={card} onDeleted={onDeleted} aria-describedby={titleId} />
      </div>
    </article>
  )
}

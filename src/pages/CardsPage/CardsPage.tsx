import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { Check, Plus } from 'lucide-react'
import { getCardSaved, KanbanCard, useCards, type CardSavedKind } from '@/features/cards'
import { PageHeader } from '@/shared/layout/PageHeader'
import { Badge, ButtonLink, type BadgeTone } from '@/shared/ui'
import styles from './CardsPage.module.scss'

const SAVED_BADGE: Record<CardSavedKind, { label: string; tone: BadgeTone }> = {
  created: { label: 'Card Created', tone: 'success' },
  saved: { label: 'Card Saved', tone: 'success' },
  deleted: { label: 'Card Deleted', tone: 'danger' },
}

/** Список карточек (экран 3.4): новые сверху, бейдж после создания/сохранения/удаления. */
export function CardsPage() {
  const { cards, getImages } = useCards()
  const location = useLocation()
  const navigate = useNavigate()
  // Бейдж — только сразу после отправки формы: state запоминаем и убираем из истории,
  // чтобы он не появлялся снова при обновлении страницы.
  const [saved, setSaved] = useState(() => getCardSaved(location.state))
  // Удалённая карточка уносит с собой кнопку Delete — фокус переводим на «New Card».
  const newCardRef = useRef<HTMLAnchorElement>(null)
  const [deletedCount, setDeletedCount] = useState(0)

  useEffect(() => {
    if (location.state != null) void navigate('.', { replace: true, state: null })
  }, [location.state, navigate])

  useEffect(() => {
    if (deletedCount > 0) newCardRef.current?.focus()
  }, [deletedCount])

  // Последнюю карточку удалили (или их не было) → к созданию.
  if (cards.length === 0) return <Navigate to="/cards/new" replace />

  const badge = saved && SAVED_BADGE[saved]

  return (
    <>
      <PageHeader
        title="Card Preview"
        aside={
          badge && (
            <Badge tone={badge.tone} size="md" icon={<Check size={14} strokeWidth={3} />}>
              <span role="status">{badge.label}</span>
            </Badge>
          )
        }
      />
      <div>
        <ButtonLink to="/cards/new" ref={newCardRef}>
          <Plus size={16} aria-hidden />
          New Card
        </ButtonLink>
      </div>
      <ul className={styles.list}>
        {cards.map((card) => (
          <li key={card.id}>
            <KanbanCard
              card={card}
              images={getImages(card.id)}
              onDeleted={() => {
                setSaved('deleted')
                setDeletedCount((count) => count + 1)
              }}
            />
          </li>
        ))}
      </ul>
    </>
  )
}

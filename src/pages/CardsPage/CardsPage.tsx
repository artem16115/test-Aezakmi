import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { Check, Plus } from 'lucide-react'
import { getCardSaved, KanbanCard, useCards } from '@/features/cards'
import { PageHeader } from '@/shared/layout/PageHeader'
import { Badge, ButtonLink } from '@/shared/ui'
import styles from './CardsPage.module.scss'

const SAVED_LABEL = { created: 'Card Created', saved: 'Card Saved' } as const

/** Список карточек (экран 3.4): новые сверху, бейдж после создания/сохранения. */
export function CardsPage() {
  const { cards, getImages } = useCards()
  const location = useLocation()
  const navigate = useNavigate()
  // Бейдж — только сразу после отправки формы: state запоминаем и убираем из истории,
  // чтобы он не появлялся снова при обновлении страницы.
  const [saved] = useState(() => getCardSaved(location.state))

  useEffect(() => {
    if (location.state != null) void navigate('.', { replace: true, state: null })
  }, [location.state, navigate])

  if (cards.length === 0) return <Navigate to="/cards/new" replace />

  return (
    <>
      <PageHeader
        title="Card Preview"
        aside={
          saved && (
            <Badge tone="success" size="md" icon={<Check size={14} strokeWidth={3} />}>
              <span role="status">{SAVED_LABEL[saved]}</span>
            </Badge>
          )
        }
      />
      <div>
        <ButtonLink to="/cards/new">
          <Plus size={16} aria-hidden />
          New Card
        </ButtonLink>
      </div>
      <ul className={styles.list}>
        {cards.map((card) => (
          <li key={card.id}>
            <KanbanCard card={card} images={getImages(card.id)} />
          </li>
        ))}
      </ul>
    </>
  )
}

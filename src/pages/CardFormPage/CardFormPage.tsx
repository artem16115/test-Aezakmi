import { Navigate, useNavigate, useParams } from 'react-router'
import {
  CardForm,
  cardToFormValues,
  emptyCardFormValues,
  toSubmitPayload,
  useCards,
  type CardFormOutput,
  type CardSavedState,
} from '@/features/cards'
import { PageHeader } from '@/shared/layout/PageHeader'
import styles from './CardFormPage.module.scss'

/** Создание (/cards/new) и редактирование (/cards/:id/edit) карточки. */
export function CardFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cards, getCard, getImages, createCard, updateCard } = useCards()
  const card = id ? getCard(id) : undefined

  // Неизвестный id → к списку.
  if (id && !card) return <Navigate to="/cards" replace />

  const handleSubmit = (data: CardFormOutput) => {
    // Имитация запроса на бэкенд (требование задания).
    alert(JSON.stringify(toSubmitPayload(data), null, 2))
    const { images, ...input } = data
    if (card) updateCard(card.id, input, images)
    else createCard(input, images)
    const state: CardSavedState = { cardSaved: card ? 'saved' : 'created' }
    void navigate('/cards', { state })
  }

  const toList = () => void navigate('/cards')

  return (
    <div className={styles.page}>
      <PageHeader title={card ? 'Edit Card' : 'Create New Card'} />
      <CardForm
        // Новая форма при переходе между созданием и редактированием разных карточек.
        key={card?.id ?? 'new'}
        defaultValues={card ? cardToFormValues(card, getImages(card.id)) : emptyCardFormValues()}
        savedDeadline={card?.deadline}
        submitLabel={card ? 'Save Card' : 'Create Card'}
        onSubmit={handleSubmit}
        // Создание без карточек: уходить некуда, Cancel просто очищает форму.
        onCancel={card || cards.length > 0 ? toList : undefined}
      />
    </div>
  )
}

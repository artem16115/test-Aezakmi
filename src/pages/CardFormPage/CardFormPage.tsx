import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import {
  CardForm,
  DeleteCardButton,
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
  // После удаления карточки нет, но переход уже запрошен — не перебиваем его своим.
  const [deleted, setDeleted] = useState(false)

  // Неизвестный id → к списку.
  if (id && !card) return deleted ? null : <Navigate to="/cards" replace />

  // replace: «Назад» не должен вести на форму удалённой карточки.
  const handleDeleted = (remaining: number) => {
    setDeleted(true)
    if (remaining === 0) {
      void navigate('/cards/new', { replace: true })
      return
    }
    const state: CardSavedState = { cardSaved: 'deleted' }
    void navigate('/cards', { replace: true, state })
  }

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
        secondaryAction={card && <DeleteCardButton card={card} onDeleted={handleDeleted} />}
      />
    </div>
  )
}

import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { CardsContext, type CardsContextValue } from './cardsContext'
import type { Card, CardImage, CardInput } from './model/types'
import { loadCards, saveCards } from './storage'

const NO_IMAGES: readonly CardImage[] = []

// ISO-строки сравниваются как строки; новые — сверху.
const byNewest = (a: Card, b: Card) => b.createdAt.localeCompare(a.createdAt)

export function CardsProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState(() => loadCards().sort(byNewest))
  // Картинки — только в памяти (Map<cardId, CardImage[]>), в localStorage не попадают.
  const [images, setImages] = useState<ReadonlyMap<string, readonly CardImage[]>>(new Map())

  const commit = useCallback((next: Card[], id: string, cardImages: readonly CardImage[]) => {
    setCards(next)
    saveCards(next)
    setImages((current) => new Map(current).set(id, cardImages))
  }, [])

  const getCard = useCallback((id: string) => cards.find((card) => card.id === id), [cards])

  const getImages = useCallback((id: string) => images.get(id) ?? NO_IMAGES, [images])

  const createCard = useCallback(
    (input: CardInput, cardImages: readonly CardImage[]) => {
      const now = new Date().toISOString()
      const card: Card = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now }
      commit([card, ...cards], card.id, cardImages)
      return card
    },
    [cards, commit],
  )

  const updateCard = useCallback(
    (id: string, input: CardInput, cardImages: readonly CardImage[]) => {
      const existing = cards.find((card) => card.id === id)
      if (!existing) return undefined
      // Поля, очищенные в форме, приходят как undefined и затирают старые значения.
      const card: Card = {
        ...input,
        id,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
      }
      commit(
        cards.map((item) => (item.id === id ? card : item)),
        id,
        cardImages,
      )
      return card
    },
    [cards, commit],
  )

  const value = useMemo<CardsContextValue>(
    () => ({ cards, getCard, getImages, createCard, updateCard }),
    [cards, getCard, getImages, createCard, updateCard],
  )

  return <CardsContext value={value}>{children}</CardsContext>
}

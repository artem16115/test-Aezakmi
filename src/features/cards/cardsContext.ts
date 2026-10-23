import { createContext } from 'react'
import type { Card, CardImage, CardInput } from './model/types'

export interface CardsContextValue {
  /** Новые сверху (по createdAt). */
  cards: readonly Card[]
  getCard: (id: string) => Card | undefined
  /** Картинки карточки из памяти; после перезагрузки страницы их нет. */
  getImages: (id: string) => readonly CardImage[]
  createCard: (input: CardInput, images: readonly CardImage[]) => Card
  /** Возвращает undefined, если карточки с таким id нет. */
  updateCard: (id: string, input: CardInput, images: readonly CardImage[]) => Card | undefined
  /** Удаляет карточку из localStorage и её картинки из памяти. */
  deleteCard: (id: string) => void
}

export const CardsContext = createContext<CardsContextValue | null>(null)

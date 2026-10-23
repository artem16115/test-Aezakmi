import { readStorage, writeStorage } from '@/shared/lib/storage'
import { storedCardsSchema } from './model/schema'
import type { Card } from './model/types'

const STORAGE_KEY = 'cards:v1'

/** Карточки из localStorage. Битые или чужие данные → пустой список, без падения. */
export function loadCards(): Card[] {
  const raw = readStorage(STORAGE_KEY)
  if (!raw) return []
  try {
    const result = storedCardsSchema.safeParse(JSON.parse(raw))
    return result.success ? result.data : []
  } catch {
    return []
  }
}

/** Сохраняет карточки (без картинок — они живут только в памяти). */
export function saveCards(cards: readonly Card[]): void {
  writeStorage(STORAGE_KEY, JSON.stringify(cards))
}

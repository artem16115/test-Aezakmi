import { use } from 'react'
import { CardsContext } from './cardsContext'

export function useCards() {
  const context = use(CardsContext)
  if (!context) throw new Error('useCards must be used within CardsProvider')
  return context
}

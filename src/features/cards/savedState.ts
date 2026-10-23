import { z } from 'zod'

/** state перехода на /cards после отправки формы: показать бейдж «Card Created» / «Card Saved». */
const cardSavedStateSchema = z.object({ cardSaved: z.enum(['created', 'saved']) })

export type CardSavedState = z.infer<typeof cardSavedStateSchema>
export type CardSavedKind = CardSavedState['cardSaved']

/** history.state приходит извне (можно подделать или получить старый) — проверяем схемой. */
export function getCardSaved(state: unknown): CardSavedKind | undefined {
  const result = cardSavedStateSchema.safeParse(state)
  return result.success ? result.data.cardSaved : undefined
}

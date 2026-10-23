import { z } from 'zod'

/**
 * state при редиректе на /login: куда вернуть пользователя после входа.
 * Только путь внутри приложения: «//host» и «/\host» браузер считает адресом другого сайта.
 */
const redirectStateSchema = z.object({ from: z.string().regex(/^\/(?![/\\])/) })

export type RedirectState = z.infer<typeof redirectStateSchema>

/** history.state приходит извне (можно подделать или получить старый) — проверяем схемой. */
export function getRedirectFrom(state: unknown): string | undefined {
  const result = redirectStateSchema.safeParse(state)
  return result.success ? result.data.from : undefined
}

import type { z } from 'zod'
import { apiErrorSchema } from './schemas'

/** GET-запрос с проверкой статуса и валидацией ответа zod-схемой. */
export async function fetchJson<T>(
  url: string,
  schema: z.ZodType<T>,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(url, { signal })
  const body: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const details = apiErrorSchema.safeParse(body)
    const reason = details.success ? details.data.message : response.statusText
    throw new Error(`Request failed (${String(response.status)}): ${reason}`)
  }

  const result = schema.safeParse(body)
  if (!result.success) throw new Error('Unexpected response format')
  return result.data
}

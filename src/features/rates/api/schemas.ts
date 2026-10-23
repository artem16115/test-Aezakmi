import { z } from 'zod'

// Формат ответа Frankfurter v2 /rates описан по реальным запросам (в документации его нет):
// [{ "date": "2026-10-22", "base": "USD", "quote": "EUR", "rate": 0.88972 }, ...]
export const ratePointSchema = z.object({
  date: z.iso.date(),
  base: z.string(),
  quote: z.string(),
  rate: z.number().positive(),
})

export const ratesResponseSchema = z.array(ratePointSchema)

export type RatePoint = z.infer<typeof ratePointSchema>

/** Тело ошибки API: { "status": 422, "message": "invalid currency: XXX" }. */
export const apiErrorSchema = z.object({ message: z.string() })

import { z } from 'zod'

// Тексты ошибок из макета 1.2; для пустых полей — те же (отдельного «required» в макете нет).
export const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { DEMO_CREDENTIALS } from './constants'
import { loginSchema } from './schema'

const errorsOf = (input: unknown) => {
  const result = loginSchema.safeParse(input)
  return result.success ? {} : z.flattenError(result.error).fieldErrors
}

describe('loginSchema', () => {
  it('принимает демо-аккаунт', () => {
    expect(loginSchema.safeParse(DEMO_CREDENTIALS).success).toBe(true)
  })

  it('невалидный email — текст ошибки из макета', () => {
    expect(errorsOf({ email: 'demo@', password: 'demo123' })).toEqual({
      email: ['Please enter a valid email address'],
    })
  })

  it('пароль короче 6 символов — текст ошибки из макета', () => {
    expect(errorsOf({ email: 'demo@example.com', password: '12345' })).toEqual({
      password: ['Password must be at least 6 characters'],
    })
  })

  it('пустые поля — те же тексты, что и для неверного формата', () => {
    expect(errorsOf({ email: '', password: '' })).toEqual({
      email: ['Please enter a valid email address'],
      password: ['Password must be at least 6 characters'],
    })
  })
})

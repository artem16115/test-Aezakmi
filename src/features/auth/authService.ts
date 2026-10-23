import { DEMO_CREDENTIALS, LOGIN_DELAY_MS } from './constants'

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password')
    this.name = 'InvalidCredentialsError'
  }
}

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })

/**
 * Имитация запроса на бэкенд: проверяет демо-аккаунт и возвращает токен.
 * В реальном проекте токен ставил бы сервер в httpOnly-куку.
 */
export async function login(email: string, password: string): Promise<string> {
  await delay(LOGIN_DELAY_MS)

  const isValid =
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password
  if (!isValid) throw new InvalidCredentialsError()

  return `mock-token-${String(Date.now())}`
}

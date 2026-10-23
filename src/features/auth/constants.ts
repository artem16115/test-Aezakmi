/** Демо-аккаунт для входа (mock-авторизация, указан в README и подсказкой на экране логина). */
export const DEMO_CREDENTIALS = {
  email: 'demo@example.com',
  password: 'demo123',
} as const

export const AUTH_COOKIE = 'auth_token'
export const AUTH_COOKIE_EXPIRES_DAYS = 7

/** Имитация сетевой задержки запроса логина. */
export const LOGIN_DELAY_MS = 600

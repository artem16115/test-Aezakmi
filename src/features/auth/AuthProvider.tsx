import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { getCookie, removeCookie, setCookie } from '@/shared/lib/cookies'
import * as authService from './authService'
import { AuthContext, type AuthContextValue } from './authContext'
import { AUTH_COOKIE, AUTH_COOKIE_EXPIRES_DAYS } from './constants'

export function AuthProvider({ children }: { children: ReactNode }) {
  // Куку читаем синхронно при первом рендере — экран логина не мигает у авторизованного.
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getCookie(AUTH_COOKIE)))

  const login = useCallback(async (email: string, password: string) => {
    const token = await authService.login(email, password)
    setCookie(AUTH_COOKIE, token, AUTH_COOKIE_EXPIRES_DAYS)
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    removeCookie(AUTH_COOKIE)
    setIsAuthenticated(false)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

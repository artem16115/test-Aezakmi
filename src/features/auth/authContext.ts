import { createContext } from 'react'

export interface AuthContextValue {
  isAuthenticated: boolean
  /** Бросает InvalidCredentialsError при неверных данных. */
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

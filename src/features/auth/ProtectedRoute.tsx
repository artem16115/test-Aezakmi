import { Navigate, Outlet, useLocation } from 'react-router'
import type { RedirectState } from './redirectState'
import { useAuth } from './useAuth'

/** Пускает только авторизованных; остальных — на /login с запоминанием исходного URL. */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const { pathname, search, hash } = useLocation()

  if (!isAuthenticated) {
    const state: RedirectState = { from: pathname + search + hash }
    return <Navigate to="/login" replace state={state} />
  }

  return <Outlet />
}

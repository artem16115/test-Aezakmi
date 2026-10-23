import { Navigate, Outlet, useLocation } from 'react-router'
import { getRedirectFrom } from './redirectState'
import { useAuth } from './useAuth'

/**
 * Пускает только неавторизованных (страница логина).
 * Сразу после входа срабатывает этот же редирект — на исходный URL или /rates.
 */
export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth()
  const state: unknown = useLocation().state

  if (isAuthenticated) {
    return <Navigate to={getRedirectFrom(state) ?? '/rates'} replace />
  }

  return <Outlet />
}

import { useNavigate } from 'react-router'
import { useAuth } from '@/features/auth'
import { AppLayout } from '@/shared/layout/AppLayout'

/** Связывает общий каркас с авторизацией: shared/layout не зависит от features. */
export function AuthenticatedLayout() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  // Явный переход без state.from: после повторного входа — на /rates, а не на страницу выхода.
  const handleLogout = () => {
    logout()
    void navigate('/login', { replace: true })
  }

  return <AppLayout onLogout={handleLogout} />
}

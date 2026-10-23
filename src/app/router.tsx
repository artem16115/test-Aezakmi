import { Navigate, Route, Routes } from 'react-router'
import { ProtectedRoute, PublicOnlyRoute } from '@/features/auth'
import { CardFormPage } from '@/pages/CardFormPage'
import { CardsPage } from '@/pages/CardsPage'
import { LoginPage } from '@/pages/LoginPage'
import { RatesPage } from '@/pages/RatesPage'
import { AuthenticatedLayout } from './AuthenticatedLayout'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AuthenticatedLayout />}>
          <Route index element={<Navigate to="/rates" replace />} />
          <Route path="rates" element={<RatesPage />} />
          <Route path="cards" element={<CardsPage />} />
          <Route path="cards/new" element={<CardFormPage />} />
          <Route path="cards/:id/edit" element={<CardFormPage />} />
        </Route>
      </Route>
      {/* Неизвестный путь → /rates; неавторизованного ProtectedRoute дальше уведёт на /login. */}
      <Route path="*" element={<Navigate to="/rates" replace />} />
    </Routes>
  )
}

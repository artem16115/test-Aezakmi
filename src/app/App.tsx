import { BrowserRouter } from 'react-router'
import { BASE_PATH } from '@/shared/lib/basePath'
import { Providers } from './providers'
import { AppRoutes } from './router'

export function App() {
  return (
    <BrowserRouter basename={BASE_PATH}>
      <Providers>
        <AppRoutes />
      </Providers>
    </BrowserRouter>
  )
}

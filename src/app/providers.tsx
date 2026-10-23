import { useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/features/auth'
import { CardsProvider } from '@/features/cards'

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        // По умолчанию ('online') без сети запрос встаёт на паузу и вечно показывает скелетон;
        // 'always' даёт честную ошибку с кнопкой Retry.
        networkMode: 'always',
      },
    },
  })

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CardsProvider>{children}</CardsProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

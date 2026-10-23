import { useCallback, useSyncExternalStore } from 'react'

// Должны совпадать с брейкпоинтами в shared/styles/_mixins.scss.
export const DESKTOP_QUERY = '(min-width: 1200px)'

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => {
        mql.removeEventListener('change', onChange)
      }
    },
    [query],
  )

  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches)
}

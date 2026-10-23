const APP_NAME = 'Dashboard'

/** Тайтл вкладки: 'Exchange rates · Dashboard'. */
export function documentTitle(page: string): string {
  return `${page} · ${APP_NAME}`
}

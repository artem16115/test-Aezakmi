import Cookies from 'js-cookie'
import { BASE_PATH } from './basePath'

// Атрибуты должны совпадать при записи и удалении куки — иначе js-cookie её не удалит.
// path — путь приложения: на github.io домен общий для всех репозиториев владельца.
const baseAttributes = (): Cookies.CookieAttributes => ({
  path: BASE_PATH,
  sameSite: 'lax',
  secure: window.location.protocol === 'https:',
})

export function getCookie(name: string): string | undefined {
  return Cookies.get(name)
}

export function setCookie(name: string, value: string, expiresInDays: number): void {
  Cookies.set(name, value, { ...baseAttributes(), expires: expiresInDays })
}

export function removeCookie(name: string): void {
  Cookies.remove(name, baseAttributes())
}

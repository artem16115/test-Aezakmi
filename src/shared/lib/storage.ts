// Безопасный доступ к localStorage: в приватном режиме или при переполнении квоты
// браузер бросает исключение — приложение от этого падать не должно.

export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Не удалось сохранить — состояние просто не переживёт перезагрузку.
  }
}

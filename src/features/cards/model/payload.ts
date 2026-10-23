import type { CardFormOutput } from './schema'

/**
 * Данные формы для «отправки на бэкенд» (alert): картинки — только { name, size }, а не сами файлы.
 */
export function toSubmitPayload({ images, ...card }: CardFormOutput) {
  return {
    ...card,
    images: images.map(({ file }) => ({ name: file.name, size: file.size })),
  }
}

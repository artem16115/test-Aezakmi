import { useCallback } from 'react'

interface FileImageProps {
  file: File
  alt: string
  className?: string
}

/**
 * Превью картинки из File через object URL. URL создаётся при монтировании `<img>`
 * и освобождается (revokeObjectURL) при удалении/размонтировании — через cleanup ref-колбэка React 19.
 */
export function FileImage({ file, alt, className }: FileImageProps) {
  const attach = useCallback(
    (img: HTMLImageElement | null) => {
      if (!img) return
      const url = URL.createObjectURL(file)
      img.src = url
      return () => {
        URL.revokeObjectURL(url)
      }
    },
    [file],
  )

  return <img ref={attach} alt={alt} className={className} />
}

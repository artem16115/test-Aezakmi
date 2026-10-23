import { useRef, useState, type DragEvent } from 'react'
import { flushSync } from 'react-dom'
import { CloudUpload, Plus, Trash2 } from 'lucide-react'
import { clsx } from 'clsx'
import { FormField, fieldErrorId } from '@/shared/ui'
import { LIMITS } from '../../model/constants'
import { acceptImages } from '../../model/images'
import type { CardImage } from '../../model/types'
import { FileImage } from '../FileImage'
import styles from './ImageDropzone.module.scss'

interface ImageDropzoneProps {
  id: string
  images: readonly CardImage[]
  onChange: (images: CardImage[]) => void
  onBlur?: () => void
  /** Кнопка выбора файлов — на неё ставится фокус при ошибке. */
  buttonRef?: (element: HTMLButtonElement | null) => void
  error?: string
}

const hasFiles = (event: DragEvent) => event.dataTransfer.types.includes('Files')

/** Картинки: drag & drop или клик (скрытый input[type=file]), превью и удаление (DESIGN.md §5). */
export function ImageDropzone({
  id,
  images,
  onChange,
  onBlur,
  buttonRef,
  error,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const pickerRef = useRef<HTMLButtonElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  // Ошибка последнего добавления (не картинка, > 5 МБ, лимит) — до следующего действия.
  const [addError, setAddError] = useState<string | null>(null)
  const shownError = addError ?? error
  const canAdd = images.length < LIMITS.images

  const addFiles = (files: readonly File[]) => {
    const { added, error: problem } = acceptImages(files, images)
    setAddError(problem)
    if (added.length > 0) onChange([...images, ...added])
  }

  const removeImage = (imageId: string) => {
    setAddError(null)
    // Кнопка удаления исчезает вместе с превью: дорисовываем список сразу и ставим фокус
    // на кнопку выбора файлов (после удаления она точно есть — «+ Add» или пустая зона).
    flushSync(() => {
      onChange(images.filter((image) => image.id !== imageId))
    })
    pickerRef.current?.focus()
  }

  const openDialog = () => inputRef.current?.click()

  const dragHandlers = {
    onDragEnter: (event: DragEvent) => {
      if (!hasFiles(event)) return
      event.preventDefault()
      setIsDragging(true)
    },
    onDragOver: (event: DragEvent) => {
      if (!hasFiles(event)) return
      // preventDefault разрешает drop; без него браузер откроет файл во вкладке.
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'
    },
    onDragLeave: (event: DragEvent) => {
      // Переход на дочерний элемент — не выход из зоны.
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDragging(false)
    },
    onDrop: (event: DragEvent) => {
      event.preventDefault()
      setIsDragging(false)
      addFiles([...event.dataTransfer.files])
    },
  }

  const pickerButton = {
    ref: (element: HTMLButtonElement | null) => {
      pickerRef.current = element
      buttonRef?.(element)
    },
    id,
    type: 'button' as const,
    'aria-describedby': shownError ? fieldErrorId(id) : undefined,
    onClick: openDialog,
    onBlur,
  }

  return (
    <FormField
      id={id}
      label={images.length > 0 ? `Images (${String(images.length)})` : 'Images'}
      error={shownError}
    >
      <div className={clsx(styles.root, isDragging && styles.dragging)} {...dragHandlers}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => {
            addFiles([...(event.target.files ?? [])])
            // Сброс, чтобы тот же файл можно было выбрать повторно.
            event.target.value = ''
          }}
        />

        {images.length === 0 ? (
          <button {...pickerButton} className={clsx(styles.dropzone, shownError && styles.invalid)}>
            <CloudUpload size={28} className={styles.cloud} aria-hidden />
            <span className={styles.hint}>Drag &amp; drop images here</span>
            <span className={styles.browse}>or click to browse</span>
          </button>
        ) : (
          <ul className={styles.grid}>
            {images.map(({ id: imageId, file }) => (
              <li key={imageId} className={styles.preview}>
                <div className={styles.thumb}>
                  <FileImage file={file} alt={file.name} className={styles.image} />
                  <button
                    type="button"
                    className={styles.remove}
                    aria-label={`Remove ${file.name}`}
                    onClick={() => {
                      removeImage(imageId)
                    }}
                  >
                    <Trash2 size={12} aria-hidden />
                  </button>
                </div>
                <span className={styles.name} title={file.name}>
                  {file.name}
                </span>
              </li>
            ))}
            {canAdd && (
              <li>
                <button
                  {...pickerButton}
                  className={clsx(styles.addTile, shownError && styles.invalid)}
                  aria-label="Add images"
                >
                  <Plus size={16} aria-hidden />
                  Add
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
    </FormField>
  )
}

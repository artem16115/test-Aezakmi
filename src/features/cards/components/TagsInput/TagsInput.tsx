import { useRef, useState, type KeyboardEvent } from 'react'
import { clsx } from 'clsx'
import { FormField, fieldErrorId } from '@/shared/ui'
import { validateNewTag } from '../../model/tags'
import { TagChip } from '../TagChip'
import styles from './TagsInput.module.scss'

interface TagsInputProps {
  id: string
  label: string
  placeholder: string
  tags: readonly string[]
  onTagsChange: (tags: string[]) => void
  /** Недописанный тег — хранится в форме, чтобы не потеряться при отправке. */
  draft: string
  onDraftChange: (draft: string) => void
  onBlur?: () => void
  inputRef?: (element: HTMLInputElement | null) => void
  /** Ошибка из схемы формы. */
  error?: string
}

/** Теги чипами внутри поля: Enter или запятая — добавить, Backspace в пустом инпуте — удалить последний. */
export function TagsInput({
  id,
  label,
  placeholder,
  tags,
  onTagsChange,
  draft,
  onDraftChange,
  onBlur,
  inputRef,
  error,
}: TagsInputProps) {
  // Ошибка попытки добавить тег (дубль, длина, лимит) — до следующей правки.
  const [addError, setAddError] = useState<string | null>(null)
  const shownError = addError ?? error
  const localInputRef = useRef<HTMLInputElement>(null)

  const addDraft = () => {
    const tag = draft.trim()
    if (!tag) return
    const problem = validateNewTag(tag, tags)
    if (problem) {
      setAddError(problem)
      return
    }
    onTagsChange([...tags, tag])
    onDraftChange('')
  }

  const removeTag = (index: number) => {
    setAddError(null)
    onTagsChange(tags.filter((_, i) => i !== index))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      // Enter не отправляет форму, а добавляет тег.
      event.preventDefault()
      addDraft()
    } else if (event.key === 'Backspace' && !draft && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  return (
    <FormField id={id} label={label} error={shownError}>
      {/* Клик по пустому месту поля ставит фокус в инпут (с клавиатуры поле доступно через сам инпут). */}
      <div
        className={clsx(styles.control, shownError && styles.invalid)}
        onClick={(event) => {
          if (event.target === event.currentTarget) localInputRef.current?.focus()
        }}
      >
        {tags.map((tag, index) => (
          <TagChip
            key={tag}
            tag={tag}
            index={index}
            onRemove={() => {
              removeTag(index)
              // Кнопка удаления исчезает вместе с чипом — фокус переводим в инпут, а не в body.
              localInputRef.current?.focus()
            }}
          />
        ))}
        <input
          ref={(element) => {
            localInputRef.current = element
            inputRef?.(element)
          }}
          id={id}
          className={clsx(styles.input, tags.length > 0 && styles.inputWithTags)}
          value={draft}
          placeholder={tags.length ? undefined : placeholder}
          enterKeyHint="enter"
          aria-invalid={shownError ? true : undefined}
          aria-describedby={shownError ? fieldErrorId(id) : undefined}
          onChange={(event) => {
            setAddError(null)
            onDraftChange(event.target.value)
          }}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
        />
      </div>
    </FormField>
  )
}

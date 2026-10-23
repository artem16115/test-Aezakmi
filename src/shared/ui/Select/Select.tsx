import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type Ref,
} from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'
import { FormField, fieldErrorId } from '../FormField'
import styles from './Select.module.scss'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label: string
  options: readonly SelectOption[]
  /** Текст пустого значения (''), показывается серым. У необязательного поля — ещё и пункт сброса. */
  placeholder: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  name?: string
  ref?: Ref<HTMLButtonElement>
  required?: boolean
  error?: string
  id?: string
  className?: string
}

/** Максимальная высота списка и отступ от края экрана (DESIGN.md §5, «Выпадающий список»). */
const LIST_MAX_HEIGHT = 280
const LIST_GAP = 6
const VIEWPORT_MARGIN = 8
const TYPEAHEAD_RESET_MS = 500

type Placement = 'bottom' | 'top'

/**
 * Выпадающий список по паттерну WAI-ARIA «select-only combobox»: кнопка `role="combobox"`
 * (её подписывает `<label for>`) и `listbox`. Фокус всегда остаётся на кнопке, активный
 * пункт — через `aria-activedescendant`. Список всегда в DOM и скрыт `visibility`, чтобы
 * анимировать и открытие, и закрытие.
 */
export function Select({
  label,
  options,
  placeholder,
  value,
  onChange,
  onBlur,
  name,
  ref,
  required,
  error,
  id,
  className,
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const listboxId = `${selectId}-listbox`
  const optionId = (index: number) => `${selectId}-option-${String(index)}`

  // У необязательного поля первый пункт — плейсхолдер: им значение сбрасывается.
  const items: readonly SelectOption[] = required
    ? options
    : [{ value: '', label: placeholder }, ...options]
  const selectedIndex = items.findIndex((item) => item.value === value)
  const selected = value === '' ? undefined : items[selectedIndex]

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [placement, setPlacement] = useState<Placement>('bottom')
  const [maxHeight, setMaxHeight] = useState(LIST_MAX_HEIGHT)

  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const typeahead = useRef({ text: '', timer: 0 })

  const setButtonRef = (node: HTMLButtonElement | null) => {
    buttonRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  const openList = (index = selectedIndex >= 0 ? selectedIndex : 0) => {
    setActiveIndex(index)
    setOpen(true)
  }

  const closeList = () => {
    setOpen(false)
  }

  const choose = (index: number) => {
    const item = items[index]
    if (item && item.value !== value) onChange(item.value)
    closeList()
  }

  // Куда открывать: вниз, если там помещается список, иначе туда, где места больше.
  // Снизу учитываем фиксированные панели (нижняя навигация на мобилке, --fixed-bottom-inset).
  useLayoutEffect(() => {
    if (!open || !rootRef.current || !listRef.current) return
    const rect = rootRef.current.getBoundingClientRect()
    const bottomInset = parseFloat(
      getComputedStyle(rootRef.current).getPropertyValue('--fixed-bottom-inset'),
    )
    const spaceBelow =
      window.innerHeight - (bottomInset || 0) - rect.bottom - LIST_GAP - VIEWPORT_MARGIN
    const spaceAbove = rect.top - LIST_GAP - VIEWPORT_MARGIN
    const needed = Math.min(listRef.current.scrollHeight, LIST_MAX_HEIGHT)
    const nextPlacement = spaceBelow >= needed || spaceBelow >= spaceAbove ? 'bottom' : 'top'
    setPlacement(nextPlacement)
    setMaxHeight(
      Math.min(LIST_MAX_HEIGHT, Math.max(nextPlacement === 'bottom' ? spaceBelow : spaceAbove, 0)),
    )
  }, [open])

  // Активный пункт всегда виден в прокручиваемом списке.
  useLayoutEffect(() => {
    if (!open || activeIndex < 0) return
    const option = document.getElementById(optionId(activeIndex))
    const list = listRef.current
    if (!option || !list) return
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop
    else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight
    }
  })

  // Клик (касание) мимо поля закрывает список.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  useEffect(() => {
    const state = typeahead.current
    return () => {
      window.clearTimeout(state.timer)
    }
  }, [])

  // Ввод букв: переход к пункту, начинающемуся с набранного текста. Повтор одной буквы
  // перебирает пункты на эту букву.
  const findByTypeahead = (char: string) => {
    const state = typeahead.current
    window.clearTimeout(state.timer)
    state.text += char.toLowerCase()
    state.timer = window.setTimeout(() => {
      state.text = ''
    }, TYPEAHEAD_RESET_MS)

    const from = open ? activeIndex : selectedIndex
    const repeated = /^(.)\1*$/.test(state.text)
    const query = repeated ? state.text.charAt(0) : state.text
    const ordered = items.map((_, i) => (from + 1 + i) % items.length)
    const start = repeated ? ordered : [Math.max(from, 0), ...ordered]
    return start.find((i) => items[i]?.label.toLowerCase().startsWith(query)) ?? -1
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = items.length - 1
    const { key } = event

    if (key.length === 1 && key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault()
      const index = findByTypeahead(key)
      if (index >= 0) openList(index)
      return
    }

    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(key)) {
        event.preventDefault()
        openList()
      } else if (key === 'Home' || key === 'End') {
        event.preventDefault()
        openList(key === 'Home' ? 0 : last)
      }
      return
    }

    switch (key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, last))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(last)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (activeIndex >= 0) choose(activeIndex)
        break
      case 'Escape':
        // Не даём Esc закрыть что-то ещё (например, overlay-меню).
        event.preventDefault()
        event.stopPropagation()
        closeList()
        break
      case 'Tab':
        // Закрываем без выбора, фокус уходит дальше штатно.
        closeList()
        break
    }
  }

  return (
    <FormField id={selectId} label={label} required={required} error={error} className={className}>
      <div
        ref={rootRef}
        className={clsx(styles.root, open && styles.open, error && styles.invalid)}
        data-placement={placement}
      >
        <button
          type="button"
          ref={setButtonRef}
          id={selectId}
          name={name}
          role="combobox"
          className={clsx(styles.control, !selected && styles.placeholder)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          aria-required={required ? true : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? fieldErrorId(selectId) : undefined}
          onClick={() => {
            // Safari не фокусирует кнопки по клику — без фокуса не работала бы клавиатура.
            buttonRef.current?.focus()
            if (open) closeList()
            else openList()
          }}
          onKeyDown={onKeyDown}
          onBlur={() => {
            closeList()
            onBlur?.()
          }}
        >
          <span className={styles.value}>{selected ? selected.label : placeholder}</span>
          <ChevronDown size={16} className={styles.chevron} aria-hidden />
        </button>

        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label={label}
          tabIndex={-1}
          className={styles.list}
          style={{ maxHeight }}
        >
          {items.map((item, index) => {
            const isSelected = index === selectedIndex
            return (
              <li
                key={item.value}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                className={clsx(
                  styles.option,
                  index === activeIndex && styles.optionActive,
                  isSelected && styles.optionSelected,
                  item.value === '' && styles.optionPlaceholder,
                )}
                // Фокус остаётся на кнопке: иначе blur закрыл бы список до выбора.
                onMouseDown={(event) => {
                  event.preventDefault()
                }}
                onMouseMove={() => {
                  if (activeIndex !== index) setActiveIndex(index)
                }}
                onClick={() => {
                  choose(index)
                }}
              >
                <span className={styles.optionLabel}>{item.label}</span>
                {isSelected && item.value !== '' && (
                  <Check size={16} className={styles.check} aria-hidden />
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </FormField>
  )
}

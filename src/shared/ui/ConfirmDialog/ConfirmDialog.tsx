import { useId, useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { Button } from '../Button'
import styles from './ConfirmDialog.module.scss'

interface ConfirmDialogProps {
  title: string
  description: ReactNode
  confirmLabel: string
  onConfirm: () => void
  /** Cancel, Esc и клик по затемнению. */
  onCancel: () => void
}

/**
 * Окно подтверждения на нативном `<dialog>` (showModal): затемнение, Esc и недоступность
 * остальной страницы даёт браузер. Открывается при монтировании, закрывается при размонтировании.
 * Фокус — на Cancel; Tab ходит по кругу внутри окна; после закрытия фокус возвращается туда,
 * где был (если тот элемент ещё на странице).
 */
export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const pressedOnBackdrop = useRef(false)

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialog.showModal()
    cancelRef.current?.focus()
    return () => {
      dialog.close()
      if (opener?.isConnected) opener.focus()
    }
  }, [])

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return
    const focusable = [...event.currentTarget.querySelectorAll<HTMLElement>('button')]
    const first = focusable.at(0)
    const last = focusable.at(-1)
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onKeyDown={onKeyDown}
      // Esc: закрытие решает родитель (размонтирует окно).
      onCancel={(event) => {
        event.preventDefault()
        onCancel()
      }}
      // Клик по затемнению: и нажатие, и отпускание — на самом <dialog> (вне карточки),
      // чтобы выделение текста, начатое внутри, не закрывало окно.
      onPointerDown={(event) => {
        pressedOnBackdrop.current = event.target === event.currentTarget
      }}
      onClick={(event) => {
        if (pressedOnBackdrop.current && event.target === event.currentTarget) onCancel()
      }}
    >
      <div className={styles.content}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
        <div className={styles.actions}>
          <Button ref={cancelRef} variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  )
}

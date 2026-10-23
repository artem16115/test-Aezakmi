import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { clsx } from 'clsx'
import { readStorage, writeStorage } from '@/shared/lib/storage'
import { DESKTOP_QUERY, useMediaQuery } from '@/shared/lib/useMediaQuery'
import { MobileNav } from '../MobileNav'
import { Sidebar } from '../Sidebar'
import styles from './AppLayout.module.scss'

const SIDEBAR_STORAGE_KEY = 'ui:sidebar-expanded'

interface AppLayoutProps {
  onLogout: () => void
}

/**
 * Каркас защищённых страниц: сайдбар + контент.
 * Десктоп — раскрытый сайдбар сдвигает контент, состояние хранится в localStorage.
 * Планшет — раскрытый сайдбар открывается поверх контента (overlay), не запоминается;
 * контент под затемнением `inert` — Tab не уходит из меню, скринридер его не читает.
 * Мобилка — вместо сайдбара нижняя панель (MobileNav).
 */
export function AppLayout({ onLogout }: AppLayoutProps) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const [pinned, setPinned] = useState(() => readStorage(SIDEBAR_STORAGE_KEY) === 'true')
  const [overlayOpen, setOverlayOpen] = useState(false)

  const expanded = isDesktop ? pinned : overlayOpen
  const isOverlay = !isDesktop && overlayOpen

  const setExpanded = (value: boolean) => {
    if (isDesktop) {
      setPinned(value)
      writeStorage(SIDEBAR_STORAGE_KEY, String(value))
    } else {
      setOverlayOpen(value)
    }
  }

  useEffect(() => {
    if (!isOverlay) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOverlayOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOverlay])

  return (
    <div className={styles.layout} data-expanded={expanded || undefined}>
      <Sidebar
        expanded={expanded}
        onExpand={() => {
          setExpanded(true)
        }}
        onCollapse={() => {
          setExpanded(false)
        }}
        onNavigate={() => {
          setOverlayOpen(false)
        }}
        onLogout={onLogout}
        className={styles.sidebar}
      />
      {/* Затемнение есть всегда (кроме десктопа и мобилки), чтобы плавно проявляться и гаснуть. */}
      <div
        className={clsx(styles.backdrop, isOverlay && styles.backdropVisible)}
        aria-hidden
        onClick={() => {
          setOverlayOpen(false)
        }}
      />
      <main className={styles.main} inert={isOverlay}>
        <Outlet />
      </main>
      <MobileNav onLogout={onLogout} />
    </div>
  )
}

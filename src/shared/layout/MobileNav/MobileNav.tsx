import { NavLink } from 'react-router'
import { clsx } from 'clsx'
import { Emoji } from '@/shared/ui'
import { NAV_ITEMS } from '../navigation'
import styles from './MobileNav.module.scss'

interface MobileNavProps {
  onLogout: () => void
  className?: string
}

/** Нижняя панель навигации на мобилке (< 768px) вместо сайдбара. */
export function MobileNav({ onLogout, className }: MobileNavProps) {
  return (
    <nav aria-label="Main" className={clsx(styles.nav, className)}>
      {NAV_ITEMS.map(({ to, shortLabel, emoji }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => clsx(styles.item, isActive && styles.itemActive)}
        >
          <Emoji name={emoji} size={22} />
          {shortLabel}
        </NavLink>
      ))}
      <button type="button" className={styles.item} onClick={onLogout}>
        <Emoji name="door" size={22} />
        Logout
      </button>
    </nav>
  )
}

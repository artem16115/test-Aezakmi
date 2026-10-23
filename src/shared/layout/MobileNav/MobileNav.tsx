import { LogOut } from 'lucide-react'
import { NavLink } from 'react-router'
import { clsx } from 'clsx'
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
      {NAV_ITEMS.map(({ to, shortLabel, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => clsx(styles.item, isActive && styles.itemActive)}
        >
          <Icon size={22} aria-hidden />
          {shortLabel}
        </NavLink>
      ))}
      <button type="button" className={styles.item} onClick={onLogout}>
        <LogOut size={22} aria-hidden />
        Logout
      </button>
    </nav>
  )
}

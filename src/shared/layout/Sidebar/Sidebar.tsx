import { LogOut, PanelLeftClose, PanelLeftOpen, Wallet } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router'
import { clsx } from 'clsx'
import { NAV_ITEMS } from '../navigation'
import styles from './Sidebar.module.scss'

interface SidebarProps {
  expanded: boolean
  onExpand: () => void
  onCollapse: () => void
  /** Клик по пункту меню (на планшете закрывает overlay). */
  onNavigate: () => void
  onLogout: () => void
  className?: string
}

export function Sidebar({
  expanded,
  onExpand,
  onCollapse,
  onNavigate,
  onLogout,
  className,
}: SidebarProps) {
  // Кнопка-переключатель меняется при сворачивании/разворачивании, и фокус с неё теряется.
  // Возвращаем его на новую кнопку, если он ушёл в body (клавиатура, Esc), но не перехватываем чужой.
  const toggleRef = useRef<HTMLButtonElement>(null)
  const previousExpanded = useRef(expanded)
  useEffect(() => {
    if (previousExpanded.current === expanded) return
    previousExpanded.current = expanded
    if (document.activeElement === document.body) toggleRef.current?.focus()
  }, [expanded])

  if (!expanded) {
    return (
      <aside className={clsx(styles.sidebar, styles.collapsed, className)}>
        <button
          type="button"
          ref={toggleRef}
          className={styles.logo}
          aria-label="Expand menu"
          aria-expanded={false}
          onClick={onExpand}
        >
          <Wallet size={24} className={styles.logoIcon} aria-hidden />
          <PanelLeftOpen size={22} className={styles.expandIcon} aria-hidden />
        </button>

        <nav aria-label="Main" className={styles.compactNav}>
          <ul>
            {NAV_ITEMS.map(({ to, shortLabel, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    clsx(styles.compactItem, isActive && styles.compactItemActive)
                  }
                >
                  <Icon size={22} aria-hidden />
                  {shortLabel}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className={clsx(styles.compactItem, styles.compactLogout)}
          onClick={onLogout}
        >
          <LogOut size={18} aria-hidden />
          Logout
        </button>
      </aside>
    )
  }

  return (
    <aside className={clsx(styles.sidebar, styles.expanded, className)}>
      <div className={styles.header}>
        <Wallet size={28} className={styles.logoIcon} aria-hidden />
        <span className={styles.brand}>Dashboard</span>
        <button
          type="button"
          ref={toggleRef}
          className={styles.collapse}
          aria-label="Collapse menu"
          aria-expanded
          onClick={onCollapse}
        >
          <PanelLeftClose size={20} aria-hidden />
        </button>
      </div>

      <hr className={styles.divider} />
      <p className={styles.menuLabel} id="sidebar-menu-label">
        Menu
      </p>

      <nav aria-labelledby="sidebar-menu-label">
        <ul className={styles.list}>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={onNavigate}
                className={({ isActive }) => clsx(styles.item, isActive && styles.itemActive)}
              >
                <Icon size={20} aria-hidden />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <hr className={clsx(styles.divider, styles.bottomDivider)} />
      <button type="button" className={clsx(styles.item, styles.logout)} onClick={onLogout}>
        <LogOut size={20} aria-hidden />
        Logout
      </button>
    </aside>
  )
}

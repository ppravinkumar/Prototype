import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './Navigation.module.css'
import { RocketIcon, HandIcon, BotIcon, ShieldCheckIcon } from './icons'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  route?: string
  expandable?: boolean
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    id: 'nav-deployment',
    label: 'Deployment',
    icon: RocketIcon,
    expandable: true,
    children: [
      {
        id: 'nav-deployment-manual',
        label: 'Manual',
        icon: HandIcon,
        route: '/deployment/manual'
      },
      {
        id: 'nav-deployment-autonomous',
        label: 'Autonomous',
        icon: BotIcon,
        route: '/deployment/autonomous'
      }
    ]
  },
  {
    id: 'nav-policy',
    label: 'Policy',
    icon: ShieldCheckIcon,
    route: '/policy'
  }
]

const STORAGE_KEY = 'patchConsole.activeNav'

function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'nav-deployment': true })
  const [activeId, setActiveId] = useState<string>('')
  const [focusedIndex, setFocusedIndex] = useState(0)
  const navRef = useRef<HTMLElement>(null)

  const flatItems = navItems.flatMap(item =>
    item.expandable && expanded[item.id] && item.children
      ? [item, ...item.children]
      : [item]
  )

  const navigableItems = flatItems.filter(item => item.route)

  useEffect(() => {
    const storedActive = localStorage.getItem(STORAGE_KEY)
    if (storedActive) {
      setActiveId(storedActive)
    } else {
      setActiveId('nav-deployment-manual')
    }
  }, [])

  useEffect(() => {
    const currentItem = navItems.flatMap(item =>
      item.children ? item.children : item
    ).find(item => item.route === location.pathname)

    if (currentItem) {
      setActiveId(currentItem.id)
      localStorage.setItem(STORAGE_KEY, currentItem.id)
    }
  }, [location.pathname])

  const handleItemClick = (item: NavItem) => {
    if (item.expandable) {
      setExpanded(prev => ({ ...prev, [item.id]: !prev[item.id] }))
    } else if (item.route) {
      setActiveId(item.id)
      localStorage.setItem(STORAGE_KEY, item.id)
      navigate(item.route)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => Math.min(prev + 1, navigableItems.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        const item = navigableItems[focusedIndex]
        if (item) {
          handleItemClick(item)
        }
        break
      case 'ArrowRight':
        e.preventDefault()
        navItems.forEach(item => {
          if (item.expandable) {
            setExpanded(prev => ({ ...prev, [item.id]: true }))
          }
        })
        break
      case 'ArrowLeft':
        e.preventDefault()
        navItems.forEach(item => {
          if (item.expandable) {
            setExpanded(prev => ({ ...prev, [item.id]: false }))
          }
        })
        break
    }
  }

  const renderNavItem = (item: NavItem, depth: number = 0) => {
    const isActive = activeId === item.id
    const isExpanded = expanded[item.id]
    const Icon = item.icon
    const isChild = depth > 0
    const navItemIndex = navigableItems.findIndex(navItem => navItem.id === item.id)
    const isFocused = navItemIndex === focusedIndex && item.route

    return (
      <div key={item.id}>
        <button
          id={item.id}
          className={`${styles.navItem} ${isActive ? styles.active : ''} ${isChild ? styles.child : ''} ${isFocused ? styles.focused : ''}`}
          onClick={() => handleItemClick(item)}
          aria-expanded={item.expandable ? isExpanded : undefined}
          aria-current={isActive && item.route ? 'page' : undefined}
          tabIndex={0}
        >
          <Icon className={styles.icon} />
          <span className={styles.label}>{item.label}</span>
        </button>
        {item.expandable && isExpanded && item.children && (
          <div className={styles.children}>
            {item.children.map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <nav
      ref={navRef}
      className={styles.navigation}
      role="navigation"
      onKeyDown={handleKeyDown}
    >
      <div className={styles.header}>
        <div className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="8" height="8" rx="2" fill="var(--primary)" />
            <rect x="13" y="3" width="8" height="8" rx="2" fill="var(--primary)" opacity="0.6" />
            <rect x="3" y="13" width="8" height="8" rx="2" fill="var(--primary)" opacity="0.6" />
            <rect x="13" y="13" width="8" height="8" rx="2" fill="var(--primary)" opacity="0.3" />
          </svg>
        </div>
        <span className={styles.title}>Patch Management</span>
      </div>
      <div className={styles.items}>
        {navItems.map(item => renderNavItem(item))}
      </div>
    </nav>
  )
}

export default Navigation

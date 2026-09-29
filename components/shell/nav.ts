import { BookOpen, Archive, ChartNoAxesColumn, Columns2, Command, Settings, type LucideIcon } from 'lucide-react'

export type NavGroup = 'WORKSPACE' | 'LIBRARY'
export type NavItem = { label: string; href: string; icon: LucideIcon; key: string; shortcut: string; group: NavGroup; count?: string; iconColor: string; mobile: boolean }

export const navItems: NavItem[] = [
  { label: 'Console', href: '/console', icon: Command, key: 'c', shortcut: 'G C', group: 'WORKSPACE', count: '4', iconColor: 'bg-ember', mobile: true },
  { label: 'Memory', href: '/memory', icon: Archive, key: 'm', shortcut: 'G M', group: 'WORKSPACE', count: '1,284', iconColor: 'bg-mint', mobile: true },
  { label: 'Learning', href: '/learning', icon: ChartNoAxesColumn, key: 'l', shortcut: 'G L', group: 'WORKSPACE', iconColor: 'bg-lemon', mobile: true },
  { label: 'Compare', href: '/compare', icon: Columns2, key: 'p', shortcut: 'G P', group: 'WORKSPACE', iconColor: 'bg-bubblegum', mobile: true },
  { label: 'Runbooks', href: '/runbooks', icon: BookOpen, key: 'r', shortcut: 'G R', group: 'LIBRARY', iconColor: 'bg-sky', mobile: true },
  { label: 'Settings', href: '/settings', icon: Settings, key: 's', shortcut: 'G S', group: 'LIBRARY', iconColor: 'bg-paper', mobile: false },
]

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function titleFor(pathname: string) {
  return navItems.find((item) => isActive(pathname, item.href))?.label ?? 'Console'
}

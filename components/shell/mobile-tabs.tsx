'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { isActive, navItems } from './nav'

export function MobileTabs({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 grid h-[68px] grid-cols-5 border-t-2 border-ink bg-paper px-1 pb-[env(safe-area-inset-bottom)] md:hidden">
      {navItems.filter((item) => item.mobile).map((item) => {
        const active = isActive(pathname, item.href)
        return (
          <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={cn('relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold', active ? 'text-ink' : 'text-muted-foreground')}>
            {active && <motion.span layoutId="mobile-tab-indicator" className="absolute inset-x-1 top-1 bottom-1 -z-10 rounded-xl border-2 border-ink bg-paper shadow-hard-sm" transition={{ type: 'spring', stiffness: 500, damping: 34 }} />}
            <span className={cn('grid size-7 place-items-center rounded-lg border border-ink text-ink', item.iconColor)}><item.icon className="size-4" aria-hidden="true" /></span>
            <span className="truncate">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

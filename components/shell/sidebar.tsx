'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown, PanelLeftClose, PanelLeftOpen, Play } from 'lucide-react'
import { DigitRoll } from '@/components/quirk/digit-roll'
import { Elio } from '@/components/quirk/elio'
import { cn } from '@/lib/utils'
import { Wordmark } from './wordmark'
import { isActive, navItems } from './nav'

const workspaces = ['Northwind Payments', 'Northwind Platform', 'Sandbox']

function MemoryHealth({ collapsed }: { collapsed: boolean }) {
  return (
    <section aria-label="Memory health" className={cn('on-bright rounded-2xl border-2 border-ink bg-mint text-ink', collapsed ? 'mx-auto grid size-12 place-items-center p-1' : 'p-3.5')}>
      {collapsed ? (
        <div role="img" className="relative grid size-10 place-items-center" aria-label="94 percent recall hit rate">
          <svg viewBox="0 0 44 44" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
            <circle cx="22" cy="22" r="18" fill="none" stroke="rgb(20 17 15 / .15)" strokeWidth="3" />
            <circle cx="22" cy="22" r="18" fill="none" stroke="#0B7A6B" strokeWidth="3" strokeDasharray="113" strokeDashoffset="7" strokeLinecap="round" />
          </svg>
          <span className="font-mono text-[9px] font-bold">94%</span>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em]">memory health</p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-paper/60 px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-ink"><span className="size-1.5 animate-pulse rounded-full bg-viridian" /> live</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="relative grid size-[62px] shrink-0 place-items-center">
              <svg viewBox="0 0 62 62" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
                <circle cx="31" cy="31" r="25" fill="none" stroke="rgb(20 17 15 / .15)" strokeWidth="5" />
                <circle cx="31" cy="31" r="25" fill="none" stroke="#0B7A6B" strokeWidth="5" strokeDasharray="157" strokeDashoffset="9.4" strokeLinecap="round" />
              </svg>
              <span className="font-mono text-sm font-bold">94%</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold leading-tight">recall hit rate</p>
              <p className="mt-1 font-mono text-[10px] text-ink/70"><DigitRoll value="1,284" /> records</p>
            </div>
          </div>
          <svg viewBox="0 0 200 32" className="mt-3 h-7 w-full" role="img" aria-label="Memory health trending upward">
            <path d="M2 25 C18 24 18 18 34 20 S53 23 67 15 90 22 104 12 128 19 141 8 164 13 178 5 191 8 198 3" fill="none" stroke="#07524A" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </>
      )}
    </section>
  )
}

export function Sidebar({
  pathname,
  collapsed,
  onToggle,
  onStartDemo,
}: {
  pathname: string
  collapsed: boolean
  onToggle: () => void
  onStartDemo: () => void
}) {
  const [workspace, setWorkspace] = useState(workspaces[0])
  const [hovered, setHovered] = useState<string | null>(null)
  const indicatorKey = hovered ?? navItems.find((item) => isActive(pathname, item.href))?.key

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 flex-col border-r-2 border-ink bg-sidebar px-3 py-4 text-ink transition-[width] duration-200 md:flex',
        collapsed ? 'w-[72px]' : 'w-[272px]',
      )}
    >
      {!collapsed && (
        <details className="group relative mb-4">
          <summary className="flex h-12 cursor-pointer list-none items-center gap-2.5 rounded-2xl border-2 border-ink bg-paper px-2.5 shadow-hard-sm [&::-webkit-details-marker]:hidden">
            <span className="grid size-8 shrink-0 place-items-center rounded-xl border-2 border-ink bg-lemon font-display text-[11px] font-extrabold">NW</span>
            <span className="min-w-0 flex-1 truncate text-left text-xs font-bold">{workspace}</span>
            <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="absolute left-0 right-0 top-[54px] z-50 rounded-2xl border-2 border-ink bg-paper p-1.5 text-ink shadow-hard">
            {workspaces.map((name) => (
              <button key={name} type="button" onClick={(event) => { setWorkspace(name); event.currentTarget.closest('details')?.removeAttribute('open') }} className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-semibold hover:bg-cream">
                <span className={cn('size-2 rounded-full', workspace === name ? 'bg-ember' : 'bg-ink/20')} />{name}
              </button>
            ))}
          </div>
        </details>
      )}

      <div className={cn('flex items-center justify-between px-1', collapsed && 'flex-col gap-3')}>
        <Wordmark compact={collapsed} />
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          className="grid size-9 place-items-center rounded-xl border border-transparent text-muted-foreground hover:border-ink/15 hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-ring"
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
      </div>

      <nav aria-label="Primary" className={cn('mt-5 flex flex-1 flex-col gap-4 overflow-y-auto pb-4', collapsed && 'items-center')} onMouseLeave={() => setHovered(null)}>
        {(['WORKSPACE', 'LIBRARY'] as const).map((group) => (
          <div key={group} className={cn('flex flex-col gap-1', collapsed && 'w-full')}>
            {!collapsed && <p className="px-2 pb-1 font-mono text-[9px] font-bold tracking-[0.16em] text-muted-foreground">{group}</p>}
            {navItems.filter((item) => item.group === group).map((item) => {
              const active = isActive(pathname, item.href)
              const isHighlighted = indicatorKey === item.key
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? `${item.label} · ${item.shortcut}` : undefined}
                  aria-label={collapsed ? `${item.label}, shortcut ${item.shortcut}` : undefined}
                  aria-current={active ? 'page' : undefined}
                  onMouseEnter={() => setHovered(item.key)}
                  className={cn(
                    'relative z-0 flex h-[46px] min-w-0 items-center gap-2.5 rounded-xl px-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    active || isHighlighted ? 'text-ink' : 'text-muted-foreground hover:text-ink',
                    collapsed && 'mx-auto w-12 justify-center px-0',
                  )}
                >
                  {(active || isHighlighted) && (
                    <motion.span layoutId="sidebar-active-indicator" aria-hidden="true" className="absolute inset-0 -z-10 rounded-xl border-2 border-ink bg-paper shadow-hard-sm" transition={{ type: 'spring', stiffness: 540, damping: 34, mass: 0.72 }} />
                  )}
                  <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl border-2 border-ink text-ink transition-transform', item.iconColor, !collapsed && 'wobble')}>
                    <item.icon className="size-[17px]" aria-hidden="true" />
                  </span>
                  {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
                  {!collapsed && item.count && (
                    <span className={cn('rounded-full border border-ink/25 px-2 py-0.5 font-mono text-[10px] font-semibold text-ink', item.key === 'c' ? 'bg-ember' : item.key === 'm' ? 'bg-mint' : 'bg-paper')}>
                      {item.count}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
        <div className="mt-auto flex flex-col gap-3">
          <MemoryHealth collapsed={collapsed} />
          {!collapsed && (
            <section aria-label="On-call handover" className="relative overflow-hidden rounded-2xl border-2 border-ink bg-paper p-3.5 shadow-hard-sm">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2" aria-label="On-call team: Priya, Mateo and Jules">
                  <span className="grid size-7 place-items-center rounded-full border-2 border-paper bg-bubblegum font-mono text-[9px] font-bold text-ink">PS</span>
                  <span className="grid size-7 place-items-center rounded-full border-2 border-paper bg-sky font-mono text-[9px] font-bold text-ink">MK</span>
                  <span className="grid size-7 place-items-center rounded-full border-2 border-paper bg-lemon font-mono text-[9px] font-bold text-ink">JL</span>
                </div>
                <div className="min-w-0"><p className="truncate text-[11px] font-bold">on-call: priya s.</p><p className="font-mono text-[9px] text-muted-foreground">handover in 3h 12m</p></div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10"><div className="h-full w-[61%] rounded-full bg-ember" /></div>
              <Elio pose="idle" size={40} className="absolute -bottom-1 right-0" />
            </section>
          )}
          <button type="button" onClick={onStartDemo} title={collapsed ? 'Guided demo' : undefined} className={cn('flex h-10 items-center gap-2 rounded-xl border-2 border-ink bg-ember px-3 text-xs font-bold text-ink shadow-hard-sm transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none', collapsed && 'mx-auto w-12 justify-center px-0')}>
            <Play className="size-3.5 fill-current" aria-hidden="true" />
            {!collapsed && 'Guided demo'}
          </button>
        </div>
      </nav>
    </aside>
  )
}

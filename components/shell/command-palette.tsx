'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert, CornerDownLeft, History, Moon, NotebookPen, Play, Plus, Search, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navItems } from './nav'

type Group = 'Recent' | 'Navigate' | 'Incidents' | 'Memories' | 'Actions'

type CommandItem = {
  id: string
  group: Exclude<Group, 'Recent'>
  label: string
  meta?: string
  hint?: string
  icon: LucideIcon
  keywords?: string
  run: () => void
}

const RECENT_KEY = 'recall:recent-commands'
const groupOrder: Group[] = ['Recent', 'Navigate', 'Incidents', 'Memories', 'Actions']

function readRecent(): string[] {
  try {
    return JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function CommandPalette({
  open,
  onClose,
  onStartDemo,
}: {
  open: boolean
  onClose: () => void
  onStartDemo: () => void
}) {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [recent, setRecent] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const items = useMemo<CommandItem[]>(
    () => [
      ...navItems.map((item) => ({
        id: `nav:${item.href}`,
        group: 'Navigate' as const,
        label: `Go to ${item.label}`,
        hint: `G ${item.key.toUpperCase()}`,
        icon: item.icon,
        run: () => router.push(item.href),
      })),
      { id: 'inc:2041', group: 'Incidents', label: 'Auth gateway latency', meta: 'INC-2041', icon: CircleAlert, keywords: 'p1 auth', run: () => router.push('/console') },
      { id: 'inc:2039', group: 'Incidents', label: 'Payments queue backlog', meta: 'INC-2039', icon: CircleAlert, keywords: 'p2 payments', run: () => router.push('/console') },
      { id: 'inc:2034', group: 'Incidents', label: 'Search index lag', meta: 'INC-2034', icon: CircleAlert, keywords: 'p3 search', run: () => router.push('/console') },
      { id: 'mem:8f42', group: 'Memories', label: 'Restart auth gateway pods', meta: 'mem_8f42', icon: History, keywords: 'auth fix', run: () => router.push('/memory') },
      { id: 'mem:7bc1', group: 'Memories', label: 'Redis failover for payments-api', meta: 'mem_7bc1', icon: History, keywords: 'redis', run: () => router.push('/memory') },
      { id: 'mem:51aa', group: 'Memories', label: 'Freeze deploys on Friday afternoons', meta: 'mem_51aa', icon: History, keywords: 'habit deploy', run: () => router.push('/memory') },
      { id: 'act:demo', group: 'Actions', label: 'Start guided demo', icon: Play, keywords: 'tour walkthrough', run: onStartDemo },
      { id: 'act:theme', group: 'Actions', label: `Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`, icon: Moon, keywords: 'dark light appearance', run: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark') },
      { id: 'act:incident', group: 'Actions', label: 'Declare new incident', icon: Plus, keywords: 'create', run: () => router.push('/console') },
      { id: 'act:retain', group: 'Actions', label: 'Retain a note to memory', icon: NotebookPen, keywords: 'add memory', run: () => router.push('/memory') },
    ],
    [router, onStartDemo, resolvedTheme, setTheme],
  )

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = (item: CommandItem) =>
      !q || `${item.label} ${item.meta ?? ''} ${item.keywords ?? ''} ${item.group}`.toLowerCase().includes(q)
    const byGroup = new Map<Group, CommandItem[]>()
    if (!q) {
      const recentItems = recent.map((id) => items.find((item) => item.id === id)).filter(Boolean) as CommandItem[]
      if (recentItems.length) byGroup.set('Recent', recentItems)
    }
    for (const item of items) {
      if (!matches(item)) continue
      if (!q && byGroup.get('Recent')?.some((r) => r.id === item.id)) continue
      byGroup.set(item.group, [...(byGroup.get(item.group) ?? []), item])
    }
    return groupOrder.filter((g) => byGroup.has(g)).map((g) => ({ group: g, items: byGroup.get(g)! }))
  }, [items, query, recent])

  const flat = useMemo(() => sections.flatMap((s) => s.items), [sections])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActiveIndex(0)
    setRecent(readRecent())
    const previous = document.activeElement as HTMLElement | null
    requestAnimationFrame(() => inputRef.current?.focus())
    return () => previous?.focus?.()
  }, [open])

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const runItem = (item: CommandItem) => {
    const next = [item.id, ...readRecent().filter((id) => id !== item.id)].slice(0, 4)
    try {
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(next))
    } catch {}
    onClose()
    item.run()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (flat.length ? (i + 1) % flat.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0))
    } else if (e.key === 'Enter') {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return
      e.preventDefault()
      const item = flat[activeIndex]
      if (item) runItem(item)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      onClose()
    } else if (e.key === 'Tab') {
      e.preventDefault()
    }
  }

  const optionId = (index: number) => `${listId}-opt-${index}`
  let running = -1

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-foreground/30 px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.2, 0.7, 0.2, 1] }}
            className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-lift"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="size-4 text-muted-foreground" aria-hidden="true" />
              <input
                ref={inputRef}
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={flat.length ? optionId(activeIndex) : undefined}
                aria-autocomplete="list"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActiveIndex(0)
                }}
                placeholder="Search incidents, memories, pages…"
                className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded border border-border px-1.5 font-mono text-[10px] text-muted-foreground">ESC</kbd>
            </div>

            <div ref={listRef} id={listId} role="listbox" aria-label="Commands" className="max-h-[min(420px,60vh)] overflow-y-auto p-2">
              {flat.length === 0 && (
                <p className="px-3 py-10 text-center text-sm text-muted-foreground">
                  No results for <span className="font-semibold text-foreground">{`"${query}"`}</span>
                </p>
              )}
              {sections.map((section) => (
                <div key={section.group} role="group" aria-labelledby={`${listId}-${section.group}`} className="pb-1">
                  <p id={`${listId}-${section.group}`} className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.group}
                  </p>
                  {section.items.map((item) => {
                    running += 1
                    const index = running
                    const selected = index === activeIndex
                    const isMemory = item.group === 'Memories'
                    return (
                      <div
                        key={`${section.group}-${item.id}`}
                        id={optionId(index)}
                        role="option"
                        aria-selected={selected}
                        onMouseMove={() => setActiveIndex(index)}
                        onClick={() => runItem(item)}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm',
                          selected ? 'bg-muted text-foreground' : 'text-foreground/85',
                        )}
                      >
                        <item.icon
                          className={cn('size-4 shrink-0', isMemory ? 'text-viridian' : 'text-muted-foreground', selected && !isMemory && 'text-primary')}
                          aria-hidden="true"
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.meta && (
                          <span className={cn('font-mono text-[11px]', isMemory ? 'text-viridian' : 'text-muted-foreground')}>{item.meta}</span>
                        )}
                        {item.hint && (
                          <kbd className="rounded border border-border px-1.5 font-mono text-[10px] text-muted-foreground">{item.hint}</kbd>
                        )}
                        {selected && <CornerDownLeft className="size-3.5 text-muted-foreground" aria-hidden="true" />}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 border-t border-border bg-background px-4 py-2 text-[11px] text-muted-foreground">
              <span><kbd className="font-mono">↑↓</kbd> navigate</span>
              <span><kbd className="font-mono">↵</kbd> open</span>
              <span className="ml-auto"><kbd className="font-mono">⌘K</kbd> toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

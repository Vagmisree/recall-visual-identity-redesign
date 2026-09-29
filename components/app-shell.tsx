'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { motion, useScroll } from 'framer-motion'
import { Bell, Moon, Search, Sun } from 'lucide-react'
import { ThreadLayer, ThreadProvider } from '@/components/threads'
import { GuidedDemo, useGuidedDemo } from '@/components/guided-demo'
import { Sidebar } from './shell/sidebar'
import { MobileTabs } from './shell/mobile-tabs'
import { CommandPalette } from './shell/command-palette'
import { EnvSwitch, type Env } from './shell/env-switch'
import { LiveFeed } from './shell/live-feed'
import { navItems, titleFor } from './shell/nav'
import { Wordmark } from './shell/wordmark'
import { QuirkSwitch } from './quirk/quirk-switch'
import { Elio } from './quirk/elio'

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null
  return !!el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))
}

const notifications = [
  { title: 'A familiar auth pattern surfaced', detail: 'INC-2041 · 3 min ago', color: 'bg-ember' },
  { title: 'Memory sync finished', detail: '12 records added · 18 min ago', color: 'bg-mint' },
  { title: 'Priya handed off payments-api', detail: 'On-call note · 42 min ago', color: 'bg-sky' },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThreadProvider>
      <GuidedDemo>
        <Shell>{children}</Shell>
      </GuidedDemo>
    </ThreadProvider>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const { start: startDemo } = useGuidedDemo()
  const [collapsed, setCollapsed] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [env, setEnv] = useState<Env>('production')
  const pendingG = useRef<number | null>(null)
  const { scrollYProgress } = useScroll()

  const openDemo = useCallback(() => {
    setPaletteOpen(false)
    startDemo()
  }, [startDemo])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((open) => !open)
        return
      }
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return
      if (pendingG.current) {
        const item = navItems.find((n) => n.key === e.key.toLowerCase())
        window.clearTimeout(pendingG.current)
        pendingG.current = null
        if (item) router.push(item.href)
        return
      }
      if (e.key.toLowerCase() === 'g') {
        pendingG.current = window.setTimeout(() => (pendingG.current = null), 900)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (pendingG.current) window.clearTimeout(pendingG.current)
    }
  }, [router])

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[120] h-[3px] origin-left bg-ember"
        style={{ scaleX: scrollYProgress }}
      />
      <Sidebar pathname={pathname} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} onStartDemo={openDemo} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[68px] shrink-0 items-center gap-3 border-b-2 border-ink bg-paper px-3 text-ink sm:px-5">
          <Wordmark className="md:hidden text-ink" />
          <nav aria-label="Breadcrumb" className="hidden min-w-0 text-xs 2xl:block">
            <ol className="flex items-center gap-2 font-mono">
              <li className="truncate text-muted-foreground">northwind payments</li>
              <li aria-hidden="true" className="text-muted-foreground/60">/</li>
              <li aria-current="page" className="font-semibold">{titleFor(pathname).toLowerCase()}</li>
            </ol>
          </nav>

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            aria-label="Search Recall, open command palette"
            className="ml-auto flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border-2 border-ink bg-cream px-3 text-sm text-muted-foreground transition hover:bg-paper focus-visible:outline-2 focus-visible:outline-primary sm:ml-0 sm:flex-none lg:w-[min(13vw,180px)]"
          >
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span className="hidden truncate sm:inline 2xl:hidden">Search</span>
            <span className="hidden truncate 2xl:inline">Search Recall</span>
            <kbd className="ml-auto hidden shrink-0 rounded border border-ink/20 px-1.5 font-mono text-[10px] text-ink/70 sm:inline">⌘K</kbd>
          </button>

          <div className="hidden lg:block"><EnvSwitch value={env} onChange={setEnv} /></div>
          <div aria-label="Hindsight connected · 1,284 memories" className="topbar-memory-compact on-bright items-center gap-1.5 rounded-full border-2 border-ink bg-mint px-2 py-2 font-mono text-[8px] font-bold whitespace-nowrap text-ink shadow-hard-sm">
            <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-viridian" />hindsight · 1,284
          </div>
          <div className="on-bright hidden items-center gap-2 rounded-full border-2 border-ink bg-mint px-3 py-2 text-[11px] font-semibold text-ink shadow-hard-sm 2xl:flex">
            <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-viridian" />
            hindsight connected <span className="font-mono">· 1,284 memories</span>
          </div>
          <details className="relative hidden sm:block">
            <summary aria-label="Notifications" className="grid size-10 cursor-pointer list-none place-items-center rounded-xl border-2 border-ink bg-paper [&::-webkit-details-marker]:hidden">
              <Bell className="size-4" aria-hidden="true" />
              <span aria-hidden="true" className="absolute right-2 top-2 size-2 rounded-full border border-paper bg-ember" />
            </summary>
            <div className="absolute right-0 top-12 z-50 w-[min(340px,calc(100vw-24px))] rounded-2xl border-2 border-ink bg-paper p-3 text-ink shadow-hard">
              <div className="flex items-center justify-between px-2 pb-2">
                <p className="font-display text-lg font-bold">Notifications</p>
                <span className="rounded-full bg-ember px-2 py-0.5 font-mono text-[10px] font-bold">3 new</span>
              </div>
              <ul className="flex flex-col">
                {notifications.map((item) => (
                  <li key={item.title} className="flex gap-3 border-t border-ink/10 px-2 py-3">
                    <span className={`mt-1.5 size-2 shrink-0 rounded-full ${item.color}`} />
                    <div><p className="text-xs font-semibold">{item.title}</p><p className="mt-1 font-mono text-[10px] text-muted-foreground">{item.detail}</p></div>
                  </li>
                ))}
              </ul>
            </div>
          </details>
          <div className="hidden items-center gap-1.5 lg:flex">
            <Elio pose="idle" size={28} label="Elio the elephant" />
            <QuirkSwitch />
          </div>
          <button
            type="button"
            onClick={openDemo}
            className="hidden h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border-2 border-ink bg-ember px-3 text-xs font-bold text-ink shadow-hard-sm transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none lg:flex"
          >
            <span className="font-mono">▶</span> Guided demo
          </button>
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle colour theme"
            className="grid size-10 shrink-0 place-items-center rounded-xl border-2 border-ink bg-paper text-ink hover:bg-cream focus-visible:outline-2 focus-visible:outline-primary"
          >
            <Moon className="size-4 dark:hidden" aria-hidden="true" />
            <Sun className="hidden size-4 dark:block" aria-hidden="true" />
          </button>
          <span aria-label="Signed in as Priya Shah" role="img" className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-ink bg-bubblegum text-[10px] font-extrabold text-ink">PS</span>
        </header>

        <motion.main
          key={pathname}
          id="main"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="min-w-0 flex-1 px-4 py-6 pb-28 sm:px-6 md:px-8 md:py-8 md:pb-14"
        >
          {children}
        </motion.main>

        <LiveFeed />
      </div>

      <MobileTabs pathname={pathname} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onStartDemo={openDemo} />
      <ThreadLayer />
    </div>
  )
}


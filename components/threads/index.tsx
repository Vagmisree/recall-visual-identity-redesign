'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { usePreferences } from '@/components/preferences'
import { cn } from '@/lib/utils'

const WIDE_QUERY = '(min-width: 1024px)'

type Registry = Map<string, HTMLElement>

type ThreadCtx = {
  anchors: React.RefObject<Registry>
  targets: React.RefObject<Registry>
  active: string | null
  pinned: ReadonlySet<string>
  hoverEnabled: boolean
  activate: (id: string) => void
  deactivate: (id: string) => void
  togglePin: (id: string) => void
}

const Ctx = createContext<ThreadCtx | null>(null)

function useThreadContext() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('Thread hooks must be used inside ThreadProvider')
  return ctx
}

function subscribeWide(callback: () => void) {
  const query = window.matchMedia(WIDE_QUERY)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

function useIsWide() {
  return useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE_QUERY).matches,
    () => true,
  )
}

function describe(el: HTMLElement | undefined) {
  if (!el) return ''
  const label = el.getAttribute('aria-label') ?? el.textContent ?? ''
  const clean = label.replace(/\s+/g, ' ').trim()
  return clean.length > 80 ? `${clean.slice(0, 77)}…` : clean
}

export function ThreadProvider({ children }: { children: React.ReactNode }) {
  const anchors = useRef<Registry>(new Map())
  const targets = useRef<Registry>(new Map())
  const [active, setActive] = useState<string | null>(null)
  const [pinned, setPinned] = useState<Set<string>>(() => new Set())
  const [announcement, setAnnouncement] = useState('')
  const { prefs, reducedMotion } = usePreferences()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setPinned((current) => (current.size ? new Set() : current))
      setActive(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const reveal = useCallback(
    (id: string) => {
      const target = targets.current.get(id)
      if (target) {
        setAnnouncement(`Citation linked to source: ${describe(target)}`)
      }
      if (!target || window.matchMedia(WIDE_QUERY).matches) return
      const rect = target.getBoundingClientRect()
      const inView = rect.top >= 0 && rect.bottom <= window.innerHeight
      if (!inView) target.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'auto' : 'smooth' })
    },
    [reducedMotion],
  )

  const activate = useCallback(
    (id: string) => {
      setActive(id)
      reveal(id)
    },
    [reveal],
  )

  const deactivate = useCallback((id: string) => {
    setActive((current) => (current === id ? null : current))
  }, [])

  const togglePin = useCallback(
    (id: string) => {
      setPinned((current) => {
        const next = new Set(current)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
      reveal(id)
    },
    [reveal],
  )

  const value = useMemo<ThreadCtx>(
    () => ({
      anchors,
      targets,
      active,
      pinned,
      hoverEnabled: prefs.threadsOnHover,
      activate,
      deactivate,
      togglePin,
    }),
    [active, pinned, prefs.threadsOnHover, activate, deactivate, togglePin],
  )

  return (
    <Ctx.Provider value={value}>
      {children}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </Ctx.Provider>
  )
}

/**
 * Props for a citation that threads to a source record. Spread the returned object once:
 * it already includes the ref, so do not pass a separate ref.
 */
export function useThreadAnchor(id: string) {
  const ctx = useThreadContext()
  const { anchors, hoverEnabled, activate, deactivate, togglePin } = ctx
  const ref = useCallback(
    (el: HTMLElement | null) => {
      if (el) anchors.current.set(id, el)
      else anchors.current.delete(id)
    },
    [anchors, id],
  )
  return {
    ref,
    onMouseEnter: () => hoverEnabled && activate(id),
    onMouseLeave: () => deactivate(id),
    onFocus: () => activate(id),
    onBlur: () => deactivate(id),
    onClick: () => togglePin(id),
    'aria-pressed': ctx.pinned.has(id),
    'data-thread-anchor': id,
  } as const
}

/**
 * Props for a source record. Pass the element's own className so the thread state
 * (dimmed or highlighted) is merged with it rather than overwriting it.
 */
export function useThreadTarget(id: string, className?: string) {
  const { targets, active, pinned } = useThreadContext()
  const ref = useCallback(
    (el: HTMLElement | null) => {
      if (el) targets.current.set(id, el)
      else targets.current.delete(id)
    },
    [targets, id],
  )
  const lit = active === id || pinned.has(id)
  const anyLit = active !== null || pinned.size > 0
  return {
    ref,
    className: cn(
      className,
      'transition-[opacity,box-shadow,border-color] duration-200',
      anyLit && !lit && 'opacity-45',
      lit && 'border-l-2 border-l-viridian shadow-soft',
    ),
    'data-thread-target': id,
    'data-thread-state': lit ? 'linked' : anyLit ? 'dimmed' : 'idle',
  } as const
}

type Thread = { id: string; d: string; start: [number, number]; end: [number, number] }

function buildPath(a: DOMRect, t: DOMRect): Omit<Thread, 'id'> {
  const ay = a.top + a.height / 2
  const ty = t.top + t.height / 2
  if (t.left >= a.right - 4) {
    const start: [number, number] = [a.right + 2, ay]
    const end: [number, number] = [t.left, ty]
    const bend = Math.max(24, (end[0] - start[0]) * 0.45)
    return {
      start,
      end,
      d: `M ${start[0]} ${start[1]} C ${start[0] + bend} ${start[1]}, ${end[0] - bend} ${end[1]}, ${end[0]} ${end[1]}`,
    }
  }
  if (t.right <= a.left + 4) {
    const start: [number, number] = [a.left - 2, ay]
    const end: [number, number] = [t.right, ty]
    const bend = Math.max(24, (start[0] - end[0]) * 0.45)
    return {
      start,
      end,
      d: `M ${start[0]} ${start[1]} C ${start[0] - bend} ${start[1]}, ${end[0] + bend} ${end[1]}, ${end[0]} ${end[1]}`,
    }
  }
  const below = ty > ay
  const start: [number, number] = [a.left + a.width / 2, below ? a.bottom + 2 : a.top - 2]
  const end: [number, number] = [t.left, ty]
  const drop = Math.max(24, Math.abs(end[1] - start[1]) * 0.5)
  return {
    start,
    end,
    d: `M ${start[0]} ${start[1]} C ${start[0]} ${start[1] + (below ? drop : -drop)}, ${end[0] - 36} ${end[1]}, ${end[0]} ${end[1]}`,
  }
}

export function ThreadLayer() {
  const ctx = useThreadContext()
  const { reducedMotion } = usePreferences()
  const wide = useIsWide()
  const [threads, setThreads] = useState<Thread[]>([])
  const { active, pinned, anchors, targets } = ctx

  const ids = useMemo(() => {
    const list = [...pinned]
    if (active && !pinned.has(active)) list.push(active)
    return list
  }, [active, pinned])

  useEffect(() => {
    if (!wide || ids.length === 0) {
      setThreads([])
      return
    }
    let frame = 0
    const measure = () => {
      frame = 0
      const next: Thread[] = []
      for (const id of ids) {
        const a = anchors.current.get(id)
        const t = targets.current.get(id)
        if (!a?.isConnected || !t?.isConnected) continue
        next.push({ id, ...buildPath(a.getBoundingClientRect(), t.getBoundingClientRect()) })
      }
      setThreads(next)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    const observer = new ResizeObserver(schedule)
    observer.observe(document.body)
    for (const id of ids) {
      const a = anchors.current.get(id)
      const t = targets.current.get(id)
      if (a) observer.observe(a)
      if (t) observer.observe(t)
    }
    window.addEventListener('scroll', schedule, { capture: true, passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule, { capture: true })
      window.removeEventListener('resize', schedule)
    }
  }, [ids, wide, anchors, targets])

  if (!wide || threads.length === 0) return null

  return (
    <svg className="pointer-events-none fixed inset-0 z-30 h-full w-full overflow-visible" aria-hidden="true">
      {threads.map((thread) => (
        <g key={thread.id}>
          <path
            d={thread.d}
            fill="none"
            stroke="var(--viridian)"
            strokeWidth={1.5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={0}
            style={reducedMotion ? undefined : { animation: 'thread-in 320ms cubic-bezier(.2,.7,.2,1) both' }}
          />
          <circle cx={thread.start[0]} cy={thread.start[1]} r={2} fill="var(--viridian)" />
          <circle cx={thread.end[0]} cy={thread.end[1]} r={3.5} fill="var(--card)" stroke="var(--viridian)" strokeWidth={1.5} />
        </g>
      ))}
    </svg>
  )
}

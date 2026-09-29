'use client'

import { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { usePreferences } from '@/components/preferences'
import { cn } from '@/lib/utils'

type Step = { route: string; target: string; title: string; body: string }

const steps: Step[] = [
  { route: '/console', target: 'console-hero', title: 'The on-call console', body: 'Everything active in production, ranked by severity. This is where a responder lands when paged.' },
  { route: '/console', target: 'console-recall', title: 'Recall remembers', body: 'For INC-2041, Hindsight recalled three past incidents with the same fingerprint and drafted a first move.' },
  { route: '/console', target: 'console-sources', title: 'Every claim cites its source', body: 'Hover or focus a citation to draw a thread to the memory it came from. Click to pin it.' },
  { route: '/console', target: 'console-outcome', title: 'Close the loop', body: 'Tell Recall whether the fix worked. The outcome is retained, so the next suggestion is better.' },
  { route: '/memory?view=graph', target: 'memory-graph', title: 'The memory graph', body: 'Incidents, fixes, services and people, linked. Strong edges are fixes that worked more than once.' },
  { route: '/learning', target: 'learning-chart', title: 'It gets faster', body: 'Median time to resolve has fallen as memories accumulate. Each marker is a memory Recall learned from.' },
  { route: '/compare', target: 'compare-stage', title: 'With and without memory', body: 'The same incident, handled by an agent with no memory and one backed by Hindsight.' },
  { route: '/compare', target: 'compare-play', title: 'Watch it learn', body: 'Replay the incident at 1, 5 and 20 occurrences to see the gap widen.' },
]

type DemoCtx = { start: () => void; stop: () => void; active: boolean }
const Ctx = createContext<DemoCtx | null>(null)

export function useGuidedDemo() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useGuidedDemo must be used inside GuidedDemo')
  return ctx
}

type Box = { top: number; left: number; width: number; height: number }
const PAD = 8
const CARD_W = 340

export function GuidedDemo({ children }: { children: React.ReactNode }) {
  const [index, setIndex] = useState(-1)
  const start = useCallback(() => setIndex(0), [])
  const stop = useCallback(() => setIndex(-1), [])
  const value = useMemo(() => ({ start, stop, active: index >= 0 }), [start, stop, index])

  return (
    <Ctx.Provider value={value}>
      {children}
      <AnimatePresence>{index >= 0 && <Tour index={index} setIndex={setIndex} onClose={stop} />}</AnimatePresence>
    </Ctx.Provider>
  )
}

function Tour({ index, setIndex, onClose }: { index: number; setIndex: (i: number) => void; onClose: () => void }) {
  const router = useRouter()
  const pathname = usePathname()
  const { reducedMotion } = usePreferences()
  const [box, setBox] = useState<Box | null>(null)
  const [viewport, setViewport] = useState({ w: 0, h: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const step = steps[index]
  const last = index === steps.length - 1

  useEffect(() => {
    const [path, query = ''] = step.route.split('?')
    const current = window.location.search.replace(/^\?/, '')
    if (pathname !== path || (query && current !== query)) router.push(step.route, { scroll: false })
  }, [step.route, pathname, router])

  useEffect(() => {
    setBox(null)
    let frame = 0
    let found: Element | null = null
    let tries = 0
    let prevBox: Box | null = null
    const tick = () => {
      if (!found || !found.isConnected) {
        found = document.querySelector(`[data-tour="${step.target}"]`)
        if (found) found.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'auto' : 'smooth' })
        else if (++tries > 240) return
      }
      if (found) {
        const r = found.getBoundingClientRect()
        const next = { top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 }
        if (!prevBox || Math.abs(prevBox.top - next.top) + Math.abs(prevBox.left - next.left) + Math.abs(prevBox.width - next.width) + Math.abs(prevBox.height - next.height) > 0.5) {
          prevBox = next
          setBox(next)
        }
      }
      setViewport((v) => (v.w === window.innerWidth && v.h === window.innerHeight ? v : { w: window.innerWidth, h: window.innerHeight }))
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [step.target, reducedMotion, pathname])

  useEffect(() => {
    nextRef.current?.focus({ preventScroll: true })
  }, [index])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') last ? onClose() : setIndex(index + 1)
      else if (e.key === 'ArrowLeft' && index > 0) setIndex(index - 1)
      else if (e.key === 'Tab' && cardRef.current) {
        const focusable = cardRef.current.querySelectorAll<HTMLElement>('button')
        const first = focusable[0]
        const end = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          end.focus()
        } else if (!e.shiftKey && document.activeElement === end) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, last, onClose, setIndex])

  const [cardH, setCardH] = useState(200)
  useLayoutEffect(() => {
    if (cardRef.current) setCardH(cardRef.current.offsetHeight)
  }, [index, viewport.w])

  const { w, h } = viewport
  const cardWidth = Math.min(CARD_W, w - 32)
  let cardPos = { top: h / 2 - cardH / 2, left: w / 2 - cardWidth / 2 }
  if (box && w) {
    const below = box.top + box.height + 14
    const above = box.top - 14 - cardH
    const top = below + cardH < h - 16 ? below : above > 16 ? above : Math.max(16, h - cardH - 16)
    const left = Math.min(Math.max(16, box.left), w - cardWidth - 16)
    cardPos = { top, left }
  }

  const hole = box
    ? `M0 0H${w}V${h}H0Z M${box.left} ${box.top}h${box.width}v${box.height}h${-box.width}Z`
    : `M0 0H${w}V${h}H0Z`
  const transition = reducedMotion ? { duration: 0 } : { type: 'spring' as const, stiffness: 320, damping: 34 }

  return (
    <motion.div
      className="fixed inset-0 z-[60]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.2 }}
    >
      <div className="absolute inset-0" style={{ clipPath: `path(evenodd, '${hole}')` }} />
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <mask id="tour-mask">
            <rect width="100%" height="100%" fill="white" />
            {box && (
              <motion.rect
                initial={false}
                animate={{ x: box.left, y: box.top, width: box.width, height: box.height }}
                transition={transition}
                rx={14}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgb(20 17 15 / 0.55)" mask="url(#tour-mask)" />
        {box && (
          <motion.rect
            initial={false}
            animate={{ x: box.left, y: box.top, width: box.width, height: box.height }}
            transition={transition}
            rx={14}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={2}
          />
        )}
      </svg>

      <motion.div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={false}
        animate={{ top: cardPos.top, left: cardPos.left }}
        transition={transition}
        style={{ width: cardWidth }}
        className="absolute rounded-xl border border-border bg-card p-5 text-foreground shadow-lift"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-muted-foreground">
            {String(index + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="End guided demo"
            className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X className="size-4" />
          </button>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={reducedMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
          >
            <h2 id={titleId} className="mt-2 text-lg font-bold tracking-tight">{step.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-5 flex items-center gap-3">
          <div className="flex gap-1" aria-hidden="true">
            {steps.map((s, i) => (
              <span key={s.target} className={cn('h-1 rounded-full transition-all', i === index ? 'w-4 bg-primary' : 'w-1 bg-border')} />
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => setIndex(index - 1)}
              disabled={index === 0}
              aria-label="Previous step"
              className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-primary"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              ref={nextRef}
              type="button"
              onClick={() => (last ? onClose() : setIndex(index + 1))}
              className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {last ? 'Finish' : 'Next'}
              {!last && <ArrowRight className="size-4" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, Check, ChevronDown, ChevronRight, Clock3, Plus, Play, Search, X } from 'lucide-react'
import { Citation, ThreadTarget } from '@/components/threads/citation'
import { CardDrawerIcon, TinyFlameIcon } from '@/components/quirk/doodles'
import { DigitRoll } from '@/components/quirk/digit-roll'
import { Elio } from '@/components/quirk/elio'
import { Headline } from '@/components/quirk/headline'
import { Stamp } from '@/components/quirk/stamp'
import { Sticker } from '@/components/quirk/sticker'
import { useConfetti } from '@/components/quirk/confetti'
import { useGuidedDemo } from '@/components/guided-demo'
import { usePreferences } from '@/components/preferences'
import { ConsoleMetrics, MetricCaption } from './console-metrics'
import { cn } from '@/lib/utils'

type IncidentStatus = 'open' | 'mitigated' | 'resolved'
type Incident = { id: string; title: string; severity: 'SEV1' | 'SEV2' | 'SEV3'; status: IncidentStatus; service: string; owner: string; age: string }
type Outcome = 'worked' | 'partly' | 'failed'
type PaneSide = 'left' | 'right'

const startingIncidents: Incident[] = [
  { id: 'INC-2041', title: 'Auth gateway latency', severity: 'SEV1', status: 'open', service: 'identity-api', owner: 'PS', age: '14m' },
  { id: 'INC-2039', title: 'Payments queue backlog', severity: 'SEV2', status: 'mitigated', service: 'payments-api', owner: 'MK', age: '1h 02m' },
  { id: 'INC-2034', title: 'Search index lag', severity: 'SEV3', status: 'open', service: 'search', owner: 'JL', age: '3h 40m' },
  { id: 'INC-2028', title: 'Redis failover retries', severity: 'SEV2', status: 'open', service: 'payments-api', owner: 'MK', age: '6h 08m' },
  { id: 'INC-2027', title: 'Worker pool saturation', severity: 'SEV3', status: 'open', service: 'queue-core', owner: 'JL', age: '7h 16m' },
  { id: 'INC-2031', title: 'Billing webhook retries', severity: 'SEV3', status: 'resolved', service: 'billing', owner: 'PS', age: '5h 12m' },
]

const memories = [
  { id: 'war-memory-1', type: 'FIX OUTCOME', label: 'Restarted auth gateway pods after token cache saturation', meta: 'INC-1987 · 12 days ago · resolved in 6m', score: 91, tint: 'bg-mint' },
  { id: 'war-memory-2', type: 'FAILED FIX', label: 'Connection pool resize did not reduce p99 latency', meta: 'INC-1932 · 41 days ago · ineffective', score: 88, tint: 'bg-bubblegum' },
  { id: 'war-memory-3', type: 'ROOT CAUSE', label: 'Latency spike followed the 09:00 cert rotation job', meta: 'INC-1874 · 2 months ago · root cause', score: 84, tint: 'bg-sky' },
]

const filters: { id: IncidentStatus; label: string }[] = [
  { id: 'open', label: 'Open' }, { id: 'mitigated', label: 'Mitigated' }, { id: 'resolved', label: 'Resolved' },
]

function severityClass(severity: Incident['severity']) {
  if (severity === 'SEV1') return 'bg-ember text-ink'
  if (severity === 'SEV2') return 'bg-lemon text-ink'
  return 'bg-paper text-ink'
}

function Avatar({ initials, className }: { initials: string; className?: string }) {
  return <span className={cn('grid size-7 shrink-0 place-items-center rounded-full border-2 border-ink font-mono text-[9px] font-bold text-ink', className)}>{initials}</span>
}

function HeroBand({ onNewIncident, onStartDemo }: { onNewIncident: () => void; onStartDemo: () => void }) {
  const { playful } = usePreferences()
  return (
    <header data-tour="console-hero" className="relative isolate mb-5 overflow-hidden rounded-2xl border-2 border-ink bg-ember p-5 text-ink shadow-hard-sm sm:p-7 lg:min-h-[232px] lg:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 dot-matrix opacity-40" />
      <div className="relative z-10 flex min-h-[190px] flex-col justify-between gap-6 lg:max-w-[62%]">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.17em]">operations / monday, 09:41</p>
          <Headline before="morning, priya." word="three" after=" incidents need you." className="mt-4 max-w-[780px] text-[clamp(2.6rem,5.4vw,4rem)] leading-[0.94] [--ember-word:#14110f] [&_path]:stroke-ink" />
          <p className="mt-3 max-w-lg text-sm font-medium text-ink/80">The queue is moving. Here&apos;s what your team already knows.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={onNewIncident} className="pop-press flex h-11 items-center gap-2 rounded-xl border-2 border-ink bg-paper px-4 text-sm font-bold text-ink shadow-hard"><Plus className="size-4" aria-hidden="true" />New incident</button>
          <button type="button" onClick={onStartDemo} className="pop-press flex h-11 items-center gap-2 rounded-xl border-2 border-ink bg-ink px-4 text-sm font-bold text-cream shadow-hard"><Play className="size-3.5 fill-current" aria-hidden="true" />Start guided demo</button>
        </div>
      </div>
      <div className="pointer-events-none absolute right-5 top-4 hidden h-[205px] w-[310px] lg:block" aria-hidden="true">
        <svg viewBox="0 0 310 205" className="absolute inset-0 size-full overflow-visible">
          <motion.path d="M55 48 C95 20 112 120 165 76 S230 26 268 66" fill="none" stroke="#14110F" strokeWidth="1.5" strokeDasharray="5 5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.3 }} />
          <motion.path d="M70 130 C112 170 152 86 190 130 S238 166 275 122" fill="none" stroke="#14110F" strokeWidth="1.5" strokeDasharray="4 6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.5 }} />
        </svg>
        <div className="absolute left-3 top-8 w-[176px] -rotate-3 rounded-xl border-2 border-ink bg-paper p-3 shadow-hard-sm">
          <p className="font-mono text-[9px] font-bold uppercase">mem_8f42 · fix</p><p className="mt-1 text-[11px] font-semibold leading-snug">Restarted auth gateway pods</p>
        </div>
        <div className="absolute right-1 top-6 w-[148px] rotate-2 rounded-xl border-2 border-ink bg-lemon p-3 shadow-hard-sm">
          <p className="font-mono text-[9px] font-bold uppercase">INC-1987</p><p className="mt-1 text-[11px] font-semibold leading-snug">token cache saturation</p>
        </div>
        <div className="absolute bottom-1 left-16 w-[178px] rotate-1 rounded-xl border-2 border-ink bg-mint p-3 shadow-hard-sm">
          <p className="font-mono text-[9px] font-bold uppercase">91% match</p><p className="mt-1 text-[11px] font-semibold leading-snug">fixed in 6 minutes, last time</p>
        </div>
        {playful && <Elio pose="idle" size={74} className="absolute -bottom-8 right-0" />}
      </div>
      {playful && <Sticker color="lemon" tilt={2} className="absolute right-4 top-3 lg:hidden">memory at work</Sticker>}
    </header>
  )
}

function SignalBanner({ onReview }: { onReview: () => void }) {
  return (
    <section className="on-bright mb-5 flex flex-col gap-4 rounded-2xl border-2 border-ink bg-mint p-4 text-ink shadow-hard-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex min-w-0 items-start gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-xl border-2 border-ink bg-paper"><Search className="size-4" aria-hidden="true" /></div>
        <div className="min-w-0"><p className="font-display text-xl font-extrabold tracking-[-0.04em] sm:text-2xl">you&apos;ve seen this before.</p><p className="mt-1 text-xs text-ink/75">Three useful memories surfaced for INC-2041 <Citation id="war-memory-1" n={1} label="mem_8f42" data-citation-index="1" /> <Citation id="war-memory-2" n={2} label="mem_7bc1" data-citation-index="2" /> <Citation id="war-memory-3" n={3} label="mem_51aa" data-citation-index="3" />.</p></div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <div className="flex -space-x-2" aria-label="Three related memories"><Avatar initials="1" className="bg-mint" /><Avatar initials="2" className="bg-bubblegum" /><Avatar initials="3" className="bg-sky" /></div>
        <button type="button" onClick={onReview} className="flex items-center gap-1 text-xs font-bold underline decoration-1 underline-offset-4">review 3 memories <ArrowRight className="size-3.5" aria-hidden="true" /></button>
      </div>
    </section>
  )
}

function IncidentPane({
  incidents,
  selectedId,
  filter,
  onFilter,
  onSelect,
}: {
  incidents: Incident[]
  selectedId: string
  filter: IncidentStatus
  onFilter: (filter: IncidentStatus) => void
  onSelect: (id: string) => void
}) {
  const shown = incidents.filter((incident) => incident.status === filter)
  const countFor = (status: IncidentStatus) => incidents.filter((incident) => incident.status === status).length
  return (
    <section className="min-h-[620px] overflow-hidden rounded-2xl border-2 border-ink bg-paper text-ink">
      <header className="border-b border-ink/15 px-3.5 py-4">
        <div className="flex items-center justify-between"><div><MetricCaption>incident queue</MetricCaption><h2 className="mt-1 font-display text-lg font-extrabold">Your war room</h2></div><span className="rounded-full border border-ink/20 bg-cream px-2 py-1 font-mono text-[9px] font-bold">{incidents.length} total</span></div>
        <div role="tablist" aria-label="Incident status" className="relative mt-4 grid grid-cols-3 rounded-xl border-2 border-ink bg-cream p-0.5">
          {filters.map((item) => {
            const selected = filter === item.id
            return <button key={item.id} type="button" role="tab" aria-selected={selected} onClick={() => onFilter(item.id)} className={cn('relative z-0 rounded-lg px-1 py-2 text-[10px] font-bold', selected ? 'text-ink' : 'text-muted-foreground hover:text-ink')}>
              {selected && <motion.span layoutId="incident-filter" className="absolute inset-0 -z-10 rounded-lg border border-ink bg-paper shadow-hard-sm" transition={{ type: 'spring', stiffness: 500, damping: 34 }} />}
              <span className="relative">{item.label} <span className="font-mono text-[9px]">{countFor(item.id)}</span></span>
            </button>
          })}
        </div>
      </header>
      <ul className="divide-y divide-ink/10">
        {shown.map((incident) => {
          const selected = selectedId === incident.id
          return <li key={incident.id} className="px-2 py-1.5">
            <button type="button" onClick={() => onSelect(incident.id)} aria-current={selected ? 'true' : undefined} className={cn('flex min-h-[68px] w-full items-center gap-2 rounded-xl border-2 px-2.5 py-2 text-left transition-[transform,box-shadow,border-color]', selected ? 'border-ink bg-cream shadow-hard-sm -translate-y-0.5' : 'border-transparent hover:border-ink/20 hover:bg-cream/70')}>
              <span className={cn('grid min-h-8 min-w-[42px] place-items-center gap-0.5 rounded-lg border-2 border-ink px-1 font-mono text-[8px] font-extrabold', severityClass(incident.severity))}>
                {incident.severity === 'SEV1' && <TinyFlameIcon className="size-3" />}{incident.severity}
              </span>
              <span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-bold leading-tight">{incident.title}</span><span className="mt-1 block truncate font-mono text-[8px] text-muted-foreground">{incident.id} · <span aria-hidden="true" className="mr-1 inline-block size-1.5 rounded-full bg-ink/60 align-middle" />{incident.service}</span></span>
              <span className="flex shrink-0 flex-col items-end gap-1"><Avatar initials={incident.owner} className="size-6 bg-bubblegum text-[8px]" /><span className="font-mono text-[8px] text-muted-foreground">{incident.age}</span></span>
            </button>
          </li>
        })}
      </ul>
      {shown.length === 0 && <div className="grid min-h-[310px] place-items-center p-5 text-center"><div><Elio pose="waving" size={68} essential /><div className="mx-auto mt-2 grid size-11 place-items-center rounded-xl border-2 border-ink bg-lemon"><CardDrawerIcon /></div><p className="mt-3 font-display text-lg font-extrabold">all quiet. suspiciously chill.</p><p className="mt-1 text-xs text-muted-foreground">Nothing in this lane right now.</p></div></div>}
    </section>
  )
}

function CasePane({
  incident,
  elapsed,
  searchState,
  outcome,
  onOutcome,
  onResolve,
  resolved,
  onToast,
}: {
  incident: Incident
  elapsed: number
  searchState: 'searching' | 'done'
  outcome: Outcome | null
  onOutcome: (value: Outcome, target: HTMLElement | null) => void
  onResolve: () => void
  resolved: boolean
  onToast: (message: string) => void
}) {
  const { start: startDemo } = useGuidedDemo()
  const { motionOn } = usePreferences()
  const { confetti, fire } = useConfetti()
  const [logOpen, setLogOpen] = useState(false)
  const [running, setRunning] = useState<number | null>(null)
  const [complete, setComplete] = useState<number[]>([])
  const workedRef = useRef<HTMLButtonElement>(null)
  const mins = Math.floor(elapsed / 60).toString().padStart(2, '0')
  const secs = (elapsed % 60).toString().padStart(2, '0')

  const runAction = useCallback((index: number) => {
    if (running !== null || complete.includes(index)) return
    setRunning(index)
    window.setTimeout(() => {
      setComplete((current) => current.includes(index) ? current : [...current, index])
      setRunning(null)
      onToast('Command finished. Check output before moving on.')
    }, 1300)
  }, [complete, onToast, running])

  return (
    <section className="min-h-[620px] overflow-hidden rounded-2xl border-2 border-ink bg-paper text-ink">
      {confetti}
      <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-ink/15 bg-paper px-4 py-3">
        <div className="min-w-0"><MetricCaption>incident / {incident.service}</MetricCaption><h2 className="mt-1 truncate font-display text-xl font-extrabold">{incident.id} <span className="font-sans text-base font-semibold">· {incident.title}</span></h2></div>
        <div className="flex items-center gap-2">
          {resolved ? <Stamp tone="success">RESOLVED</Stamp> : <span className="inline-flex items-center gap-1.5 rounded-full border border-ember/40 bg-ember/10 px-2.5 py-1 font-mono text-[9px] font-bold text-ember-ink"><span className="size-1.5 animate-pulse rounded-full bg-ember" />LIVE · {mins}:{secs}</span>}
          <button type="button" onClick={onResolve} disabled={resolved} className="rounded-xl border-2 border-ink bg-ink px-3 py-2 text-[10px] font-bold text-cream disabled:opacity-45">{resolved ? 'Resolved' : 'Resolve'}</button>
        </div>
      </header>
      <div className="space-y-4 p-4">
        <div className="rounded-xl border border-ink/15 bg-cream p-3.5">
          <div className="flex items-center justify-between gap-2"><MetricCaption>trigger · 09:27:14 UTC</MetricCaption><button type="button" aria-expanded={logOpen} onClick={() => setLogOpen((open) => !open)} className="inline-flex items-center gap-1 text-[10px] font-bold">{logOpen ? 'Hide log' : 'View log'}<ChevronDown className={cn('size-3.5 transition-transform', logOpen && 'rotate-180')} /></button></div>
          <p className="mt-2 text-xs font-semibold leading-5">p99 latency crossed 2.5s on identity-api after the 09:00 certificate rotation.</p>
          {logOpen && <pre className="mt-3 overflow-x-auto rounded-lg border border-ink/15 bg-paper p-3 font-mono text-[10px] leading-5 text-ink/80">09:27:14.233 WARN auth.cache token lookup exceeded 2500ms{'\n'}09:27:15.019 INFO cert-rotation completed keyset=prod-2026-09{'\n'}09:27:16.402 ERROR gateway pool waiters=482 saturation=0.97</pre>}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-viridian-border bg-viridian-tint px-3 py-2.5 text-viridian-ink">
          {searchState === 'searching' ? <Search className="size-4 shrink-0 animate-pulse" aria-hidden="true" /> : <Check className="size-4 shrink-0" aria-hidden="true" />}
          <p className="min-w-0 flex-1 text-[10px] font-semibold">{searchState === 'searching' ? 'searching memory…' : 'searched memory · 7 records · 3 relevant · best match 91%'}</p>
          {searchState === 'searching' ? <Elio pose="searching" size={34} /> : <span className="font-mono text-[9px]">1.2s</span>}
        </div>

        <div className="rounded-xl border border-ink/15 bg-paper p-3.5">
          <div className="flex items-center justify-between gap-3"><MetricCaption>agent report / memory-backed</MetricCaption><span className="font-mono text-[9px] text-muted-foreground">stream complete</span></div>
          <motion.p key={incident.id} initial={motionOn ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="mt-2 text-xs leading-6"><motion.span initial={motionOn ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}>This looks like the token-cache saturation from 12 days ago. </motion.span><motion.span initial={motionOn ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}>Restarting the auth gateway pods cleared it in six minutes </motion.span><Citation id="war-memory-1" n={1} label="mem_8f42" data-citation-index="1" /><motion.span initial={motionOn ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ delay: 0.48 }}>. Check the cert rotation before touching the connection pool </motion.span><Citation id="war-memory-2" n={2} label="mem_7bc1" data-citation-index="2" /><motion.span initial={motionOn ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ delay: 0.62 }}>.</motion.span></motion.p>
        </div>

        <div>
          <MetricCaption>recommended actions</MetricCaption>
          <ol className="mt-2 space-y-2">
            {['Check the 09:00 certificate rotation job and compare the active keyset.', 'Restart the identity-api gateway pods one availability zone at a time.'].map((step, index) => {
              const done = complete.includes(index)
              const busy = running === index
              return <li key={step} className="rounded-xl border border-ink/15 bg-paper p-3">
                <div className="flex items-start gap-2.5"><span className="grid size-6 shrink-0 place-items-center rounded-lg border border-ink bg-lemon font-mono text-[10px] font-bold">{index + 1}</span><div className="min-w-0 flex-1"><p className="text-[11px] font-semibold leading-5">{step}</p><button type="button" data-run-action={index + 1} onClick={() => runAction(index)} disabled={busy || done} className="mt-2 inline-flex items-center gap-1.5 rounded-lg border-2 border-ink bg-cream px-2.5 py-1.5 text-[9px] font-bold disabled:opacity-60"><Play className="size-3 fill-current" aria-hidden="true" />{busy ? 'Running…' : done ? 'Completed' : 'Run step'}</button></div>{(done || (outcome === 'worked' && index === 0)) && <Stamp tone="success" className="shrink-0">{outcome === 'worked' && index === 0 ? 'WORKED' : 'DONE'}</Stamp>}</div>
                {busy && <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10"><motion.div className="h-full rounded-full bg-ember" initial={{ width: '8%' }} animate={{ width: '100%' }} transition={{ duration: 1.25 }} /></div>}
                {done && <pre className="mt-3 overflow-x-auto rounded-lg border border-ink/15 bg-cream p-2.5 font-mono text-[9px] leading-4">{index === 0 ? 'rotation status: complete\nactive keyset: prod-2026-09' : 'rollout: 3/3 zones healthy\np99 latency: 341ms'}</pre>}
              </li>
            })}
          </ol>
        </div>

        <div className="rounded-xl border border-danger-border bg-danger-tint p-3.5 text-ink">
          <p className="flex items-center gap-2 text-[10px] font-bold"><AlertTriangle className="size-3.5 text-danger" aria-hidden="true" />DO NOT ATTEMPT</p>
          <p className="mt-1.5 text-[11px] leading-5">Avoid resizing the connection pool. It increased queue wait time during the last incident <Citation id="war-memory-2" n={2} label="mem_7bc1" data-citation-index="2" />.</p>
        </div>

        <div className="border-t border-ink/15 pt-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-[11px] font-bold">Did the suggested fix work?</p><div role="radiogroup" aria-label="Fix outcome" className="flex rounded-xl border-2 border-ink bg-cream p-0.5">{([{id:'worked',label:'Worked'},{id:'partly',label:'Partly'},{id:'failed',label:"Didn't work"}] as const).map((option) => <button key={option.id} type="button" role="radio" aria-checked={outcome === option.id} ref={option.id === 'worked' ? workedRef : undefined} onClick={(event) => { onOutcome(option.id, event.currentTarget); if (option.id === 'worked') { fire(workedRef.current); onToast('saved to memory. future you says thanks.') } }} className={cn('rounded-lg px-2.5 py-2 text-[9px] font-bold', outcome === option.id ? 'border border-ink bg-paper shadow-hard-sm' : 'text-muted-foreground hover:text-ink')}>{option.label}</button>)}</div></div>
          {outcome && <p aria-live="polite" className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-viridian"><Check className="size-3.5" />Outcome retained to memory · <span className="font-mono">mem_8f42</span></p>}
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-ink/15 pt-3 font-mono text-[9px] text-muted-foreground"><span className="font-bold uppercase tracking-wider">sources</span><span>·</span><span>7 records</span><span>·</span><button type="button" onClick={startDemo} className="underline underline-offset-2">open incident timeline</button><ChevronRight className="size-3" /></div>
      </div>
    </section>
  )
}

function MemoryPane({ learned }: { learned: number }) {
  const recallScore = Math.min(99, 91 + learned)
  return (
    <aside id="related-memories" className="min-h-[620px] overflow-hidden rounded-2xl border-2 border-ink bg-paper text-ink">
      <header className="border-b border-ink/15 px-3.5 py-4">
        <div className="flex items-center justify-between"><div><MetricCaption>hindsight / 3 records</MetricCaption><h2 className="mt-1 font-display text-lg font-extrabold">Memory echoes</h2></div><div className="relative grid size-11 place-items-center"><svg viewBox="0 0 44 44" className="absolute inset-0 size-full -rotate-90" aria-hidden="true"><circle cx="22" cy="22" r="18" fill="none" stroke="rgb(20 17 15 / .12)" strokeWidth="3"/><circle cx="22" cy="22" r="18" fill="none" stroke="#0B7A6B" strokeWidth="3" strokeDasharray="113" strokeDashoffset={((100 - recallScore) / 100) * 113} strokeLinecap="round"/></svg><span className="font-mono text-[9px] font-bold">{recallScore}%</span></div></div>
        <p className="mt-2 font-mono text-[9px] text-muted-foreground">learned outcomes <DigitRoll value={String(1284 + learned)} /></p>
      </header>
      <ul className="space-y-2.5 p-3">
        {memories.map((memory) => <ThreadTarget key={memory.id} id={memory.id} as="li" aria-label={`${memory.type}: ${memory.label}`} className="rounded-xl border border-ink/15 bg-paper p-3">
          <div className="flex items-start gap-2.5"><span className={cn('grid size-8 shrink-0 place-items-center rounded-lg border border-ink/15', memory.tint)}><span className="font-mono text-[9px] font-extrabold">{memory.type === 'FIX OUTCOME' ? 'FIX' : memory.type === 'FAILED FIX' ? 'NO' : 'WHY'}</span></span><div className="min-w-0 flex-1"><p className="font-mono text-[8px] font-bold tracking-[0.08em]">{memory.type}</p><p className="mt-1 text-[10px] font-semibold leading-4">{memory.label}</p></div></div>
          <div className="mt-2.5 flex items-center justify-between gap-2"><span className="truncate font-mono text-[8px] text-muted-foreground">{memory.meta}</span><span className="font-mono text-[8px] font-bold">{memory.score}%</span></div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full bg-viridian" style={{ width: `${memory.score}%` }} /></div>
        </ThreadTarget>)}
      </ul>
      <div className="mx-3 border-t border-ink/15 py-3"><MetricCaption>memory types</MetricCaption><div className="mt-2 flex flex-wrap gap-1.5">{['fix outcome', 'failed fix', 'root cause'].map((type) => <span key={type} className="rounded-full border border-ink/20 bg-cream px-2 py-1 font-mono text-[8px] font-semibold">{type}</span>)}</div></div>
    </aside>
  )
}

function NewIncidentDialog({ onClose, onCreate }: { onClose: () => void; onCreate: (title: string, service: string) => void }) {
  const [title, setTitle] = useState('')
  const [service, setService] = useState('')
  return <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="new-incident-title" className="w-full max-w-md rounded-2xl border-2 border-ink bg-paper p-5 text-ink shadow-hard">
      <div className="flex items-start justify-between"><div><MetricCaption>northwind payments</MetricCaption><h2 id="new-incident-title" className="mt-1 font-display text-2xl font-extrabold">New incident</h2></div><button type="button" onClick={onClose} aria-label="Close dialog" className="grid size-9 place-items-center rounded-xl border-2 border-ink"><X className="size-4" /></button></div>
      <form className="mt-5 space-y-4" onSubmit={(event) => { event.preventDefault(); if (!title.trim() || !service.trim()) return; onCreate(title.trim(), service.trim()); onClose() }}>
        <label className="block text-xs font-bold">Incident title<input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border-2 border-ink bg-cream px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ember" placeholder="e.g. checkout latency spike" /></label>
        <label className="block text-xs font-bold">Affected service<input value={service} onChange={(event) => setService(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border-2 border-ink bg-cream px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ember" placeholder="e.g. checkout-api" /></label>
        <div className="flex justify-end gap-2 pt-1"><button type="button" onClick={onClose} className="rounded-xl border-2 border-ink bg-paper px-4 py-2.5 text-xs font-bold">Cancel</button><button type="submit" disabled={!title.trim() || !service.trim()} className="rounded-xl border-2 border-ink bg-ember px-4 py-2.5 text-xs font-bold shadow-hard-sm disabled:opacity-50">Create incident</button></div>
      </form>
    </section>
  </div>
}

export function WarRoom() {
  const [incidents, setIncidents] = useState(startingIncidents)
  const [selectedId, setSelectedId] = useState(startingIncidents[0].id)
  const [filter, setFilter] = useState<IncidentStatus>('open')
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [learned, setLearned] = useState(0)
  const [searchState, setSearchState] = useState<'searching' | 'done'>('done')
  const [showNew, setShowNew] = useState(false)
  const [toast, setToast] = useState('')
  const [elapsed, setElapsed] = useState(14 * 60 + 32)
  const [leftWidth, setLeftWidth] = useState(264)
  const [rightWidth, setRightWidth] = useState(304)
  const resizeRef = useRef<{ side: PaneSide; x: number; left: number; right: number } | null>(null)
  const incident = incidents.find((item) => item.id === selectedId) ?? incidents[0]
  const { start: startDemo } = useGuidedDemo()
  const { motionOn } = usePreferences()

  const notify = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast((current) => current === message ? '' : current), 2800)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed((seconds) => seconds + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    setSearchState('searching')
    setOutcome(null)
    const timer = window.setTimeout(() => setSearchState('done'), 1200)
    return () => window.clearTimeout(timer)
  }, [selectedId])

  const resolveIncident = useCallback(() => {
    setIncidents((current) => current.map((item) => item.id === selectedId ? { ...item, status: 'resolved' } : item))
    setFilter('resolved')
    notify('Incident resolved. Its useful bits stay in memory.')
  }, [notify, selectedId])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing = !!target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      if (event.key === 'Escape' && showNew) { setShowNew(false); return }
      if (typing || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() !== 'enter')) return
      const visible = incidents.filter((item) => item.status === filter)
      const selectedIndex = visible.findIndex((item) => item.id === selectedId)
      if (event.key.toLowerCase() === 'j' || event.key.toLowerCase() === 'k') {
        event.preventDefault()
        const delta = event.key.toLowerCase() === 'j' ? 1 : -1
        const next = visible[(selectedIndex + delta + visible.length) % visible.length]
        if (next) setSelectedId(next.id)
      }
      if (event.key.toLowerCase() === 'r') document.querySelector<HTMLButtonElement>('[data-run-action="1"]')?.click()
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') { event.preventDefault(); resolveIncident() }
      if (event.key === '[') document.querySelector<HTMLButtonElement>('[data-citation-index="1"]')?.click()
      if (/^[1-9]$/.test(event.key)) document.querySelector<HTMLButtonElement>(`[data-citation-index="${event.key}"]`)?.click()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [filter, incidents, resolveIncident, selectedId, showNew])

  const startResize = (side: PaneSide, event: React.PointerEvent<HTMLDivElement>) => {
    resizeRef.current = { side, x: event.clientX, left: leftWidth, right: rightWidth }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const moveResize = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = resizeRef.current
    if (!start) return
    const delta = event.clientX - start.x
    if (start.side === 'left') setLeftWidth(Math.min(380, Math.max(220, start.left + delta)))
    else setRightWidth(Math.min(400, Math.max(250, start.right - delta)))
  }
  const stopResize = () => { resizeRef.current = null }

  const filteredCount = useMemo(() => incidents.filter((item) => item.status === 'open').length, [incidents])
  const reviewMemories = () => document.getElementById('related-memories')?.scrollIntoView({ behavior: motionOn ? 'smooth' : 'auto', block: 'center' })
  const createIncident = (title: string, service: string) => {
    const id = `INC-${2042 + incidents.length - startingIncidents.length}`
    const created: Incident = { id, title, service, severity: 'SEV2', status: 'open', owner: 'PS', age: 'now' }
    setIncidents((current) => [created, ...current])
    setSelectedId(id)
    setFilter('open')
    notify('Incident created. Memory search is on the way.')
  }

  if (!incident) return <div className="grid min-h-[60vh] place-items-center"><div className="text-center"><Elio pose="waving" size={100} essential /><h1 className="mt-3 font-display text-3xl font-extrabold">all quiet. suspiciously chill.</h1><p className="mt-2 text-sm text-muted-foreground">Your incident queue is empty.</p></div></div>

  return (
    <div className="mx-auto max-w-[1560px]">
      <HeroBand onNewIncident={() => setShowNew(true)} onStartDemo={startDemo} />
      <div className="mb-5"><ConsoleMetrics openCount={filteredCount} recalled={128 + learned} /></div>
      <div data-tour="console-recall"><SignalBanner onReview={reviewMemories} /></div>

      <div className="mb-3 flex items-center justify-between gap-3"><div><MetricCaption>live workspace / click and drag dividers to resize</MetricCaption><h2 className="mt-1 font-display text-xl font-extrabold tracking-[-0.04em]">Incident response</h2></div><span className="hidden items-center gap-1.5 font-mono text-[9px] text-muted-foreground sm:flex"><Clock3 className="size-3.5" /> updated just now</span></div>
      <div className="lg:flex lg:items-stretch">
        <div className="w-full shrink-0 lg:w-[var(--pane-width)]" style={{ '--pane-width': `${leftWidth}px` } as React.CSSProperties}>
          <IncidentPane incidents={incidents} selectedId={selectedId} filter={filter} onFilter={setFilter} onSelect={setSelectedId} />
        </div>
        <div role="separator" aria-label="Resize incident list" aria-orientation="vertical" tabIndex={0} onPointerDown={(event) => startResize('left', event)} onPointerMove={moveResize} onPointerUp={stopResize} onKeyDown={(event) => { if (event.key === 'ArrowLeft') setLeftWidth((v) => Math.max(220, v - 16)); if (event.key === 'ArrowRight') setLeftWidth((v) => Math.min(380, v + 16)) }} className="hidden w-3 shrink-0 cursor-col-resize touch-none items-center justify-center lg:flex"><span className="h-12 w-1 rounded-full bg-ink/20 hover:bg-ember" /></div>
        <div className="min-w-0 flex-1 py-4 lg:py-0"><CasePane incident={incident} elapsed={elapsed} searchState={searchState} outcome={outcome} onOutcome={(value) => { setOutcome(value); if (value === 'worked') setLearned((count) => count + 1) }} onResolve={resolveIncident} resolved={incident.status === 'resolved'} onToast={notify} /></div>
        <div role="separator" aria-label="Resize memory panel" aria-orientation="vertical" tabIndex={0} onPointerDown={(event) => startResize('right', event)} onPointerMove={moveResize} onPointerUp={stopResize} onKeyDown={(event) => { if (event.key === 'ArrowLeft') setRightWidth((v) => Math.min(400, v + 16)); if (event.key === 'ArrowRight') setRightWidth((v) => Math.max(250, v - 16)) }} className="hidden w-3 shrink-0 cursor-col-resize touch-none items-center justify-center lg:flex"><span className="h-12 w-1 rounded-full bg-ink/20 hover:bg-ember" /></div>
        <div className="w-full shrink-0 lg:w-[var(--pane-width)]" style={{ '--pane-width': `${rightWidth}px` } as React.CSSProperties}><MemoryPane learned={learned} /></div>
      </div>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink/15 pt-3 font-mono text-[9px] text-muted-foreground"><span>shortcuts: J / K move · R run · ⌘↵ resolve · [ pin first · 1–9 pin citations · Esc clear</span><span className="inline-flex items-center gap-1.5"><span className="size-1.5 animate-pulse rounded-full bg-viridian" /> hindsight connected</span></footer>

      {showNew && <NewIncidentDialog onClose={() => setShowNew(false)} onCreate={createIncident} />}
      <div aria-live="polite" className="pointer-events-none fixed bottom-16 right-4 z-[110] sm:bottom-5">
        {toast && <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl border-2 border-ink bg-paper px-4 py-3 text-xs font-bold text-ink shadow-hard">{toast}</motion.p>}
      </div>
    </div>
  )
}

export default WarRoom

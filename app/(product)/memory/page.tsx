'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Archive,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Check,
  ChevronDown,
  Download,
  Filter,
  GitBranch,
  History,
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  BookMarked,
  X,
  Zap,
} from 'lucide-react'

type MemoryType = 'Incident' | 'Cause' | 'Fix' | 'Failed fix' | 'Habit'
type Memory = {
  id: string
  type: MemoryType
  title: string
  service: string
  outcome: 'Worked' | 'Failed' | 'Mixed'
  recalled: number
  success: number
  last: string
  source: string
  text: string
}

const seed: Memory[] = [
  {
    id: 'mem_8f42',
    type: 'Fix',
    title: 'Restarting the auth gateway clears stale connection pools',
    service: 'Auth Gateway',
    outcome: 'Worked',
    recalled: 18,
    success: 94,
    last: 'Today, 09:42',
    source: 'INC-2041',
    text: 'When auth gateway latency spikes after a deploy, restart the gateway pods before changing upstream timeouts. This cleared stale connection pools in 5 of 6 incidents.',
  },
  {
    id: 'mem_7bc1',
    type: 'Cause',
    title: 'Kafka consumer lag follows partition rebalances',
    service: 'Kafka',
    outcome: 'Worked',
    recalled: 12,
    success: 88,
    last: 'Yesterday, 16:08',
    source: 'INC-1988',
    text: 'Consumer lag is usually a symptom of a partition rebalance after broker pressure. Check the rebalance timeline before scaling consumers.',
  },
  {
    id: 'mem_51aa',
    type: 'Failed fix',
    title: 'Do not increase timeout values for the webhook worker',
    service: 'Webhooks',
    outcome: 'Failed',
    recalled: 8,
    success: 21,
    last: 'Sep 24, 11:31',
    source: 'INC-1933',
    text: 'Increasing the timeout masked the queue saturation and caused more retries. Prefer draining the queue and restoring worker capacity.',
  },
  {
    id: 'mem_44d2',
    type: 'Incident',
    title: 'Checkout errors caused by expired feature flag config',
    service: 'Checkout',
    outcome: 'Mixed',
    recalled: 7,
    success: 64,
    last: 'Sep 22, 14:12',
    source: 'INC-1901',
    text: 'A stale flag configuration can make checkout fail only for a subset of regions. Compare the config version between healthy and unhealthy pods.',
  },
  {
    id: 'mem_31ce',
    type: 'Habit',
    title: 'Always capture the deploy SHA in the incident opening note',
    service: 'Platform',
    outcome: 'Worked',
    recalled: 5,
    success: 100,
    last: 'Sep 18, 08:04',
    source: 'RUN-082',
    text: 'The deploy SHA makes correlation with release events immediate and prevents a second round of questions during handoff.',
  },
]
const types: MemoryType[] = ['Incident', 'Cause', 'Fix', 'Failed fix', 'Habit']
const typeTone: Record<MemoryType, string> = {
  Incident: 'bg-card border-border text-muted-foreground',
  Cause: 'bg-viridian-tint border-viridian-border text-viridian',
  Fix: 'bg-viridian-tint border-viridian-border text-viridian',
  'Failed fix': 'bg-danger-tint border-danger-border text-danger',
  Habit: 'bg-warn-tint border-warn-border text-warn',
}

function Ring({ value }: { value: number }) {
  return (
    <div
      className="relative grid size-10 place-items-center rounded-full"
      style={{ background: `conic-gradient(var(--viridian) ${value}%, var(--viridian-tint) 0)` }}
    >
      <div className="grid size-7 place-items-center rounded-full bg-card font-mono text-[9px] text-viridian">
        {value}%
      </div>
    </div>
  )
}
function TypeBadge({ type }: { type: MemoryType }) {
  return (
    <span
      className={`inline-flex rounded-md border px-2 py-1 font-mono text-[9px] uppercase tracking-wide ${typeTone[type]}`}
    >
      {type}
    </span>
  )
}
function Header({ onRetain, onExport }: { onRetain: () => void; onExport: () => void }) {
  return (
    <>
      <div className="flex flex-col gap-5 border-b pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[.18em] text-viridian">
            Recall / persistent memory
          </div>
          <h1 className="mt-2 text-4xl font-bold tracking-[-.06em] md:text-5xl">
            Memory <em className="serif-italic">explorer</em>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Everything the agent has retained, and how often it has proved useful.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-semibold hover:bg-muted"
          >
            <Download className="size-4" />
            Export
          </button>
          <button
            onClick={onRetain}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-hover"
          >
            <Plus className="size-4" />
            Retain a note
          </button>
        </div>
      </div>
      <div className="mt-6 h-32 overflow-hidden rounded-[14px] border bg-muted md:h-44">
        <img
          className="h-full w-full object-cover"
          alt="A bright archive with orderly shelves"
          src="https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1800&q=85"
        />
      </div>
    </>
  )
}
function Summary() {
  return (
    <div className="mt-4 grid grid-cols-1 divide-y divide-viridian-border rounded-[14px] border border-viridian-border bg-viridian-tint px-5 py-4 text-viridian-ink md:grid-cols-3 md:divide-x md:divide-y-0">
      <div className="pb-3 md:pb-0">
        <strong className="font-mono text-2xl tracking-[-.08em]">12,842</strong>
        <p className="mt-1 text-xs text-viridian-muted">total records</p>
      </div>
      <div className="py-3 md:px-6 md:py-0">
        <strong className="font-mono text-2xl tracking-[-.08em]">84.6%</strong>
        <p className="mt-1 text-xs text-viridian-muted">average success rate</p>
      </div>
      <div className="pt-3 md:px-6 md:pt-0">
        <strong className="block truncate font-mono text-lg tracking-[-.06em]">auth gateway restart</strong>
        <p className="mt-1 text-xs text-viridian-muted">most-recalled record · 18 recalls</p>
      </div>
    </div>
  )
}
function Filters({
  query,
  setQuery,
  active,
  setActive,
}: {
  query: string
  setQuery: (v: string) => void
  active: MemoryType[]
  setActive: (v: MemoryType[]) => void
}) {
  return (
    <div className="mt-6 rounded-[14px] border bg-card p-3 shadow-soft">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3 py-2">
          <Search className="size-4 text-muted-foreground" />
          <input
            aria-label="Search memories"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Semantic search memories..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          <span className="hidden rounded border bg-card px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground md:inline">
            ⌘ K
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {types.map((type) => (
            <button
              key={type}
              onClick={() =>
                setActive(active.includes(type) ? active.filter((x) => x !== type) : [...active, type])
              }
              className={`rounded-md border px-2.5 py-1.5 text-xs font-semibold transition ${active.includes(type) ? typeTone[type] : 'bg-card text-muted-foreground hover:bg-muted'}`}
            >
              {type}
            </button>
          ))}
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted">
          <Filter className="size-3.5" />
          More filters
          <ChevronDown className="size-3.5" />
        </button>
      </div>
      {(active.length > 0 || query) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Active</span>
          {active.map((type) => (
            <button
              key={type}
              onClick={() => setActive(active.filter((x) => x !== type))}
              className="inline-flex items-center gap-1 rounded-full bg-viridian-tint px-2 py-1 text-[10px] font-semibold text-viridian"
            >
              {type}
              <X className="size-3" />
            </button>
          ))}
          {query && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px]">
              “{query}”
              <button onClick={() => setQuery('')}>
                <X className="size-3" />
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setActive([])
              setQuery('')
            }}
            className="ml-auto text-[10px] font-semibold text-primary"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
function MemoryTable({ rows, onOpen }: { rows: Memory[]; onOpen: (m: Memory) => void }) {
  const [sort, setSort] = useState<'recalled' | 'success'>('recalled')
  const sorted = [...rows].sort((a, b) =>
    sort === 'recalled' ? b.recalled - a.recalled : b.success - a.success,
  )
  return (
    <div className="overflow-hidden rounded-[14px] border bg-card">
      <div className="flex items-center justify-between border-b bg-background px-4 py-3">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <List className="size-4 text-viridian" />
          Memory records <span className="font-mono text-[10px] text-muted-foreground">{rows.length} visible</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded-md p-1.5 text-muted-foreground hover:bg-card" aria-label="Density">
            <SlidersHorizontal className="size-4" />
          </button>
          <button className="rounded-md p-1.5 text-muted-foreground hover:bg-card" aria-label="More actions">
            <MoreHorizontal className="size-4" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left">
          <thead className="sticky top-0 border-b bg-card">
            <tr className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Entry</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Outcome</th>
              <th className="px-4 py-3">
                <button onClick={() => setSort('recalled')} className="inline-flex items-center gap-1">
                  Recalled{' '}
                  {sort === 'recalled' ? <ArrowDown className="size-3" /> : <ArrowUp className="size-3" />}
                </button>
              </th>
              <th className="px-4 py-3">
                <button onClick={() => setSort('success')} className="inline-flex items-center gap-1">
                  Success{' '}
                  {sort === 'success' ? <ArrowDown className="size-3" /> : <ArrowUp className="size-3" />}
                </button>
              </th>
              <th className="px-4 py-3">Last used</th>
              <th className="px-4 py-3">Source</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((m) => (
              <tr
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onOpen(m)}
                onClick={() => onOpen(m)}
                key={m.id}
                className="cursor-pointer border-b last:border-0 hover:bg-background focus:bg-viridian-tint focus:outline-none"
              >
                <td className="px-4 py-3">
                  <TypeBadge type={m.type} />
                </td>
                <td className="max-w-[280px] px-4 py-3">
                  <div className="truncate text-sm font-semibold">{m.title}</div>
                  <div className="mt-1 font-mono text-[9px] text-muted-foreground">{m.id}</div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{m.service}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold ${m.outcome === 'Worked' ? 'text-viridian' : m.outcome === 'Failed' ? 'text-danger' : 'text-warn'}`}
                  >
                    {m.outcome}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 font-mono text-xs">{m.recalled}</span>
                    <span className="h-1.5 w-16 rounded-full bg-viridian-tint">
                      <span
                        className="block h-full rounded-full bg-viridian"
                        style={{ width: `${Math.min(100, m.recalled * 5)}%` }}
                      />
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Ring value={m.success} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-[10px] text-muted-foreground">{m.last}</td>
                <td className="px-4 py-3 font-mono text-[10px] text-viridian">{m.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
function Graph({ rows, onOpen }: { rows: Memory[]; onOpen: (m: Memory) => void }) {
  const points = [
    { x: 18, y: 35 },
    { x: 42, y: 22 },
    { x: 67, y: 32 },
    { x: 31, y: 68 },
    { x: 72, y: 70 },
  ]
  return (
    <div className="relative overflow-hidden rounded-[14px] border bg-background dot-matrix">
      <div className="absolute left-4 top-4 z-10 rounded-xl border bg-card p-3 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold">
          <GitBranch className="size-4 text-viridian" />
          Memory graph
        </div>
        <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <input type="checkbox" defaultChecked className="accent-viridian" />
          Only what worked
        </label>
        <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>Usage</span>
          <input type="range" min="1" max="20" defaultValue="3" className="w-24 accent-viridian" />
        </div>
        <button className="mt-3 w-full rounded-md border px-2 py-1.5 text-[10px] font-semibold hover:bg-muted">
          Tidy layout
        </button>
      </div>
      <svg viewBox="0 0 100 100" className="h-[520px] w-full min-w-[650px] p-8">
        <g stroke="var(--viridian-border)" strokeWidth=".35">
          <line x1="18" y1="35" x2="42" y2="22" />
          <line x1="42" y1="22" x2="67" y2="32" />
          <line x1="18" y1="35" x2="31" y2="68" strokeDasharray="2 2" />
          <line x1="67" y1="32" x2="72" y2="70" />
        </g>
        {rows.map((m, i) => {
          const p = points[i % points.length]
          return (
            <g key={m.id} onClick={() => onOpen(m)} className="cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r={Math.max(4, m.recalled / 3)}
                fill={m.type === 'Failed fix' ? 'var(--danger-tint)' : 'var(--viridian-tint)'}
                stroke={m.type === 'Failed fix' ? 'var(--danger)' : 'var(--viridian)'}
                strokeWidth=".6"
              />
              <text x={p.x} y={p.y - 7} textAnchor="middle" fontSize="2.5" fill="var(--foreground)">
                {m.title.slice(0, 22)}
              </text>
              <text x={p.x} y={p.y + 0.9} textAnchor="middle" fontSize="2.5" fill="var(--viridian)">
                {m.recalled}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="absolute bottom-4 right-4 rounded-lg border bg-card px-3 py-2 font-mono text-[9px] text-muted-foreground">
        scroll to zoom · click to inspect
      </div>
    </div>
  )
}
function Timeline({ rows }: { rows: Memory[] }) {
  return (
    <div className="rounded-[14px] border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <History className="size-4 text-viridian" />
            Memory timeline
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            A record of what Recall retained, recalled, and learned.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-background">
          <Zap className="size-3.5" />
          Replay
        </button>
      </div>
      <div className="mt-12 flex min-w-[650px] items-end justify-between border-b border-viridian-border pb-5">
        {['Sep 18', 'Sep 20', 'Sep 22', 'Sep 24', 'Sep 26', 'Today'].map((day, i) => (
          <div key={day} className="relative flex flex-col items-center gap-3">
            <div
              className={`size-3 rounded-full border-2 border-white shadow-sm ${i % 2 ? 'bg-primary' : 'bg-viridian'}`}
            />
            <span className="font-mono text-[9px] text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {rows.slice(0, 3).map((m, i) => (
          <div key={m.id} className="rounded-lg border bg-background p-3">
            <div className="flex items-center justify-between">
              <TypeBadge type={m.type} />
              <span className="font-mono text-[9px] text-muted-foreground">
                {i === 0 ? 'Retained' : i === 1 ? 'Recalled' : 'Outcome recorded'}
              </span>
            </div>
            <div className="mt-3 text-xs font-semibold">{m.title}</div>
            <div className="mt-2 text-[10px] text-muted-foreground">{m.last}</div>
          </div>
        ))}
      </div>
      <input
        aria-label="Timeline scrubber"
        type="range"
        min="0"
        max="100"
        defaultValue="72"
        className="mt-8 w-full accent-viridian"
      />
    </div>
  )
}
function Detail({ memory, onClose }: { memory: Memory; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/20" onMouseDown={onClose}>
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        className="h-full w-full max-w-[460px] overflow-y-auto border-l bg-card p-6 shadow-lift"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Memory detail</div>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-muted" aria-label="Close details">
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-8">
          <TypeBadge type={memory.type} />
          <h2 className="mt-4 text-2xl font-bold tracking-[-.05em]">{memory.title}</h2>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{memory.service}</span>
            <span>·</span>
            <span className="font-mono">{memory.id}</span>
          </div>
          <p className="mt-7 text-sm leading-7 text-muted-foreground">{memory.text}</p>
        </div>
        <div className="mt-8 rounded-xl border border-viridian-border bg-viridian-tint p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-3xl text-viridian">{memory.success}%</div>
              <div className="mt-1 text-xs text-viridian-muted">
                worked {Math.round(memory.success / 20)} of 6 recalls
              </div>
            </div>
            <Ring value={memory.success} />
          </div>
          <div className="mt-5 flex h-2 gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className={`flex-1 rounded-full ${i < Math.round(memory.success / 20) ? 'bg-viridian' : 'bg-viridian-border'}`}
              />
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-sm font-semibold">Recall history</h3>
          <div className="mt-3 grid gap-2">
            {['INC-2041 · auth gateway latency', 'INC-1988 · broker pressure', 'INC-1901 · config drift']
              .slice(0, Math.min(3, memory.recalled))
              .map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-lg border px-3 py-2.5 text-xs"
                >
                  <span>{item}</span>
                  <ArrowUp className="size-3 text-viridian" />
                </div>
              ))}
          </div>
        </div>
        <button className="mt-10 w-full rounded-lg border border-danger-border bg-danger-tint px-3 py-2.5 text-sm font-semibold text-danger hover:bg-danger-tint">
          Forget this memory
        </button>
      </motion.aside>
    </div>
  )
}
function RetainDialog({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg rounded-[14px] border bg-card p-6 shadow-lift"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-viridian">New memory</div>
            <h2 className="mt-1 text-xl font-bold">Retain a note</h2>
          </div>
          <button onClick={onClose} aria-label="Close dialog">
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-1.5 text-xs font-semibold">
            Type
            <select className="rounded-lg border bg-card px-3 py-2.5 text-sm font-normal outline-none focus:ring-2 focus:ring-viridian">
              <option>Fix</option>
              <option>Cause</option>
              <option>Incident</option>
              <option>Habit</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-xs font-semibold">
            Service
            <input
              className="rounded-lg border px-3 py-2.5 text-sm font-normal outline-none focus:ring-2 focus:ring-viridian"
              placeholder="e.g. Auth Gateway"
            />
          </label>
          <label className="grid gap-1.5 text-xs font-semibold">
            What should the agent remember?
            <textarea
              rows={5}
              className="resize-none rounded-lg border px-3 py-2.5 text-sm font-normal outline-none focus:ring-2 focus:ring-viridian"
              placeholder="Write a durable, useful note..."
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border px-3 py-2 text-sm font-semibold">
            Cancel
          </button>
          <button
            onClick={onSave}
            className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
          >
            Save to memory
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MemoryPage() {
  const [view, setView] = useState<'Table' | 'Graph' | 'Timeline'>('Table')
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<MemoryType[]>([])
  const [selected, setSelected] = useState<Memory | null>(null)
  const [retain, setRetain] = useState(false)
  const [saved, setSaved] = useState(false)
  const rows = useMemo(
    () =>
      seed.filter(
        (m) =>
          (!active.length || active.includes(m.type)) &&
          (!query || `${m.title} ${m.service} ${m.text}`.toLowerCase().includes(query.toLowerCase())),
      ),
    [active, query],
  )
  return (
    <main className="mx-auto max-w-[1440px] px-5 py-7 md:px-8 md:py-9">
      <Header
        onRetain={() => setRetain(true)}
        onExport={() => {
          setSaved(true)
          setTimeout(() => setSaved(false), 2200)
        }}
      />
      <Summary />
      <Filters query={query} setQuery={setQuery} active={active} setActive={setActive} />
      <div className="mt-7 flex items-center justify-between">
        <div className="relative flex rounded-lg border bg-card p-1">
          <div
            className="absolute bottom-1 top-1 w-1/3 rounded-md bg-viridian-tint transition-transform"
            style={{ transform: `translateX(${['Table', 'Graph', 'Timeline'].indexOf(view) * 100}%)` }}
          />
          {(['Table', 'Graph', 'Timeline'] as const).map((item, i) => (
            <button
              key={item}
              onClick={() => setView(item)}
              className={`relative z-10 flex items-center gap-2 px-3 py-1.5 text-xs font-semibold ${view === item ? 'text-viridian' : 'text-muted-foreground'}`}
            >
              {i === 0 ? (
                <LayoutGrid className="size-3.5" />
              ) : i === 1 ? (
                <GitBranch className="size-3.5" />
              ) : (
                <CalendarDays className="size-3.5" />
              )}
              {item}
            </button>
          ))}
        </div>
        <div className="hidden items-center gap-2 text-[10px] text-muted-foreground sm:flex">
          <BookMarked className="size-3.5 text-viridian" />
          {rows.length} records in view
        </div>
      </div>
      <div className="mt-3">
        <AnimatePresence mode="wait">
          {view === 'Table' && (
            <motion.div key="table" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              <MemoryTable rows={rows} onOpen={setSelected} />
            </motion.div>
          )}
          {view === 'Graph' && (
            <motion.div key="graph" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              <Graph rows={rows} onOpen={setSelected} />
            </motion.div>
          )}
          {view === 'Timeline' && (
            <motion.div key="timeline" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              <Timeline rows={rows} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl border bg-card px-4 py-3">
        <button className="grid size-5 place-items-center rounded-full bg-viridian text-white">
          <Check className="size-3" />
        </button>
        <div className="font-mono text-[10px] text-muted-foreground">ACTIVITY</div>
        <div className="text-xs text-muted-foreground">Memory graph indexed 12 new relationships</div>
        <div className="ml-auto hidden font-mono text-[10px] text-muted-foreground sm:block">09:48:12</div>
      </div>
      {selected && <Detail memory={selected} onClose={() => setSelected(null)} />}{' '}
      {retain && (
        <RetainDialog
          onClose={() => setRetain(false)}
          onSave={() => {
            setRetain(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 2200)
          }}
        />
      )}
      {saved && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-[60] rounded-lg bg-viridian-ink px-4 py-3 text-sm font-semibold text-white shadow-lift"
        >
          Saved to memory.
        </div>
      )}
    </main>
  )
}

export const dynamic = 'force-dynamic'

'use client'

import { useState } from 'react'
import { Check, ChevronRight, GripVertical, History, Search, BookMarked } from 'lucide-react'
import { motion, Reorder } from 'framer-motion'

const procedures = [
  {
    id: 'triage',
    title: 'Triage the signal',
    body: 'Confirm the elevated p95 is isolated to the auth gateway and capture the first affected region.',
    memory: 'Worked 9 of 10',
    source: 'INC-2103',
  },
  {
    id: 'logs',
    title: 'Inspect gateway logs',
    body: 'Compare request IDs across the gateway and identity service before changing a timeout.',
    memory: 'Worked 8 of 10',
    source: 'INC-1988',
  },
  {
    id: 'rollback',
    title: 'Roll back the policy',
    body: 'Revert the last policy bundle, then watch the error budget for five minutes.',
    memory: 'Worked 10 of 10',
    source: 'INC-2041',
  },
]

function MemoryRing({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="grid size-11 place-items-center rounded-full"
        style={{ background: 'conic-gradient(var(--viridian) 84%, var(--viridian-tint) 0)' }}
      >
        <div className="grid size-8 place-items-center rounded-full bg-card text-[8px] font-mono text-viridian">
          84%
        </div>
      </div>
      <span className="text-[11px] font-mono text-viridian">{label}</span>
    </div>
  )
}

export default function RunbooksPage() {
  const [selected, setSelected] = useState('Gateway latency response')
  const [items, setItems] = useState(procedures)
  const [checked, setChecked] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [sheet, setSheet] = useState(false)
  const visible = ['Gateway latency response', 'Database failover', 'Queue backlog recovery'].filter((x) =>
    x.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <main className="mx-auto max-w-6xl p-5 md:p-8">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">
            Recall / runbooks
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-[-.05em]">
            Runbooks that <em className="serif-italic">remember</em>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Operational procedures that improve each time your team runs them.
          </p>
        </div>
        <button
          onClick={() => setSheet(true)}
          className="rounded-lg border bg-card px-3 py-2 text-sm font-semibold hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <History className="mr-2 inline size-4" />
          Changes since v3
        </button>
      </header>
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-[14px] border bg-card p-3">
          <div className="mb-3 flex items-center gap-2 rounded-lg border bg-background px-3 py-2">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a runbook"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              aria-label="Find a runbook"
            />
          </div>
          <div className="flex flex-col gap-1">
            {visible.map((name, i) => (
              <button
                key={name}
                onClick={() => setSelected(name)}
                className={`flex items-center justify-between rounded-lg px-3 py-3 text-left text-sm ${selected === name ? 'bg-muted font-semibold' : 'hover:bg-background'}`}
              >
                <span>
                  {name}
                  <span className="mt-1 block font-mono text-[9px] text-muted-foreground">
                    v{3 - i} · Sep {18 - i}, 2026
                  </span>
                </span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </aside>
        <section className="rounded-[14px] border bg-card p-5 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-viridian-tint px-2 py-1 font-mono text-[10px] text-viridian">
                  v3.4 · active
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">updated Sep 18, 2026</span>
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-[-.04em]">{selected}</h2>
              <p className="mt-1 text-sm text-muted-foreground">Used 24 times · 92% successful outcomes</p>
            </div>
            <button className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <BookMarked className="mr-2 inline size-4" />
              Run live
            </button>
          </div>
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Procedure</h3>
              <span className="font-mono text-[10px] text-muted-foreground">3 steps · live execution</span>
            </div>
            <Reorder.Group axis="y" values={items} onReorder={setItems} className="flex flex-col gap-3">
              {items.map((step, index) => (
                <Reorder.Item key={step.id} value={step} className="rounded-xl border bg-background p-4">
                  <div className="flex gap-3">
                    <GripVertical className="mt-1 size-4 shrink-0 cursor-grab text-muted-foreground/60" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <span className="font-mono text-[10px] text-primary">0{index + 1}</span>
                          <h4 className="mt-1 font-semibold">{step.title}</h4>
                        </div>
                        <MemoryRing label={step.memory} />
                      </div>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{step.body}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2 text-xs text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={checked.includes(step.id)}
                            onChange={(e) =>
                              setChecked(
                                e.target.checked
                                  ? [...checked, step.id]
                                  : checked.filter((x) => x !== step.id),
                              )
                            }
                            className="accent-primary"
                          />
                          Done in live mode
                        </label>
                        <span className="memory-source rounded-full border border-viridian-border bg-viridian-tint px-2 py-1 text-[10px] text-viridian">
                          Revised from {step.source}
                        </span>
                      </div>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        </section>
      </div>
      {sheet && (
        <div className="fixed inset-0 z-50 bg-foreground/30" onMouseDown={() => setSheet(false)}>
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-lg overflow-auto bg-card p-6 shadow-lift"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Version history
                </div>
                <h2 className="mt-2 text-xl font-bold">Changes since v3</h2>
              </div>
              <button onClick={() => setSheet(false)} className="rounded-lg border px-3 py-2 text-sm">
                Close
              </button>
            </div>
            <div className="mt-8 flex flex-col gap-3 font-mono text-xs">
              <div className="rounded-lg bg-viridian-tint p-3 text-viridian">
                + Added a five-minute error budget check
              </div>
              <div className="rounded-lg bg-danger-tint p-3 text-danger">
                − Removed the automatic timeout increase
              </div>
              <div className="rounded-lg border p-3">~ Reordered rollback after log inspection</div>
            </div>
          </aside>
        </div>
      )}
    </main>
  )
}

export const dynamic = 'force-dynamic'

// Memory Thread source: hover the provenance badge to follow its incident citation.
// @ts-expect-error Reorder's generic inference is intentionally handled by the runtime component.
void Reorder
void motion

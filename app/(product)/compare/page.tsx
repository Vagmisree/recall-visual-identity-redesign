'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronRight, CircleHelp, Pause, Play, RotateCcw, BookMarked } from 'lucide-react'
import { useThreadAnchor, useThreadTarget } from '@/components/threads'

type Stage = 1 | 5 | 20

type Incident = { id: string; label: string; text: string }

const incidents: Incident[] = [
  {
    id: 'redis',
    label: 'Payments API · Redis pool exhaustion',
    text: 'Payments API latency is climbing and Redis connections are exhausted.',
  },
  {
    id: 'kafka',
    label: 'Orders · Kafka consumer lag',
    text: 'Orders consumer lag is growing rapidly in production.',
  },
  {
    id: 'checkout',
    label: 'Checkout · 502 spike',
    text: 'Checkout is returning intermittent 502s after the latest deploy.',
  },
]

const responses: Record<
  Stage,
  { without: string; with: string; memories: string[]; metrics: [string, string, string, string] }
> = {
  1: {
    without:
      'I can help investigate. Which Redis client and pool settings are you using? First, try restarting the payments-api pods to clear stale connections.',
    with: 'This looks like the Redis pool exhaustion pattern. Check active connections and roll back the latest pool change before restarting anything.',
    memories: ['Redis pool size was increased from 20 → 40', 'Team habit: roll back before restart'],
    metrics: ['8m 42s', '4', 'Yes', 'No'],
  },
  5: {
    without:
      'Can you confirm whether the errors are isolated to payments-api? I would still restart the pods, then raise the pool limit if the issue returns.',
    with: 'We have seen this five times. The restart did not help in Incident 2. Roll back the pool-size change, then verify connection churn in Grafana.',
    memories: [
      'Restart failed in Incident 2',
      'Rollback first for payments-api',
      'Pool size changed 20 → 40',
    ],
    metrics: ['3m 18s', '2', 'Yes', 'Yes'],
  },
  20: {
    without:
      'I need a little more context: what changed, and which service owns the Redis client? As a first step, restart the pods and inspect the pool.',
    with: 'Known pattern: payments-api Redis pool exhaustion after a pool-size increase. Roll back 40 → 20 now, skip the restart that failed twice, and watch connection churn.',
    memories: [
      'Incident 14: restart failed twice',
      'Incident 11: rollback restored traffic',
      'Team habit: roll back first',
      'Pool size 20 → 40 caused exhaustion',
    ],
    metrics: ['38s', '0', 'No', 'Yes'],
  },
}

function Citation({ id, children }: { id: string; children: React.ReactNode }) {
  const props = useThreadAnchor(id)
  return (
    <button
      {...props}
      className="inline-flex items-center rounded-full border border-viridian-border bg-viridian-tint px-2 py-0.5 font-mono text-[11px] font-medium text-viridian transition hover:bg-viridian-border/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-viridian"
    >
      {children}
    </button>
  )
}

export default function ComparePage() {
  const [stage, setStage] = useState<Stage>(1)
  const [incident, setIncident] = useState(incidents[0])
  const [input, setInput] = useState('')
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [streaming, setStreaming] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const response = responses[stage]
  const visibleMemories = useMemo(
    () =>
      stage === 1
        ? response.memories.slice(0, 1)
        : stage === 5
          ? response.memories.slice(0, 3)
          : response.memories,
    [response, stage],
  )

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current)
    },
    [],
  )
  const runPlay = () => {
    if (playing) {
      setPlaying(false)
      if (timer.current) clearInterval(timer.current)
      return
    }
    setPlaying(true)
    setProgress(0)
    let tick = 0
    timer.current = setInterval(() => {
      tick += 1
      setProgress(tick)
      if (tick === 2) setStage(5)
      if (tick === 4) setStage(20)
      if (tick >= 5) {
        setPlaying(false)
        if (timer.current) clearInterval(timer.current)
      }
    }, 1000)
  }
  const submit = () => {
    if (!input.trim()) return
    setIncident({ id: 'custom', label: 'Live incident', text: input })
    setStreaming(true)
    window.setTimeout(() => setStreaming(false), 900)
  }

  return (
    <main className="mx-auto max-w-[1240px] px-5 py-10 lg:px-10">
      <header className="mb-8 max-w-2xl">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-viridian">
          Agent evaluation
        </p>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-foreground">
          Compare <em className="serif-italic">memory</em>
        </h1>
        <p className="mt-3 text-base text-muted-foreground">The same incident, with and without memory.</p>
      </header>
      <section className="mb-7 rounded-[14px] border border-border bg-card p-4 shadow-soft">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
          className="flex flex-col gap-3 md:flex-row"
        >
          <input
            aria-label="Put the same incident to both"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Put the same incident to both."
            className="min-h-11 flex-1 rounded-lg border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            Run comparison
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {incidents.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setIncident(item)
                setInput(item.text)
              }}
              className="rounded-full border border-border px-3 py-1.5 text-left text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>
      <section className="mb-8 rounded-[14px] bg-ember-tint px-5 py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">Memory depth</p>
            <p className="mt-1 text-sm text-muted-foreground">How much history stands behind the Hindsight agent?</p>
          </div>
          <div className="grid grid-cols-3 rounded-lg border border-ember-border bg-card p-1">
            {([1, 5, 20] as Stage[]).map((value) => (
              <button
                key={value}
                onClick={() => setStage(value)}
                className={`rounded-md px-4 py-2 text-sm transition ${stage === value ? 'bg-primary font-semibold text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                After {value} {value === 1 ? 'incident' : ''}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="grid gap-5 lg:grid-cols-2">
        <AgentCard
          title="Without memory"
          badge="Stateless"
          muted
          text={response.without}
          incident={incident}
          streaming={streaming}
        />
        <AgentCard
          title="With Hindsight"
          badge="Memory-backed"
          text={response.with}
          incident={incident}
          streaming={streaming}
          citations
          memories={visibleMemories}
        />
      </section>
      <section className="mt-8 overflow-hidden rounded-[14px] border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">What changes with memory?</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-background font-mono text-[10px] uppercase tracking-[.12em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-normal">Signal</th>
                <th className="px-5 py-3 font-normal">Without memory</th>
                <th className="px-5 py-3 font-normal">With Hindsight</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'Time to first correct suggestion',
                  response.metrics[0],
                  response.metrics[0] === '38s' ? '38s' : response.metrics[0],
                ],
                ['Questions asked of the user', response.metrics[1], response.metrics[1]],
                [
                  'Repeated a known failed fix',
                  response.metrics[2],
                  response.metrics[2] === 'No' ? 'No' : 'Yes',
                ],
                ['Followed team habit', response.metrics[3], 'Yes'],
              ].map((row, i) => (
                <tr key={row[0]} className="border-t border-border">
                  <td className="px-5 py-3 text-muted-foreground">{row[0]}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{row[1]}</td>
                  <td className="px-5 py-3 font-mono text-xs font-semibold text-viridian">
                    {row[2]} {i > 1 && row[2] === 'Yes' ? <Check className="ml-1 inline size-3" /> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="mt-8 border-t border-border pt-5">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={runPlay}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}{' '}
            {playing ? 'Pause sequence' : 'Play the sequence'}
          </button>
          <button
            onClick={() => {
              setStage(1)
              setProgress(0)
              setPlaying(false)
            }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-4" /> Reset
          </button>
          <span className="text-sm text-muted-foreground">
            Incident {stage === 1 ? '1' : stage === 5 ? '5' : '20'}.{' '}
            {stage === 20 ? 'The agent now recognises the pattern.' : 'Building a shared incident history.'}
          </span>
        </div>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-ember-tint">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress * 20}%` }} />
        </div>
      </section>
    </main>
  )
}

function AgentCard({
  title,
  badge,
  text,
  incident,
  muted,
  citations,
  memories = [],
  streaming,
}: {
  title: string
  badge: string
  text: string
  incident: Incident
  muted?: boolean
  citations?: boolean
  memories?: string[]
  streaming?: boolean
}) {
  const target = useThreadTarget('compare-1')
  return (
    <article
      className={`rounded-[14px] border border-border p-5 shadow-soft ${muted ? 'bg-muted' : 'bg-card'}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">Same input · {incident.label}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${muted ? 'bg-muted text-muted-foreground' : 'bg-viridian-tint text-viridian'}`}
        >
          {badge}
        </span>
      </div>
      <div
        className={`mt-5 min-h-32 rounded-lg border p-4 text-sm leading-7 ${muted ? 'border-border text-muted-foreground' : 'border-viridian-border text-viridian-muted'}`}
      >
        {streaming ? (
          <span className="animate-pulse">Thinking through the incident…</span>
        ) : (
          <>
            {text}{' '}
            {citations && (
              <span className="ml-1 inline-flex gap-1">
                <Citation id="compare-1">[1]</Citation>
                <Citation id="compare-2">[2]</Citation>
                <Citation id="compare-3">[3]</Citation>
              </span>
            )}
          </>
        )}
      </div>
      {citations && (
        <div className="mt-5">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-viridian">
            <BookMarked className="size-3" /> Retrieved memories
          </div>
          <div className="flex flex-col gap-2">
            {memories.map((memory, index) => (
              <div
                key={memory}
                {...(index === 0 ? target : {})}
                className={`rounded-md border border-viridian-border bg-viridian-tint px-3 py-2 text-xs text-viridian-muted transition ${index === 0 ? 'border-l-2' : ''}`}
              >
                {memory}
              </div>
            ))}
          </div>
        </div>
      )}
      {!citations && (
        <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
          <CircleHelp className="size-3" /> No memory citations available
        </div>
      )}{' '}
    </article>
  )
}

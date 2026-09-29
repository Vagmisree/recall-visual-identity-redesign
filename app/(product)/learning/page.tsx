'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Area,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ArrowUpRight, ChevronDown, Eye, RotateCcw, Table2 } from 'lucide-react'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

const incidents = [
  {
    id: 1,
    code: 'INC-1981',
    name: 'Payments API pool exhaustion',
    minutes: 47,
    firstFix: 0,
    failed: 3,
    questions: 5,
    memory: 'No prior history',
    saved: 0,
  },
  {
    id: 2,
    code: 'INC-1987',
    name: 'Checkout webhook backlog',
    minutes: 41,
    firstFix: 0,
    failed: 2,
    questions: 4,
    memory: 'No prior history',
    saved: 2,
  },
  {
    id: 3,
    code: 'INC-1992',
    name: 'Auth gateway latency',
    minutes: 38,
    firstFix: 0,
    failed: 2,
    questions: 4,
    memory: 'No prior history',
    saved: 4,
  },
  {
    id: 4,
    code: 'INC-1998',
    name: 'Kafka consumer lag',
    minutes: 34,
    firstFix: 1,
    failed: 2,
    questions: 3,
    memory: 'Deploy timeline',
    saved: 8,
  },
  {
    id: 5,
    code: 'INC-2004',
    name: 'Webhook worker retries',
    minutes: 29,
    firstFix: 1,
    failed: 1,
    questions: 3,
    memory: 'First recall: queue saturation',
    saved: 12,
  },
  {
    id: 6,
    code: 'INC-2010',
    name: 'Search index drift',
    minutes: 31,
    firstFix: 0,
    failed: 1,
    questions: 3,
    memory: 'First recall: index rebuild',
    saved: 9,
  },
  {
    id: 7,
    code: 'INC-2015',
    name: 'Billing event delay',
    minutes: 25,
    firstFix: 1,
    failed: 1,
    questions: 2,
    memory: 'Queue capacity note',
    saved: 16,
  },
  {
    id: 8,
    code: 'INC-2021',
    name: 'Config propagation lag',
    minutes: 23,
    firstFix: 1,
    failed: 1,
    questions: 2,
    memory: 'Feature flag config',
    saved: 19,
  },
  {
    id: 9,
    code: 'INC-2026',
    name: 'API rate limit spike',
    minutes: 22,
    firstFix: 1,
    failed: 0,
    questions: 2,
    memory: 'Rate-limit pattern',
    saved: 21,
  },
  {
    id: 10,
    code: 'INC-2030',
    name: 'Payments API pool exhaustion',
    minutes: 9,
    firstFix: 1,
    failed: 1,
    questions: 2,
    memory: 'Pool settings deploy',
    saved: 28,
  },
  {
    id: 11,
    code: 'INC-2033',
    name: 'Auth gateway latency',
    minutes: 9,
    firstFix: 1,
    failed: 0,
    questions: 1,
    memory: 'Restart gateway pods',
    saved: 31,
  },
  {
    id: 12,
    code: 'INC-2036',
    name: 'Kafka consumer lag',
    minutes: 16,
    firstFix: 1,
    failed: 0,
    questions: 1,
    memory: 'Partition rebalance',
    saved: 34,
  },
  {
    id: 13,
    code: 'INC-2038',
    name: 'Checkout webhook backlog',
    minutes: 9,
    firstFix: 1,
    failed: 0,
    questions: 1,
    memory: 'Drain queue first',
    saved: 36,
  },
  {
    id: 14,
    code: 'INC-2040',
    name: 'Config propagation lag',
    minutes: 9,
    firstFix: 1,
    failed: 0,
    questions: 1,
    memory: 'Compare config versions',
    saved: 38,
  },
  {
    id: 15,
    code: 'INC-2041',
    name: 'Payments API pool exhaustion',
    minutes: 13,
    firstFix: 1,
    failed: 0,
    questions: 1,
    memory: 'Pool settings deploy',
    saved: 40,
  },
  {
    id: 16,
    code: 'INC-2044',
    name: 'Auth gateway latency',
    minutes: 12,
    firstFix: 1,
    failed: 0,
    questions: 1,
    memory: 'Restart gateway pods',
    saved: 42,
  },
  {
    id: 17,
    code: 'INC-2047',
    name: 'Kafka consumer lag',
    minutes: 11,
    firstFix: 1,
    failed: 0,
    questions: 0,
    memory: 'Partition rebalance',
    saved: 44,
  },
  {
    id: 18,
    code: 'INC-2050',
    name: 'Webhook worker retries',
    minutes: 10,
    firstFix: 1,
    failed: 0,
    questions: 0,
    memory: 'Drain queue first',
    saved: 45,
  },
  {
    id: 19,
    code: 'INC-2052',
    name: 'Payments API pool exhaustion',
    minutes: 9,
    firstFix: 1,
    failed: 0,
    questions: 0,
    memory: 'Pool settings deploy',
    saved: 46,
  },
  {
    id: 20,
    code: 'INC-2055',
    name: 'Auth gateway latency',
    minutes: 9,
    firstFix: 1,
    failed: 0,
    questions: 0,
    memory: 'Restart gateway pods',
    saved: 47,
  },
]
const chartConfig = { minutes: { label: 'Resolution time', color: 'var(--chart-1)' } }
const lessons = [
  [
    'Connection-pool failures on payments-api follow any deploy touching pool settings.',
    'Sep 28',
    'INC-2041',
    'INC-2052',
  ],
  [
    'Consumer lag is a symptom of partition rebalances after broker pressure.',
    'Sep 26',
    'INC-2036',
    'INC-2047',
  ],
  [
    'Restarting auth gateway pods beats changing upstream timeouts after deploys.',
    'Sep 24',
    'INC-2033',
    'INC-2055',
  ],
]

function Toggle({ table, setTable }: { table: boolean; setTable: (v: boolean) => void }) {
  return (
    <button
      onClick={() => setTable(!table)}
      className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1.5 font-mono text-[10px] text-muted-foreground hover:text-viridian"
      aria-label="View as table"
    >
      <Table2 className="size-3.5" />
      {table ? 'Chart view' : 'View as table'}
    </button>
  )
}
function TableView({ rows }: { rows: typeof incidents }) {
  return (
    <div className="overflow-auto rounded-lg border bg-card">
      <table className="w-full min-w-[620px] text-left text-xs">
        <thead className="border-b bg-background font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          <tr>
            <th className="p-3">Incident</th>
            <th className="p-3">Minutes</th>
            <th className="p-3">First fix</th>
            <th className="p-3">Questions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((i) => (
            <tr key={i.id} className="border-b last:border-0">
              <td className="p-3">
                {i.code} · {i.name}
              </td>
              <td className="p-3 font-mono">{i.minutes}</td>
              <td className="p-3">{i.firstFix ? 'Yes' : 'No'}</td>
              <td className="p-3 font-mono">{i.questions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
function Count({ value }: { value: number }) {
  return (
    <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {value}
    </motion.span>
  )
}

export default function LearningPage() {
  const [range, setRange] = useState('All time')
  const [table, setTable] = useState(false)
  const [active, setActive] = useState<number | null>(null)
  const [step, setStep] = useState(3)
  const [openLesson, setOpenLesson] = useState(0)
  const [replayed, setReplayed] = useState(false)
  const median = useMemo(
    () =>
      incidents
        .slice(-10)
        .map((i) => i.minutes)
        .sort((a, b) => a - b)[0],
    [],
  )
  return (
    <main className="mx-auto max-w-[1440px] px-5 py-7 md:px-8 md:py-9">
      <header className="flex flex-col gap-5 border-b pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[.18em] text-viridian">
            Recall / improvement loop
          </div>
          <h1 className="mt-2 text-4xl font-bold tracking-[-.06em] md:text-5xl">
            Learning <em className="serif-italic">curve</em>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">Evidence that the agent improves with use.</p>
        </div>
        <div className="flex rounded-lg border bg-card p-1">
          {['7 days', '30 days', 'All time'].map((v) => (
            <button
              key={v}
              onClick={() => setRange(v)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${range === v ? 'bg-viridian-tint text-viridian' : 'text-muted-foreground'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </header>
      <section className="relative mt-7 overflow-hidden rounded-[14px] border border-viridian-border bg-viridian-tint p-6 md:p-9">
        <div className="dot-matrix pointer-events-none absolute inset-y-0 right-0 w-2/5 opacity-[.08]" />
        <p className="relative max-w-4xl text-[31px] leading-[1.05] tracking-[-.055em] text-viridian-ink md:text-[44px]">
          Median time to resolve has fallen from <strong className="text-primary">47 minutes</strong> to{' '}
          <strong className="text-primary">{median} minutes</strong> across{' '}
          <strong className="text-primary">20 incidents</strong>.
        </p>
        <div className="relative mt-5 font-mono text-[10px] text-viridian-muted">
          {range} · measured from first alert to resolved
        </div>
      </section>
      <section className="mt-4 grid grid-cols-2 divide-x rounded-[14px] border bg-card shadow-soft md:grid-cols-4">
        <div className="p-4 md:p-5">
          <div className="text-xs text-muted-foreground">Median time to resolve</div>
          <div className="mt-2 font-mono text-2xl">9m</div>
          <span className="mt-2 inline-flex rounded-full bg-viridian-tint px-2 py-1 font-mono text-[9px] text-viridian">
            ↓ 81%
          </span>
        </div>
        <div className="p-4 md:p-5">
          <div className="text-xs text-muted-foreground">First-fix success</div>
          <div className="mt-2 font-mono text-2xl">
            <Count value={85} />%
          </div>
          <span className="mt-2 inline-flex rounded-full bg-viridian-tint px-2 py-1 font-mono text-[9px] text-viridian">
            ↑ 85 pts
          </span>
        </div>
        <div className="p-4 md:p-5">
          <div className="text-xs text-muted-foreground">Repeated failed fixes</div>
          <div className="mt-2 font-mono text-2xl">0.6</div>
          <span className="mt-2 inline-flex rounded-full bg-viridian-tint px-2 py-1 font-mono text-[9px] text-viridian">
            ↓ 80%
          </span>
        </div>
        <div className="p-4 md:p-5">
          <div className="text-xs text-muted-foreground">Questions per incident</div>
          <div className="mt-2 font-mono text-2xl">1.6</div>
          <span className="mt-2 inline-flex rounded-full bg-viridian-tint px-2 py-1 font-mono text-[9px] text-viridian">
            ↓ 68%
          </span>
        </div>
      </section>
      <section className="mt-8 rounded-[14px] border bg-card p-5 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-[-.04em]">Resolution time per incident</h2>
            <p className="mt-1 text-xs text-muted-foreground">Noisy by design. The direction is what matters.</p>
          </div>
          <Toggle table={table} setTable={setTable} />
        </div>
        {table ? (
          <div className="mt-5">
            <TableView rows={incidents} />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="mt-5 h-[300px] w-full">
            <ScatterChart
              margin={{ left: 0, right: 12, top: 18, bottom: 6 }}
              onClick={(e: any) => {
                if (e?.activePayload?.[0])
                  window.location.href = `/console?incident=${e.activePayload[0].payload.code}`
              }}
            >
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                type="number"
                dataKey="id"
                domain={[1, 20]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                type="number"
                dataKey="minutes"
                domain={[0, 52]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                unit="m"
              />
              <Tooltip content={<ChartTooltipContent indicator="dot" />} />
              <ReferenceLine
                x={1}
                stroke="var(--primary)"
                strokeDasharray="3 3"
                label={{ value: '1 · no history', fontSize: 10, fill: 'var(--danger)' }}
              />
              <ReferenceLine
                x={5}
                stroke="var(--viridian)"
                strokeDasharray="3 3"
                label={{ value: '5 · first recall', fontSize: 10, fill: 'var(--viridian)' }}
              />
              <ReferenceLine
                x={20}
                stroke="var(--viridian)"
                strokeDasharray="3 3"
                label={{ value: '20 · cause anticipated', fontSize: 10, fill: 'var(--viridian)' }}
              />
              <Scatter
                data={incidents}
                fill="var(--primary)"
                line={{ stroke: 'var(--viridian)', strokeWidth: 2 }}
                onMouseEnter={(_, i) => setActive(incidents[i]?.id)}
              />
              <Line
                type="monotone"
                dataKey="minutes"
                data={incidents}
                stroke="var(--viridian)"
                strokeWidth={2}
                dot={false}
                isAnimationActive
              />
            </ScatterChart>
          </ChartContainer>
        )}
        <div className="mt-3 h-2 rounded-full bg-viridian-tint">
          <div className="h-2 w-[86%] rounded-full bg-viridian" />
        </div>
      </section>
      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {[
          ['First-fix success', 'firstFix', 'var(--viridian)'],
          ['Repeated failed fixes', 'failed', 'var(--primary)'],
          ['Questions asked', 'questions', 'var(--muted-foreground)'],
        ].map(([label, key, color]) => (
          <div key={key} className="rounded-[14px] border bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{label}</h3>
              <Eye className="size-4 text-muted-foreground" />
            </div>
            <ResponsiveContainer width="100%" height={115}>
              <LineChart
                data={incidents}
                onMouseMove={(e) => {
                  if (e?.activeTooltipIndex !== undefined) setActive(Number(e.activeTooltipIndex) + 1)
                }}
              >
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="id" hide />
                <YAxis hide />
                <Line
                  dataKey={key}
                  stroke={color}
                  strokeWidth={2}
                  dot={(p: any) => (
                    <circle cx={p.cx} cy={p.cy} r={active === p.payload.id ? 4 : 2.5} fill={color} />
                  )}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="font-mono text-[9px] text-muted-foreground">Hover an incident to link all three</div>
          </div>
        ))}
      </section>
      <section className="mt-8 rounded-[14px] border bg-card p-5 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-[-.04em]">Memory maturity</h2>
            <p className="mt-1 text-xs text-muted-foreground">The agent&apos;s operating mode, based on evidence.</p>
          </div>
          <button
            onClick={() => {
              setReplayed(true)
              setStep(4)
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-background"
          >
            <RotateCcw className="size-3.5" />
            Replay
          </button>
        </div>
        <div className="mt-7 grid grid-cols-4 gap-2">
          {['Blank slate', 'Familiar', 'Reliable', 'Anticipating'].map((name, i) => (
            <button key={name} onClick={() => setStep(i + 1)} className="text-left">
              <div className={`h-2 rounded-full ${i < step ? 'bg-viridian' : 'bg-border'}`} />
              <div className={`mt-2 text-xs font-semibold ${i === step - 1 ? 'text-primary' : ''}`}>
                {name}
              </div>
              {i < step && (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mt-1 font-mono text-[9px] text-viridian"
                >
                  reached
                </motion.div>
              )}
            </button>
          ))}
        </div>
        {replayed && (
          <div className="mt-5 rounded-lg border border-viridian-border bg-viridian-tint p-3 text-xs text-viridian-ink">
            Pulse: cause anticipation unlocked after repeated pool-setting incidents.
          </div>
        )}
      </section>
      <section className="mt-8 rounded-[14px] border bg-card p-5 md:p-6">
        <h2 className="text-lg font-bold tracking-[-.04em]">What it has learned</h2>
        <div className="mt-4 divide-y">
          {lessons.map((lesson, i) => (
            <div key={lesson[0]} className="py-4">
              <button
                onClick={() => setOpenLesson(openLesson === i ? -1 : i)}
                className="flex w-full items-start justify-between gap-4 text-left"
              >
                <span className="text-sm font-semibold leading-6">
                  {lesson[0]}
                  <span className="ml-2 font-mono text-[10px] text-viridian">[{i + 1}]</span>
                </span>
                <ChevronDown
                  className={`mt-1 size-4 shrink-0 text-muted-foreground transition-transform ${openLesson === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openLesson === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 border-l-2 border-viridian pl-4 text-xs text-muted-foreground"
                >
                  Evidence from {lesson[2]} and {lesson[3]} · {lesson[1]}
                  <div className="mt-2 flex gap-2">
                    <span className="rounded-full bg-viridian-tint px-2 py-1 font-mono text-[9px] text-viridian">
                      {lesson[2]}
                    </span>
                    <span className="rounded-full bg-viridian-tint px-2 py-1 font-mono text-[9px] text-viridian">
                      {lesson[3]}
                    </span>
                    <ArrowUpRight className="size-3.5 text-viridian" />
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export const dynamic = 'force-dynamic'

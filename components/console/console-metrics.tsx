'use client'

import { Bar, BarChart, CartesianGrid, XAxis, Area, AreaChart } from 'recharts'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { DigitRoll } from '@/components/quirk/digit-roll'
import { cn } from '@/lib/utils'

const mttrData = [
  { day: 'M', minutes: 43 }, { day: 'T', minutes: 37 }, { day: 'W', minutes: 51 },
  { day: 'T', minutes: 33 }, { day: 'F', minutes: 26 }, { day: 'S', minutes: 18 }, { day: 'S', minutes: 9 },
]
const recallData = [
  { hour: '08', count: 3 }, { hour: '09', count: 5 }, { hour: '10', count: 4 }, { hour: '11', count: 7 },
  { hour: '12', count: 6 }, { hour: '13', count: 8 }, { hour: '14', count: 5 }, { hour: '15', count: 9 },
  { hour: '16', count: 8 }, { hour: '17', count: 11 }, { hour: '18', count: 9 }, { hour: '19', count: 12 },
]

const lineConfig = { minutes: { label: 'Minutes to resolve', color: 'var(--chart-1)' } } satisfies ChartConfig
const barConfig = { count: { label: 'Recalls', color: 'var(--chart-2)' } } satisfies ChartConfig

function Sparkline() {
  return (
    <ChartContainer config={lineConfig} className="mt-2 h-[64px] w-full aspect-auto" aria-label="Mean time to resolve trending down over the last seven days">
      <AreaChart data={mttrData} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
        <Area type="monotone" dataKey="minutes" stroke="var(--color-minutes)" strokeWidth={2.5} fill="var(--color-minutes)" fillOpacity={0.14} dot={false} isAnimationActive />
      </AreaChart>
    </ChartContainer>
  )
}

function RecallBars() {
  return (
    <ChartContainer config={barConfig} className="mt-4 h-[128px] w-full aspect-auto" aria-label="Memory recall volume by hour over the last twelve hours">
      <BarChart data={recallData} margin={{ top: 5, right: 2, bottom: 0, left: 2 }}>
        <CartesianGrid vertical={false} stroke="rgb(20 17 15 / .12)" strokeDasharray="3 4" />
        <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: 'rgb(20 17 15 / .65)', fontSize: 9, fontFamily: 'var(--font-jetbrains)' }} interval={2} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} maxBarSize={15} isAnimationActive />
      </BarChart>
    </ChartContainer>
  )
}

export function ConsoleMetrics({ openCount, recalled }: { openCount: number; recalled: number }) {
  return (
    <section aria-label="Incident response metrics" className="grid grid-cols-12 gap-3 xl:grid-rows-[124px_124px]">
      <article className="on-bright col-span-12 flex min-h-[190px] flex-col rounded-2xl border-2 border-ink bg-lemon p-4 text-ink shadow-hard-sm sm:p-5 md:col-span-6 xl:col-span-5 xl:row-span-2">
        <div className="flex items-start justify-between gap-3">
          <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.13em]">mean time to resolve</p><p className="mt-1 text-xs text-ink/70">last 7 days · down 81%</p></div>
          <span className="rounded-full border border-ink/25 bg-paper/60 px-2 py-1 font-mono text-[9px] font-bold">MTTR</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2 font-display font-extrabold tracking-[-0.06em]">
          <DigitRoll value="9" className="text-6xl leading-none sm:text-7xl" />
          <span className="font-mono text-base font-bold">min</span>
          <span className="ml-auto font-mono text-xs font-semibold text-ink/55 line-through">47m</span>
        </div>
        <Sparkline />
      </article>

      <article className="on-bright col-span-12 flex min-h-[190px] flex-col rounded-2xl border-2 border-ink bg-mint p-4 text-ink shadow-hard-sm sm:p-5 md:col-span-6 xl:col-span-4 xl:row-span-2">
        <div className="flex items-start justify-between gap-2">
          <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.13em]">memory recalls today</p><p className="mt-1 text-xs text-ink/70">context found before guesswork</p></div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-paper/70 px-2 py-1 font-mono text-[9px] font-bold uppercase"><span className="size-1.5 animate-pulse rounded-full bg-viridian" /> live</span>
        </div>
        <p className="mt-3 font-display text-5xl font-extrabold tracking-[-0.06em]"><DigitRoll value={String(recalled)} /></p>
        <RecallBars />
      </article>

      <article className="on-bright col-span-6 flex min-h-[112px] flex-col justify-between rounded-2xl border-2 border-ink bg-sky p-3.5 text-ink shadow-hard-sm sm:p-4 xl:col-span-3">
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.1em]">open incidents</p>
        <div className="flex items-end justify-between"><span className="font-display text-4xl font-extrabold leading-none tracking-[-0.06em]"><DigitRoll value={String(openCount).padStart(2, '0')} /></span><div aria-label="One critical, one high, two lower severity" className="mb-1 flex gap-1"><span className="size-2.5 rounded-full border border-ink bg-ember" /><span className="size-2.5 rounded-full border border-ink bg-bubblegum" /><span className="size-2.5 rounded-full border border-ink bg-paper" /></div></div>
      </article>

      <article className={cn('on-bright col-span-6 flex min-h-[112px] flex-col justify-between rounded-2xl border-2 border-ink bg-bubblegum p-3.5 text-ink shadow-hard-sm sm:p-4 xl:col-span-3')}>
        <div className="flex items-start justify-between gap-2"><p className="font-mono text-[9px] font-bold uppercase tracking-[0.1em]">repeated failed fixes</p><span className="-rotate-2 rounded-full border border-ink bg-paper px-2 py-0.5 font-mono text-[8px] font-bold">12 clean</span></div>
        <div className="flex items-end justify-between"><span className="font-display text-4xl font-extrabold leading-none tracking-[-0.06em]">0</span><span className="pb-0.5 text-[10px] font-semibold">last 12 incidents</span></div>
      </article>
    </section>
  )
}

export function MetricCaption({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn('font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground', className)}>{children}</p>
}

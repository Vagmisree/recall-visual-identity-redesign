'use client'

import { Citation, ThreadTarget } from '@/components/threads/citation'
import { MemoryDot } from '@/components/doodle'
import { OutcomeControl } from './outcome-control'

const sources = [
  { id: 'console-1', mem: 'mem_8f42', incident: 'INC-1987', title: 'Restarted auth gateway pods after token cache saturation', when: '12 days ago', result: 'Resolved in 6m' },
  { id: 'console-2', mem: 'mem_7bc1', incident: 'INC-1932', title: 'Connection pool resize did not reduce p99 latency', when: '41 days ago', result: 'Ineffective' },
  { id: 'console-3', mem: 'mem_51aa', incident: 'INC-1874', title: 'Latency spike followed the 09:00 cert rotation job', when: '2 months ago', result: 'Root cause' },
]

export function RecallPanel() {
  return (
    <section aria-labelledby="recall-heading" className="flex flex-col gap-4">
      <div data-tour="console-recall" className="rounded-xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-center gap-2 text-xs font-semibold text-viridian">
          <MemoryDot />
          Hindsight recall · <span className="font-mono">INC-2041</span>
        </div>
        <h2 id="recall-heading" className="mt-3 text-xl font-bold tracking-tight text-balance">
          You&apos;ve seen this <span className="serif-italic">before</span>
        </h2>
        <p className="mt-3 text-sm leading-7 text-foreground/85">
          This matches a token-cache saturation from 12 days ago, fixed by restarting the auth gateway pods{' '}
          <Citation id="console-1" n={1} label="mem_8f42" />. Avoid resizing the connection pool; it didn&apos;t help
          last time <Citation id="console-2" n={2} label="mem_7bc1" />. Check whether the 09:00 cert rotation ran
          <Citation id="console-3" n={3} label="mem_51aa" className="ml-1" />.
        </p>
        <div data-tour="console-outcome" className="mt-5 border-t border-border pt-4">
          <OutcomeControl memoryId="mem_8f42" />
        </div>
      </div>

      <div data-tour="console-sources">
        <h3 className="sr-only">Cited memories</h3>
        <ol className="flex flex-col gap-2">
          {sources.map((source, i) => (
            <ThreadTarget
              key={source.id}
              id={source.id}
              as="li"
              aria-label={`${source.mem}: ${source.title}`}
              className="flex gap-3 rounded-xl border border-viridian-border bg-viridian-tint px-4 py-3 text-viridian-ink"
            >
              <span className="font-mono text-xs text-viridian">[{i + 1}]</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug">{source.title}</p>
                <p className="mt-1 font-mono text-[11px] text-viridian-muted">
                  {source.mem} · {source.incident} · {source.when} · {source.result}
                </p>
              </div>
            </ThreadTarget>
          ))}
        </ol>
      </div>
    </section>
  )
}

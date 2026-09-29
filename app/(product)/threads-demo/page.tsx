'use client'
import { useThreadAnchor, useThreadTarget } from '@/components/threads'
function Anchor({ id, children }: { id: string; children: React.ReactNode }) {
  const p = useThreadAnchor(id)
  return (
    <button
      ref={p.ref}
      {...p}
      className="rounded-lg border bg-card px-3 py-2 text-left text-sm font-semibold shadow-soft hover:border-viridian"
    >
      {children}
    </button>
  )
}
function Target({ id, children }: { id: string; children: React.ReactNode }) {
  const p = useThreadTarget(id)
  return (
    <div ref={p.ref} {...p} className={`rounded-xl border bg-card p-4 ${p.className}`}>
      <div className="font-mono text-[10px] text-viridian">{id}</div>
      <div className="mt-1 text-sm font-semibold">{children}</div>
      <p className="mt-1 text-xs text-muted-foreground">Source record with contextual resolution notes.</p>
    </div>
  )
}
export default function ThreadsDemo() {
  return (
    <div className="mx-auto max-w-5xl">
      <header className="border-b pb-6">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Interaction lab</div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Memory <span className="serif-italic">threads</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Hover or focus a citation to trace its source record. Click to pin multiple threads.
        </p>
      </header>
      <div className="grid gap-12 py-10 lg:grid-cols-[220px_1fr]">
        <div className="flex flex-col gap-3">
          {['INC-2041', 'Fix · DNS', 'Runbook · 12', 'Cause · cache', 'Team · Edge', 'Record · 842'].map(
            (x, i) => (
              <Anchor key={x} id={`thread-${i + 1}`}>
                Citation {i + 1} · {x}
              </Anchor>
            ),
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            'Auth gateway latency',
            'Stale DNS cache',
            'Pool size increase',
            'Resolver fallback',
            'Edge rotation',
            'Postmortem note',
          ].map((x, i) => (
            <Target key={x} id={`thread-${i + 1}`}>
              {x}
            </Target>
          ))}
        </div>
      </div>
    </div>
  )
}

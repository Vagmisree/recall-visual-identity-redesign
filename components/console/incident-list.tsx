import { cn } from '@/lib/utils'

const incidents = [
  { id: 'INC-2041', name: 'Auth gateway latency', severity: 'P1', status: 'Investigating', age: '14m', owner: 'AR' },
  { id: 'INC-2039', name: 'Payments queue backlog', severity: 'P2', status: 'Monitoring', age: '1h 02m', owner: 'PN' },
  { id: 'INC-2034', name: 'Search index lag', severity: 'P3', status: 'Assigned', age: '3h 40m', owner: null },
  { id: 'INC-2031', name: 'Billing webhook retries', severity: 'P3', status: 'Assigned', age: '5h 12m', owner: null },
]

const severityStyle: Record<string, string> = {
  P1: 'border-danger-border bg-danger-tint text-danger',
  P2: 'border-warn-border bg-warn-tint text-warn',
  P3: 'border-border bg-muted text-muted-foreground',
}

export function IncidentList() {
  return (
    <section aria-labelledby="active-incidents" className="rounded-xl border border-border bg-card shadow-soft">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 id="active-incidents" className="font-semibold">Active incidents</h2>
        <span className="font-mono text-xs text-muted-foreground">{incidents.length} open</span>
      </div>
      <ul className="divide-y divide-border">
        {incidents.map((incident, i) => (
          <li
            key={incident.id}
            className={cn('flex items-center gap-4 px-5 py-4', i === 0 && 'bg-background')}
            aria-current={i === 0 ? 'true' : undefined}
          >
            <span className={cn('rounded-md border px-1.5 py-0.5 font-mono text-[11px] font-medium', severityStyle[incident.severity])}>
              {incident.severity}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{incident.name}</p>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                {incident.id} · {incident.status} · {incident.age}
              </p>
            </div>
            {incident.owner ? (
              <span className="grid size-7 place-items-center rounded-full bg-muted text-[10px] font-bold" aria-label={`Owner ${incident.owner}`}>
                {incident.owner}
              </span>
            ) : (
              <span className="text-xs font-semibold text-primary">Unowned</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

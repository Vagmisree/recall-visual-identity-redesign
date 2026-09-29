'use client'

import { usePreferences, type QuirkLevel } from '@/components/preferences'
import { cn } from '@/lib/utils'

const options: { value: QuirkLevel; label: string }[] = [
  { value: 'full', label: 'Full' },
  { value: 'calm', label: 'Calm' },
]

/** Global Full / Calm quirk level toggle. */
export function QuirkSwitch({ className }: { className?: string }) {
  const { prefs, setPref } = usePreferences()
  return (
    <div
      role="radiogroup"
      aria-label="Quirk level"
      className={cn('inline-flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5', className)}
    >
      {options.map((o) => {
        const active = prefs.quirk === o.value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setPref('quirk', o.value)}
            className={cn(
              'h-7 rounded-md px-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

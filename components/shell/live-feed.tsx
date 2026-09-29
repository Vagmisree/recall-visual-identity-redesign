'use client'

import { X } from 'lucide-react'
import { usePreferences } from '@/components/preferences'
import { cn } from '@/lib/utils'

const events = [
  { id: 'mem_8f42', text: 'Retained fix outcome for INC-2041 · restart auth gateway pods' },
  { id: 'mem_7bc1', text: 'Recalled redis failover pattern for payments-api' },
  { id: 'mem_51aa', text: 'Linked deploy freeze habit to Friday releases' },
  { id: 'mem_2d09', text: 'Marked connection-pool resize as ineffective (2 of 5)' },
  { id: 'mem_9e7c', text: 'Retained on-call note from Priya Nair' },
]

export function LiveFeed() {
  const { prefs, setPref, reducedMotion } = usePreferences()
  if (!prefs.liveFeed) return null

  return (
    <aside aria-label="Live memory feed" className="group sticky bottom-[68px] z-20 flex h-9 items-center border-t-2 border-ink bg-lemon text-ink md:bottom-0">
      <div className="flex h-full shrink-0 items-center gap-2 border-r-2 border-ink px-3 text-[10px] font-extrabold tracking-[0.1em] sm:px-4">
        <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-ember" />
        <span>LIVE</span>
      </div>
      <div className="relative min-w-0 flex-1 overflow-hidden" aria-live="off">
        <ul className={cn('flex w-max gap-12 whitespace-nowrap pl-6', !reducedMotion && 'recall-ticker')}>
          {[...events, ...events].map((event, index) => (
            <li key={`${event.id}-${index}`} className="flex items-center gap-2 text-[10px] font-semibold">
              <span className="font-mono text-[9px]">{event.id}</span>{event.text}
            </li>
          ))}
        </ul>
      </div>
      <button type="button" onClick={() => setPref('liveFeed', false)} aria-label="Hide live memory feed" className="grid size-9 shrink-0 place-items-center border-l-2 border-ink text-ink hover:bg-ember focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary">
        <X className="size-3.5" />
      </button>
    </aside>
  )
}

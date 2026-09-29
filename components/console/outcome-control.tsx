'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type Outcome = 'worked' | 'partial' | 'failed'

const options: { value: Outcome; label: string }[] = [
  { value: 'worked', label: 'Worked' },
  { value: 'partial', label: 'Partially' },
  { value: 'failed', label: "Didn't work" },
]

export function OutcomeControl({ memoryId }: { memoryId: string }) {
  const [outcome, setOutcome] = useState<Outcome | null>(null)

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p id="outcome-label" className="text-sm font-semibold">
        Did the suggested fix work?
      </p>
      <div role="radiogroup" aria-labelledby="outcome-label" className="flex rounded-lg border border-border bg-muted p-0.5">
        {options.map((option) => {
          const selected = outcome === option.value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setOutcome(option.value)}
              className={cn(
                'relative h-8 rounded-md px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                selected ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {selected && (
                <motion.span
                  layoutId="outcome-pill"
                  className="absolute inset-0 rounded-md border border-border bg-card shadow-soft"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative">{option.label}</span>
            </button>
          )
        })}
      </div>
      <div aria-live="polite" className="sm:basis-full">
        <AnimatePresence>
          {outcome && (
            <motion.p
              key={outcome}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-xs text-viridian"
            >
              <Check className="size-3.5" aria-hidden="true" />
              Outcome retained to memory · <span className="font-mono">{memoryId}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

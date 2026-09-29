'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type Env = 'production' | 'staging'

const options: { value: Env; label: string }[] = [
  { value: 'production', label: 'Production' },
  { value: 'staging', label: 'Staging' },
]

export function EnvSwitch({ value, onChange }: { value: Env; onChange: (env: Env) => void }) {
  return (
    <div role="radiogroup" aria-label="Environment" className="flex rounded-xl border-2 border-ink bg-cream p-0.5 text-ink">
      {options.map((option) => {
        const selected = value === option.value
        return (
          <button key={option.value} type="button" role="radio" aria-checked={selected} onClick={() => onChange(option.value)} className={cn('relative flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-primary', selected ? 'text-ink' : 'text-muted-foreground hover:text-ink')}>
            {selected && <motion.span layoutId="env-pill" className="absolute inset-0 rounded-lg border border-ink bg-paper shadow-hard-sm" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
            <span aria-hidden="true" className={cn('relative size-1.5 rounded-full', option.value === 'production' ? 'bg-viridian' : 'bg-warn')} />
            <span className="relative">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

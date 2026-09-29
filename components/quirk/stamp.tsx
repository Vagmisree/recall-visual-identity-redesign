'use client'

import { motion } from 'framer-motion'
import { usePreferences } from '@/components/preferences'
import { cn } from '@/lib/utils'
import { useEscSkip } from './use-skip'

type StampTone = 'success' | 'danger' | 'warn' | 'memory'

const tones: Record<StampTone, string> = {
  success: 'text-success border-success',
  danger: 'text-danger border-danger',
  warn: 'text-warn border-warn',
  memory: 'text-viridian border-viridian',
}

/**
 * Rubber stamp that thunks onto a card: scale 1.8 to 1, a small shake, 320ms total.
 * Esc or reduced motion shows the final state immediately.
 */
export function Stamp({
  children,
  tone = 'success',
  className,
}: {
  children: React.ReactNode
  tone?: StampTone
  className?: string
}) {
  const { motionOn } = usePreferences()
  const skipped = useEscSkip(motionOn)
  const animate = motionOn && !skipped

  return (
    <motion.span
      role="status"
      style={{ '--tilt': '-6deg' } as React.CSSProperties}
      initial={animate ? { scale: 1.8, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1, x: [0, -2, 2, -1, 0] } : { scale: 1, opacity: 1 }}
      transition={
        animate
          ? {
              scale: { duration: 0.18, ease: [0.5, 0, 0.9, 0.6] },
              opacity: { duration: 0.08 },
              x: { duration: 0.14, delay: 0.18 },
            }
          : { duration: 0 }
      }
      className={cn(
        'tilt inline-flex items-center gap-1.5 rounded-md border-[2.5px] px-2.5 py-1 font-mono text-xs font-medium tracking-[0.14em] uppercase outline-2 outline-offset-2 outline-current/40 outline-dashed',
        tones[tone],
        className,
      )}
    >
      {children}
    </motion.span>
  )
}

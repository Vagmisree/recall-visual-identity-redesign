'use client'

import { motion } from 'framer-motion'
import { usePreferences } from '@/components/preferences'
import { cn } from '@/lib/utils'
import { useEscSkip } from './use-skip'

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/** Odometer-style roll for a formatted numeric string such as "3m 18s" or "4,812". */
export function DigitRoll({ value, className }: { value: string; className?: string }) {
  const { motionOn } = usePreferences()
  const skipped = useEscSkip(motionOn)
  const animate = motionOn && !skipped
  const chars = value.split('')

  return (
    <span className={cn('inline-flex font-mono tabular-nums', className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="inline-flex">
        {chars.map((char, i) => {
          const digit = DIGITS.indexOf(char)
          if (digit === -1) {
            return (
              <span key={i} className="whitespace-pre">
                {char}
              </span>
            )
          }
          return (
            <span key={i} className="relative inline-block h-[1lh] overflow-hidden">
              <span className="invisible">{char}</span>
              <motion.span
                className="absolute inset-x-0 top-0 flex flex-col"
                initial={animate ? { y: '0lh' } : false}
                animate={{ y: `-${digit}lh` }}
                transition={
                  animate ? { type: 'spring', stiffness: 120, damping: 18, delay: i * 0.05 } : { duration: 0 }
                }
              >
                {DIGITS.map((d) => (
                  <span key={d} className="block h-[1lh]">
                    {d}
                  </span>
                ))}
              </motion.span>
            </span>
          )
        })}
      </span>
    </span>
  )
}

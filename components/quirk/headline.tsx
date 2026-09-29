'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePreferences } from '@/components/preferences'
import { cn } from '@/lib/utils'
import { useEscSkip } from './use-skip'

const WAVE =
  'M2 7 C 9 1.5, 16 12.5, 23 7 S 37 1.5, 44 7 S 58 12.5, 65 7 S 79 1.5, 86 7 S 100 12.5, 107 7 S 116 3, 118 5'

/** Hand-drawn wavy underline in Ember. */
export function Squiggle({ draw = true, delay = 0, className }: { draw?: boolean; delay?: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 12"
      preserveAspectRatio="none"
      className={cn('pointer-events-none absolute inset-x-0 -bottom-[0.14em] h-[0.2em] w-full overflow-visible', className)}
    >
      <motion.path
        d={WAVE}
        fill="none"
        stroke="var(--ember)"
        strokeWidth={3}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={draw ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: [0.3, 0.7, 0.2, 1], delay }}
      />
    </svg>
  )
}

const CHAR_MS = 55

/**
 * Display headline with exactly one Instrument Serif italic word in Ember, underlined by a
 * squiggle. With motion on, the word types in and then the squiggle draws.
 */
export function Headline({
  as: Tag = 'h1',
  before,
  word,
  after,
  className,
  kinetic = true,
  id,
}: {
  as?: 'h1' | 'h2' | 'h3'
  before?: React.ReactNode
  word: string
  after?: React.ReactNode
  className?: string
  kinetic?: boolean
  id?: string
}) {
  const { motionOn } = usePreferences()
  const animate = kinetic && motionOn
  const [count, setCount] = useState(animate ? 0 : word.length)
  const skipped = useEscSkip(animate && count < word.length)
  const shown = skipped || !animate ? word.length : count

  useEffect(() => {
    if (!animate || skipped) return
    setCount(0)
    const timer = window.setInterval(() => {
      setCount((c) => {
        if (c >= word.length) {
          window.clearInterval(timer)
          return c
        }
        return c + 1
      })
    }, CHAR_MS)
    return () => window.clearInterval(timer)
  }, [animate, skipped, word])

  const done = shown >= word.length

  return (
    <Tag id={id} className={cn('font-display font-extrabold tracking-[-0.03em] text-balance', className)}>
      {before}
      {before ? ' ' : null}
      <span className="relative inline-grid whitespace-nowrap">
        <span className="sr-only">{word}</span>
        <span aria-hidden="true" className="serif-italic invisible col-start-1 row-start-1 pr-[0.06em]">
          {word}
        </span>
        <span aria-hidden="true" className="serif-italic col-start-1 row-start-1 pr-[0.06em]">
          {word.slice(0, shown)}
        </span>
        {done && <Squiggle draw={animate && !skipped} />}
      </span>
      {after}
    </Tag>
  )
}

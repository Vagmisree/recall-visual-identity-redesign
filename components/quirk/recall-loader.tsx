'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePreferences } from '@/components/preferences'
import { loaderLines } from '@/lib/copy'
import { cn } from '@/lib/utils'
import { Elio } from './elio'

/** Rotating loading copy with Elio searching. Announces once to screen readers. */
export function RecallLoader({ className }: { className?: string }) {
  const { playful, motionOn } = usePreferences()
  const lines = playful ? loaderLines.playful : loaderLines.plain
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % lines.length), 1600)
    return () => window.clearInterval(timer)
  }, [lines.length])

  return (
    <div role="status" className={cn('flex items-center gap-3', className)}>
      <Elio pose="searching" size={44} />
      <span className="sr-only">Searching memory</span>
      <span aria-hidden="true" className="relative h-5 min-w-0 flex-1 overflow-hidden text-sm text-muted-foreground">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={`${playful}-${index}`}
            className="absolute inset-0 truncate"
            initial={motionOn ? { y: 12, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            exit={motionOn ? { y: -12, opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {lines[index % lines.length]}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  )
}

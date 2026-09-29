'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { usePreferences } from '@/components/preferences'

const COLORS = ['#FF5A1F', '#FFE14D', '#FF8FB1', '#7CC6FE', '#BDEBDD', '#14110F']
const COUNT = 36
const DURATION = 0.9

type Burst = { id: number; x: number; y: number }
type Piece = { dx: number; dy: number; rotate: number; color: string; w: number; h: number; round: boolean }

function makePieces(): Piece[] {
  return Array.from({ length: COUNT }, (_, i) => {
    const angle = (Math.PI * 2 * i) / COUNT + Math.random() * 0.4
    const speed = 70 + Math.random() * 110
    return {
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed - 60,
      rotate: (Math.random() - 0.5) * 540,
      color: COLORS[i % COLORS.length],
      w: 5 + Math.random() * 4,
      h: 8 + Math.random() * 6,
      round: i % 5 === 0,
    }
  })
}

function BurstView({ burst, onDone }: { burst: Burst; onDone: () => void }) {
  const [pieces] = useState(makePieces)
  return (
    <div className="pointer-events-none fixed z-[90]" style={{ left: burst.x, top: burst.y }}>
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute block"
          style={{
            width: p.w,
            height: p.round ? p.w : p.h,
            background: p.color,
            borderRadius: p.round ? 999 : 1.5,
            border: '1px solid #14110F',
          }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: p.dx, y: [0, p.dy, p.dy + 140], rotate: p.rotate, opacity: [1, 1, 0] }}
          transition={{ duration: DURATION, ease: 'easeOut', times: [0, 0.45, 1] }}
          onAnimationComplete={i === 0 ? onDone : undefined}
        />
      ))}
    </div>
  )
}

/**
 * Single confetti burst for a first-ever resolution or a new record only.
 * Returns the portal node and a `fire(element)` trigger. Esc clears it.
 */
export function useConfetti() {
  const { motionOn } = usePreferences()
  const [bursts, setBursts] = useState<Burst[]>([])

  useEffect(() => {
    if (!bursts.length) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setBursts([])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [bursts.length])

  const fire = useCallback(
    (el: HTMLElement | null) => {
      if (!motionOn || !el) return
      const r = el.getBoundingClientRect()
      setBursts((b) => [...b, { id: Date.now(), x: r.left + r.width / 2, y: r.top + r.height / 2 }])
    },
    [motionOn],
  )

  const node =
    typeof document === 'undefined'
      ? null
      : createPortal(
          <AnimatePresence>
            {bursts.map((b) => (
              <BurstView key={b.id} burst={b} onDone={() => setBursts((all) => all.filter((x) => x.id !== b.id))} />
            ))}
          </AnimatePresence>,
          document.body,
        )

  return { confetti: node, fire }
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { usePreferences } from '@/components/preferences'
import { cn } from '@/lib/utils'

export type ElioPose =
  | 'idle'
  | 'thinking'
  | 'searching'
  | 'found'
  | 'celebrating'
  | 'sleepy'
  | 'confused'
  | 'waving'

export const elioPoses: ElioPose[] = [
  'idle',
  'thinking',
  'searching',
  'found',
  'celebrating',
  'sleepy',
  'confused',
  'waving',
]

const INK = '#14110F'
const CREAM = '#FFF6E8'
const EMBER = '#FF5A1F'
const VIRIDIAN = '#0B7A6B'
const PAPER = '#FFFFFF'

/** Trunk centre-lines per pose, drawn as a thick outlined stroke. */
const trunks: Record<ElioPose, string> = {
  idle: 'M82 60 C 92 66, 94 80, 88 90 C 85 95, 80 94, 81 89',
  thinking: 'M82 60 C 90 66, 86 76, 76 76 C 70 76, 69 70, 73 68',
  searching: 'M82 60 C 92 62, 100 62, 106 56',
  found: 'M82 58 C 92 52, 96 40, 94 28',
  celebrating: 'M82 58 C 94 50, 100 36, 96 22 C 95 18, 99 16, 101 19',
  sleepy: 'M82 62 C 88 72, 86 84, 80 92 C 77 96, 73 94, 75 90',
  confused: 'M82 60 C 90 68, 90 80, 84 88 C 81 92, 77 90, 79 86',
  waving: 'M82 58 C 92 52, 98 40, 96 26 C 95 21, 99 19, 102 22',
}

/**
 * Elio the elephant (elephants never forget). Cream body, Ember ear, Viridian ear lining,
 * 2px ink outline at every size, blinking dot eyes that follow the pointer by 2px.
 * In Calm mode Elio only appears when `essential` (empty and error states).
 */
export function Elio({
  pose = 'idle',
  size = 96,
  essential = false,
  showInCalm = false,
  label,
  className,
}: {
  pose?: ElioPose
  size?: number
  essential?: boolean
  showInCalm?: boolean
  label?: string
  className?: string
}) {
  const { playful, motionOn } = usePreferences()
  const ref = useRef<SVGSVGElement>(null)
  const [look, setLook] = useState({ x: 0, y: 0 })
  const unit = 120 / size
  const sw = 2 * unit
  const followPointer = motionOn && pose !== 'sleepy'

  useEffect(() => {
    if (!followPointer) {
      setLook({ x: 0, y: 0 })
      return
    }
    let frame = 0
    const onMove = (e: PointerEvent) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width * 0.6)
        const dy = e.clientY - (r.top + r.height * 0.4)
        const len = Math.hypot(dx, dy) || 1
        const max = 2 * unit
        setLook({ x: (dx / len) * max, y: (dy / len) * max })
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [followPointer, unit])

  if (!playful && !essential) return null

  const posed = playful ? pose : 'idle'
  const trunk = trunks[posed]
  const eyeY = posed === 'thinking' ? 46 : 49
  const trunkRaised = posed === 'waving' || posed === 'celebrating'

  return (
    <svg
      ref={ref}
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('shrink-0 overflow-visible', className)}
    >
      <g className={motionOn ? 'elio-bob' : undefined}>
        {/* index card tucked behind the ear */}
        <g transform="rotate(-14 30 30)">
          <rect x="16" y="20" width="26" height="18" rx="2" fill={PAPER} stroke={INK} strokeWidth={sw} />
          <path d="M20 26h16M20 31h11" stroke={VIRIDIAN} strokeWidth={sw * 0.9} strokeLinecap="round" />
        </g>

        {/* tail */}
        <path d="M34 86 C 26 86, 24 94, 20 96" fill="none" stroke={INK} strokeWidth={sw} strokeLinecap="round" />

        {/* legs */}
        <rect x="42" y="92" width="14" height="20" rx="6" fill={CREAM} stroke={INK} strokeWidth={sw} />
        <rect x="70" y="92" width="14" height="20" rx="6" fill={CREAM} stroke={INK} strokeWidth={sw} />

        {/* body */}
        <ellipse cx="60" cy="84" rx="28" ry="20" fill={CREAM} stroke={INK} strokeWidth={sw} />

        {/* head */}
        <circle cx="66" cy="52" r="24" fill={CREAM} stroke={INK} strokeWidth={sw} />

        {/* ear with viridian lining */}
        <g transform={posed === 'confused' ? 'rotate(-8 46 54)' : undefined}>
          <path
            d="M50 36 C 34 30, 24 42, 28 58 C 31 70, 42 74, 52 66 Z"
            fill={EMBER}
            stroke={INK}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <path d="M47 42 C 37 40, 33 48, 35 57 C 37 64, 43 66, 48 62" fill={VIRIDIAN} />
        </g>

        {/* trunk: outline stroke under a cream stroke gives a 2px outline */}
        <g className={posed === 'waving' && motionOn ? 'elio-wave' : undefined}>
          <path d={trunk} fill="none" stroke={INK} strokeWidth={11 + sw * 2} strokeLinecap="round" strokeLinejoin="round" />
          <path d={trunk} fill="none" stroke={CREAM} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
          {!trunkRaised && posed !== 'searching' && (
            <path d="M84 72 q 3 1 5 0 M84 79 q 3 1 5 0" stroke={INK} strokeWidth={sw * 0.6} strokeLinecap="round" />
          )}
        </g>

        {/* cheek */}
        <circle cx="80" cy="60" r="3.2" fill="#FF8FB1" opacity="0.9" />

        {/* eyes */}
        {posed === 'sleepy' ? (
          <path
            d="M64 50 q 3 3 6 0 M75 50 q 3 3 6 0"
            fill="none"
            stroke={INK}
            strokeWidth={sw}
            strokeLinecap="round"
          />
        ) : posed === 'celebrating' ? (
          <path
            d="M64 51 q 3 -4 6 0 M75 51 q 3 -4 6 0"
            fill="none"
            stroke={INK}
            strokeWidth={sw}
            strokeLinecap="round"
          />
        ) : (
          <g transform={`translate(${look.x} ${look.y})`}>
            <g className={motionOn ? 'elio-blink' : undefined}>
              <circle cx="67" cy={eyeY} r={posed === 'confused' ? 3.2 : 2.6} fill={INK} />
              <circle cx="78" cy={eyeY} r={2.6} fill={INK} />
            </g>
          </g>
        )}

        {/* pose props */}
        {posed === 'searching' && (
          <g>
            <circle cx="108" cy="46" r="8" fill={PAPER} fillOpacity="0.6" stroke={INK} strokeWidth={sw} />
            <path d="M104 53 L 100 58" stroke={INK} strokeWidth={sw * 1.6} strokeLinecap="round" />
          </g>
        )}
        {posed === 'found' && (
          <g transform="rotate(8 96 18)">
            <rect x="84" y="8" width="24" height="17" rx="2" fill={PAPER} stroke={INK} strokeWidth={sw} />
            <path d="M89 17 l3 3 6 -7" fill="none" stroke={VIRIDIAN} strokeWidth={sw * 1.1} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
        {posed === 'celebrating' && (
          <g stroke={INK} strokeWidth={sw} strokeLinecap="round">
            <path d="M106 12 l5 -5 M110 22 l7 0 M100 6 l0 -5" />
          </g>
        )}
        {posed === 'thinking' && (
          <g fill={INK}>
            <circle cx="94" cy="30" r="2" />
            <circle cx="101" cy="24" r="2.6" />
            <circle cx="109" cy="16" r="3.2" />
          </g>
        )}
        {posed === 'sleepy' && (
          <g fill={INK} fontFamily="var(--font-bricolage), sans-serif" fontWeight={800}>
            <text x="92" y="30" fontSize="12">
              z
            </text>
            <text x="102" y="18" fontSize="9">
              z
            </text>
          </g>
        )}
        {posed === 'confused' && (
          <text x="92" y="30" fill={INK} fontSize="22" fontWeight={800} fontFamily="var(--font-bricolage), sans-serif">
            ?
          </text>
        )}
      </g>
    </svg>
  )
}

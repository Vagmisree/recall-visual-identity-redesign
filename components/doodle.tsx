import { cn } from '@/lib/utils'

/** A small hand-drawn squiggle used in place of generic sparkle icons. */
export function Doodle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 12" fill="none" aria-hidden="true" className={cn('h-3 w-5 shrink-0', className)}>
      <path
        d="M1.5 8.5c2-4 3.5-5.5 5-3.5s1.5 4.5 3.5 3S12.8 2 14.8 3.2 16.5 8 18.5 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** The memory marker: a small Viridian dot. */
export function MemoryDot({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn('inline-block size-1.5 shrink-0 rounded-full bg-viridian', className)} />
}

import Link from 'next/link'
import { cn } from '@/lib/utils'

/** Recall wordmark: an ear-shaped mark plus the name in Bricolage. */
export function Wordmark({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/console" aria-label="Recall console" className={cn('inline-flex items-center gap-2 rounded-lg text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring', className)}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" rx="9" fill="#FF5A1F" stroke="currentColor" strokeWidth="2" />
        <path d="M17 7 C 10 5, 6 10, 8 17 C 9.5 22, 14 24, 18 21 Z" fill="#FFF6E8" stroke="#14110F" strokeWidth="2" strokeLinejoin="round" />
        <path d="M15.5 10 C 12 9.5, 10.5 12.5, 11.2 16 C 11.8 18.5, 13.8 19.4, 15.6 18.2" fill="#0B7A6B" />
        <circle cx="22" cy="12" r="1.8" fill="#14110F" />
      </svg>
      {!compact && <span className="inline-flex items-center font-display text-[22px] font-extrabold lowercase tracking-[-0.06em]">recall<span className="ml-0.5 size-2 rounded-full bg-ember" /></span>}
    </Link>
  )
}

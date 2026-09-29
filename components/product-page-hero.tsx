'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, BookMarked } from 'lucide-react'
import { Elio, type ElioPose } from '@/components/quirk/elio'
import { usePreferences } from '@/components/preferences'

type HeroTone = 'mint' | 'lemon' | 'sky' | 'bubblegum' | 'cream'

const tones: Record<HeroTone, string> = {
  mint: 'bg-mint',
  lemon: 'bg-lemon',
  sky: 'bg-sky',
  bubblegum: 'bg-bubblegum',
  cream: 'bg-cream',
}

export function ProductPageHero({
  eyebrow,
  title,
  accent,
  description,
  tone = 'cream',
  action,
  href,
  secondary,
  illustration = 'found',
}: {
  eyebrow: string
  title: string
  accent: string
  description: string
  tone?: HeroTone
  action?: string
  href?: string
  secondary?: ReactNode
  illustration?: ElioPose
}) {
  const { playful } = usePreferences()
  return (
    <header className={`on-bright relative isolate mb-7 overflow-hidden rounded-2xl border-2 border-ink ${tones[tone]} p-5 text-ink shadow-hard-sm sm:p-7 lg:min-h-[188px] lg:p-8`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-2/5 dot-matrix opacity-40" />
      <div className="relative z-10 flex min-h-[130px] flex-col justify-between gap-5 lg:max-w-[76%]">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em]">{eyebrow}</p>
          <h1 className="mt-3 max-w-4xl font-display text-[clamp(2.6rem,5.4vw,3.5rem)] font-extrabold leading-[.94] tracking-[-.065em]">
            {title} <em className="serif-italic">{accent}</em>
            <svg aria-hidden="true" className="ml-2 inline h-3 w-24 align-middle text-ember-ink" viewBox="0 0 100 12" fill="none">
              <path d="M2 8C16 2 26 11 39 6S62 2 74 7s16 2 24-2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-ink/75">{description}</p>
        </div>
        {(action || secondary) && (
          <div className="flex flex-wrap items-center gap-2">
            {action && href && (
              <Link href={href} className="pop-press inline-flex h-10 items-center gap-2 rounded-xl border-2 border-ink bg-ember px-4 text-xs font-bold text-ink shadow-hard-sm">
                {action}<ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            )}
            {secondary}
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute bottom-2 right-4 hidden items-end gap-2 lg:flex" aria-hidden="true">
        <div className="mb-4 rotate-2 rounded-xl border-2 border-ink bg-paper px-3 py-2 text-ink shadow-hard-sm">
          <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold"><BookMarked className="size-3 text-viridian" />mem_8f42</div>
          <div className="mt-1 text-[10px] font-semibold">a useful thread to follow</div>
        </div>
        {playful && <Elio pose={illustration} size={82} />}
      </div>
    </header>
  )
}

export function ProductActionButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="pop-press inline-flex h-10 items-center gap-2 rounded-xl border-2 border-ink bg-paper px-3 text-xs font-bold text-ink shadow-hard-sm">{children}</button>
}

export function ProductPageFrame({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-[1440px]">{children}</main>
}

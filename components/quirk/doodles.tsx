'use client'

import { usePreferences } from '@/components/preferences'
import { cn } from '@/lib/utils'

type IconProps = { className?: string; title?: string }

function Doodle({ className, title, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn('size-5 shrink-0', className)}
    >
      {children}
    </svg>
  )
}

export function CardDrawerIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M6.5 9.5 7 4.2c.1-.6.5-.9 1.1-.8l7.6.6c.6.1.9.5.9 1.1l-.3 4.3" />
      <path d="M9.4 6.4 14 6.8" />
      <path d="M3.3 10.1c0-.5.4-.8.9-.8h15.7c.5 0 .8.4.8.9l-.4 9.1c0 .5-.4.8-.9.8H4.6c-.5 0-.9-.4-.9-.9z" />
      <path d="M9.5 14.2c1.6.3 3.3.3 5 0" />
    </Doodle>
  )
}

export function StickyNotesIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M8.2 3.6h11.3c.5 0 .9.4.9.9v8.8l-4.6 4.5H8.4c-.5 0-.9-.4-.9-.9L7.3 4.5c0-.5.4-.9.9-.9z" />
      <path d="M20.4 13.3h-3.8c-.5 0-.9.4-.9.9v3.6" />
      <path d="M4.7 7.2 4 19.4c0 .6.4 1 .9 1h9.6" />
      <path d="M10.6 7.8h6.2M10.6 10.6h4.3" />
    </Doodle>
  )
}

export function MagnifierIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M10.4 3.8c3.7-.2 6.6 2.6 6.7 6.2.1 3.7-2.8 6.6-6.4 6.7-3.7.1-6.6-2.8-6.7-6.4-.1-3.5 2.8-6.4 6.4-6.5z" />
      <path d="m15.3 15.4 5 4.9" />
      <path d="M7.8 8.2c.6-1 1.5-1.6 2.6-1.8" />
    </Doodle>
  )
}

export function RubberStampIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M12.1 3.2c1.6 0 2.8 1.2 2.8 2.7 0 1.2-.8 2.1-1.6 2.6l.3 3.6" />
      <path d="M11.9 3.2c-1.6 0-2.8 1.3-2.8 2.8 0 1.1.7 2 1.6 2.5l-.3 3.6" />
      <path d="M4.6 12.3h14.8c.5 0 .9.4.9.9v2.4c0 .5-.4.9-.9.9H4.6c-.5 0-.9-.4-.9-.9v-2.4c0-.5.4-.9.9-.9z" />
      <path d="M5.6 16.6v1.6M18.4 16.6v1.6" />
      <path d="M4 20.6c5.3-.4 10.7-.4 16 0" />
    </Doodle>
  )
}

export function TrophyIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M7.2 3.8h9.6l-.4 5.6c-.2 2.4-2.1 4.2-4.4 4.2s-4.2-1.8-4.4-4.2z" />
      <path d="M7.3 5.6H4.6c-.2 2.6 1 4.3 3.3 4.7M16.7 5.6h2.7c.2 2.6-1 4.3-3.3 4.7" />
      <path d="M12 13.6v3.4" />
      <path d="M8.6 20.4c.1-1.9 1.5-3.3 3.4-3.3s3.3 1.4 3.4 3.3z" />
    </Doodle>
  )
}

export function TinyFlameIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M12.3 3.4c.6 2.6 4.8 4.7 5 9.4.1 3.8-2.4 7-5.4 7-3.1 0-5.4-2.6-5.3-5.8.1-2.3 1.4-3.6 2.4-4.6.2 1.5.9 2.4 1.8 2.6-.3-3.1.3-6.2 1.5-8.6z" />
      <path d="M11.9 19.7c-1.4 0-2.3-1.1-2.2-2.3.1-1.1 1-1.8 1.6-2.6.9 1 2.8 1.8 2.7 3-.1 1.1-.9 1.9-2.1 1.9z" />
    </Doodle>
  )
}

export function ThreadNeedleIcon(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M19.6 3.8 7.4 16.2l-1.2 2.1 2.1-1.1L20.5 4.7c.3-.3.3-.7 0-.9-.3-.3-.6-.3-.9 0z" />
      <path d="m17.6 5.4 1.3 1.3" />
      <path d="M18.2 6.1c-4.2 1.4-6 4.1-4.6 5.6 1.5 1.6 4.4-.6 3.2-2.1-1.6-1.9-8.7 2.2-11.3 6.1-1.4 2.1-2.1 4.4-1.5 5.1" />
    </Doodle>
  )
}

export const doodleIcons = [
  { name: 'Card drawer', Icon: CardDrawerIcon },
  { name: 'Sticky notes', Icon: StickyNotesIcon },
  { name: 'Magnifier', Icon: MagnifierIcon },
  { name: 'Rubber stamp', Icon: RubberStampIcon },
  { name: 'Trophy', Icon: TrophyIcon },
  { name: 'Tiny flame', Icon: TinyFlameIcon },
  { name: 'Thread and needle', Icon: ThreadNeedleIcon },
] as const

type ArrowDirection = 'right' | 'left' | 'down' | 'up'

const arrowPaths: Record<ArrowDirection, { d: string; head: string; box: string }> = {
  right: { d: 'M6 30 C 20 6, 52 4, 72 22', head: 'M62 20 L73 23 L70 12', box: '0 0 80 36' },
  left: { d: 'M74 30 C 60 6, 28 4, 8 22', head: 'M18 20 L7 23 L10 12', box: '0 0 80 36' },
  down: { d: 'M10 4 C 34 8, 40 30, 26 52', head: 'M20 44 L25 54 L34 47', box: '0 0 48 60' },
  up: { d: 'M10 56 C 34 52, 40 30, 26 8', head: 'M20 16 L25 6 L34 13', box: '0 0 48 60' },
}

/** Curved hand-drawn arrow with a handwritten-style label. Hidden in Calm mode. */
export function DoodleArrow({
  label,
  direction = 'right',
  className,
}: {
  label: string
  direction?: ArrowDirection
  className?: string
}) {
  const { playful } = usePreferences()
  if (!playful) return null
  const arrow = arrowPaths[direction]
  const vertical = direction === 'down' || direction === 'up'
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none inline-flex items-center gap-1 text-foreground select-none',
        vertical ? 'flex-col' : direction === 'left' ? 'flex-row-reverse' : 'flex-row',
        direction === 'up' && 'flex-col-reverse',
        className,
      )}
    >
      <span className="font-serif text-lg leading-none italic">{label}</span>
      <svg viewBox={arrow.box} className={vertical ? 'h-12 w-10' : 'h-8 w-18'} fill="none">
        <path d={arrow.d} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        <path d={arrow.head} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

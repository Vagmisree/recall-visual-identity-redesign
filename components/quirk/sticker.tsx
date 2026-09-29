import { cn } from '@/lib/utils'

export type StickerColor = 'lemon' | 'bubblegum' | 'sky' | 'mint' | 'ember' | 'paper'

const fills: Record<StickerColor, string> = {
  lemon: 'bg-lemon',
  bubblegum: 'bg-bubblegum',
  sky: 'bg-sky',
  mint: 'bg-mint',
  ember: 'bg-ember',
  paper: 'bg-paper',
}

/** Outlined flat pill with a hard shadow. Max three per screen, never on data. */
export function Sticker({
  color = 'lemon',
  tilt = -2,
  className,
  children,
}: {
  color?: StickerColor
  tilt?: number
  className?: string
  children: React.ReactNode
}) {
  const clamped = Math.max(-3, Math.min(3, tilt))
  return (
    <span
      style={{ '--tilt': `${clamped}deg` } as React.CSSProperties}
      className={cn(
        'on-bright pop tilt wobble inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap select-none',
        fills[color],
        className,
      )}
    >
      {children}
    </span>
  )
}

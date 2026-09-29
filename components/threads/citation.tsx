'use client'

import { cn } from '@/lib/utils'
import { useThreadAnchor, useThreadTarget } from '.'

export function Citation({
  id,
  n,
  label,
  className,
  ...rest
}: {
  id: string
  n: number
  label?: string
  className?: string
} & Omit<React.HTMLAttributes<HTMLButtonElement>, 'id'>) {
  const anchor = useThreadAnchor(id)
  return (
    <button
      type="button"
      {...rest}
      {...anchor}
      aria-label={label ? `Citation ${n}: ${label}` : `Citation ${n}`}
      className={cn(
        'inline-flex h-5 min-w-6 items-center justify-center rounded-full border border-viridian-border bg-viridian-tint px-1.5 align-middle font-mono text-[10.5px] font-medium text-viridian transition-colors hover:bg-viridian-border/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-viridian aria-pressed:bg-viridian aria-pressed:text-card',
        className,
      )}
    >
      [{n}]
    </button>
  )
}

export function ThreadTarget({
  id,
  className,
  children,
  as: Tag = 'div',
  ...rest
}: {
  id: string
  className?: string
  children: React.ReactNode
  as?: 'div' | 'li' | 'article'
} & Omit<React.HTMLAttributes<HTMLElement>, 'id' | 'className'>) {
  const target = useThreadTarget(id, className)
  return (
    <Tag {...rest} {...target}>
      {children}
    </Tag>
  )
}

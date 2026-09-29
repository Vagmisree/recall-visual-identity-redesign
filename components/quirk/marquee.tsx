import { cn } from '@/lib/utils'

/** Continuously scrolling band. Pauses on hover; static under Calm or reduced motion. */
export function Marquee({
  items,
  className,
  itemClassName,
  separator = '✦',
  label,
}: {
  items: React.ReactNode[]
  className?: string
  itemClassName?: string
  separator?: string
  label: string
}) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <li key={i} className={cn('flex items-center gap-6 pr-6 whitespace-nowrap', itemClassName)}>
          {item}
          <span aria-hidden="true" className="opacity-60">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  )
  return (
    <section aria-label={label} className={cn('overflow-hidden', className)}>
      <div className="recall-ticker flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </section>
  )
}

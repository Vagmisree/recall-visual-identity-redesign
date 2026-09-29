import Link from 'next/link'
export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  const label = section[0].toUpperCase() + section.slice(1)
  return (
    <div className="mx-auto max-w-6xl">
      <header className="border-b pb-6">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Recall / {section}</div>
        <h1 className="mt-3 text-3xl font-bold">
          {label} <span className="serif-italic">workspace</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A focused view of your incident operations and persistent memory.
        </p>
      </header>
      <div className="mt-8 grid min-h-64 place-items-center rounded-xl border bg-card dot-matrix">
        <div className="text-center">
          <div className="mx-auto mb-3 size-3 rounded-full bg-viridian" />
          <h2 className="font-semibold">Your {section} view is ready</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect the dots between incidents and what your team already knows.
          </p>
          <Link href="/threads-demo" className="mt-4 inline-block text-sm font-semibold text-ember-ink">
            Explore memory threads →
          </Link>
        </div>
      </div>
    </div>
  )
}

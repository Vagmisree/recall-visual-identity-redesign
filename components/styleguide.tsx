'use client'

import { useRef } from 'react'
import { usePreferences } from '@/components/preferences'
import { QuirkSwitch } from '@/components/quirk/quirk-switch'
import { DigitRoll } from '@/components/quirk/digit-roll'
import { useConfetti } from '@/components/quirk/confetti'
import { DoodleArrow, doodleIcons } from '@/components/quirk/doodles'
import { Elio, elioPoses } from '@/components/quirk/elio'
import { Headline, Squiggle } from '@/components/quirk/headline'
import { Marquee } from '@/components/quirk/marquee'
import { Say } from '@/components/quirk/say'
import { Stamp } from '@/components/quirk/stamp'
import { Sticker } from '@/components/quirk/sticker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { copy } from '@/lib/copy'

const palette = [
  { name: 'Ink', hex: '#14110F', color: '#14110F', text: '#FFF6E8' },
  { name: 'Cream', hex: '#FFF6E8', color: '#FFF6E8', text: '#14110F' },
  { name: 'Paper', hex: '#FFFFFF', color: '#FFFFFF', text: '#14110F' },
  { name: 'Ember', hex: '#FF5A1F', color: '#FF5A1F', text: '#14110F' },
  { name: 'Lemon', hex: '#FFE14D', color: '#FFE14D', text: '#14110F' },
  { name: 'Bubblegum', hex: '#FF8FB1', color: '#FF8FB1', text: '#14110F' },
  { name: 'Sky', hex: '#7CC6FE', color: '#7CC6FE', text: '#14110F' },
  { name: 'Viridian · memory', hex: '#0B7A6B', color: '#0B7A6B', text: '#FFFFFF' },
  { name: 'Mint · memory', hex: '#BDEBDD', color: '#BDEBDD', text: '#14110F' },
]

const statuses = [
  { name: 'Success', foreground: '#17803D', background: '#E3F5EA' },
  { name: 'Warning', foreground: '#8A5A12', background: '#FFF1CC' },
  { name: 'Danger', foreground: '#C0342B', background: '#FDE7E4' },
]

function SectionTitle({ before, word }: { before: string; word: string }) {
  return <Headline as="h2" before={before} word={word} kinetic={false} className="text-3xl md:text-4xl" />
}

export function Styleguide() {
  const { playful } = usePreferences()
  const confettiButton = useRef<HTMLButtonElement>(null)
  const { confetti, fire } = useConfetti()

  return (
    <div className="mx-auto max-w-6xl pb-16">
      <section className="on-bright relative overflow-hidden rounded-3xl border-2 border-ink bg-ember p-6 shadow-hard md:p-10">
        <div className="dot-matrix absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="relative flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.16em]">recall / design system / 2026</p>
            <Headline before="A visual" word="memory" after=" for Recall" className="mt-4 text-5xl leading-[0.98] md:text-7xl" />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/80 md:text-lg">
              A practical field guide to the colors, type, motion, and small oddities that make Recall feel like itself.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest">global quirk level</span>
            <QuirkSwitch />
          </div>
        </div>
      </section>

      <section className="mt-14">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">01 / foundations</p>
        <SectionTitle before="Color with" word="receipts" />
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Flat fills only. Ink stays on brights; memory greens are reserved for remembered facts and outcomes.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {palette.map((swatch) => (
            <div key={swatch.name} className="overflow-hidden rounded-2xl border border-ink/15 bg-card">
              <div className="h-20 border-b border-ink/10" style={{ backgroundColor: swatch.color }} />
              <div className="flex items-center justify-between gap-2 p-3">
                <span className="text-xs font-bold">{swatch.name}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{swatch.hex}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {statuses.map((status) => (
            <div key={status.name} className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-sm font-semibold" style={{ color: status.foreground }}>{status.name}</span>
              <span className="rounded-full px-3 py-1 font-mono text-xs" style={{ color: status.foreground, backgroundColor: status.background }}>
                status / ready
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">02 / typography</p>
        <SectionTitle before="Type that" word="remembers" />
        <Card className="mt-6 border-border shadow-none">
          <CardContent className="grid gap-6 py-6">
            <div className="border-b border-border pb-5">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">display / 72px / bricolage grotesque 800</p>
              <p className="font-display text-5xl font-extrabold leading-none tracking-[-0.03em] md:text-7xl">Every fix has a <span className="serif-italic relative inline-block">story<Squiggle draw={false} /></span></p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">headline / 32px</p>
                <p className="font-display text-3xl font-bold tracking-[-0.03em]">Incident <span className="serif-italic">memory</span></p>
              </div>
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">body / hanken grotesk</p>
                <p className="max-w-lg text-sm leading-relaxed">Keep the explanation readable, the hierarchy obvious, and the next useful action close at hand.</p>
              </div>
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">serif accent / instrument serif italic</p>
                <p className="font-serif text-3xl italic">one word, not a paragraph.</p>
              </div>
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">mono / jetbrains</p>
                <p className="font-mono text-sm">INC-2041 · 09:42:18 · 3m 18s</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-14">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">03 / interactive surfaces</p>
        <SectionTitle before="Make it" word="tactile" />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Card className="border-border shadow-none">
            <CardHeader><CardTitle>Buttons &amp; cards</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4 pb-5">
              <Button>save memory</Button>
              <Button variant="outline">view incident</Button>
              <Button variant="secondary">quiet action</Button>
              <button type="button" className="pop-press rounded-xl bg-lemon px-4 py-2.5 text-sm font-bold text-ink">press me</button>
            </CardContent>
          </Card>
          <Card className="border-border shadow-none">
            <CardHeader><CardTitle>Sticker kit</CardTitle></CardHeader>
            <CardContent className="flex min-h-20 flex-wrap items-center gap-4 pb-5">
              <Sticker color="lemon" tilt={-3}>kept for later</Sticker>
              <Sticker color="bubblegum" tilt={2}>tiny receipt</Sticker>
              <Sticker color="sky" tilt={-1}>known issue</Sticker>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-5 border-border shadow-none">
          <CardHeader><CardTitle>Squiggle &amp; doodle arrows</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap items-center gap-10 pb-6">
            <p className="font-display text-3xl font-bold">Keep the <span className="serif-italic relative inline-block">thread<Squiggle draw={false} /></span></p>
            <DoodleArrow label="try this" direction="right" />
            <DoodleArrow label="look here" direction="down" />
          </CardContent>
        </Card>
      </section>

      <section className="mt-14">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">04 / doodle library</p>
        <SectionTitle before="Useful little" word="marks" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {doodleIcons.map(({ name, Icon }, index) => (
            <div key={name} className="flex min-h-28 flex-col justify-between rounded-2xl border border-border bg-card p-4">
              <Icon className="size-7 text-ink" />
              <span className="text-xs font-semibold">{name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">05 / elio</p>
        <SectionTitle before="The elephant" word="remembers" />
        <p className="mt-3 text-sm text-muted-foreground">Cream body, Ember ear, Viridian lining, little card behind the ear. Static pose art stays inspectable here in either mode.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {elioPoses.map((pose) => (
            <Card key={pose} className="border-border shadow-none">
              <CardHeader className="pb-0"><CardTitle className="font-mono text-xs lowercase">{pose}</CardTitle></CardHeader>
              <CardContent className="flex items-end justify-between gap-1 pb-4">
                {[40, 72, 112].map((size) => (
                  <div key={size} className="flex min-w-0 flex-col items-center gap-1">
                    <Elio pose={pose} size={size} showInCalm label={`Elio ${pose} pose, ${size} pixels`} />
                    <span className="font-mono text-[9px] text-muted-foreground">{size}px</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">06 / motion</p>
        <SectionTitle before="Motion with an" word="off-switch" />
        <p className="mt-3 text-sm text-muted-foreground">Press Escape to skip active sequences. Calm mode and reduced-motion preferences keep everything still.</p>
        <Card className="mt-6 border-border shadow-none">
          <CardContent className="grid gap-6 py-6 md:grid-cols-2">
            <div className="flex flex-wrap items-center gap-4">
              <Button ref={confettiButton} onClick={() => fire(confettiButton.current)}>small confetti</Button>
              {confetti}
              <Stamp>resolved</Stamp>
              <span className="rounded-lg border border-border bg-card px-3 py-2 font-mono text-xl"><DigitRoll value="3m 18s" /></span>
            </div>
            <div className="flex flex-col justify-center gap-3">
              <Headline as="h3" before="Kinetic" word="memory" className="text-3xl" />
              <Marquee
                label="Recall design system marquee"
                className="rounded-lg border border-ink bg-lemon py-2 font-mono text-xs text-ink"
                items={['remember the fix', 'keep the receipts', 'less repeat paging']}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-14">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">07 / quirk levels</p>
        <SectionTitle before="Two settings, one" word="system" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="pop rounded-2xl bg-lemon p-5 text-ink">
            <p className="font-mono text-xs uppercase tracking-widest">full / playful</p>
            <p className="mt-3 text-sm font-semibold">{copy.settingsHint.playful}</p>
            <div className="mt-5 flex items-center gap-3"><Elio pose="waving" size={64} label="Elio waving" /><Sticker color="bubblegum" tilt={2}>tiny helper</Sticker></div>
          </div>
          <div className="calm rounded-2xl border border-border bg-card p-5 text-foreground">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">calm / plain</p>
            <p className="mt-3 text-sm font-semibold">{copy.settingsHint.plain}</p>
            <div className="mt-5 flex items-center gap-3"><span className="grid size-16 place-items-center rounded-xl border border-border bg-muted font-mono text-xs">still</span><span className="text-xs text-muted-foreground">same palette. less theatre.</span></div>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Current voice: <span className="font-semibold text-foreground"><Say k="settingsHint" /></span> <span className="text-xs">(switch above to compare)</span></p>
      </section>
    </div>
  )
}

export default Styleguide

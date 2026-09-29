'use client'

import { useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Check, Play, RotateCcw } from 'lucide-react'
import { usePreferences } from '@/components/preferences'
import { Button } from '@/components/ui/button'
import { DoodleArrow, doodleIcons } from '@/components/quirk/doodles'
import { DigitRoll } from '@/components/quirk/digit-roll'
import { Elio, elioPoses } from '@/components/quirk/elio'
import { Headline, Squiggle } from '@/components/quirk/headline'
import { Marquee } from '@/components/quirk/marquee'
import { QuirkSwitch } from '@/components/quirk/quirk-switch'
import { Stamp } from '@/components/quirk/stamp'
import { Sticker } from '@/components/quirk/sticker'
import { useConfetti } from '@/components/quirk/confetti'

const colors = [
  { name: 'Ink', value: '#14110F', className: 'bg-ink text-cream' },
  { name: 'Cream', value: '#FFF6E8', className: 'bg-cream text-ink' },
  { name: 'Paper', value: '#FFFFFF', className: 'bg-paper text-ink' },
  { name: 'Ember', value: '#FF5A1F', className: 'bg-ember text-ink' },
  { name: 'Lemon', value: '#FFE14D', className: 'bg-lemon text-ink' },
  { name: 'Bubblegum', value: '#FF8FB1', className: 'bg-bubblegum text-ink' },
  { name: 'Sky', value: '#7CC6FE', className: 'bg-sky text-ink' },
  { name: 'Viridian', value: '#0B7A6B', className: 'bg-viridian text-cream' },
  { name: 'Mint', value: '#BDEBDD', className: 'bg-mint text-ink' },
]

const statuses = [
  { name: 'Success', foreground: '#17803D', background: '#E3F5EA' },
  { name: 'Warning', foreground: '#B7791F', background: '#FFF1CC' },
  { name: 'Danger', foreground: '#C0342B', background: '#FDE7E4' },
]

const typeSamples = [
  { label: 'Display / 72', className: 'font-display text-5xl font-extrabold tracking-[-0.03em] sm:text-7xl', sample: 'remember the fix' },
  { label: 'Heading / 36', className: 'font-display text-3xl font-bold tracking-[-0.03em]', sample: 'context beats guesswork' },
  { label: 'Body / 16', className: 'text-base leading-7', sample: 'The right incident history, right when your team needs it.' },
  { label: 'Mono / 13', className: 'font-mono text-sm', sample: 'INC-0042   00:03:18   0.96' },
]

const sectionClass = 'scroll-mt-24 border-t border-ink/15 py-10 sm:py-14'
const sectionLabel = 'font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground'

export function RecallStyleguide() {
  const { playful, motionOn } = usePreferences()
  const { confetti, fire } = useConfetti()
  const confettiTarget = useRef<HTMLButtonElement>(null)
  const [roll, setRoll] = useState(4812)
  const [stampVersion, setStampVersion] = useState(0)

  return (
    <div className="mx-auto max-w-6xl">
      {confetti}
      <header className="relative mb-12 overflow-hidden rounded-2xl border-2 border-ink bg-ember p-6 text-ink shadow-[6px_6px_0_#14110f] sm:p-10 lg:p-12">
        <div className="pointer-events-none absolute -right-6 -top-7 size-36 rounded-full border-2 border-ink/20 sm:size-56" aria-hidden="true" />
        <div className="pointer-events-none absolute right-10 top-12 size-16 rounded-full border-2 border-ink/20 sm:right-24 sm:top-20 sm:size-24" aria-hidden="true" />
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em]">Recall / design system / 01</p>
            <Headline
              before="The visual"
              word="identity"
              after=" of Recall."
              className="max-w-3xl text-5xl leading-[0.98] sm:text-7xl lg:text-[88px]"
              kinetic
            />
            <p className="mt-6 max-w-xl text-base leading-7 sm:text-lg">
              A little more human. A lot more memorable. Built for the people who have to fix it at 2 a.m.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <div className="flex flex-wrap gap-3">
              <Sticker color="lemon" tilt={-2}>built to remember</Sticker>
              <Sticker color="sky" tilt={2}>not another dashboard</Sticker>
            </div>
            <div className="flex items-center gap-3 rounded-xl border-2 border-ink bg-paper px-3 py-2 text-ink shadow-[3px_3px_0_#14110f]">
              <span className="font-mono text-[10px] uppercase tracking-wider">quirk level</span>
              <QuirkSwitch />
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-4 right-4 hidden text-ink sm:block" aria-hidden="true">
          <DoodleArrow label="start here" direction="left" />
        </div>
      </header>

      <section id="palette" className={sectionClass} aria-labelledby="palette-heading">
        <p className={sectionLabel}>01 / colour</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <Headline as="h2" id="palette-heading" word="colour" after=" with a point of view" className="text-3xl sm:text-5xl" kinetic={false} />
          <p className="max-w-md text-sm leading-6 text-muted-foreground">Warm paper, loud ink, and one bright signal at a time. Memory green stays in memory.</p>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {colors.map((color) => (
            <div key={color.name} className={`flex min-h-24 flex-col justify-between rounded-xl border border-ink/15 p-3 ${color.className}`}>
              <span className="text-sm font-bold">{color.name}</span>
              <span className="font-mono text-[11px]">{color.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {statuses.map((status) => (
            <div key={status.name} className="flex items-center justify-between rounded-xl border border-ink/10 px-4 py-3" style={{ backgroundColor: status.background, color: status.foreground }}>
              <span className="text-sm font-bold">{status.name}</span>
              <span className="font-mono text-[11px]">{status.foreground} / {status.background}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">Bright fills use Ink text. Dark mode switches the canvas to Ink and type to Cream; the brights stay bright.</p>
      </section>

      <section id="type" className={sectionClass} aria-labelledby="type-heading">
        <p className={sectionLabel}>02 / type</p>
        <Headline as="h2" id="type-heading" word="type" after=" that sounds like us" className="mt-3 text-3xl sm:text-5xl" kinetic={false} />
        <div className="mt-7 grid gap-3 md:grid-cols-2">
          {typeSamples.map((sample) => (
            <div key={sample.label} className="rounded-2xl border border-ink/15 bg-paper p-5">
              <p className={sectionLabel}>{sample.label}</p>
              <p className={`mt-4 ${sample.className}`}>{sample.sample}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-ink/15 bg-paper p-5 sm:p-7">
          <p className={sectionLabel}>Kinetic headline / one serif word / squiggle underline</p>
          <Headline before="Good fixes" word="stick" after=" around." className="mt-5 text-4xl sm:text-6xl" />
          <p className="mt-3 text-sm text-muted-foreground">The Instrument Serif word types in, then the Ember line draws underneath.</p>
        </div>
      </section>

      <section id="controls" className={sectionClass} aria-labelledby="controls-heading">
        <p className={sectionLabel}>03 / controls &amp; stickers</p>
        <Headline as="h2" id="controls-heading" word="press" after=" playfully" className="mt-3 text-3xl sm:text-5xl" kinetic={false} />
        <div className="mt-7 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border-2 border-ink bg-paper p-5 shadow-[4px_4px_0_#14110f] sm:p-7">
            <p className={sectionLabel}>Buttons / 12px radius / 2px outline</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button size="lg" onClick={() => setStampVersion((v) => v + 1)}><Check data-icon="inline-start" />Primary action</Button>
              <Button size="lg" variant="outline"><Play data-icon="inline-start" />Secondary action</Button>
              <button type="button" className="rounded-xl border-2 border-ink bg-lemon px-5 py-3 text-sm font-bold text-ink shadow-[4px_4px_0_#14110f] transition-transform active:translate-x-[3px] active:translate-y-[3px] active:scale-[0.96] active:shadow-[1px_1px_0_#14110f]">Squishy press</button>
            </div>
            <div className="mt-7 flex min-h-14 items-center gap-4">
              <span className="font-mono text-xs text-muted-foreground">outcome / {String(stampVersion).padStart(2, '0')}</span>
              <Stamp key={stampVersion} tone="success">resolved</Stamp>
            </div>
          </div>
          <div className="rounded-2xl border-2 border-ink bg-lemon p-5 text-ink shadow-[4px_4px_0_#14110f] sm:p-7">
            <p className={sectionLabel}>Stickers / no more than three on a screen</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Sticker color="bubblegum" tilt={-3}>receipts attached</Sticker>
              <Sticker color="sky" tilt={2}>past you: helpful</Sticker>
              <Sticker color="paper" tilt={-1}>works on my incident</Sticker>
            </div>
            <p className="mt-6 text-sm leading-6">Flat fills. Ink outline. Hard shadow. A little lean, never on data.</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-6 rounded-2xl border border-ink/15 bg-paper p-5">
          <div className="relative inline-flex px-2 pb-3 font-display text-2xl font-bold">Squiggle sample<Squiggle draw={motionOn} /></div>
          <DoodleArrow label="try this" direction="right" />
          <DoodleArrow label="down here" direction="down" />
        </div>
      </section>

      <section id="doodles" className={sectionClass} aria-labelledby="doodles-heading">
        <p className={sectionLabel}>04 / doodle kit</p>
        <Headline as="h2" id="doodles-heading" word="drawn" after=" from memory" className="mt-3 text-3xl sm:text-5xl" kinetic={false} />
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {doodleIcons.map(({ name, Icon }) => (
            <div key={name} className="flex min-h-28 flex-col justify-between rounded-2xl border border-ink/15 bg-paper p-4">
              <Icon className="size-7 text-ember-ink" />
              <span className="text-xs font-semibold">{name}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="elio" className={sectionClass} aria-labelledby="elio-heading">
        <p className={sectionLabel}>05 / elio the elephant</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
          <Headline as="h2" id="elio-heading" before="elephants never" word="forget" className="text-3xl sm:text-5xl" kinetic={false} />
          <div className="flex items-center gap-3 rounded-xl border border-ink/15 bg-paper px-3 py-2">
            <span className="font-mono text-[10px] uppercase tracking-wider">preview</span>
            <QuirkSwitch />
          </div>
        </div>
        <div className="mt-6 overflow-hidden rounded-2xl border border-ink/15 bg-paper">
          <div className="grid grid-cols-[minmax(94px,1fr)_repeat(3,minmax(66px,0.7fr))] items-center border-b border-ink/10 bg-cream px-3 py-3 font-mono text-[10px] uppercase tracking-wider sm:px-5">
            <span>Pose</span><span className="text-center">48px</span><span className="text-center">80px</span><span className="text-center">120px</span>
          </div>
          {playful ? elioPoses.map((pose) => (
            <div key={pose} className="grid min-h-24 grid-cols-[minmax(94px,1fr)_repeat(3,minmax(66px,0.7fr))] items-center border-b border-ink/10 px-3 last:border-0 sm:px-5">
              <span className="font-mono text-xs">{pose}</span>
              {[48, 80, 120].map((size) => (
                <div key={size} className="flex min-h-24 items-center justify-center overflow-hidden">
                  <Elio pose={pose} size={size} label={`Elio, ${pose} pose, ${size} pixels`} />
                </div>
              ))}
            </div>
          )) : (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <Elio pose="idle" size={96} essential label="Elio, calm idle pose" />
              <p className="max-w-sm text-sm leading-6 text-muted-foreground">Calm mode keeps the mascot for empty and error states. Switch back to Full to inspect all poses and sizes.</p>
            </div>
          )}
        </div>
      </section>

      <section id="motion" className={sectionClass} aria-labelledby="motion-heading">
        <p className={sectionLabel}>06 / motion lab</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
          <Headline as="h2" id="motion-heading" word="motion" after=" with a job" className="text-3xl sm:text-5xl" kinetic={false} />
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">Esc skips active demos. Calm and reduced-motion preferences keep everything still.</p>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-ink/15 bg-paper p-5 sm:p-7">
            <p className={sectionLabel}>Slot-machine digits</p>
            <div className="mt-5 flex items-center gap-4">
              <DigitRoll value={roll.toLocaleString('en-US')} className="font-display text-4xl font-extrabold" />
              <Button size="sm" variant="outline" onClick={() => setRoll((n) => n === 4812 ? 9627 : 4812)}><RotateCcw data-icon="inline-start" />Roll</Button>
            </div>
          </div>
          <div className="rounded-2xl border border-ink/15 bg-paper p-5 sm:p-7">
            <p className={sectionLabel}>Confetti / max 40 pieces / 900ms</p>
            <div className="mt-5 flex items-center gap-4">
              <Button ref={confettiTarget} onClick={() => fire(confettiTarget.current)}>Resolve incident</Button>
              <span className="text-sm text-muted-foreground">{motionOn ? 'one small celebration' : 'motion is paused'}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-ink/15 bg-paper p-5 sm:p-7">
            <p className={sectionLabel}>Marquee / pauses on hover</p>
            <Marquee
              label="Recall motion sample"
              items={['memory beats guesswork', 'the fix is in the notes', 'context, on call']}
              separator="•"
              className="mt-5 border-y border-ink/15 py-3 font-mono text-xs uppercase tracking-wider"
            />
          </div>
          <div className="rounded-2xl border border-ink/15 bg-paper p-5 sm:p-7">
            <p className={sectionLabel}>Motion rules</p>
            <ul className="mt-4 flex flex-col gap-3 text-sm leading-6">
              <li className="flex gap-2"><ArrowDownRight className="mt-1 size-4 shrink-0 text-ember-ink" aria-hidden="true" />Elio breathes by 4px; sticker wobble stays small.</li>
              <li className="flex gap-2"><ArrowUpRight className="mt-1 size-4 shrink-0 text-ember-ink" aria-hidden="true" />Reduced motion and Calm mode turn the play off.</li>
              <li className="flex gap-2"><Check className="mt-1 size-4 shrink-0 text-viridian" aria-hidden="true" />Meaning stays visible if animation is skipped.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="levels" className={`${sectionClass} pb-4`} aria-labelledby="levels-heading">
        <p className={sectionLabel}>07 / quirk level</p>
        <Headline as="h2" id="levels-heading" word="same" after=" signal, two volumes" className="mt-3 text-3xl sm:text-5xl" kinetic={false} />
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <div className={`rounded-2xl border-2 border-ink p-5 sm:p-7 ${playful ? 'bg-lemon text-ink shadow-[4px_4px_0_#14110f]' : 'bg-paper text-ink'}`}>
            <div className="flex items-center justify-between gap-4"><p className="font-mono text-xs uppercase tracking-wider">Full</p><Sticker color="bubblegum" tilt={2}>a little extra</Sticker></div>
            <p className="mt-5 font-display text-3xl font-bold tracking-[-0.03em]">{playful ? 'all the personality.' : 'ready when you are.'}</p>
            <p className="mt-2 text-sm leading-6">{playful ? 'Elio, doodles, playful copy, rotations, hard shadows, and motion.' : 'This version stays tidy and quiet. Full mode brings the extras back.'}</p>
          </div>
          <div className={`rounded-2xl border-2 border-ink p-5 sm:p-7 ${!playful ? 'bg-sky text-ink shadow-[4px_4px_0_#14110f]' : 'bg-paper text-ink'}`}>
            <div className="flex items-center justify-between gap-4"><p className="font-mono text-xs uppercase tracking-wider">Calm</p><span className="rounded-full border border-ink/25 px-3 py-1 font-mono text-[10px] uppercase">less motion</span></div>
            <p className="mt-5 font-display text-3xl font-bold tracking-[-0.03em]">{!playful ? 'same signal. less noise.' : 'cleaner, still Recall.'}</p>
            <p className="mt-2 text-sm leading-6">{!playful ? 'Colour and layout stay. Rotation, motion, mascot poses, and slang step aside.' : 'Switch to Calm to preview a quieter version without losing the visual identity.'}</p>
          </div>
        </div>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink/15 bg-paper p-4 sm:p-5">
          <div><p className="font-semibold">Try both settings</p><p className="mt-1 text-sm text-muted-foreground">This is the app-wide preference, shared with the top bar and Settings.</p></div>
          <QuirkSwitch />
        </div>
      </section>

      <footer className="mt-12 border-t border-ink/15 py-6 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        Recall / visual identity / built to keep the useful bits
      </footer>
    </div>
  )
}

export default RecallStyleguide

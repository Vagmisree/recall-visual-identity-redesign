'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import {
  ArrowRight,
  Check,
  ChevronRight,
  Circle,
  GripVertical,
  Menu,
  Moon,
  Pause,
  Play,
  Search,
  BookMarked,
  Sun,
  Terminal,
  X,
} from 'lucide-react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const incidents = [
  {
    name: 'payments-api 5xx',
    alert: 'Elevated 5xx responses on payments-api',
    detail: 'Error rate crossed 8.4% in us-east-1',
    report:
      'The last occurrence was caused by a rotated Stripe secret. Roll back the secret version, then replay failed webhooks.',
    records: [
      'INC-0042 · Stripe secret rotation',
      'RUNBOOK-18 · Webhook replay',
      'POSTMORTEM-07 · Key rotation',
    ],
    color: '#F2560D',
  },
  {
    name: 'Checkout latency',
    alert: 'p95 latency elevated on checkout',
    detail: 'p95 reached 3.8s · 14 minutes ago',
    report:
      'A cache miss storm followed the deploy. Warm the product cache and hold traffic on the previous version while the queue drains.',
    records: ['INC-0038 · Cache miss storm', 'DEPLOY-119 · Checkout v2', 'QUERY-044 · Product cache'],
    color: '#D8892B',
  },
  {
    name: 'Kafka lag',
    alert: 'Consumer lag growing in orders-events',
    detail: 'orders-worker lag: 184,220 messages',
    report:
      'The consumer group was throttled by a noisy neighbor. Increase partitions by two and restore the 2025-02-14 consumer limits.',
    records: ['INC-0031 · Consumer throttling', 'CHANGE-88 · Partition plan', 'OPS-021 · Worker limits'],
    color: '#0B7A6B',
  },
]

const chartData = Array.from({ length: 20 }, (_, i) => ({
  incident: i + 1,
  minutes: Math.round(47 - i * 1.95 + (i > 8 ? (i % 3) * 1.1 : (i % 2) * 3)),
}))

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Citation({
  n,
  record,
  active,
  onHover,
}: {
  n: number
  record: string
  active: boolean
  onHover: (value: boolean) => void
}) {
  return (
    <span className="citation-wrap" onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>
      <span className="citation">[{n}]</span>
      {active && (
        <svg className="thread-line" viewBox="0 0 110 50" aria-hidden="true">
          <path d="M5 8 C30 8 26 43 55 41 S85 12 105 18" />
        </svg>
      )}
      <span className="sr-only">Source: {record}</span>
    </span>
  )
}

function Simulator() {
  const [active, setActive] = useState(0)
  const [phase, setPhase] = useState(0)
  const [hoveredCitation, setHoveredCitation] = useState<number | null>(null)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const incident = incidents[active]
  useEffect(() => {
    setPhase(0)
    timer.current = setInterval(() => setPhase((p) => (p < 3 ? p + 1 : 0)), 1800)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [active])
  return (
    <div
      className="simulator"
      onMouseEnter={() => timer.current && clearInterval(timer.current)}
      onMouseLeave={() => {
        timer.current = setInterval(() => setPhase((p) => (p < 3 ? p + 1 : 0)), 1800)
      }}
    >
      <div className="window-bar">
        <span />
        <span />
        <span />
        <b>recall / live incident simulator</b>
        <span className="live-dot" /> LIVE
      </div>
      <div className="sim-body">
        <div className="sim-chips">
          {incidents.map((item, i) => (
            <button key={item.name} className={active === i ? 'active' : ''} onClick={() => setActive(i)}>
              {item.name}
            </button>
          ))}
        </div>
        <div className="sim-grid">
          <div className="alert-panel">
            <div className="eyebrow">
              <span className="status-dot" /> ALERT / NOW
            </div>
            <h3>{phase >= 1 ? incident.alert : 'Waiting for an incident...'}</h3>
            <p>{phase >= 1 ? incident.detail : 'Choose a signal above to begin.'}</p>
            <div className="mono-small">source: pagerduty · region: us-east-1</div>
          </div>
          <div className="memory-panel">
            <div className="eyebrow memory-label">
              <Search /> MEMORY SEARCH
            </div>
            {phase === 0 && (
              <div className="search-state">
                <span>Listening for signal</span>
                <div className="loader-line" />
              </div>
            )}
            {phase === 1 && (
              <div className="search-state">
                <span>Searching memory…</span>
                <div className="loader-line running" />
              </div>
            )}
            {phase >= 2 && (
              <>
                <div className="search-state found">
                  <Check /> Searched memory · 7 records · 3 relevant
                </div>
                <p className="report">
                  {incident.report}{' '}
                  <Citation
                    n={1}
                    record={incident.records[0]}
                    active={hoveredCitation === 1}
                    onHover={(v) => setHoveredCitation(v ? 1 : null)}
                  />{' '}
                  <Citation
                    n={2}
                    record={incident.records[1]}
                    active={hoveredCitation === 2}
                    onHover={(v) => setHoveredCitation(v ? 2 : null)}
                  />{' '}
                  <Citation
                    n={3}
                    record={incident.records[2]}
                    active={hoveredCitation === 3}
                    onHover={(v) => setHoveredCitation(v ? 3 : null)}
                  />
                </p>
                <div className="record-list">
                  {incident.records.map((r, i) => (
                    <div className={hoveredCitation === i + 1 ? 'record active' : 'record'} key={r}>
                      <span className="ring" />
                      {r}
                      <span className="score">{['0.96', '0.89', '0.82'][i]}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="sim-footer">
          <span>Hindsight memory index</span>
          <span>Last indexed 4s ago</span>
          <span className="font-mono">recall.v1.7</span>
        </div>
      </div>
    </div>
  )
}

function Compare() {
  const [value, setValue] = useState(54)
  const [hovered, setHovered] = useState(false)
  return (
    <div className="compare-shell">
      <div className="compare-stage">
        <div className="compare-pane without">
          <span className="compare-label">WITHOUT MEMORY</span>
          <h3>
            We saw this last month.
            <br />
            Let me search Slack.
          </h3>
          <p>“Does anyone remember what fixed this?”</p>
          <div className="compare-code">
            grep -R "checkout 5xx" ./runbooks
            <br />
            No matches found.
          </div>
        </div>
        <div className="compare-pane with" style={{ clipPath: `inset(0 0 0 ${value}%)` }}>
          <span className="compare-label">WITH RECALL</span>
          <h3>
            We have seen this before.
            <br />
            Here&apos;s the fix.
          </h3>
          <p>Rotate the Stripe secret, then replay failed webhooks.</p>
          <div className="compare-code memory-code">
            Found 3 relevant records{' '}
            <Citation n={1} record="INC-0042" active={hovered} onHover={setHovered} />
            <br />
            Confidence: 96% · matched cause
          </div>
        </div>
        <div className="compare-divider" style={{ left: `${value}%` }}>
          <GripVertical />
          <input
            aria-label="Compare without memory and with Recall"
            type="range"
            min="8"
            max="92"
            value={value}
            onChange={(e) => setValue(+e.target.value)}
          />
        </div>
      </div>
      <div className="compare-caption">
        <span>Drag to compare</span>
        <a href="/compare">
          Try it in Compare <ArrowRight />
        </a>
      </div>
    </div>
  )
}

function ResultsChart() {
  const ref = useRef(null)
  const visible = useInView(ref, { once: true, margin: '-100px' })
  return (
    <div ref={ref} className="chart-wrap">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 20, right: 12, bottom: 8, left: -16 }}>
          <CartesianGrid stroke="#B6DCD5" vertical={false} />
          <XAxis
            dataKey="incident"
            tick={{ fill: '#39776D', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#39776D', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              border: '1px solid #B6DCD5',
              borderRadius: 8,
              fontFamily: 'JetBrains Mono',
              fontSize: 11,
            }}
            formatter={(v) => [`${v} min`, 'Resolution']}
          />
          <Line
            type="monotone"
            dataKey="minutes"
            stroke="#0B7A6B"
            strokeWidth={3}
            dot={false}
            isAnimationActive={visible}
            animationDuration={1600}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="milestones">
        <span>
          <b>1</b> no history
        </span>
        <span>
          <b>5</b> first recall
        </span>
        <span>
          <b>20</b> cause anticipated
        </span>
      </div>
    </div>
  )
}

export default function Page() {
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [menu, setMenu] = useState(false)
  const [incidentText, setIncidentText] = useState('')
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  const nav = useMemo(
    () => [
      ['Product', '#product'],
      ['How it works', '#how'],
      ['Results', '#results'],
      ['Docs', '/docs'],
    ],
    [],
  )
  return (
    <div className={theme === 'dark' ? 'site dark' : 'site'}>
      <header className={scrolled ? 'nav scrolled' : 'nav'}>
        <a className="wordmark" href="/">
          recall<span>.</span>
        </a>
        <nav>
          {nav.map(([label, href]) => (
            <a key={label} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <a className="ghost-link" href="/sign-in">
            Sign in
          </a>
          <a className="button primary small" href="/console">
            Open the console <ArrowRight />
          </a>
          <button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Toggle navigation">
            <Menu />
          </button>
        </div>
      </header>
      {menu && (
        <div className="mobile-nav">
          {nav.map(([label, href]) => (
            <a key={label} href={href}>
              {label}
              <ChevronRight />
            </a>
          ))}
        </div>
      )}
      <main>
        <section className="hero section-pad">
          <div className="hero-copy">
            <Reveal>
              <div className="badge">
                <span /> Built on Hindsight memory
              </div>
              <h1>
                Incident response that <em className="serif-italic">remembers.</em>
              </h1>
              <p className="hero-sub">
                Recall retains every outage, cause and fix, and brings them back the next time something
                breaks, so your team stops solving the same incident twice.
              </p>
              <div className="hero-actions">
                <a className="button primary" href="/console">
                  Open the console <ArrowRight />
                </a>
                <a className="button secondary" href="/threads-demo">
                  Start the guided demo <Play />
                </a>
              </div>
              <p className="proof font-mono">
                20 incidents · median resolution 47 min → 9 min · 0 repeated failed fixes after incident 12.
              </p>
            </Reveal>
          </div>
          <Reveal className="hero-visual" delay={0.12}>
            <div className="wash" />
            <div className="dot-matrix hero-dots" />
            <motion.div
              className="frame-wrap"
              style={{ y: useSpring(useMotionValue(0), { stiffness: 80, damping: 20 }) }}
            >
              <Simulator />
            </motion.div>
          </Reveal>
        </section>
        <section className="feed-band">
          <span className="feed-status">
            <span /> LIVE MEMORY FEED
          </span>
          <div className="ticker">
            <span>RETAN / INC-0042 / cause: rotated secret / confidence 0.96</span>
            <span>RECALL / checkout latency / matched 3 records / 0.89</span>
            <span>REFLECT / kafka lag / outcome recorded / 20:14 UTC</span>
          </div>
        </section>
        <section className="problem section-pad" id="product">
          <Reveal className="problem-copy">
            <div className="eyebrow">THE COST OF FORGETTING</div>
            <h2>
              The same outage, solved from <em className="serif-italic">scratch,</em> every time.
            </h2>
            <p>
              Teams do the hard work once, then lose it across Slack threads, incident docs, and
              someone&apos;s memory.
            </p>
            <p>
              Recall turns every fix into operational context your team can actually retrieve when the alert
              fires again.
            </p>
          </Reveal>
          <Reveal className="timeline" delay={0.1}>
            <div className="timeline-line" />
            <div className="timeline-row">
              <b>Day 1 · Fixed</b>
              <span>92 minutes</span>
            </div>
            <div className="timeline-row">
              <b>Day 40 · Returns</b>
              <span className="status-bad">same alert</span>
            </div>
            <div className="timeline-row">
              <b>Day 40 · Nobody remembers how</b>
              <span className="status-bad">start over</span>
            </div>
            <div className="wasted">
              <strong>1,840</strong>
              <span>wasted minutes across 20 incidents</span>
            </div>
          </Reveal>
        </section>
        <section className="compare-section section-pad">
          <Reveal>
            <div className="eyebrow">A DIFFERENT DEFAULT</div>
            <h2>
              Same incident. <em className="serif-italic">Different</em> outcome.
            </h2>
            <Compare />
          </Reveal>
        </section>
        <section className="how section-pad" id="how">
          <Reveal>
            <div className="eyebrow">HOW IT WORKS</div>
            <h2>
              Give every fix a <em className="serif-italic">memory.</em>
            </h2>
          </Reveal>
          <div className="bento">
            <Reveal className="bento-card retain">
              <div className="card-top">
                <span className="card-index">01</span>
                <h3>Retain</h3>
              </div>
              <p>Records enter the store with the cause, context, and outcome attached.</p>
              <div className="store-lines">
                <span>
                  INC-0042 <b>cause</b>
                </span>
                <span>
                  RUNBOOK-18 <b>fix</b>
                </span>
                <span>
                  POSTMORTEM-07 <b>outcome</b>
                </span>
              </div>
            </Reveal>
            <Reveal className="bento-card retrieve" delay={0.08}>
              <div className="card-top">
                <span className="card-index">02</span>
                <h3>Retrieve</h3>
              </div>
              <p>Ask naturally. Get ranked matches with the evidence behind them.</p>
              <div className="score-bars">
                <span style={{ width: '96%' }}>
                  INC-0042 <b>0.96</b>
                </span>
                <span style={{ width: '82%' }}>
                  RUNBOOK-18 <b>0.82</b>
                </span>
                <span style={{ width: '68%' }}>
                  QUERY-044 <b>0.68</b>
                </span>
              </div>
            </Reveal>
            <Reveal className="bento-card reflect" delay={0.16}>
              <div className="card-top">
                <span className="card-index">03</span>
                <h3>Reflect</h3>
              </div>
              <p>After the incident, record what actually worked.</p>
              <div className="memory-ring">
                <div>
                  <strong>84%</strong>
                  <span>outcome captured</span>
                </div>
              </div>
            </Reveal>
            <Reveal className="bento-card hindsight" delay={0.24}>
              <div className="card-top">
                <span className="card-index">04</span>
                <h3>Hindsight</h3>
              </div>
              <div className="api-snippet">
                <span>recall</span>.retain({'{'}
                <br /> incident: alert,
                <br /> outcome: fix
                <br />
                {'}'})
              </div>
              <a href="/docs">
                Read the API <ArrowRight />
              </a>
            </Reveal>
          </div>
        </section>
        <section className="results" id="results">
          <div className="results-inner section-pad">
            <Reveal className="results-copy">
              <div className="eyebrow">THE RESULT</div>
              <h2>
                The curve you want to <em className="serif-italic">see.</em>
              </h2>
              <p>
                Resolution time falls as your team accumulates context. Not more dashboards. Better recall.
              </p>
            </Reveal>
            <Reveal className="chart-panel" delay={0.1}>
              <ResultsChart />
            </Reveal>
            <div className="countups">
              <div>
                <strong>5.2×</strong>
                <span>faster resolution</span>
              </div>
              <div>
                <strong>96%</strong>
                <span>cause match confidence</span>
              </div>
              <div>
                <strong>0</strong>
                <span>repeated failed fixes</span>
              </div>
            </div>
          </div>
        </section>
        <section className="people section-pad">
          <Reveal>
            <div className="eyebrow">MADE FOR THE PEOPLE ON CALL</div>
            <h2>
              Operational memory, <em className="serif-italic">shared.</em>
            </h2>
          </Reveal>
          <div className="people-grid">
            <Reveal className="photo large">
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85"
                alt="Engineers collaborating around a laptop in a bright office"
              />
            </Reveal>
            <Reveal className="photo small" delay={0.12}>
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85"
                alt="Daylight desk with a monitor showing code"
              />
            </Reveal>
            <Reveal className="people-caption" delay={0.18}>
              <BookMarked /> Built for on-call teams. <span>So the next person has a head start.</span>
            </Reveal>
          </div>
        </section>
        <section className="closing">
          <div className="closing-inner section-pad">
            <Reveal>
              <div className="eyebrow light">MAKE THE NEXT ONE EASIER</div>
              <h2>
                See what your team already <em>knows.</em>
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  window.location.href = `/console?incident=${encodeURIComponent(incidentText)}`
                }}
              >
                <input
                  value={incidentText}
                  onChange={(e) => setIncidentText(e.target.value)}
                  placeholder="Describe an incident…"
                  aria-label="Describe an incident"
                />
                <button className="button dark-button" type="submit">
                  Open in console <ArrowRight />
                </button>
              </form>
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="footer section-pad">
        <div className="footer-brand">
          <a className="wordmark" href="/">
            recall<span>.</span>
          </a>
          <p>Built on Hindsight.</p>
          <p className="font-mono">RECALL HACKATHON / 2026</p>
        </div>
        <div className="footer-links">
          <div>
            <b>Product</b>
            <a href="#how">How it works</a>
            <a href="#results">Results</a>
            <a href="/compare">Compare</a>
          </div>
          <div>
            <b>Resources</b>
            <a href="/docs">Docs</a>
            <a href="/threads-demo">Guided demo</a>
            <a href="/console">Console</a>
          </div>
          <div>
            <b>Company</b>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy</a>
          </div>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon /> : <Sun />} {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
      </footer>
    </div>
  )
}

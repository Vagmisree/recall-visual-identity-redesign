'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { MotionConfig } from 'framer-motion'

export type QuirkLevel = 'full' | 'calm'

export type Preferences = {
  reduceMotion: boolean
  threadsOnHover: boolean
  liveFeed: boolean
  quirk: QuirkLevel
}

const STORAGE_KEY = 'recall:preferences'
const defaults: Preferences = { reduceMotion: false, threadsOnHover: true, liveFeed: true, quirk: 'full' }

type PreferencesContext = {
  prefs: Preferences
  setPref: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void
  /** True when either the OS or the in-app preference asks for reduced motion. */
  reducedMotion: boolean
  /** Full quirk level: mascot, stickers, rotation, playful copy. */
  playful: boolean
  /** Playful motion primitives (stamp, confetti, digit roll, kinetic type) may run. */
  motionOn: boolean
}

const Ctx = createContext<PreferencesContext | null>(null)

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

function useSystemReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(defaults)
  const systemReduced = useSystemReducedMotion()

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) setPrefs({ ...defaults, ...JSON.parse(stored) })
    } catch {
      // Ignore malformed or unavailable storage and keep defaults.
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('reduce-motion', prefs.reduceMotion)
    root.classList.toggle('calm', prefs.quirk === 'calm')
  }, [prefs.reduceMotion, prefs.quirk])

  const setPref = useCallback<PreferencesContext['setPref']>((key, value) => {
    setPrefs((current) => {
      const next = { ...current, [key]: value }
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const reducedMotion = prefs.reduceMotion || systemReduced
  const playful = prefs.quirk === 'full'

  const value = useMemo(
    () => ({ prefs, setPref, reducedMotion, playful, motionOn: playful && !reducedMotion }),
    [prefs, setPref, reducedMotion, playful],
  )

  return (
    <Ctx.Provider value={value}>
      <MotionConfig reducedMotion={prefs.reduceMotion ? 'always' : 'user'}>{children}</MotionConfig>
    </Ctx.Provider>
  )
}

export function usePreferences() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('usePreferences must be used inside PreferencesProvider')
  return ctx
}

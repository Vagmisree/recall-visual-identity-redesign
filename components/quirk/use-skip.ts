'use client'

import { useEffect, useState } from 'react'

/** Returns true once Escape is pressed while `active`, so a motion can jump to its end state. */
export function useEscSkip(active: boolean) {
  const [skipped, setSkipped] = useState(false)
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSkipped(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])
  return skipped
}

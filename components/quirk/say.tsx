'use client'

import { useCallback } from 'react'
import { copy, type CopyKey } from '@/lib/copy'
import { usePreferences } from '@/components/preferences'

export function useSay() {
  const { playful } = usePreferences()
  return useCallback((key: CopyKey) => (playful ? copy[key].playful : copy[key].plain), [playful])
}

export function Say({ k }: { k: CopyKey }) {
  const say = useSay()
  return <>{say(k)}</>
}

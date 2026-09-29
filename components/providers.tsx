'use client'

import { ThemeProvider } from 'next-themes'
import { PreferencesProvider } from './preferences'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <PreferencesProvider>{children}</PreferencesProvider>
    </ThemeProvider>
  )
}

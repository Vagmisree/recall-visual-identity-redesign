/**
 * Recall's voice: plain first, playful second. Every entry has a plain version used in
 * Calm mode. Playful copy is lowercase, dry and warm, with at most one slang word per
 * screen. Never use these strings in errors, incident data, logs or metrics.
 */
export type CopyEntry = { plain: string; playful: string }

export const copy = {
  emptyIncidents: { plain: 'No active incidents.', playful: 'all quiet. suspiciously chill.' },
  emptySearch: { plain: 'No memories match that search.', playful: 'nothing here. elio checked twice.' },
  savedToast: { plain: 'Saved to memory.', playful: 'saved to memory. future you says thanks.' },
  notFound: {
    plain: '404. This page does not exist.',
    playful: '404. this page was forgotten. unlike your incidents.',
  },
  notFoundBody: {
    plain: 'The link may be out of date. Head back to the console.',
    playful: 'the link is stale. the console is right where you left it.',
  },
  consoleEyebrow: { plain: 'Operations · Today', playful: 'operations · today · coffee pending' },
  recallTagline: {
    plain: 'Recall found a matching incident in memory.',
    playful: 'recall has seen this one before. receipts below.',
  },
  outcomeRetained: { plain: 'Outcome retained to memory', playful: 'noted. elio will remember this' },
  compareHint: { plain: 'Pick an incident and run both agents.', playful: 'pick an incident. let them race.' },
  runbookHint: { plain: 'Drag steps to reorder the procedure.', playful: 'steps are draggable. go on.' },
  learningHint: {
    plain: 'Resolution time keeps dropping as memory grows.',
    playful: 'the line goes down. that is the whole point.',
  },
  memoryHint: {
    plain: 'Every fix, failure and habit Recall has retained.',
    playful: 'every fix, flop and habit recall has kept.',
  },
  settingsHint: { plain: 'Tune how Recall looks and moves.', playful: 'tune the vibe. elio will cope.' },
  quirkFull: { plain: 'Full', playful: 'full' },
  quirkCalm: { plain: 'Calm', playful: 'calm' },
} satisfies Record<string, CopyEntry>

export type CopyKey = keyof typeof copy

export const loaderLines = {
  plain: ['Searching past incidents…', 'Checking memory…', 'Comparing with earlier fixes…'],
  playful: [
    'digging through the group chat of past incidents…',
    "asking the team's collective brain…",
    "checking if we've been here before…",
  ],
}

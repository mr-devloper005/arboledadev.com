import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Meridian task surfaces — all tasks share one warm cream/dark/amber palette
  and typography (Geist sans + Fraunces display). Per-task kicker/note wording
  keeps the voice specific without breaking the shared visual identity.
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const FONT_BODY = "'Geist', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
const FONT_DISPLAY = "'Fraunces', 'Times New Roman', ui-serif, Georgia, serif"

const base = {
  dark: false,
  fontDisplay: FONT_DISPLAY,
  fontBody: FONT_BODY,
  bg: '#f3ebe4',
  surface: '#ffffff',
  raised: '#e8dccb',
  text: '#181312',
  muted: '#5d534b',
  line: 'color-mix(in srgb, #181312 14%, transparent)',
  accent: '#fcaa2d',
  accentSoft: '#fdf1d8',
  onAccent: '#181312',
  glow: 'color-mix(in srgb, #fcaa2d 22%, transparent)',
  radius: '6px',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Reading room', note: 'Longer reads that reward the scroll.' },
  listing: { ...base, kicker: 'Directory', note: 'Discover, compare, connect.' },
  classified: { ...base, kicker: 'Notice board', note: 'Time-sensitive listings and offers.' },
  image: { ...base, kicker: 'Visual gallery', note: 'Image-led stories and moments.' },
  sbm: { ...base, kicker: 'The Library', note: 'Curators, collections, and the resources worth returning to.' },
  pdf: { ...base, kicker: 'Documents', note: 'Downloadable references and guides.' },
  profile: { ...base, kicker: 'Curator', note: 'The person behind the collection.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.sbm
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}

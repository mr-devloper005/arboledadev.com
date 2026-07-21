import type { CSSProperties } from 'react'

// Meridian-inspired design tokens: warm cream page, dark ink, amber brand.
// Radii sit at 6px; buttons use the same corner as cards. Sections keep
// a generous vertical rhythm matched to the reference's padding scale.
export const editableRootStyle = {
  '--slot4-page-bg': '#f3ebe4',
  '--slot4-page-text': '#181312',
  '--slot4-panel-bg': '#e8dccb',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#5d534b',
  '--slot4-soft-muted-text': '#8b7f75',
  '--slot4-accent': '#fcaa2d',
  '--slot4-accent-fill': '#fcaa2d',
  '--slot4-accent-soft': '#fdf1d8',
  '--slot4-on-accent': '#181312',
  '--slot4-dark-bg': '#181312',
  '--slot4-dark-text': '#f3ebe4',
  '--slot4-dark-secondary': '#2e2927',
  '--slot4-light-secondary': '#d8cdbc',
  '--slot4-media-bg': '#e8dccb',
  '--slot4-cream': '#f3ebe4',
  '--slot4-warm': '#ede2d3',
  '--slot4-lavender': '#f3ebe4',
  '--slot4-gray': '#e8dccb',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#f3ebe4',
  '--editable-page-text': '#181312',
  '--editable-container': '1400px',
  '--editable-border': 'color-mix(in srgb, #181312 14%, transparent)',
  '--editable-border-strong': 'color-mix(in srgb, #181312 22%, transparent)',
  '--editable-dark-border': 'color-mix(in srgb, #f3ebe4 14%, transparent)',
  '--editable-nav-bg': '#f3ebe4',
  '--editable-nav-text': '#181312',
  '--editable-nav-active': '#fcaa2d',
  '--editable-nav-active-text': '#181312',
  '--editable-cta-bg': '#fcaa2d',
  '--editable-cta-text': '#181312',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#181312',
  '--editable-footer-text': '#f3ebe4',
  // Motion token — mirrored in editable-global.css.
  '--ease-premium': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  // Section padding scale (reference).
  '--pad-small': 'clamp(1.5rem, 3vw, 3rem)',
  '--pad-main': 'clamp(2.5rem, 5vw, 5rem)',
  '--pad-large': 'clamp(4rem, 8vw, 8rem)',
  '--pad-xl': 'clamp(5rem, 10vw, 10rem)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  darkSecondaryBg: 'bg-[var(--slot4-dark-secondary)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  borderStrong: 'border-[var(--editable-border-strong)]',
  darkBorder: 'border-[var(--editable-dark-border)]',
  shadow: '',
  shadowStrong: '',
  overlay: 'bg-[linear-gradient(180deg,rgba(24,19,18,0.05),rgba(24,19,18,0.72))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-12',
    sectionY: 'py-[var(--pad-main)]',
    sectionYLarge: 'py-[var(--pad-large)]',
    sectionYXL: 'py-[var(--pad-xl)]',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    eyebrow: 'text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]',
    heroTitle: 'editable-display text-[2.5rem] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[3.5rem] lg:text-[4.5rem]',
    display: 'editable-display text-[3rem] font-medium leading-[0.98] tracking-[-0.035em] sm:text-[4.5rem] lg:text-[6rem]',
    sectionTitle: 'editable-display text-3xl font-medium leading-[1.08] tracking-[-0.02em] sm:text-4xl lg:text-[3.5rem]',
    sectionTitleSm: 'editable-display text-2xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-3xl',
    body: 'text-base leading-[1.6]',
    lead: 'text-lg leading-[1.55] sm:text-xl',
  },
  surface: {
    card: `rounded-[6px] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    soft: `rounded-[6px] border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-[6px] ${editablePalette.darkBg} ${editablePalette.darkText}`,
    darkPanel: `rounded-[6px] ${editablePalette.darkSecondaryBg} ${editablePalette.darkText}`,
  },
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 rounded-[6px] border border-[var(--slot4-accent)] bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-medium text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-[0.96] active:scale-[0.985]',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-[6px] border border-[var(--editable-border-strong)] bg-transparent px-6 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-page-text)] active:scale-[0.985]',
    ghostDark:
      'inline-flex items-center justify-center gap-2 rounded-[6px] border border-[var(--editable-dark-border)] bg-transparent px-6 py-3 text-sm font-medium text-[var(--slot4-dark-text)] transition duration-300 hover:border-[var(--slot4-dark-text)] active:scale-[0.985]',
    accent:
      'inline-flex items-center justify-center gap-2 rounded-[6px] bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-medium text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-[0.96] active:scale-[0.985]',
  },
  media: {
    frame: `relative overflow-hidden rounded-[6px] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/5]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-[3px]',
    fade: 'transition duration-300 hover:opacity-80',
    slideArrow: 'transition duration-300 group-hover:translate-x-1',
  },
} as const

export const aiLayoutRules = [
  'Edit editableRootStyle to shift the entire palette; every section reads from these tokens.',
  'Keep home section composition in src/editable/sections/HomeSections.tsx so a single file drives layout.',
  'Never hardcode reference hex values — go through the CSS variables above.',
  'Wrap major home sections in <EditableReveal index={n}> for the staggered fade-slide.',
  'Preserve all data-fetch prop names; only JSX/classNames/copy may change.',
] as const

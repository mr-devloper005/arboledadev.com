import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Reading room',
    headline: 'Long-form finds arranged for the slow read.',
    description: 'Resources that reward the scroll — essays, guides, and pieces worth returning to.',
    filterLabel: 'Filter by topic',
    secondaryNote: 'Editorial pacing, quiet metadata.',
    chips: ['Long reads', 'Guides', 'Essays'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Time-sensitive finds and offers from the community.',
    description: 'Quick-scan notices, offers, and time-boxed resources — pulled from the shelf when they expire.',
    filterLabel: 'Filter notices',
    secondaryNote: 'Fast to scan, easy to act on.',
    chips: ['Time-boxed', 'Offers', 'Notices'],
  },
  sbm: {
    eyebrow: 'The Library',
    headline: 'Collections, resources, and the finds worth returning to.',
    description:
      'Curated shelves grouped by theme. Every resource carries its curator\'s note on why it earned a permanent spot.',
    filterLabel: 'Browse a collection',
    secondaryNote: 'Grouped by taste, kept honest, always browsable.',
    chips: ['Collections', 'Curated', 'Reference-ready'],
  },
  profile: {
    eyebrow: 'Curator',
    headline: 'The person behind the shelf.',
    description: 'A closer look at a single curator — their focus, their finds, their collections.',
    filterLabel: 'Filter curators',
    secondaryNote: 'Identity, focus, and the finds they\'ve saved.',
    chips: ['Curator', 'Collections', 'Focus'],
  },
  pdf: {
    eyebrow: 'Documents',
    headline: 'PDFs, guides, and downloadable references.',
    description: 'Documents worth keeping offline — reports, playbooks, and reference material.',
    filterLabel: 'Filter by type',
    secondaryNote: 'File context, size, and quick download.',
    chips: ['Reports', 'Guides', 'Downloads'],
  },
  listing: {
    eyebrow: 'Directory',
    headline: 'Resources organized like a directory.',
    description: 'Structured entries with details, contact rails, and quick actions.',
    filterLabel: 'Filter directory',
    secondaryNote: 'Compare, browse, connect.',
    chips: ['Directory', 'Compare', 'Details'],
  },
  image: {
    eyebrow: 'Gallery',
    headline: 'Visual finds and image-led resources.',
    description: 'Image-first collections and gallery-style resources.',
    filterLabel: 'Filter visuals',
    secondaryNote: 'Let the imagery lead.',
    chips: ['Visuals', 'Galleries', 'Moodboards'],
  },
} satisfies Record<TaskKey, TaskPageVoice>

import { slot4BrandConfig } from '@/editable/theme/brand.config'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { CATEGORY_OPTIONS } from '@/lib/categories'

/**
 * Tasks that stay wired for direct-URL routing but must not appear anywhere in
 * the public UI (no nav links, no cards, no listings, no promo blocks, no
 * "view all" buttons, no filter option, no create picker option, no stats).
 */
export const uiHiddenTaskKeys = ['profile'] as const

export const isUiHiddenTask = (key: string) =>
  (uiHiddenTaskKeys as readonly string[]).includes(key)

/** UI-visible task list — the only tasks that ever render in the public shell. */
export const visibleTasks = () => SITE_CONFIG.tasks.filter((task) => task.enabled && !isUiHiddenTask(task.key))

/** User-facing rename for tasks (labels only; keys/routes untouched). */
export const taskLabelOverrides: Partial<Record<TaskKey, string>> = {
  sbm: 'The Library',
}

export const taskMemberLabelOverrides: Partial<Record<TaskKey, string>> = {
  sbm: 'Curators',
}

export const displayTaskLabel = (key: TaskKey, fallback?: string) =>
  taskLabelOverrides[key] || fallback || SITE_CONFIG.tasks.find((task) => task.key === key)?.label || key

export const displayMemberLabel = (key: TaskKey, fallback = 'Members') =>
  taskMemberLabelOverrides[key] || fallback

// Featured collections shown as chips in the footer, home marquee, and
// collections grid. Sourced from the same CATEGORY_OPTIONS the archive uses so
// every "View shelf" click lands on `/sbm?category=<slug>` with real results.
export const featuredCollections = CATEGORY_OPTIONS.slice(0, 8).map((item) => ({
  label: item.name,
  slug: item.slug,
}))

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: 'A curated library of finds worth returning to',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'A curated library',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Browse the library', href: '/sbm' },
      secondary: { label: 'Submit a find', href: '/contact' },
    },
  },
  footer: {
    tagline: 'A quiet home for collections worth coming back to.',
    description:
      'Independent curators sharing collections, resources, and the corners of the internet worth bookmarking.',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'The Library', href: '/sbm' },
          { label: 'Latest finds', href: '/sbm?sort=latest' },
          { label: 'Search', href: '/search' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Bookmarks, boards, and the odd rabbit hole. Built with care.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'Browse the library',
    explore: 'Explore collections',
    latest: 'Latest finds',
    related: 'Related resources',
    published: 'Added',
  },
} as const

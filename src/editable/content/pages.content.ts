import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'A quiet library of finds worth returning to',
      description: 'Discover curated bookmarks, collections, and resources gathered by independent curators.',
      openGraphTitle: 'The Library — bookmarks & collections worth returning to',
      openGraphDescription:
        'A calm home for discovering curated resources, collections, and the corners of the internet worth saving.',
      keywords: ['bookmarks', 'collections', 'curated resources', 'reading list', 'discovery'],
    },
    hero: {
      badge: 'The Library',
      title: ['A quieter library', 'of finds worth', 'returning to.'],
      description:
        'Curated collections, bookmarks, and resources gathered by independent curators — sorted with care so the good ones surface twice.',
      primaryCta: { label: 'Browse the library', href: '/sbm' },
      secondaryCta: { label: 'Latest finds', href: '/sbm?sort=latest' },
      searchPlaceholder: 'Search collections, curators, and finds',
      focusLabel: 'In focus',
      featureCardBadge: 'This week in the library',
      featureCardTitle: 'The finds we keep coming back to.',
      featureCardDescription:
        'A rotating shelf of the collections curators have opened most this week.',
    },
    intro: {
      badge: 'What lives here',
      title: 'Bookmarks worth returning to, gathered by people who look for a living.',
      paragraphs: [
        'Every resource here was recommended by a curator who thought it deserved a permanent shelf, not a dusty tab.',
        'Collections are grouped by taste — a curator collects what interests them, and the archive stays browsable months later.',
        'No feeds, no infinite scroll — just a shelf of collections you can leave and come back to.',
      ],
      sideBadge: 'Why the library',
      sidePoints: [
        'Bookmarks with context, not just a URL and a title.',
        'Collections grouped by theme, not by algorithm.',
        'Curators keep their shelves current — nothing rots quietly.',
        'Everything is searchable, and every find has a permanent home.',
      ],
      primaryLink: { label: 'Browse the library', href: '/sbm' },
      secondaryLink: { label: 'Explore collections', href: '/sbm' },
    },
    cta: {
      badge: 'Add to the shelf',
      title: 'Have a resource worth saving? Suggest it for the library.',
      description:
        'The best collections come from people who spend their days looking. Send us a find and we\'ll route it to the right shelf.',
      primaryCta: { label: 'Submit a find', href: '/contact' },
      secondaryCta: { label: 'Browse the library', href: '/sbm' },
    },
    taskSection: {
      heading: 'Latest in {label}',
      descriptionSuffix: 'The freshest additions to the shelf.',
    },
  },
  about: {
    badge: 'The Library',
    title: 'A quieter place for the resources worth returning to.',
    description: `${slot4BrandConfig.siteName} is a calm library of bookmarks, collections, and resources gathered by independent curators who care about the work.`,
    paragraphs: [
      'Every collection here starts with a curator who wanted a permanent shelf for the things they kept coming back to.',
      'We keep the shelves organized, the metadata honest, and the pace slow — the goal is a place you can leave and return to, not a feed that demands attention.',
      'Anyone can browse. Curators can add. And the archive stays browsable months later, without an algorithm reshuffling everything overnight.',
    ],
    values: [
      {
        title: 'Curator-led, not algorithm-led',
        description:
          'A person decides what belongs on a shelf. The library preserves that choice instead of ranking it away.',
      },
      {
        title: 'Context beats a raw link',
        description:
          'Every find carries the curator\'s note — why it made the shelf, when it was added, what it belongs next to.',
      },
      {
        title: 'A calm, browsable archive',
        description:
          'No feeds, no notifications, no infinite scroll. Just shelves that stay legible weeks later.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Have a find, a shelf, or a curator to nominate?',
    description:
      'Send us a resource, pitch a collection, or ask about becoming a curator. We read every note and route it to the right shelf.',
    formTitle: 'Send a note',
  },

  search: {
    metadata: {
      title: 'Search the library',
      description: 'Search collections, curators, and finds across the library.',
    },
    hero: {
      badge: 'Search the library',
      title: 'Find a collection, a curator, or a specific resource.',
      description:
        'Search by keyword, topic, or collection. Every find on the shelf is indexed and one query away.',
      placeholder: 'Search collections, tags, or resources',
    },
    resultsTitle: 'From the library',
  },
  create: {
    metadata: {
      title: 'Add to the library',
      description: 'Add a new find or collection to the library.',
    },
    locked: {
      badge: 'Curators only',
      title: 'Sign in to add to the library.',
      description: 'Curators sign in to save new finds, build collections, and keep their shelves current.',
    },
    hero: {
      badge: 'Add a find',
      title: 'Save something worth returning to.',
      description:
        'Give the find a home on the shelf: title, link, a short note on why it belongs, and the collection it joins.',
    },
    formTitle: 'New find',
    submitLabel: 'Add to the library',
    successTitle: 'Added to the shelf.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to the library.',
      badge: 'Curator sign-in',
      title: 'Welcome back to your shelves.',
      description: 'Sign in to keep curating, add new finds, and manage the collections on your shelf.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'We couldn\'t match those details. Create a curator account first, then sign in.',
      success: 'Signed in. Redirecting…',
      createCta: 'Become a curator',
    },
    signup: {
      metadataDescription: 'Sign up for a curator account.',
      badge: 'Become a curator',
      title: 'Start a shelf. Save the things worth returning to.',
      description: 'Curator accounts let you save finds, build collections, and keep a permanent shelf.',
      formTitle: 'New curator',
      submitLabel: 'Create curator account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Curator account created. Redirecting…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'More from the shelf',
      fallbackTitle: 'Resource details',
    },
    listing: {
      relatedTitle: 'More on this shelf',
      fallbackTitle: 'Resource details',
    },
    image: {
      relatedTitle: 'More visuals',
      fallbackTitle: 'Resource details',
    },
    profile: {
      relatedTitle: 'From this curator',
      fallbackDescription: 'Curator details will appear here once available.',
      visitButton: 'Visit resource',
    },
  },
} as const

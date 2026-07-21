import Link from 'next/link'
import { ArrowUpRight, Bookmark, Check, Compass, FolderOpen, Globe, LibraryBig, Minus, Plus, Sparkles, Star } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { displayTaskLabel, featuredCollections, isUiHiddenTask } from '@/editable/content/global.content'
import {
  getEditableCategory,
  getEditableDomain,
  getEditableExcerpt,
  getEditablePostImage,
  postHref,
} from '@/editable/cards/PostCards'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-12'

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* ---------------------------------------------------------------- HERO --- */

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const featured = pool.slice(0, 4)
  const hero = pagesContent.home.hero
  const titleLines = hero.title || ['A quieter library', 'of finds worth returning to.']

  return (
    <section className="relative overflow-hidden bg-[var(--slot4-page-bg)]">
      <div className={`relative ${container} pt-16 pb-[var(--pad-large)] sm:pt-24`}>
        <EditableReveal>
          <span className={`${dc.type.eyebrow} inline-flex items-center gap-2`}>
            <Sparkles className="h-3.5 w-3.5" /> {hero.badge}
          </span>
        </EditableReveal>

        <div className="mt-8 grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <EditableReveal index={1}>
              <h1 className={dc.type.display}>
                {titleLines.map((line, i) => (
                  <span key={i} className="block text-balance">
                    {i === titleLines.length - 1 ? (
                      <>
                        {line.replace(/[.\s]+$/, '')}
                        <span className="text-[var(--slot4-accent)]">.</span>
                      </>
                    ) : (
                      line
                    )}
                  </span>
                ))}
              </h1>
            </EditableReveal>

            <EditableReveal index={2}>
              <p className={`mt-8 max-w-xl ${dc.type.lead} text-[var(--slot4-muted-text)]`}>{hero.description}</p>
            </EditableReveal>

            <EditableReveal index={3}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link href={hero.primaryCta.href} className={dc.button.primary}>
                  {hero.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href={hero.secondaryCta.href} className={dc.button.secondary}>
                  {hero.secondaryCta.label}
                </Link>
              </div>
            </EditableReveal>

            <EditableReveal index={4}>
              <form action="/search" className="mt-10 flex w-full max-w-lg overflow-hidden rounded-[6px] border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)]">
                <div className="flex flex-1 items-center gap-2 px-4">
                  <Compass className="h-4 w-4 shrink-0 text-[var(--slot4-muted-text)]" />
                  <input
                    name="q"
                    placeholder={hero.searchPlaceholder}
                    className="w-full bg-transparent py-3.5 text-sm text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                  />
                </div>
                <button className="shrink-0 bg-[var(--slot4-page-text)] px-6 text-xs font-medium uppercase tracking-[0.14em] text-[var(--slot4-page-bg)] transition duration-300 hover:brightness-110" type="submit">
                  Search
                </button>
              </form>
            </EditableReveal>
          </div>

          <EditableReveal index={2}>
            <HeroVisual posts={featured} primaryRoute={primaryRoute} primaryTask={primaryTask} />
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}

function HeroVisual({ posts, primaryRoute, primaryTask }: { posts: SitePost[]; primaryRoute: string; primaryTask: TaskKey }) {
  const primary = posts[0]
  const stack = posts.slice(1, 3)
  if (!primary) {
    return (
      <div className="relative rounded-[6px] border border-[var(--editable-border-strong)] bg-[var(--slot4-panel-bg)] p-10 text-center">
        <LibraryBig className="mx-auto h-10 w-10 text-[var(--slot4-muted-text)]" />
        <p className="mt-6 text-sm font-medium text-[var(--slot4-muted-text)]">
          The shelf is being set. New finds arrive shortly.
        </p>
      </div>
    )
  }
  return (
    <div className="relative">
      <Link href={postHref(primaryTask, primary, primaryRoute)} className={`group block overflow-hidden ${dc.surface.dark}`}>
        <div className="relative aspect-[4/5] w-full">
          <img src={getEditablePostImage(primary)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,19,18,0.05),rgba(24,19,18,0.72))]" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <span className="inline-flex items-center gap-1.5 rounded-[6px] bg-[var(--slot4-accent-fill)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-on-accent)]">
              {pagesContent.home.hero.featureCardBadge}
            </span>
            <h3 className="mt-4 line-clamp-3 editable-display text-2xl font-medium leading-tight tracking-[-0.02em] text-[var(--slot4-dark-text)] sm:text-3xl">
              {primary.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-[color:color-mix(in_srgb,var(--slot4-dark-text)_78%,transparent)]">
              {getEditableExcerpt(primary, 140)}
            </p>
          </div>
        </div>
      </Link>

      {stack.length ? (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {stack.map((post, i) => (
            <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className={`group block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
              <div className="relative aspect-[4/3] w-full">
                <img src={getEditablePostImage(post)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
              </div>
              <div className="p-4">
                <p className={`${dc.type.eyebrow}`}>{i === 0 ? 'Recent' : 'Editor pick'}</p>
                <h4 className="mt-2 line-clamp-2 editable-display text-base font-medium leading-snug tracking-[-0.01em] text-[var(--slot4-page-text)]">
                  {post.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}

/* ---------------------------------------------------- COLLECTIONS MARQUEE */

export function EditableStoryRail() {
  const chips = [...featuredCollections, ...featuredCollections]
  return (
    <section className="overflow-hidden border-y border-[var(--editable-border)] bg-[var(--slot4-warm)] py-6">
      <EditableReveal>
        <div className="flex items-center gap-8 overflow-hidden">
          <div className="editable-marquee-track flex shrink-0 items-center gap-3 whitespace-nowrap pr-3">
            {chips.map((collection, i) => (
              <Link
                key={`${collection.slug}-${i}`}
                href={`/sbm?category=${collection.slug}`}
                className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] px-4 py-2 text-sm font-medium text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-page-text)]"
              >
                <FolderOpen className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {collection.label}
              </Link>
            ))}
          </div>
        </div>
      </EditableReveal>
    </section>
  )
}

/* ----------------------------------------------- ALTERNATING CHECK FEATURES */

const homeFeatures: Array<{ eyebrow: string; title: string; body: string; points: string[]; icon: typeof LibraryBig }> = [
  {
    eyebrow: 'Curator-led',
    title: 'Finds a person thought worth returning to.',
    body: 'The library is built by curators who spend their days looking. Every resource on the shelf carries a note on why it belongs — and stays browsable months later.',
    points: [
      'Human-picked, human-noted, human-organized.',
      'Every find keeps its curator\'s context.',
      'Shelves stay current without an algorithm.',
    ],
    icon: LibraryBig,
  },
  {
    eyebrow: 'Grouped by taste',
    title: 'Collections that read like a good bookshelf.',
    body: 'We group resources by theme, not by algorithm. Whether you\'re chasing design systems or startup playbooks, the shelf is browsable end-to-end.',
    points: [
      'Themed collections you can walk through.',
      'Related finds surface without infinite scroll.',
      'Search is a query away, never a fight.',
    ],
    icon: FolderOpen,
  },
]

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const activity = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const spotlight = activity.slice(0, 2)

  return (
    <section className={`${container} py-[var(--pad-large)]`}>
      <EditableReveal>
        <div className="max-w-3xl">
          <p className={dc.type.eyebrow}>What lives here</p>
          <h2 className={`mt-4 ${dc.type.sectionTitle}`}>{pagesContent.home.intro.title}</h2>
        </div>
      </EditableReveal>

      <div className="mt-16 grid gap-16 lg:gap-24">
        {homeFeatures.map((feature, index) => {
          const Icon = feature.icon
          const post = spotlight[index] || activity[index]
          const flip = index % 2 === 1
          return (
            <EditableReveal key={feature.title} index={index}>
              <div className={`grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center ${flip ? 'lg:[&>:first-child]:order-2' : ''}`}>
                <div>
                  <span className={dc.type.eyebrow}>{feature.eyebrow}</span>
                  <h3 className={`mt-4 ${dc.type.sectionTitleSm}`}>{feature.title}</h3>
                  <p className={`mt-5 max-w-lg text-[15px] leading-[1.7] ${pal.mutedText}`}>{feature.body}</p>
                  <ul className="mt-7 space-y-3">
                    {feature.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-[15px] leading-[1.55] text-[var(--slot4-page-text)]">
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-fill)] text-[var(--slot4-on-accent)]">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`relative overflow-hidden ${dc.surface.soft}`}>
                  <div className="flex items-center gap-3 border-b border-[var(--editable-border)] px-6 py-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className={dc.type.eyebrow}>{feature.eyebrow}</span>
                  </div>
                  {post ? (
                    <Link href={postHref(primaryTask, post, primaryRoute)} className="group block">
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--slot4-media-bg)]">
                        <img src={getEditablePostImage(post)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                      </div>
                      <div className="p-6">
                        <p className={`${dc.type.eyebrow}`}>{getEditableCategory(post)}</p>
                        <h4 className="mt-3 editable-display text-xl font-medium leading-snug tracking-[-0.02em] text-[var(--slot4-page-text)]">
                          {post.title}
                        </h4>
                        <p className={`mt-3 line-clamp-2 text-sm leading-6 ${pal.mutedText}`}>{getEditableExcerpt(post, 130)}</p>
                        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-page-text)]">
                          Open find <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className="p-10 text-center">
                      <Bookmark className="mx-auto h-8 w-8 text-[var(--slot4-muted-text)]" />
                      <p className={`mt-4 text-sm ${pal.mutedText}`}>Shelf loading. Check back shortly.</p>
                    </div>
                  )}
                </div>
              </div>
            </EditableReveal>
          )
        })}
      </div>
    </section>
  )
}

/* ---------------------------------------------------- COLLECTIONS GRID --- */

export function EditableCollectionsGrid() {
  return (
    <section className="border-y border-[var(--editable-border)] bg-[var(--slot4-warm)]">
      <div className={`${container} py-[var(--pad-large)]`}>
        <EditableReveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className={dc.type.eyebrow}>Featured collections</p>
              <h2 className={`mt-3 ${dc.type.sectionTitle}`}>Shelves worth walking through.</h2>
            </div>
            <Link href="/sbm" className={dc.button.secondary}>
              Browse the library <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </EditableReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCollections.map((collection, i) => (
            <EditableReveal key={collection.slug} index={i} step={70}>
              <Link
                href={`/sbm?category=${collection.slug}`}
                className={`group flex h-full flex-col justify-between overflow-hidden ${dc.surface.card} p-6 transition duration-500 hover:-translate-y-[3px] hover:border-[var(--slot4-page-text)]`}
              >
                <div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                    <FolderOpen className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 editable-display text-xl font-medium tracking-[-0.02em] text-[var(--slot4-page-text)]">
                    {collection.label}
                  </h3>
                </div>
                <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-page-text)]">
                  View shelf <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------- FEATURED + STATS (real data) */

function statsFromPosts(posts: SitePost[]) {
  const categories = new Set<string>()
  const curators = new Set<string>()
  for (const post of posts) {
    const cat = getEditableCategory(post)
    if (cat) categories.add(cat)
    const author = (post as unknown as { author?: string }).author
    if (typeof author === 'string' && author) curators.add(author)
  }
  return {
    finds: posts.length,
    collections: Math.max(categories.size, 4),
    curators: Math.max(curators.size, 12),
  }
}

export function EditableFeaturedAndStats({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const featured = pool[0]
  const stats = statsFromPosts(pool)
  if (!featured) return null

  return (
    <section className={`${container} py-[var(--pad-large)]`}>
      <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-stretch">
        <EditableReveal>
          <Link
            href={postHref(primaryTask, featured, primaryRoute)}
            className={`group relative flex h-full flex-col justify-end overflow-hidden ${dc.surface.dark} p-8 sm:p-12`}
          >
            <img
              src={getEditablePostImage(featured)}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,19,18,0.1),rgba(24,19,18,0.85))]" />
            <div className="relative min-h-[380px] sm:min-h-[440px]">
              <span className="inline-flex items-center gap-1.5 rounded-[6px] bg-[var(--slot4-accent-fill)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-on-accent)]">
                <Star className="h-3 w-3" /> Editor's shelf
              </span>
              <h3 className="mt-6 max-w-2xl editable-display text-3xl font-medium leading-[1.05] tracking-[-0.02em] text-[var(--slot4-dark-text)] sm:text-4xl lg:text-[3rem]">
                {featured.title}
              </h3>
              <p className="mt-4 max-w-xl text-base leading-[1.65] text-[color:color-mix(in_srgb,var(--slot4-dark-text)_78%,transparent)]">
                {getEditableExcerpt(featured, 180)}
              </p>
              <span className="mt-8 inline-flex items-center gap-2 rounded-[6px] bg-[var(--slot4-accent-fill)] px-4 py-2.5 text-sm font-medium text-[var(--slot4-on-accent)]">
                Open find <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </EditableReveal>

        <EditableReveal index={1}>
          <div className="flex h-full flex-col gap-6">
            <div className={`${dc.surface.soft} p-8`}>
              <p className={dc.type.eyebrow}>The library, by the numbers</p>
              <div className="mt-6 grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
                <StatItem number={stats.finds} label="Finds on the shelf" />
                <StatItem number={stats.collections} label="Active collections" />
                <StatItem number={stats.curators} label="Independent curators" />
              </div>
            </div>
            <div className={`${dc.surface.card} p-8`}>
              <p className={dc.type.eyebrow}>Why curators use it</p>
              <p className="mt-4 editable-display text-xl font-medium leading-[1.25] tracking-[-0.02em] text-[var(--slot4-page-text)]">
                "A permanent home for the things I kept saving to a tab I never opened."
              </p>
              <p className={`mt-4 text-sm ${pal.mutedText}`}>— A curator</p>
            </div>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

function StatItem({ number, label }: { number: number; label: string }) {
  return (
    <div>
      <p className="editable-display text-4xl font-medium leading-none tracking-[-0.03em] text-[var(--slot4-page-text)] sm:text-5xl">
        {number.toLocaleString()}
      </p>
      <p className={`mt-3 text-sm ${pal.mutedText}`}>{label}</p>
    </div>
  )
}

/* ---------------------------------------- DYNAMIC BOOKMARK GRIDS (real) */

const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: 'Fresh on the shelf', title: 'Added this week' },
  browse: { eyebrow: 'Warming up', title: 'Popular this month' },
  index: { eyebrow: 'Evergreen', title: 'From the deeper stacks' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, index) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More on the shelf' }
        const alt = index % 2 === 1
        return (
          <section key={section.key} className={alt ? 'bg-[var(--slot4-warm)]' : ''}>
            <div className={`${container} py-[var(--pad-large)]`}>
              <EditableReveal>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div className="max-w-2xl">
                    <p className={dc.type.eyebrow}>{copy.eyebrow}</p>
                    <h2 className={`mt-3 ${dc.type.sectionTitle}`}>{copy.title}</h2>
                  </div>
                  <Link href={section.href || primaryRoute} className={dc.button.secondary}>
                    View shelf <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </EditableReveal>

              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post, i) => (
                  <EditableReveal key={post.id || post.slug} index={i} step={60}>
                    <BookmarkCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  </EditableReveal>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

function BookmarkCard({ post, href }: { post: SitePost; href: string }) {
  const image = getEditablePostImage(post)
  const category = getEditableCategory(post)
  const domain = getEditableDomain(post)
  return (
    <Link href={href} className={`group flex h-full flex-col overflow-hidden ${dc.surface.card} transition duration-500 hover:-translate-y-[3px] hover:border-[var(--editable-border-strong)]`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" loading="lazy" />
        {domain ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-[6px] bg-[var(--slot4-page-bg)]/95 px-2.5 py-1 text-[11px] font-medium text-[var(--slot4-page-text)] backdrop-blur">
            <Globe className="h-3 w-3" /> {domain}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {category ? <p className={dc.type.eyebrow}>{category}</p> : null}
        <h3 className="mt-2 line-clamp-2 editable-display text-lg font-medium leading-snug tracking-[-0.02em] text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
        <p className={`mt-3 line-clamp-2 flex-1 text-sm leading-[1.55] ${pal.mutedText}`}>{getEditableExcerpt(post, 120)}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-page-text)]">
          Open find <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

/* --------------------------------------------------- SOCIAL PROOF BAND --- */

const socialProof = [
  { name: 'Independent designers', quote: '"The shelf I forward every time someone asks for a starting point."' },
  { name: 'Startup operators', quote: '"Fewer feeds, more of the resources I actually reopen a month later."' },
  { name: 'Independent researchers', quote: '"A cited, browsable archive — with a note on why each thing belongs."' },
]

export function EditableSocialProof() {
  return (
    <section className={`${dc.surface.dark} border-y border-[var(--editable-dark-border)]`}>
      <div className={`${container} py-[var(--pad-large)]`}>
        <EditableReveal>
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Loved by</p>
            <h2 className="mt-4 editable-display text-3xl font-medium leading-[1.05] tracking-[-0.02em] text-[var(--slot4-dark-text)] sm:text-4xl">
              Curators, designers, and independent researchers.
            </h2>
          </div>
        </EditableReveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {socialProof.map((quote, i) => (
            <EditableReveal key={quote.name} index={i}>
              <blockquote className="rounded-[6px] border border-[var(--editable-dark-border)] bg-[var(--slot4-dark-secondary)] p-8">
                <p className="editable-display text-xl font-medium leading-[1.35] tracking-[-0.01em] text-[var(--slot4-dark-text)]">
                  {quote.quote}
                </p>
                <footer className="mt-6 text-sm text-[color:color-mix(in_srgb,var(--slot4-dark-text)_60%,transparent)]">
                  — {quote.name}
                </footer>
              </blockquote>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------- FAQ ACCORDION --- */

const faqs = [
  {
    q: 'What kind of finds live in the library?',
    a: 'Bookmarks, resources, tools, articles, references — anything a curator thought worth returning to. Every entry has a note on why it belongs.',
  },
  {
    q: 'How are collections chosen?',
    a: 'A curator groups related finds into a themed collection. The archive stays browsable end-to-end — no algorithm reshuffles overnight.',
  },
  {
    q: 'Can I suggest a resource?',
    a: 'Yes. Use the contact page to send a resource, or become a curator to save finds directly to a shelf.',
  },
  {
    q: 'How often does the library update?',
    a: 'Curators add finds when they come across them. New shelves and additions appear across the home surface as soon as they land.',
  },
]

export function EditableFaqSection() {
  return (
    <section className={`${container} py-[var(--pad-large)]`}>
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <EditableReveal>
          <div>
            <p className={dc.type.eyebrow}>Questions</p>
            <h2 className={`mt-4 ${dc.type.sectionTitle}`}>Anything worth asking about the shelf.</h2>
            <p className={`mt-6 max-w-md text-[15px] leading-[1.65] ${pal.mutedText}`}>
              A quick rundown for people wondering what the library is for and how it stays honest.
            </p>
          </div>
        </EditableReveal>

        <EditableReveal index={1}>
          <div className="divide-y divide-[var(--editable-border)] border-y border-[var(--editable-border)]">
            {faqs.map((faq, i) => (
              <details key={faq.q} className="group py-5" open={i === 0}>
                <summary className="flex cursor-pointer items-center justify-between gap-6 list-none">
                  <span className="editable-display text-lg font-medium leading-snug tracking-[-0.01em] text-[var(--slot4-page-text)] sm:text-xl">
                    {faq.q}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border-strong)] text-[var(--slot4-page-text)] transition duration-300 group-open:bg-[var(--slot4-page-text)] group-open:text-[var(--slot4-page-bg)]">
                    <Plus className="h-4 w-4 group-open:hidden" />
                    <Minus className="hidden h-4 w-4 group-open:block" />
                  </span>
                </summary>
                <p className={`mt-4 max-w-2xl text-[15px] leading-[1.7] ${pal.mutedText}`}>{faq.a}</p>
              </details>
            ))}
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------- HOME CTA BAND --- */

export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section className={`${dc.surface.dark} border-t border-[var(--editable-dark-border)]`}>
      <div className={`${container} py-[var(--pad-xl)] text-center`}>
        <EditableReveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
            {cta.badge}
          </p>
          <h2 className="mx-auto mt-6 max-w-4xl editable-display text-[2.5rem] font-medium leading-[1.02] tracking-[-0.03em] text-[var(--slot4-dark-text)] sm:text-6xl lg:text-[5rem]">
            {cta.title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-[1.65] text-[color:color-mix(in_srgb,var(--slot4-dark-text)_72%,transparent)] sm:text-lg">
            {cta.description}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href={cta.primaryCta.href} className={dc.button.primary}>
              {cta.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href={cta.secondaryCta.href} className={dc.button.ghostDark}>
              {cta.secondaryCta.label}
            </Link>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

/* --------------- Re-exports kept for HomePage/other callers back-compat -- */
export { isUiHiddenTask, displayTaskLabel }

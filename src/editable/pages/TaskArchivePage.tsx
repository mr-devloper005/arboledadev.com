import Link from 'next/link'
import { ArrowUpRight, Bookmark, ChevronDown, FolderOpen, Globe, LibraryBig, Search } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { displayTaskLabel, isUiHiddenTask } from '@/editable/content/global.content'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo) || asText(content.avatar)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback

const stripHtml = (value: string) => value
  .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&quot;/gi, '"')
  .replace(/&#0?39;|&apos;/gi, "'")
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

// The Library shelf: three-column grid on desktop, with the first hero card
// stretching across two rows. Every other task inherits the same layout but
// keeps its own kicker/note for context.
const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-6 md:grid-cols-2',
  classified: 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-6 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

const cardBase = 'group block rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-[3px] hover:border-[color:color-mix(in_srgb,var(--tk-text)_28%,transparent)]'

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const label = displayTaskLabel(task, taskConfig?.label)
  const categoryLabel = category === 'all' ? 'All shelves' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const showFeedAd = task === 'sbm'

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {/* Premium hero band */}
        <header className="relative overflow-hidden">
          <div className={`relative mx-auto max-w-[var(--editable-container)] px-5 pt-16 pb-[var(--pad-large)] sm:px-8 sm:pt-24 lg:px-12`}>
            <EditableReveal>
              <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">
                <span>{theme.kicker}</span>
                <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)] opacity-60" />
                <span className="text-[var(--tk-muted)]">{label}</span>
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <h1 className="editable-display mt-8 max-w-4xl text-balance text-[2.5rem] font-medium leading-[1.02] tracking-[-0.03em] sm:text-[3.5rem] lg:text-[4.5rem]">
                {voice?.headline || `Browse ${label}`}
                <span className="text-[var(--tk-accent)]">.</span>
              </h1>
            </EditableReveal>

            <EditableReveal index={2}>
              <p className="mt-6 max-w-2xl text-lg leading-[1.6] text-[var(--tk-muted)]">
                {voice?.description || theme.note}
              </p>
            </EditableReveal>

            {voice?.chips?.length ? (
              <EditableReveal index={3}>
                <div className="mt-8 flex flex-wrap gap-2">
                  {voice.chips.map((chip) => (
                    <span key={chip} className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3 py-1.5 text-xs font-medium text-[var(--tk-muted)]">
                      <Bookmark className="h-3 w-3 text-[var(--tk-accent)]" /> {chip}
                    </span>
                  ))}
                </div>
              </EditableReveal>
            ) : null}

            <EditableReveal index={4}>
              <div className="mt-12 flex flex-col gap-4 border-t border-[var(--tk-line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[var(--tk-muted)]">
                  <span className="font-medium text-[var(--tk-text)]">{posts.length}</span> {posts.length === 1 ? 'find' : 'finds'} · {categoryLabel}
                </p>
                <form action={basePath} className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      name="category"
                      defaultValue={category}
                      className="h-11 appearance-none rounded-[6px] border border-[var(--tk-line)] bg-[var(--tk-surface)] pl-4 pr-10 text-sm font-medium text-[var(--tk-text)] outline-none transition duration-300 focus:border-[var(--tk-accent)]"
                      aria-label={voice?.filterLabel || 'Filter shelf'}
                    >
                      <option value="all">All shelves</option>
                      {CATEGORY_OPTIONS.map((item) => (
                        <option key={item.slug} value={item.slug}>{item.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                  </div>
                  <button className="inline-flex h-11 items-center rounded-[6px] bg-[var(--tk-accent)] px-5 text-sm font-medium text-[var(--tk-on-accent)] transition duration-300 hover:brightness-[0.96]">
                    Apply
                  </button>
                </form>
              </div>
            </EditableReveal>
          </div>
        </header>

        <section className="mx-auto max-w-[var(--editable-container)] px-5 pb-[var(--pad-large)] sm:px-8 lg:px-12">
          {posts.length ? (
            <>
              <div className={taskGrid[task]}>
                {posts.map((post, index) => (
                  <EditableReveal key={post.id || post.slug} index={index % 6} step={60}>
                    <ArchivePostCard post={post} task={task} basePath={basePath} index={index} />
                  </EditableReveal>
                ))}
              </div>

              {showFeedAd ? (
                <div className="mt-16 flex justify-center">
                  <Ads slot="feed" size={pickRandom(getSlotSizes('feed'))} showLabel className="mx-auto w-full max-w-3xl" />
                </div>
              ) : null}
            </>
          ) : (
            <div className="mx-auto max-w-xl rounded-[var(--tk-radius)] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] px-8 py-20 text-center">
              <LibraryBig className="mx-auto h-8 w-8 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-6 text-2xl font-medium tracking-[-0.02em]">This shelf is empty for now.</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--tk-muted)]">Pick another shelf, or check back after new finds are added.</p>
              <Link href={basePath} className="mt-6 inline-flex items-center gap-2 rounded-[6px] border border-[var(--tk-line)] px-4 py-2.5 text-sm font-medium transition duration-300 hover:border-[var(--tk-accent)]">
                <Search className="h-4 w-4" /> View all shelves
              </Link>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-16 flex items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? (
                <Link href={pageHref(basePath, category, page - 1)} className="rounded-[6px] border border-[var(--tk-line)] px-5 py-2.5 font-medium transition duration-300 hover:border-[var(--tk-accent)]">
                  Previous
                </Link>
              ) : null}
              <span className="rounded-[6px] border border-[var(--tk-line)] bg-[var(--tk-surface)] px-5 py-2.5 font-medium text-[var(--tk-muted)]">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link href={pageHref(basePath, category, page + 1)} className="rounded-[6px] border border-[var(--tk-line)] px-5 py-2.5 font-medium transition duration-300 hover:border-[var(--tk-accent)]">
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-text)]">
      {label}
      <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
  )
}

/* -------- Bookmark card — the flagship shelf item for The Library ------- */
function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImages(post)[0]
  const category = getCategory(post, 'Collection')
  const website = getField(post, ['website', 'url', 'link'])
  const domain = website ? cleanDomain(website) : ''
  const showImage = Boolean(image) && index % 4 !== 3

  return (
    <Link href={href} className={`${cardBase} flex flex-col overflow-hidden`}>
      {showImage ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--tk-raised)]">
          <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
          {domain ? (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-[6px] bg-[var(--tk-bg)]/95 px-2.5 py-1 text-[11px] font-medium text-[var(--tk-text)] backdrop-blur">
              <Globe className="h-3 w-3" /> {domain}
            </span>
          ) : null}
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-[var(--tk-line)] p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
            <FolderOpen className="h-5 w-5" />
          </span>
          {domain ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--tk-muted)]">
              <Globe className="h-3 w-3" /> {domain}
            </span>
          ) : null}
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--tk-accent)]">
          <Bookmark className="h-3 w-3" /> {category}
        </div>
        <h2 className="editable-display mt-3 text-xl font-medium leading-snug tracking-[-0.02em]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-[1.6] text-[var(--tk-muted)]">{getSummary(post)}</p>
        <CardArrow label="Open find" />
      </div>
    </Link>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Resource')
  return (
    <Link href={href} className={`${cardBase} overflow-hidden`}>
      <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
      </div>
      <div className="p-6 sm:p-7">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-accent)]">
          <span>{category}</span>
          <span className="text-[var(--tk-muted)]">· No. {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h2 className="editable-display mt-3 text-2xl font-medium leading-snug tracking-[-0.02em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-[15px] leading-[1.65] text-[var(--tk-muted)]">{getSummary(post)}</p>
        <CardArrow label="Open resource" />
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className={`${cardBase} flex gap-5 p-6`}>
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[6px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <FolderOpen className="h-8 w-8 text-[var(--tk-muted)]" />}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="editable-display text-xl font-medium leading-snug tracking-[-0.02em]">{post.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-[var(--tk-muted)]">
          {location ? <span>{location}</span> : null}
          {website ? <span>{cleanDomain(website)}</span> : null}
        </div>
      </div>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--tk-muted)] transition duration-300 group-hover:text-[var(--tk-accent)]" />
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6 sm:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-2xl font-medium tracking-[-0.02em] text-[var(--tk-accent)]">{price || 'Open offer'}</span>
      </div>
      <h2 className="editable-display mt-5 text-xl font-medium leading-snug tracking-[-0.02em]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
      <CardArrow label="Open notice" />
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-6 block break-inside-avoid overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-[3px]">
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(24,19,18,0.75))]" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h2 className="editable-display line-clamp-2 text-lg font-medium leading-snug tracking-[-0.02em] text-white">{post.title}</h2>
        </div>
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'Document')
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6 sm:p-7`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
          <FolderOpen className="h-5 w-5" />
        </div>
        <span className="rounded-[6px] border border-[var(--tk-line)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--tk-muted)]">{category}</span>
      </div>
      <h2 className="editable-display mt-6 text-xl font-medium leading-snug tracking-[-0.02em]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
      <CardArrow label="Open document" />
    </Link>
  )
}

// Profile task is UI-hidden — this card is only ever reached from direct URLs
// via legacy fallbacks. It stays intentionally quiet.
function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  if (isUiHiddenTask('profile')) {
    // Still render for direct nav integrity, but never advertise it publicly.
    // (Discovery filters remove profile from the visible feed elsewhere.)
  }
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col items-center p-7 text-center`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <span className="editable-display text-2xl">{(post.title || '?').charAt(0)}</span>}
      </div>
      <h2 className="editable-display mt-5 text-lg font-medium tracking-[-0.02em]">{post.title}</h2>
      {role ? <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--tk-accent)]">{role}</p> : null}
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}

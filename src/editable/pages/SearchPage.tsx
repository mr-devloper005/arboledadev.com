import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Bookmark, Filter, FolderOpen, Search as SearchIcon } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { toPlainText, getEditableDomain, getEditablePostImage } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'
import { displayTaskLabel, isUiHiddenTask, featuredCollections } from '@/editable/content/global.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const compactText = (value: unknown) =>
  typeof value === 'string' ? value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase() : ''

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}

const summaryOf = (post: SitePost) => {
  const content = getContent(post)
  return toPlainText(
    (typeof post.summary === 'string' && post.summary) ||
    (typeof content.description === 'string' && content.description) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    (typeof content.body === 'string' && content.body) ||
    '',
  )
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  // Hidden tasks stay out of the visible feed entirely.
  if (derivedTask && isUiHiddenTask(derivedTask)) return false
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post }: { post: SitePost }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = task ? SITE_CONFIG.tasks.find((item) => item.key === task)?.route : undefined
  const href = `${taskRoute || `/${task || 'sbm'}`}/${post.slug}`
  const image = getEditablePostImage(post)
  const summary = summaryOf(post)
  const label = task ? displayTaskLabel(task) : 'Find'
  const domain = getEditableDomain(post)

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-[3px] hover:border-[var(--editable-border-strong)]"
    >
      {image && !image.includes('placeholder') ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-[6px] bg-[var(--slot4-page-bg)]/95 px-2.5 py-1 text-[11px] font-medium text-[var(--slot4-page-text)] backdrop-blur">
            <Bookmark className="h-3 w-3 text-[var(--slot4-accent)]" /> {label}
          </span>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        {!(image && !image.includes('placeholder')) ? (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm)] px-2.5 py-1 text-[11px] font-medium text-[var(--slot4-page-text)]">
            <Bookmark className="h-3 w-3 text-[var(--slot4-accent)]" /> {label}
          </span>
        ) : null}
        <h2 className="mt-4 line-clamp-3 editable-display text-xl font-medium leading-snug tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-2xl">
          {post.title}
        </h2>
        {summary ? (
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-[1.6] text-[var(--slot4-muted-text)]">{summary}</p>
        ) : null}
        <div className="mt-6 flex items-center justify-between gap-3">
          {domain ? <span className="text-xs font-medium text-[var(--slot4-soft-muted-text)]">{domain}</span> : <span />}
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-page-text)]">
            Open find <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
      ? []
      : SITE_CONFIG.tasks
          .filter((item) => item.enabled && !isUiHiddenTask(item.key))
          .flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  // Filter picker never lists hidden tasks.
  const filterableTasks = SITE_CONFIG.tasks.filter((item) => item.enabled && !isUiHiddenTask(item.key))

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-5 pt-14 pb-10 sm:px-8 sm:pt-24 lg:px-12">
          <EditableReveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
              {pagesContent.search.hero.badge}
            </p>
          </EditableReveal>

          <EditableReveal index={1}>
            <h1 className="editable-display mt-6 max-w-3xl text-balance text-[2.5rem] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[3.5rem] lg:text-[4rem]">
              {pagesContent.search.hero.title}<span className="text-[var(--slot4-accent)]">.</span>
            </h1>
          </EditableReveal>

          <EditableReveal index={2}>
            <p className="mt-6 max-w-2xl text-lg leading-[1.6] text-[var(--slot4-muted-text)]">
              {pagesContent.search.hero.description}
            </p>
          </EditableReveal>

          <EditableReveal index={3}>
            <form action="/search" className="mt-10 grid gap-3 rounded-[6px] border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] p-4 sm:p-5">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-3">
                <SearchIcon className="h-5 w-5 text-[var(--slot4-muted-text)]" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder={pagesContent.search.hero.placeholder}
                  className="min-w-0 flex-1 bg-transparent text-base font-medium text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <label className="flex items-center gap-2 rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-3">
                  <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                  <input
                    name="category"
                    defaultValue={category}
                    placeholder="Collection or tag"
                    className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                  />
                </label>
                <select
                  name="task"
                  defaultValue={task}
                  className="rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-3 text-sm font-medium outline-none"
                >
                  <option value="">All resource types</option>
                  {filterableTasks.map((item) => (
                    <option key={item.key} value={item.key}>{displayTaskLabel(item.key, item.label)}</option>
                  ))}
                </select>
                <button
                  className="inline-flex h-full min-h-[46px] items-center justify-center rounded-[6px] border border-[var(--slot4-accent)] bg-[var(--slot4-accent-fill)] px-6 text-sm font-medium text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-[0.96]"
                  type="submit"
                >
                  Search
                </button>
              </div>
            </form>
          </EditableReveal>
        </section>

        {/* Featured collection shortcuts */}
        <section className="mx-auto max-w-[var(--editable-container)] px-5 pb-8 sm:px-8 lg:px-12">
          <EditableReveal>
            <div className="flex flex-wrap gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">Jump to a collection:</span>
              {featuredCollections.slice(0, 6).map((collection) => (
                <Link
                  key={collection.slug}
                  href={`/sbm?category=${collection.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-3 py-1.5 text-xs font-medium text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-page-text)]"
                >
                  <FolderOpen className="h-3 w-3 text-[var(--slot4-accent)]" /> {collection.label}
                </Link>
              ))}
            </div>
          </EditableReveal>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-5 pb-[var(--pad-large)] sm:px-8 lg:px-12">
          <div className="mt-6 flex flex-col gap-4 border-t border-[var(--editable-border)] pt-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">
                {results.length} results
              </p>
              <h2 className="mt-2 editable-display text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                {query ? `Results for "${query}"` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link href="/sbm" className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-border-strong)] bg-transparent px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-page-text)]">
              Browse the library <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {results.length ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((post, i) => (
                <EditableReveal key={post.id || post.slug} index={i % 6} step={60}>
                  <SearchResultCard post={post} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[6px] border border-dashed border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] p-14 text-center">
              <SearchIcon className="mx-auto h-8 w-8 text-[var(--slot4-muted-text)]" />
              <p className="mt-6 editable-display text-2xl font-medium tracking-[-0.02em]">No finds match that search.</p>
              <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">Try a different keyword, tag, or collection.</p>
            </div>
          )}

          {/* Footer ad — the only ad on search. */}
          <div className="mt-16 flex justify-center">
            <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel className="mx-auto w-full max-w-4xl" />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

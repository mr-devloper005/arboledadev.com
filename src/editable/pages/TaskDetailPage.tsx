import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, ArrowUpRight, Bookmark, CheckCircle2, Download, ExternalLink, FileText, FolderOpen,
  Globe, Globe2, Mail, MapPin, Phone, Shield, Tag, Twitter, Link as LinkIcon, UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { displayTaskLabel, isUiHiddenTask } from '@/editable/content/global.content'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar', 'cover'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here shortly.'
}

const getTagList = (post: SitePost) => {
  const tags = Array.isArray(post.tags) ? post.tags.filter((tag): tag is string => typeof tag === 'string' && Boolean(tag)) : []
  const contentTags = Array.isArray(getContent(post).tags) ? (getContent(post).tags as string[]).filter((tag) => typeof tag === 'string' && Boolean(tag)) : []
  return Array.from(new Set([...tags, ...contentTags])).slice(0, 8)
}

const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatBody = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* -------- Kicker / navigation shared bits ------------------------------- */
function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">
      <span>{theme.kicker}</span>
      <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)] opacity-60" />
      <span className="text-[var(--tk-muted)]">{children}</span>
    </div>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  const label = displayTaskLabel(task, taskConfig?.label)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-muted)] transition duration-300 hover:text-[var(--tk-text)]">
      <ArrowLeft className="h-4 w-4" /> Back to {label}
    </Link>
  )
}

/* =============================================================
   Bookmark / Resource detail — public hero + sticky action rail
   No hero image, no date. Domain chip + Visit resource CTA sit
   next to the display h1; body uses display headings; sidebar
   contains resource card + trust panel + one sidebar ad.
   ============================================================= */
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  const domain = website ? cleanDomain(website) : ''
  const collection = categoryOf(post, 'Collection')
  const tags = getTagList(post)
  const verified = Boolean(getField(post, ['verified', 'trusted'])) || tags.some((tag) => /verified|trusted|official/i.test(tag))

  return (
    <>
      {/* Premium hero band — cream ground, oversized display, no imagery. */}
      <section className="relative border-b border-[var(--tk-line)]">
        <div className="pointer-events-none absolute inset-x-0 -top-40 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--tk-glow),transparent_72%)]" />
        <div className="relative mx-auto max-w-[var(--editable-container)] px-5 pt-14 pb-[var(--pad-large)] sm:px-8 sm:pt-20 lg:px-12">
          <EditableReveal><BackLink task="sbm" /></EditableReveal>

          <EditableReveal index={1}>
            <div className="mt-10"><Kicker task="sbm">{collection}</Kicker></div>
          </EditableReveal>

          <EditableReveal index={2}>
            <h1 className="editable-display mt-6 max-w-4xl text-balance text-[2.5rem] font-medium leading-[1.02] tracking-[-0.03em] sm:text-[3.5rem] lg:text-[4.25rem]">
              {post.title}<span className="text-[var(--tk-accent)]">.</span>
            </h1>
          </EditableReveal>

          {leadText(post) ? (
            <EditableReveal index={3}>
              <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-[var(--tk-muted)]">{leadText(post)}</p>
            </EditableReveal>
          ) : null}

          <EditableReveal index={4}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {domain ? (
                <span className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--tk-line)] bg-[var(--tk-surface)] px-4 py-2.5 text-sm font-medium text-[var(--tk-text)]">
                  <Globe className="h-4 w-4 text-[var(--tk-accent)]" /> {domain}
                </span>
              ) : null}
              {website ? (
                <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--tk-accent)] bg-[var(--tk-accent)] px-5 py-2.5 text-sm font-medium text-[var(--tk-on-accent)] transition duration-300 hover:brightness-[0.96]">
                  Visit resource <ExternalLink className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </EditableReveal>

          {/* Quick-facts strip — Collection · Verified */}
          <EditableReveal index={5}>
            <dl className="mt-14 grid gap-6 border-t border-[var(--tk-line)] pt-10 sm:grid-cols-2">
              <QuickFact label="Collection" value={collection} icon={FolderOpen} />
              <QuickFact label="Trust" value={verified ? 'Verified' : 'Community-added'} icon={Shield} />
            </dl>
          </EditableReveal>
        </div>
      </section>

      {/* Body + sidebar */}
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-[var(--pad-large)] sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <EditableReveal>
              <BodyContent post={post} />
            </EditableReveal>

            {tags.length ? (
              <EditableReveal index={1}>
                <div className="mt-12 border-t border-[var(--tk-line)] pt-8">
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">Tags</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3 py-1.5 text-xs font-medium text-[var(--tk-muted)] transition duration-300 hover:border-[var(--tk-accent)] hover:text-[var(--tk-text)]">
                        <Tag className="h-3 w-3" /> {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </EditableReveal>
            ) : null}
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <EditableReveal>
              <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
                    <Bookmark className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">The find</p>
                    <p className="editable-display text-lg font-medium leading-tight tracking-[-0.02em]">{post.title}</p>
                  </div>
                </div>
                {domain ? (
                  <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--tk-muted)]">
                    <Globe className="h-4 w-4 text-[var(--tk-accent)]" /> {domain}
                  </p>
                ) : null}
                {website ? (
                  <Link href={website} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[6px] border border-[var(--tk-accent)] bg-[var(--tk-accent)] px-5 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition duration-300 hover:brightness-[0.96]">
                    Visit resource <ExternalLink className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">Trust panel</p>
                <ul className="mt-5 space-y-3 text-sm text-[var(--tk-text)]">
                  <TrustRow icon={CheckCircle2} label="Human-curated" note="A person added it, not a script." />
                  <TrustRow icon={Shield} label={verified ? 'Verified link' : 'Live link'} note="Checked recently for reachability." />
                  <TrustRow icon={FolderOpen} label={`Filed under ${collection}`} note="Grouped by theme, not by algorithm." />
                </ul>
              </div>
            </EditableReveal>

            <EditableReveal index={2}>
              <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel className="mx-auto w-full" />
            </EditableReveal>
          </aside>
        </div>

        {/* More from this collection */}
        {related.length ? (
          <EditableReveal>
            <div className="mt-24 border-t border-[var(--tk-line)] pt-16">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-accent)]">More from this collection</p>
                  <h2 className="mt-3 editable-display text-3xl font-medium tracking-[-0.02em]">Kept alongside on the shelf.</h2>
                </div>
                <Link href={getTaskConfig('sbm')?.route || '/sbm'} className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--tk-line)] px-4 py-2.5 text-sm font-medium transition duration-300 hover:border-[var(--tk-accent)]">
                  Browse the library <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((item, i) => (
                  <EditableReveal key={item.id || item.slug} index={i} step={60}>
                    <RelatedBookmarkCard post={item} />
                  </EditableReveal>
                ))}
              </div>
            </div>
          </EditableReveal>
        ) : null}
      </section>
    </>
  )
}

function QuickFact({ label, value, icon: Icon }: { label: string; value: string; icon: typeof FolderOpen }) {
  return (
    <div>
      <dt className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">
        <Icon className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {label}
      </dt>
      <dd className="mt-3 editable-display text-xl font-medium tracking-[-0.02em] text-[var(--tk-text)]">{value}</dd>
    </div>
  )
}

function TrustRow({ icon: Icon, label, note }: { icon: typeof CheckCircle2; label: string; note: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-[var(--tk-muted)]">{note}</p>
      </div>
    </li>
  )
}

function RelatedBookmarkCard({ post }: { post: SitePost }) {
  const href = `${getTaskConfig('sbm')?.route || '/sbm'}/${post.slug}`
  const image = getImages(post)[0]
  const domain = cleanDomain(getField(post, ['website', 'url', 'link']))
  return (
    <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-[3px]">
      {image ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--tk-raised)]">
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        </div>
      ) : (
        <div className="flex items-center justify-center border-b border-[var(--tk-line)] p-6">
          <FolderOpen className="h-6 w-6 text-[var(--tk-muted)]" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="editable-display line-clamp-2 text-base font-medium leading-snug tracking-[-0.01em]">{post.title}</h3>
        {domain ? <p className="mt-2 text-xs font-medium text-[var(--tk-muted)]">{domain}</p> : null}
      </div>
    </Link>
  )
}

/* =============================================================
   Profile detail — identity-first. Never linked from public UI.
   Cover band + overlapping avatar/initials + contact rows +
   "their content" section + identity info sidebar. No date,
   no back-to-archive link, no related-profiles strip.
   ============================================================= */
function ProfileDetail({ post }: { post: SitePost }) {
  const images = getImages(post)
  const avatar = images[0]
  const role = getField(post, ['role', 'designation', 'title', 'company'])
  const location = getField(post, ['location', 'address', 'city', 'country'])
  const bio = leadText(post) || stripHtml(getBody(post)).slice(0, 240)
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const twitter = getField(post, ['twitter', 'x'])
  const focus = getTagList(post)
  const initials = (post.title || '?').trim().split(/\s+/).map((chunk) => chunk.charAt(0).toUpperCase()).slice(0, 2).join('')
  const collectionsCount = focus.length
  const findsCount = Number(getField(post, ['findsCount', 'postsCount', 'count'])) || Math.max(collectionsCount * 4, 12)

  return (
    <>
      {/* Cover band (no back link) + overlapping identity */}
      <section className="relative">
        <div className="h-56 bg-[linear-gradient(135deg,var(--tk-raised),var(--tk-accent-soft))] sm:h-72" />
        <div className="mx-auto max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-12">
          <div className="-mt-20 flex flex-col items-start gap-6 sm:-mt-24 sm:flex-row sm:items-end">
            <EditableReveal>
              <div className="flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-[6px] border-4 border-[var(--tk-bg)] bg-[var(--tk-surface)] shadow-[0_10px_30px_rgba(24,19,18,0.12)] sm:h-48 sm:w-48">
                {avatar ? (
                  <img src={avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="editable-display text-4xl font-medium tracking-[-0.03em] text-[var(--tk-muted)] sm:text-5xl">
                    {initials || '?'}
                  </span>
                )}
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <div className="min-w-0 pb-2 sm:pb-4">
                <Kicker task="profile">Independent curator</Kicker>
                <h1 className="editable-display mt-4 text-3xl font-medium leading-[1.02] tracking-[-0.03em] sm:text-5xl">
                  {post.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--tk-muted)]">
                  {role ? <span className="inline-flex items-center gap-1.5"><UserRound className="h-4 w-4 text-[var(--tk-accent)]" /> {role}</span> : null}
                  {location ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[var(--tk-accent)]" /> {location}</span> : null}
                </div>
              </div>
            </EditableReveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-[var(--pad-large)] sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0 space-y-14">
            {bio ? (
              <EditableReveal>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-accent)]">About</p>
                  <p className="mt-5 max-w-2xl text-lg leading-[1.65] text-[var(--tk-text)]">{bio}</p>
                </div>
              </EditableReveal>
            ) : null}

            {/* Contact / links rows */}
            {(website || email || phone || twitter) ? (
              <EditableReveal index={1}>
                <div className="border-y border-[var(--tk-line)] py-8">
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">Contact & links</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {website ? <ContactRow icon={Globe2} label="Website" value={cleanDomain(website)} href={website} /> : null}
                    {email ? <ContactRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} /> : null}
                    {phone ? <ContactRow icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} /> : null}
                    {twitter ? <ContactRow icon={Twitter} label="Twitter" value={`@${twitter.replace(/^@/, '')}`} href={`https://twitter.com/${twitter.replace(/^@/, '')}`} /> : null}
                  </div>
                </div>
              </EditableReveal>
            ) : null}

            {/* Their content */}
            <EditableReveal index={2}>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-accent)]">Their content</p>
                <h2 className="mt-4 editable-display text-3xl font-medium tracking-[-0.02em]">What they've been adding.</h2>
                <div className="mt-8">
                  <BodyContent post={post} />
                </div>
              </div>
            </EditableReveal>
          </article>

          {/* Identity info sidebar (no related-profiles strip) */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <EditableReveal>
              <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">Identity</p>
                <dl className="mt-5 space-y-4">
                  <IdentityRow label="Name" value={post.title} />
                  {role ? <IdentityRow label="Role" value={role} /> : null}
                  {location ? <IdentityRow label="Location" value={location} /> : null}
                  <IdentityRow label="On the shelf" value={`${findsCount} finds`} />
                  {collectionsCount ? <IdentityRow label="Collections" value={String(collectionsCount)} /> : null}
                </dl>
              </div>
            </EditableReveal>

            {focus.length ? (
              <EditableReveal index={1}>
                <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">Focus areas</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {focus.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--tk-line)] bg-[var(--tk-bg)] px-3 py-1.5 text-xs font-medium text-[var(--tk-muted)]">
                        <Tag className="h-3 w-3 text-[var(--tk-accent)]" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </EditableReveal>
            ) : null}

            {website ? (
              <EditableReveal index={2}>
                <Link href={website} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-[6px] border border-[var(--tk-accent)] bg-[var(--tk-accent)] px-5 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition duration-300 hover:brightness-[0.96]">
                  Visit website <ExternalLink className="h-4 w-4" />
                </Link>
              </EditableReveal>
            ) : null}
          </aside>
        </div>
      </section>
    </>
  )
}

function ContactRow({ icon: Icon, label, value, href }: { icon: typeof Globe; label: string; value: string; href: string }) {
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="group flex items-center gap-3 rounded-[6px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-4 transition duration-300 hover:border-[var(--tk-accent)]">
      <span className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--tk-muted)]">{label}</p>
        <p className="truncate text-sm font-medium text-[var(--tk-text)]">{value}</p>
      </div>
      <LinkIcon className="h-4 w-4 shrink-0 text-[var(--tk-muted)] transition duration-300 group-hover:text-[var(--tk-accent)]" />
    </a>
  )
}

function IdentityRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--tk-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-[var(--tk-text)]">{value}</dd>
    </div>
  )
}

/* =============================================================
   Other task detail views — kept intact but trimmed to remove
   date rendering. Not promoted in the public UI.
   ============================================================= */
function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
        <BackLink task="article" />
        <p className="mt-10 text-xs font-medium uppercase tracking-[0.24em] text-[var(--tk-accent)]">{categoryOf(post, 'Resource')}</p>
        <h1 className="editable-display mt-5 text-balance text-4xl font-medium leading-[1.02] tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]">
          {post.title}
        </h1>
        {images[0] ? <img src={images[0]} alt="" className="mt-10 aspect-[16/9] w-full rounded-[var(--tk-radius)] border border-[var(--tk-line)] object-cover" /> : null}
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <BackLink task="listing" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="min-w-0">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
              {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <FolderOpen className="h-10 w-10 text-[var(--tk-muted)]" />}
            </div>
            <div className="min-w-0">
              <Kicker task="listing">Directory entry</Kicker>
              <h1 className="editable-display mt-4 text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl">{post.title}</h1>
            </div>
          </div>
          {leadText(post) ? <p className="mt-7 max-w-2xl text-lg leading-[1.65] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
        </article>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="listing" post={post} related={related} />
        </aside>
      </div>
    </section>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-12">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <div className="mt-7 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
            <Kicker task="classified">Notice</Kicker>
            <h1 className="editable-display mt-4 text-2xl font-medium leading-tight tracking-[-0.02em]">{post.title}</h1>
            <p className="editable-display mt-6 text-4xl font-medium tracking-[-0.03em] text-[var(--tk-accent)]">{price || 'Open offer'}</p>
            <div className="mt-6 space-y-2.5">
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <BackLink task="image" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Kicker task="image">Visual find</Kicker>
            <h1 className="editable-display mt-6 text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl">{post.title}</h1>
            {leadText(post) ? <p className="mt-6 text-lg leading-[1.65] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <BackLink task="pdf" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="min-w-0">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--tk-radius)] bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><FileText className="h-7 w-7" /></div>
            <div className="min-w-0">
              <Kicker task="pdf">{categoryOf(post, 'Document')}</Kicker>
              <h1 className="editable-display mt-3 text-3xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-4xl">{post.title}</h1>
            </div>
          </div>
          <BodyContent post={post} />
        </article>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {fileUrl ? (
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
              <p className="text-sm font-medium">Get this document</p>
              <p className="mt-2 text-sm leading-6 text-[var(--tk-muted)]">Open or download the file in a new tab.</p>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[var(--tk-accent)] px-5 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition duration-300 hover:brightness-[0.96]">
                Download <Download className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
          <RelatedPanel task="pdf" post={post} related={related} />
        </aside>
      </div>
    </section>
  )
}

/* ---- shared blocks ---- */
function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-8 max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-7' : 'text-[1.0625rem] leading-8'}`}
      dangerouslySetInnerHTML={{ __html: formatBody(getBody(post)) }}
    />
  )
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--tk-muted)]"><Icon className="h-4 w-4 text-[var(--tk-accent)]" /> {label}</div>
          <p className="mt-2 break-words text-sm font-medium leading-6">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--tk-muted)]">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-[6px] bg-[var(--tk-accent)] px-4 py-2.5 text-sm font-medium text-[var(--tk-on-accent)] transition duration-300 hover:brightness-[0.96]">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--tk-line)] px-4 py-2.5 text-sm font-medium transition duration-300 hover:border-[var(--tk-accent)]"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--tk-line)] px-4 py-2.5 text-sm font-medium transition duration-300 hover:border-[var(--tk-accent)]"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[6px] border border-[var(--tk-line)] bg-[var(--tk-raised)] px-4 py-3 text-sm">
      <span className="font-medium uppercase tracking-[0.12em] text-[var(--tk-muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function RelatedPanel({ task, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  const label = displayTaskLabel(task, taskConfig?.label)
  if (isUiHiddenTask(task)) return null
  return (
    <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--tk-muted)]">More {label.toLowerCase()}</p>
        <Link href={taskConfig?.route || '/'} className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--tk-accent)]">View all</Link>
      </div>
      <div className="mt-5 grid gap-3">
        {related.slice(0, 4).map((item) => {
          const href = `${taskConfig?.route || `/${task}`}/${item.slug}`
          return (
            <Link key={item.id || item.slug} href={href} className="group flex gap-3 rounded-[6px] border border-[var(--tk-line)] p-3 transition duration-300 hover:border-[var(--tk-accent)]">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[6px] bg-[var(--tk-raised)]"><FolderOpen className="h-5 w-5 text-[var(--tk-muted)]" /></div>
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm font-medium leading-snug tracking-[-0.01em]">{item.title}</h3>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length || isUiHiddenTask(task)) return null
  const taskConfig = getTaskConfig(task)
  const label = displayTaskLabel(task, taskConfig?.label)
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div className="flex items-center justify-between">
          <h2 className="editable-display text-2xl font-medium tracking-[-0.02em]">More {label.toLowerCase()}</h2>
          <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-accent)]">View all <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <Link key={item.id || item.slug} href={`${taskConfig?.route || `/${task}`}/${item.slug}`} className="group block overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-[3px]">
              <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
                {getImages(item)[0] ? (
                  <img src={getImages(item)[0]} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                ) : (
                  <div className="flex h-full items-center justify-center"><FileText className="h-7 w-7 text-[var(--tk-muted)]" /></div>
                )}
              </div>
              <div className="p-5">
                <h3 className="editable-display line-clamp-2 text-base font-medium leading-snug tracking-[-0.01em]">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{stripHtml(summaryText(item))}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'
import { ArrowUpRight, Bookmark, Globe } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
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
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}…` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Collection'
}

export function getEditableDomain(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const website =
    (typeof content.website === 'string' && content.website) ||
    (typeof content.url === 'string' && content.url) ||
    (typeof content.link === 'string' && content.link) ||
    ''
  return website.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

// -------- Card variants used by home, archive, search, and rails.

export function EditorialFeatureCard({ post, href, label = 'Featured find' }: { post: SitePost; href: string; label?: string }) {
  const image = getEditablePostImage(post)
  const domain = getEditableDomain(post)
  return (
    <Link href={href} className={`group block overflow-hidden ${dc.surface.dark} ${dc.motion.lift}`}>
      <div className="relative min-h-[520px] p-8 sm:p-10 lg:min-h-[600px]">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-700 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,19,18,0.12),rgba(24,19,18,0.85))]" />
        <div className="relative z-10 flex h-full min-h-[440px] flex-col justify-end lg:min-h-[520px]">
          <span className={`${dc.type.eyebrow} text-[var(--slot4-accent)]`}>{label}</span>
          <h3 className="mt-5 max-w-3xl editable-display text-4xl font-medium leading-[1.02] tracking-[-0.03em] text-[var(--slot4-dark-text)] sm:text-5xl lg:text-[3.5rem]">
            {post.title}
          </h3>
          <p className="mt-5 max-w-2xl text-base leading-[1.6] text-[color:color-mix(in_srgb,var(--slot4-dark-text)_78%,transparent)]">
            {getEditableExcerpt(post, 200)}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
            {domain ? (
              <span className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-dark-border)] bg-transparent px-3 py-1.5 text-[color:color-mix(in_srgb,var(--slot4-dark-text)_80%,transparent)]">
                <Globe className="h-3.5 w-3.5" /> {domain}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2 rounded-[6px] bg-[var(--slot4-accent-fill)] px-4 py-2 font-medium text-[var(--slot4-on-accent)]">
              Open find <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getEditablePostImage(post)
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} aspect-[4/3]`}>
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <span className="absolute left-4 top-4 rounded-[6px] bg-[var(--slot4-page-text)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-page-bg)]">
          No. {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-6">
        <p className={`${dc.type.eyebrow}`}>{getEditableCategory(post)}</p>
        <h3 className={`mt-3 line-clamp-3 editable-display text-xl font-medium leading-tight tracking-[-0.02em] ${pal.panelText}`}>
          {post.title}
        </h3>
        <p className={`mt-3 line-clamp-3 text-sm leading-6 ${pal.mutedText}`}>{getEditableExcerpt(post, 130)}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-page-text)]">
          Open find <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 ${dc.surface.soft} p-6 ${dc.motion.lift}`}>
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-[var(--slot4-page-text)] text-xs font-medium text-[var(--slot4-page-bg)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className={`inline-flex items-center gap-2 ${dc.type.eyebrow}`}>
            <Bookmark className="h-3.5 w-3.5" /> {getEditableCategory(post)}
          </p>
          <h3 className={`mt-2 line-clamp-2 editable-display text-lg font-medium leading-tight tracking-[-0.02em] ${pal.panelText}`}>
            {post.title}
          </h3>
          <p className={`mt-2 line-clamp-2 text-sm leading-6 ${pal.mutedText}`}>{getEditableExcerpt(post, 110)}</p>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getEditablePostImage(post)
  return (
    <Link href={href} className={`group grid min-w-0 gap-6 overflow-hidden ${dc.surface.card} p-4 ${dc.motion.lift} sm:grid-cols-[240px_minmax(0,1fr)]`}>
      <div className={`${dc.media.frame} aspect-[16/12] sm:aspect-auto sm:min-h-[200px]`}>
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
      </div>
      <div className="min-w-0 p-2 sm:py-5 sm:pr-6">
        <p className={`${dc.type.eyebrow}`}>Find {String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}</p>
        <h2 className={`mt-3 line-clamp-3 editable-display text-2xl font-medium leading-tight tracking-[-0.02em] ${pal.panelText} sm:text-[1.75rem]`}>
          {post.title}
        </h2>
        <p className={`mt-4 line-clamp-3 text-[15px] leading-[1.65] ${pal.mutedText}`}>{getEditableExcerpt(post, 200)}</p>
        <span className={`mt-6 inline-flex items-center gap-2 text-sm font-medium ${pal.panelText}`}>
          Open resource <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

import Link from 'next/link'
import { ArrowUpRight, Check, Compass, FolderOpen, LibraryBig, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

const principleIcons = [LibraryBig, FolderOpen, Compass]

export default function AboutPage() {
  const about = pagesContent.about
  const values = about.values

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* Hero band — no task-specific mention, calm and editorial. */}
        <section className="relative border-b border-[var(--editable-border)]">
          <div className={`mx-auto max-w-[var(--editable-container)] px-5 pt-16 pb-[var(--pad-large)] sm:px-8 sm:pt-24 lg:px-12`}>
            <EditableReveal>
              <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                <Sparkles className="h-3.5 w-3.5" /> {about.badge}
              </span>
            </EditableReveal>

            <EditableReveal index={1}>
              <h1 className={`${dc.type.display} mt-8 max-w-4xl text-balance`}>
                {about.title.replace(/[.\s]+$/, '')}<span className="text-[var(--slot4-accent)]">.</span>
              </h1>
            </EditableReveal>

            <EditableReveal index={2}>
              <p className={`mt-8 max-w-2xl ${dc.type.lead} text-[var(--slot4-muted-text)]`}>
                {about.description}
              </p>
            </EditableReveal>

            <EditableReveal index={3}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/sbm" className={dc.button.primary}>
                  Browse the library <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className={dc.button.secondary}>
                  Talk to us
                </Link>
              </div>
            </EditableReveal>
          </div>
        </section>

        {/* Long-form intro paragraphs */}
        <section className={`${dc.shell.section} py-[var(--pad-large)]`}>
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            <EditableReveal>
              <div>
                <p className={dc.type.eyebrow}>What we're building</p>
                <h2 className={`mt-4 ${dc.type.sectionTitleSm}`}>
                  A quieter place for the things worth returning to.
                </h2>
              </div>
            </EditableReveal>
            <EditableReveal index={1}>
              <div className="space-y-6">
                {about.paragraphs.map((paragraph, i) => (
                  <p key={i} className={`text-[17px] leading-[1.7] ${pal.mutedText}`}>{paragraph}</p>
                ))}
              </div>
            </EditableReveal>
          </div>
        </section>

        {/* Values / principles */}
        <section className="border-y border-[var(--editable-border)] bg-[var(--slot4-warm)]">
          <div className={`${dc.shell.section} py-[var(--pad-large)]`}>
            <EditableReveal>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl">
                  <p className={dc.type.eyebrow}>Principles</p>
                  <h2 className={`mt-3 ${dc.type.sectionTitle}`}>
                    The three things we protect.
                  </h2>
                </div>
              </div>
            </EditableReveal>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {values.map((value, i) => {
                const Icon = principleIcons[i] || LibraryBig
                return (
                  <EditableReveal key={value.title} index={i}>
                    <div className={`h-full ${dc.surface.card} p-8`}>
                      <span className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-6 editable-display text-xl font-medium tracking-[-0.02em]">{value.title}</h3>
                      <p className={`mt-3 text-[15px] leading-[1.65] ${pal.mutedText}`}>{value.description}</p>
                    </div>
                  </EditableReveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* Checkmark list — what visitors get */}
        <section className={`${dc.shell.section} py-[var(--pad-large)]`}>
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <EditableReveal>
              <div className={`${dc.surface.dark} p-10`}>
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Made for visitors</p>
                <h3 className="mt-4 editable-display text-3xl font-medium leading-[1.05] tracking-[-0.02em] text-[var(--slot4-dark-text)] sm:text-4xl">
                  What you'll find here — and what you won't.
                </h3>
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <ul className="space-y-4">
                {[
                  'Human-curated finds, kept alongside a note on why they belong.',
                  'Collections grouped by theme — no algorithm, no infinite scroll.',
                  'A browsable archive that stays legible weeks after you leave.',
                  'A calm, quiet page — the shelf, not a feed.',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[16px] leading-[1.55] text-[var(--slot4-page-text)]">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-fill)] text-[var(--slot4-on-accent)]">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </EditableReveal>
          </div>
        </section>

        {/* Closing CTA */}
        <section className={`${dc.surface.dark} border-t border-[var(--editable-dark-border)]`}>
          <div className={`${dc.shell.section} py-[var(--pad-xl)] text-center`}>
            <EditableReveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                Come look around
              </p>
              <h2 className="mx-auto mt-6 max-w-3xl editable-display text-4xl font-medium leading-[1.02] tracking-[-0.03em] text-[var(--slot4-dark-text)] sm:text-6xl">
                Start with the shelf you're most curious about.
              </h2>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Link href="/sbm" className={dc.button.primary}>
                  Browse the library <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className={dc.button.ghostDark}>
                  Suggest a find
                </Link>
              </div>
              <p className="mt-8 text-sm text-[color:color-mix(in_srgb,var(--slot4-dark-text)_55%,transparent)]">
                {SITE_CONFIG.name} — a curated library.
              </p>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

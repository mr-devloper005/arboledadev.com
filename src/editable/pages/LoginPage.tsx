import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Bookmark, Check } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Sign in', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  const login = pagesContent.auth.login
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} grid min-h-[calc(100vh-10rem)] items-center gap-14 py-[var(--pad-large)] lg:grid-cols-[1.05fr_0.95fr]`}>
          <div>
            <EditableReveal>
              <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                <Bookmark className="h-3.5 w-3.5" /> {login.badge}
              </span>
            </EditableReveal>

            <EditableReveal index={1}>
              <h1 className={`${dc.type.heroTitle} mt-8 max-w-xl text-balance`}>
                {login.title.replace(/[.\s]+$/, '')}<span className="text-[var(--slot4-accent)]">.</span>
              </h1>
            </EditableReveal>

            <EditableReveal index={2}>
              <p className={`mt-8 max-w-lg ${dc.type.lead} text-[var(--slot4-muted-text)]`}>{login.description}</p>
            </EditableReveal>

            <EditableReveal index={3}>
              <ul className="mt-10 space-y-3">
                {[
                  'Pick up any collection you were building.',
                  'Add new finds to your existing shelves.',
                  'Keep your curator page current.',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[15px] leading-[1.55]">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-fill)] text-[var(--slot4-on-accent)]">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </EditableReveal>
          </div>

          <EditableReveal index={1}>
            <div className={`${dc.surface.card} p-8 sm:p-10`}>
              <h2 className="editable-display text-2xl font-medium tracking-[-0.02em]">{login.formTitle}</h2>
              <p className={`mt-2 text-sm ${pal.mutedText}`}>Curator access — the same account you use to add finds.</p>
              <div className="mt-6">
                <EditableLocalLoginForm />
              </div>
              <div className="mt-8 flex flex-col items-start gap-3 border-t border-[var(--editable-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className={`text-sm ${pal.mutedText}`}>New here?</p>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-page-text)] transition duration-300 hover:text-[var(--slot4-accent)]"
                >
                  {login.createCta} <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}

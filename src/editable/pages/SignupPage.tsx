import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Compass, FolderOpen, LibraryBig, UserPlus } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Become a curator', description: pagesContent.auth.signup.metadataDescription })
}

const perks = [
  { icon: LibraryBig, title: 'A shelf of your own', body: 'Start a permanent home for the resources you keep returning to.' },
  { icon: FolderOpen, title: 'Themed collections', body: 'Group finds into shelves that stay browsable months later.' },
  { icon: Compass, title: 'A quiet audience', body: 'The library brings in people who came to browse, not scroll a feed.' },
]

export default function SignupPage() {
  const signup = pagesContent.auth.signup
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} grid min-h-[calc(100vh-10rem)] items-center gap-14 py-[var(--pad-large)] lg:grid-cols-[0.95fr_1.05fr]`}>
          <EditableReveal>
            <div className={`${dc.surface.card} p-8 sm:p-10`}>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)]">
                  <UserPlus className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">Curator account</p>
                  <h1 className="editable-display text-2xl font-medium tracking-[-0.02em]">{signup.formTitle}</h1>
                </div>
              </div>
              <div className="mt-6">
                <EditableLocalSignupForm />
              </div>
              <div className="mt-8 flex flex-col items-start gap-3 border-t border-[var(--editable-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className={`text-sm ${pal.mutedText}`}>Already have an account?</p>
                <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-page-text)] transition duration-300 hover:text-[var(--slot4-accent)]">
                  {signup.loginCta} <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </EditableReveal>

          <div>
            <EditableReveal>
              <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                <UserPlus className="h-3.5 w-3.5" /> {signup.badge}
              </span>
            </EditableReveal>

            <EditableReveal index={1}>
              <h2 className={`${dc.type.heroTitle} mt-8 max-w-xl text-balance`}>
                {signup.title.replace(/[.\s]+$/, '')}<span className="text-[var(--slot4-accent)]">.</span>
              </h2>
            </EditableReveal>

            <EditableReveal index={2}>
              <p className={`mt-8 max-w-lg ${dc.type.lead} text-[var(--slot4-muted-text)]`}>{signup.description}</p>
            </EditableReveal>

            <div className="mt-10 grid gap-3">
              {perks.map((perk, i) => (
                <EditableReveal key={perk.title} index={i + 3} step={70}>
                  <div className={`${dc.surface.soft} p-5 flex items-start gap-4`}>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                      <perk.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="editable-display text-lg font-medium tracking-[-0.02em]">{perk.title}</p>
                      <p className={`mt-1 text-sm leading-[1.6] ${pal.mutedText}`}>{perk.body}</p>
                    </div>
                  </div>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

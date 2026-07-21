'use client'

import Link from 'next/link'
import { ArrowUpRight, Bookmark, Compass, Mail, MessageSquareText, Sparkles, Users } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

const lanes = [
  {
    icon: Bookmark,
    title: 'Suggest a find',
    body: 'Pass us a resource, tool, or reference you think deserves a permanent shelf.',
  },
  {
    icon: Compass,
    title: 'Pitch a collection',
    body: 'Have a themed shelf in mind? Tell us what belongs on it and why it holds together.',
  },
  {
    icon: Users,
    title: 'Become a curator',
    body: 'If you spend your days looking for good work, a curator shelf is yours to build.',
  },
  {
    icon: MessageSquareText,
    title: 'Everything else',
    body: 'Bug reports, questions, partnerships — leave a note and we\'ll route it.',
  },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} pt-14 pb-[var(--pad-large)] sm:pt-24`}>
          <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <EditableReveal>
                <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                  <Sparkles className="h-3.5 w-3.5" /> {pagesContent.contact.eyebrow}
                </span>
              </EditableReveal>

              <EditableReveal index={1}>
                <h1 className={`${dc.type.heroTitle} mt-8 max-w-2xl text-balance`}>
                  {pagesContent.contact.title.replace(/[.\s?!]+$/, '')}
                  <span className="text-[var(--slot4-accent)]">?</span>
                </h1>
              </EditableReveal>

              <EditableReveal index={2}>
                <p className={`mt-8 max-w-xl ${dc.type.lead} text-[var(--slot4-muted-text)]`}>
                  {pagesContent.contact.description}
                </p>
              </EditableReveal>

              <div className="mt-12 grid gap-3 sm:grid-cols-2">
                {lanes.map((lane, i) => (
                  <EditableReveal key={lane.title} index={i} step={70}>
                    <div className={`h-full ${dc.surface.card} p-6`}>
                      <span className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                        <lane.icon className="h-5 w-5" />
                      </span>
                      <h2 className="mt-5 editable-display text-lg font-medium tracking-[-0.02em]">{lane.title}</h2>
                      <p className={`mt-2 text-sm leading-[1.6] ${pal.mutedText}`}>{lane.body}</p>
                    </div>
                  </EditableReveal>
                ))}
              </div>
            </div>

            <EditableReveal index={1}>
              <div className={`${dc.surface.card} p-8 sm:p-10`}>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)]">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">Reach us</p>
                    <h2 className="editable-display text-2xl font-medium tracking-[-0.02em]">{pagesContent.contact.formTitle}</h2>
                  </div>
                </div>

                <div className="mt-8">
                  <EditableContactLeadForm />
                </div>

                <p className={`mt-6 flex items-center gap-2 text-xs ${pal.softMutedText}`}>
                  We reply personally, usually within a couple of days.
                </p>
              </div>
            </EditableReveal>
          </div>
        </section>

        {/* Closing note strip */}
        <section className="border-t border-[var(--editable-border)] bg-[var(--slot4-warm)]">
          <div className={`${dc.shell.section} py-[var(--pad-main)]`}>
            <EditableReveal>
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <p className={`editable-display max-w-xl text-xl font-medium tracking-[-0.02em]`}>
                  Prefer to just browse? The shelf is one click away.
                </p>
                <Link href="/sbm" className={dc.button.primary}>
                  Browse the library <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

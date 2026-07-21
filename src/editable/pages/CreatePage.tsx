'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Bookmark, CheckCircle2, FileText, FolderOpen, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { displayTaskLabel, isUiHiddenTask } from '@/editable/content/global.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  sbm: Bookmark,
  article: FileText,
  listing: FolderOpen,
  classified: PlusCircle,
  image: ImageIcon,
  pdf: FileText,
  profile: Sparkles,
}

const fieldClass =
  'rounded-[6px] border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition duration-300 placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-page-text)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  // Publisher picker hides UI-hidden tasks entirely (e.g. profile).
  const enabledTasks = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled && !isUiHiddenTask(task.key)),
    [],
  )
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'sbm') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]
  const activeLabel = activeTask ? displayTaskLabel(activeTask.key, activeTask.label) : 'find'

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    const locked = pagesContent.create.locked
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
          <section className={`${dc.shell.section} grid min-h-[calc(100vh-10rem)] items-center gap-14 py-[var(--pad-large)] lg:grid-cols-[0.9fr_1.1fr]`}>
            <EditableReveal>
              <div className={`${dc.surface.dark} flex h-full min-h-72 flex-col items-center justify-center p-14 text-center`}>
                <Lock className="h-14 w-14 text-[var(--slot4-accent)]" />
                <p className="mt-6 editable-display text-2xl font-medium tracking-[-0.02em] text-[var(--slot4-dark-text)]">
                  Curator sign-in required.
                </p>
                <p className="mt-2 text-sm text-[color:color-mix(in_srgb,var(--slot4-dark-text)_65%,transparent)]">
                  Adding finds is a small perk of being a curator.
                </p>
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <div>
                <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                  <Bookmark className="h-3.5 w-3.5" /> {locked.badge}
                </span>
                <h1 className={`${dc.type.heroTitle} mt-8 max-w-xl text-balance`}>
                  {locked.title.replace(/[.\s]+$/, '')}<span className="text-[var(--slot4-accent)]">.</span>
                </h1>
                <p className={`mt-8 max-w-lg ${dc.type.lead} text-[var(--slot4-muted-text)]`}>
                  {locked.description}
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link href="/login" className={dc.button.primary}>
                    Sign in <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/signup" className={dc.button.secondary}>
                    Become a curator
                  </Link>
                </div>
              </div>
            </EditableReveal>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  const hero = pagesContent.create.hero
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} py-[var(--pad-large)]`}>
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <aside>
              <EditableReveal>
                <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                  <Bookmark className="h-3.5 w-3.5" /> {hero.badge}
                </span>
              </EditableReveal>

              <EditableReveal index={1}>
                <h1 className={`${dc.type.heroTitle} mt-8 max-w-xl text-balance`}>
                  {hero.title.replace(/[.\s]+$/, '')}<span className="text-[var(--slot4-accent)]">.</span>
                </h1>
              </EditableReveal>

              <EditableReveal index={2}>
                <p className={`mt-8 max-w-lg ${dc.type.lead} text-[var(--slot4-muted-text)]`}>{hero.description}</p>
              </EditableReveal>

              <EditableReveal index={3}>
                <div className="mt-10">
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">Resource type</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {enabledTasks.map((item) => {
                      const Icon = taskIcon[item.key] || FileText
                      const active = item.key === task
                      const labelForTask = displayTaskLabel(item.key, item.label)
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setTask(item.key)}
                          className={`rounded-[6px] border p-4 text-left transition duration-300 ${
                            active
                              ? 'border-[var(--slot4-page-text)] bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)]'
                              : 'border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-page-text)] hover:border-[var(--slot4-page-text)]'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="mt-3 block editable-display text-lg font-medium tracking-[-0.02em]">{labelForTask}</span>
                          <span className={`mt-1 block text-xs ${active ? 'opacity-70' : pal.mutedText}`}>{item.description}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </EditableReveal>
            </aside>

            <EditableReveal index={1}>
              <form onSubmit={submit} className={`${dc.surface.card} p-6 sm:p-8`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
                      Add to {activeLabel.toLowerCase()}
                    </p>
                    <h2 className="mt-1 editable-display text-2xl font-medium tracking-[-0.02em]">
                      {pagesContent.create.formTitle}
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--editable-border)] bg-[var(--slot4-warm)] px-3 py-1.5 text-xs font-medium text-[var(--slot4-page-text)]">
                    Curator · {session.name}
                  </span>
                </div>

                <div className="mt-8 grid gap-4">
                  <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title of the find" required />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Collection or shelf" />
                    <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Resource URL" />
                  </div>
                  <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Cover image URL (optional)" />
                  <textarea className={`${fieldClass} min-h-24 resize-y`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short curator's note — why this belongs on the shelf" required />
                  <textarea className={`${fieldClass} min-h-48 resize-y`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Longer notes, context, or related resources" />
                </div>

                {created ? (
                  <div className="mt-5 flex items-start gap-3 rounded-[6px] border border-[var(--slot4-accent)] bg-[var(--slot4-accent-soft)] p-4 text-[var(--slot4-page-text)]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-[var(--slot4-accent)]" />
                    <div>
                      <p className="text-sm font-medium">{pagesContent.create.successTitle}</p>
                      <p className={`mt-1 text-sm ${pal.mutedText}`}>{created.title}</p>
                    </div>
                  </div>
                ) : null}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                  <Link href="/sbm" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-muted-text)] transition duration-300 hover:text-[var(--slot4-page-text)]">
                    View the shelf <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <button type="submit" className={dc.button.primary}>
                    <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
                  </button>
                </div>
              </form>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent, featuredCollections } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

// Dark footer, cream ink. A Collections column deep-links into
// /sbm?category=<slug> for topical discovery.
export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="mt-auto bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[var(--slot4-accent-fill)] text-[var(--slot4-on-accent)]">
                <img src="/favicon.ico" alt="Logo" className="h-9 w-9" />
              </span>
              <span className="editable-display text-2xl font-medium tracking-[-0.02em]">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-6 max-w-md text-[15px] leading-[1.65] text-[color:color-mix(in_srgb,var(--slot4-dark-text)_70%,transparent)]">
              {globalContent.footer.description}
            </p>
            <Link
              href="/sbm"
              className="mt-8 inline-flex items-center gap-2 rounded-[6px] border border-[var(--slot4-accent)] bg-[var(--slot4-accent-fill)] px-5 py-3 text-sm font-medium text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-[0.96]"
            >
              {globalContent.commonLabels.viewAll} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <FooterColumn
            title="Collections"
            links={featuredCollections.map((collection) => ({
              label: collection.label,
              href: `/sbm?category=${collection.slug}`,
            }))}
          />

          <FooterColumn title="Explore" links={[...globalContent.footer.columns[0].links]} />

          <FooterColumn
            title="Site"
            links={[
              ...globalContent.footer.columns[1].links,
              ...(session
                ? [{ label: 'Add a find', href: '/create' }]
                : [
                    { label: 'Sign in', href: '/login' },
                    { label: 'Become a curator', href: '/signup' },
                  ]),
            ]}
            trailing={
              session ? (
                <button
                  type="button"
                  onClick={logout}
                  className="mt-2 text-left text-sm font-medium text-[color:color-mix(in_srgb,var(--slot4-dark-text)_60%,transparent)] transition duration-300 hover:text-[var(--slot4-dark-text)]"
                >
                  Sign out
                </button>
              ) : null
            }
          />
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-[var(--editable-dark-border)] pt-8 text-sm text-[color:color-mix(in_srgb,var(--slot4-dark-text)_55%,transparent)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {SITE_CONFIG.name}. {globalContent.footer.bottomNote}</p>
          <p className="editable-display text-base tracking-[-0.02em] text-[color:color-mix(in_srgb,var(--slot4-dark-text)_80%,transparent)]">
            {globalContent.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
  trailing,
}: {
  title: string
  links: Array<{ label: string; href: string }>
  trailing?: React.ReactNode
}) {
  return (
    <div>
      <h3 className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{title}</h3>
      <div className="mt-5 grid gap-2.5">
        {links.map((link) => (
          <Link
            key={`${link.label}-${link.href}`}
            href={link.href}
            className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[color:color-mix(in_srgb,var(--slot4-dark-text)_78%,transparent)] transition duration-300 hover:text-[var(--slot4-dark-text)]"
          >
            {link.label}
          </Link>
        ))}
      </div>
      {trailing}
    </div>
  )
}

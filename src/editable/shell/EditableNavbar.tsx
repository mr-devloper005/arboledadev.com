'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X, ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

// Meridian-style top bar: warm cream ground, dark ink, three text links, a
// search glyph that jumps to /search, and auth actions. No task navigation —
// collection discovery lives on the home and in the footer.
export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const primaryLinks = globalContent.nav.primaryLinks

  const linkClass = (href: string) => {
    const active = pathname === href || pathname.startsWith(`${href}/`)
    return `inline-flex items-center px-1.5 py-1 text-[13px] font-medium tracking-[-0.005em] transition-colors duration-300 ${
      active
        ? 'text-[var(--slot4-page-text)]'
        : 'text-[color:color-mix(in_srgb,var(--slot4-page-text)_66%,transparent)] hover:text-[var(--slot4-page-text)]'
    }`
  }

  return (
    <header className="sticky top-0 z-50 bg-[var(--editable-nav-bg)]/92 text-[var(--editable-nav-text)] backdrop-blur-md">
      <nav className="mx-auto flex min-h-[76px] w-full max-w-[var(--editable-container)] items-center gap-6 px-5 sm:px-8 lg:px-12">
        <Link href="/" className="group inline-flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)]">
            <img src="/favicon.ico" alt="Logo" className="h-8 w-8" />
          </span>
          <span className="editable-display text-lg font-medium tracking-[-0.02em] leading-none">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <div className="ml-8 hidden items-center gap-6 md:flex">
          {primaryLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-[6px] text-[var(--slot4-page-text)]/70 transition duration-300 hover:bg-[var(--slot4-panel-bg)] hover:text-[var(--slot4-page-text)] md:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-1.5 rounded-[6px] px-3 py-2 text-[13px] font-medium text-[var(--slot4-page-text)] transition duration-300 hover:bg-[var(--slot4-panel-bg)] sm:inline-flex"
              >
                Add a find
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-1.5 rounded-[6px] px-3 py-2 text-[13px] font-medium text-[var(--slot4-page-text)]/70 transition duration-300 hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-1.5 rounded-[6px] px-3 py-2 text-[13px] font-medium text-[var(--slot4-page-text)]/70 transition duration-300 hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-1.5 rounded-[6px] border border-[var(--slot4-accent)] bg-[var(--slot4-accent-fill)] px-4 py-2 text-[13px] font-medium text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-[0.96] sm:inline-flex"
              >
                Become a curator <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-[var(--editable-border)] bg-transparent md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div className="h-px w-full bg-[var(--editable-border)]" />

      {open ? (
        <div className="border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-5 py-5 md:hidden">
          <div className="grid gap-0.5">
            {[{ label: 'Home', href: '/' }, ...primaryLinks, { label: 'Search', href: '/search' }].map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-[6px] px-3 py-3 text-sm font-medium transition duration-300 ${
                    active ? 'bg-[var(--slot4-panel-bg)] text-[var(--slot4-page-text)]' : 'text-[var(--slot4-page-text)]/75 hover:bg-[var(--slot4-panel-bg)] hover:text-[var(--slot4-page-text)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="mt-3 border-t border-[var(--editable-border)] pt-3">
              {session ? (
                <>
                  <Link href="/create" onClick={() => setOpen(false)} className="block rounded-[6px] px-3 py-3 text-sm font-medium text-[var(--slot4-page-text)] hover:bg-[var(--slot4-panel-bg)]">
                    Add a find
                  </Link>
                  <button type="button" onClick={() => { logout(); setOpen(false) }} className="block w-full rounded-[6px] px-3 py-3 text-left text-sm font-medium text-[var(--slot4-page-text)]/70">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="block rounded-[6px] px-3 py-3 text-sm font-medium text-[var(--slot4-page-text)]/70 hover:bg-[var(--slot4-panel-bg)] hover:text-[var(--slot4-page-text)]">
                    Sign in
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="mt-1 block rounded-[6px] bg-[var(--slot4-accent-fill)] px-3 py-3 text-center text-sm font-medium text-[var(--slot4-on-accent)]">
                    Become a curator
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

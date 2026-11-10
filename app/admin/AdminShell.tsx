"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BookOpen, ChevronRight, FolderOpen, LayoutDashboard, LogOut, Mail, Menu, PanelLeft, UserRound, X } from "lucide-react";
import { signOut } from "./actions";

const navigation = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/about", label: "About", icon: UserRound },
  { href: "/admin/story", label: "My Story", icon: BookOpen },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/messages", label: "Inbox", icon: Mail },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  if (["/admin/login", "/admin/forgot-password", "/admin/reset-password"].includes(pathname)) return children;
  const current = navigation.find(item => item.href === pathname || item.href !== "/admin" && pathname.startsWith(`${item.href}/`))?.label ?? "Workspace";
  return <div className="min-h-svh bg-[var(--surface-muted)] text-[var(--foreground)]">
    <a href="#main-content" className="sr-only z-50 rounded-lg bg-[var(--background)] p-3 focus:not-sr-only focus:fixed focus:top-4 focus:left-4">Skip to content</a>
    <aside className="border-b border-[var(--border-color)] bg-[var(--background)] lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-b-0" aria-label="Admin sidebar">
      <div className="flex h-20 items-center justify-between px-5 lg:px-6">
        <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-base font-semibold tracking-tight">Admin Panel</Link>
        <button type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="admin-navigation" onClick={() => setMenuOpen(open => !open)} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[var(--border-color)] lg:hidden">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
      </div>
      <div id="admin-navigation" className={`${menuOpen ? "flex" : "hidden"} flex-col px-4 pb-5 lg:flex lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pt-5`} onKeyDown={event => { if (event.key === "Escape") { setMenuOpen(false); event.currentTarget.closest("aside")?.querySelector("button")?.focus(); } }}>
        <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.16em] text-[var(--text-muted)] uppercase">Workspace</p>
        <nav aria-label="Admin navigation" className="space-y-1.5">{navigation.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || href !== "/admin" && pathname.startsWith(`${href}/`);
          return <Link key={href} href={href} onClick={() => setMenuOpen(false)} aria-current={active ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${active ? "bg-[var(--accent-soft)] font-semibold text-[var(--accent)]" : "text-[var(--secondary-text)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"}`}><Icon size={18} aria-hidden="true" />{label}{active && <ChevronRight size={15} className="ml-auto" aria-hidden="true" />}</Link>;
        })}</nav>
        <div className="mt-8 border-t border-[var(--border-color)] pt-6">
          <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.16em] text-[var(--text-muted)] uppercase">Coming next</p>
          {[{ label: "Contact details", icon: Mail }].map(({ label, icon: Icon }) => <p key={label} className="flex items-center gap-3 px-3 py-3 text-sm text-[var(--text-muted)]"><Icon size={18} aria-hidden="true" />{label}</p>)}
        </div>
        <div className="mt-8 rounded-xl border border-[var(--accent-border)] bg-[var(--accent-subtle)] p-4 lg:mt-auto lg:mb-5"><p className="text-xs font-semibold">Make it yours.</p><p className="mt-2 text-xs leading-5 text-[var(--secondary-text)]">Open a section, edit your content, then save to publish.</p></div>
        <div className="mt-4 space-y-1 border-t border-[var(--border-color)] pt-3 lg:mt-0">
          <Link href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--secondary-text)] hover:bg-[var(--surface-muted)]"><ArrowUpRight size={18} aria-hidden="true" />View portfolio</Link>
          <form action={signOut}><button type="submit" className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--secondary-text)] hover:bg-red-500/10 hover:text-red-500"><LogOut size={18} aria-hidden="true" />Sign out</button></form>
        </div>
      </div>
    </aside>
    <div className="min-w-0 lg:pl-64">
      <header className="flex h-16 items-center justify-between gap-4 border-b border-[var(--border-color)] bg-[var(--background)] px-5 md:px-8 lg:px-10">
        <div className="flex min-w-0 items-center gap-2 text-xs text-[var(--secondary-text)]"><PanelLeft size={16} className="mr-1 hidden sm:block" aria-hidden="true" /><Link href="/admin" className="hover:text-[var(--accent)]">Workspace</Link><ChevronRight size={13} aria-hidden="true" /><span className="truncate font-medium text-[var(--foreground)]">{current}</span></div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--border-color)] px-3 py-1.5 text-[10px] font-medium"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />Admin</span>
      </header>
      {children}
    </div>
  </div>;
}

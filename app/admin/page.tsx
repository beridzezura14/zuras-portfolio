import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Check, Clock3, FileText, FolderOpen, Mail, UserRound } from "lucide-react";
import { requireAdmin } from "@/lib/supabase/admin";

const editors = [
  { key: "about", title: "About", href: "/admin/about", preview: "/#about", icon: UserRound, description: "Your introduction, experience, education and skills.", label: "Homepage section" },
  { key: "story", title: "My Story", href: "/admin/story", preview: "/about", icon: BookOpen, description: "The journey behind your work. Edit and arrange chapters.", label: "More About Me page" },
  { key: "projects", title: "Projects", href: "/admin/projects", preview: "/projects", icon: FolderOpen, description: "Add projects, upload images and manage published work.", label: "Project collection" },
];

async function Dashboard() {
  const { supabase, user } = await requireAdmin();
  const [projects, content, messages, unread] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("site_content").select("key, updated_at"),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
  ]);
  const hasError = projects.error || content.error || messages.error || unread.error;
  const stats = [
    { label: "Content sections", value: content.error ? "—" : content.data?.length ?? 0, icon: FileText, href: "#manage-content" },
    { label: "Projects", value: projects.error ? "—" : projects.count ?? 0, icon: FolderOpen, href: "/admin/projects" },
    { label: "Messages", value: messages.error ? "—" : messages.count ?? 0, icon: Mail, href: "/admin/messages" },
    { label: "Unread", value: unread.error ? "—" : unread.count ?? 0, icon: Mail, href: "/admin/messages?status=unread" },
  ];
  return <>
    <div className="flex flex-wrap items-start justify-between gap-6">
      <div><p className="text-xs font-medium text-[var(--secondary-text)]">Your portfolio, at a glance</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] md:text-4xl">Workspace overview</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[var(--secondary-text)]">Keep your story up to date. Choose a section below to get started.</p></div>
      <Link href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--background)] px-4 py-3 text-xs font-semibold transition hover:border-[var(--accent)]">View portfolio<ArrowUpRight size={15} aria-hidden="true" /></Link>
    </div>
    {hasError && <p role="alert" className="mt-7 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm">Some information could not be loaded. Refresh the page to try again.</p>}
    <section aria-label="Portfolio statistics" className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--border-color)] sm:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, href }) => <Link key={label} href={href} className="flex min-w-0 items-center gap-2.5 bg-[var(--background)] px-3 py-3 transition-colors hover:bg-[var(--accent-subtle)] focus-visible:-outline-offset-2 md:px-4">
        <Icon size={15} className="shrink-0 text-[var(--accent)]" aria-hidden="true" />
        <span className="text-[11px] leading-4 font-medium text-[var(--secondary-text)]">{label}</span>
        <span className="ml-auto shrink-0 text-xl leading-7 font-semibold tracking-tight tabular-nums">{value}</span>
      </Link>)}
    </section>
    <div className="mt-10 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <section aria-labelledby="manage-content"><div className="mb-5"><h2 id="manage-content" className="text-lg font-semibold tracking-tight">Manage your content</h2><p className="mt-1 text-xs leading-6 text-[var(--secondary-text)]">Your available editors. Changes go live when you save.</p></div>
        <div className="space-y-4">{editors.map(({ key, title, href, preview, icon: Icon, description, label }) => <div key={key} className="rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-5 transition-colors hover:border-[var(--accent-border)] md:p-6"><div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon size={21} aria-hidden="true" /></span><div className="min-w-0"><p className="text-[10px] font-medium tracking-wide text-[var(--secondary-text)] uppercase">{label}</p><h3 className="mt-1 text-xl font-semibold tracking-tight"><Link href={href} className="hover:text-[var(--accent)]">{title}</Link></h3><p className="mt-2 text-sm leading-6 text-[var(--secondary-text)]">{description}</p></div></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-color)] pt-4"><Link href={preview} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[var(--secondary-text)] hover:text-[var(--accent)]">Preview page<ArrowUpRight size={13} aria-hidden="true" /></Link><Link href={href} className="inline-flex items-center gap-3 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[var(--accent-on)]">Edit {title}<ArrowRight size={15} aria-hidden="true" /></Link></div></div>)}</div>
      </section>
      <div className="space-y-5 xl:pt-16">
        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-5"><h2 className="flex items-center gap-2 text-sm font-semibold"><Clock3 size={16} className="text-[var(--accent)]" aria-hidden="true" />Last updated</h2><div className="mt-5 space-y-5">{editors.filter(editor => editor.key !== "projects").map(editor => {
          const row = content.data?.find(item => item.key === editor.key);
          return <div key={editor.key}><Link href={editor.href} className="text-xs font-semibold hover:text-[var(--accent)]">{editor.title}</Link><p className="mt-1 text-[11px] leading-5 text-[var(--secondary-text)]">{row?.updated_at ? new Date(row.updated_at).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tbilisi" }) + " · Tbilisi" : "Unavailable"}</p></div>;
        })}</div></section>
        <section className="rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-soft)] p-5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--background)] text-[var(--accent)]"><Check size={16} aria-hidden="true" /></span><h2 className="mt-4 text-sm font-semibold">A simple publishing flow</h2><ol className="mt-4 space-y-3 text-xs leading-5 text-[var(--secondary-text)]">{["Choose a content section or project.", "Edit your text and arrange entries.", "Save, then preview your page."].map((step, index) => <li key={step} className="flex gap-2"><span className="font-semibold text-[var(--accent)]">0{index + 1}</span>{step}</li>)}</ol></section>
        <p className="px-1 text-[11px] leading-5 text-[var(--secondary-text)]">Signed in as<span className="mt-1 block break-all font-medium text-[var(--foreground)]">{user.email}</span></p>
      </div>
    </div>
  </>;
}

export default function AdminPage() {
  return <main id="main-content" tabIndex={-1} className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 md:py-10 lg:px-10"><Suspense fallback={<p role="status" className="py-16 text-sm text-[var(--secondary-text)]">Loading your workspace…</p>}><Dashboard /></Suspense></main>;
}

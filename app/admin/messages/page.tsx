import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronDown, Mail } from "lucide-react";
import { requireAdmin } from "@/lib/supabase/admin";
import MessageControls from "./MessageControls";
import RefreshInbox from "./RefreshInbox";

type InboxParams = { status?: string; page?: string };
async function Inbox({ searchParams }: { searchParams: Promise<InboxParams> }) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const status = params.status === "unread" || params.status === "read" ? params.status : "all";
  const page = Math.max(1, Math.min(100000, Math.floor(Number(params.page)) || 1));
  let query = supabase.from("contact_messages").select("id,name,email,subject,message,is_read,created_at", { count: "exact" }).order("created_at", { ascending: false }).order("id");
  if (status !== "all") query = query.eq("is_read", status === "read");
  const [messages, unread] = await Promise.all([
    query.range((page - 1) * 25, page * 25 - 1),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
  ]);
  if (messages.error || unread.error) throw new Error("Unable to load messages.");
  const total = messages.count ?? 0;
  const pages = Math.max(1, Math.ceil(total / 25));
  if (page > pages) redirect(`/admin/messages?status=${status}&page=${pages}`);
  return <>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><nav aria-label="Message filters" className="flex flex-wrap gap-2">{["all", "unread", "read"].map(filter => <Link key={filter} href={`/admin/messages?status=${filter}`} aria-current={status === filter ? "page" : undefined} className={`rounded-full border px-4 py-2 text-xs font-semibold capitalize ${status === filter ? "border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent)]" : "border-[var(--border-color)] bg-[var(--background)] text-[var(--secondary-text)]"}`}>{filter}{filter === "unread" ? ` (${unread.count ?? 0})` : ""}</Link>)}</nav><p className="text-xs text-[var(--secondary-text)]">{total} {status === "all" ? "messages" : `${status} messages`}</p></div>
    <div className="space-y-3">{messages.data.map(message => <details key={message.id} className="group rounded-2xl border border-[var(--border-color)] bg-[var(--background)] open:border-[var(--accent-border)]">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 p-5 [&::-webkit-details-marker]:hidden"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${message.is_read ? "bg-[var(--surface-muted)] text-[var(--secondary-text)]" : "bg-[var(--accent-soft)] text-[var(--accent)]"}`}><Mail size={18} aria-hidden="true" /></span><div className="min-w-0 flex-1 basis-36"><p className="break-words text-sm font-semibold">{message.name}{!message.is_read && <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-label="Unread" />}</p><p className="mt-1 break-all text-xs text-[var(--secondary-text)]">{message.email}</p><p className="mt-1 break-words text-xs text-[var(--secondary-text)]">{message.subject || "Website inquiry"}</p></div><time dateTime={message.created_at} className="text-[11px] text-[var(--text-muted)]">{new Date(message.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tbilisi" })}</time><ChevronDown size={17} className="shrink-0 text-[var(--secondary-text)] transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
      <div className="border-t border-[var(--border-color)] px-5 py-6 md:px-7"><p className="text-sm leading-7 whitespace-pre-wrap [overflow-wrap:anywhere]">{message.message}</p><a href={`mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(`Re: ${message.subject || "Your website inquiry"}`)}`} className="mt-5 inline-flex text-xs font-semibold text-[var(--accent)]">Reply by email ↗</a><MessageControls id={message.id} isRead={message.is_read} /></div>
    </details>)}</div>
    {messages.data.length === 0 && <div className="rounded-2xl border border-dashed border-[var(--border-color)] p-12 text-center"><Mail size={28} className="mx-auto text-[var(--accent)]" /><h2 className="mt-4 text-lg font-semibold">{status === "unread" ? "All caught up." : "No messages here yet."}</h2><p className="mt-3 text-sm leading-6 text-[var(--secondary-text)]">Messages sent through your contact form will appear in this inbox.</p></div>}
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--secondary-text)]"><p>Page {page} of {pages} · Times shown in Tbilisi</p><nav aria-label="Message pages" className="flex gap-4">{page > 1 && <Link href={`/admin/messages?status=${status}&page=${page - 1}`} className="font-semibold text-[var(--accent)]">← Previous</Link>}{page < pages && <Link href={`/admin/messages?status=${status}&page=${page + 1}`} className="font-semibold text-[var(--accent)]">Next →</Link>}</nav></div>
  </>;
}

export default function MessagesPage({ searchParams }: { searchParams: Promise<InboxParams> }) {
  return <main id="main-content" tabIndex={-1} className="mx-auto max-w-[1200px] px-5 py-8 md:px-8 md:py-10 lg:px-10"><div className="mb-8 flex flex-wrap items-start justify-between gap-5"><div><p className="text-xs text-[var(--secondary-text)]">Contact form submissions</p><h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Inbox</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[var(--secondary-text)]">Open a message to read it. Mark it as read when you have reviewed it.</p></div><RefreshInbox /></div><Suspense fallback={<p role="status">Loading messages…</p>}><Inbox searchParams={searchParams} /></Suspense></main>;
}

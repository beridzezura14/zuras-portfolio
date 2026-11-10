"use client";

import { useActionState, useState } from "react";
import type { StoryContent } from "@/lib/content/story-validation";
import { saveStory } from "./actions";

const inputClass = "mt-2 w-full rounded-xl border border-[var(--border-color)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-border)]";
const toDraft = (data: StoryContent) => ({ ...data, chapters: data.chapters.map(({ paragraphs, ...chapter }) => ({ ...chapter, body: paragraphs.join("\n\n") })) });
const toPayload = (data: ReturnType<typeof toDraft>) => JSON.stringify({ title: data.title, subtitle: data.subtitle, chapters: data.chapters.map(({ body, ...chapter }) => ({ ...chapter, paragraphs: body.split(/\n\s*\n/).map(value => value.trim()).filter(Boolean) })) });

export default function StoryEditor({ initialData }: { initialData: StoryContent }) {
  const [data, setData] = useState(() => toDraft(initialData));
  const [state, action, pending] = useActionState(saveStory, {});
  const payload = toPayload(data);
  const saved = state.saved === payload;
  const changed = state.saved ? !saved : payload !== toPayload(toDraft(initialData));
  function updateChapter(index: number, patch: Partial<(typeof data.chapters)[number]>) {
    setData(previous => ({ ...previous, chapters: previous.chapters.map((chapter, i) => i === index ? { ...chapter, ...patch } : chapter) }));
  }
  function moveChapter(index: number, direction: number) {
    setData(previous => {
      const chapters = [...previous.chapters];
      const target = index + direction;
      if (target < 0 || target >= chapters.length) return previous;
      [chapters[index], chapters[target]] = [chapters[target], chapters[index]];
      return { ...previous, chapters };
    });
  }
  return <form action={action}>
    <input type="hidden" name="content" value={payload} />
    <fieldset disabled={pending} className="space-y-6 disabled:opacity-70">
      <section className="space-y-5 rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-5 md:p-8">
        <h2 className="text-xl font-semibold tracking-tight">Page introduction</h2>
        <label className="block text-sm font-medium">Page title<input className={inputClass} value={data.title} onChange={event => setData(previous => ({ ...previous, title: event.target.value }))} maxLength={150} required /></label>
        <label className="block text-sm font-medium">Subtitle<textarea className={inputClass} rows={3} value={data.subtitle} onChange={event => setData(previous => ({ ...previous, subtitle: event.target.value }))} maxLength={1000} required /></label>
        <p className="text-xs leading-6 text-[var(--secondary-text)]">Your name, role and location come from the <a href="/admin/about" className="text-[var(--accent)] underline">About editor</a>.</p>
      </section>
      <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-5 md:p-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-4"><h2 className="text-xl font-semibold tracking-tight">Chapters <span className="text-sm text-[var(--secondary-text)]">({data.chapters.length}/30)</span></h2>
          <button type="button" disabled={data.chapters.length >= 30} onClick={() => setData(previous => ({ ...previous, chapters: [...previous.chapters, { id: `chapter-${crypto.randomUUID()}`, title: "", body: "" }] }))} className="cursor-pointer rounded-full border border-[var(--accent-border)] px-4 py-2 text-xs font-semibold text-[var(--accent)] hover:bg-[var(--accent-soft)] disabled:opacity-40">+ Add chapter</button>
        </div>
        <p className="mb-7 text-xs leading-6 text-[var(--secondary-text)]">Separate paragraphs with a blank line. Wrap a whole paragraph in **double asterisks** to display it as a highlighted quote. Chapter titles also appear in the page navigation.</p>
        <div className="space-y-6">{data.chapters.map((chapter, index) => <section key={chapter.id} className="min-w-0 rounded-xl border border-[var(--border-color)] p-4 md:p-6" aria-label={`Chapter ${index + 1}`}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h3 className="text-sm font-semibold">Chapter {String(index + 1).padStart(2, "0")}</h3><div className="flex items-center gap-3 text-xs">
            <button type="button" disabled={index === 0} onClick={() => moveChapter(index, -1)} aria-label={`Move chapter ${index + 1} up`} className="cursor-pointer p-2 disabled:opacity-25">↑</button>
            <button type="button" disabled={index === data.chapters.length - 1} onClick={() => moveChapter(index, 1)} aria-label={`Move chapter ${index + 1} down`} className="cursor-pointer p-2 disabled:opacity-25">↓</button>
            <button type="button" disabled={data.chapters.length <= 1} onClick={() => setData(previous => ({ ...previous, chapters: previous.chapters.filter(item => item.id !== chapter.id) }))} aria-label={`Remove chapter ${index + 1}`} className="cursor-pointer rounded-lg px-2 py-2 text-red-500 hover:bg-red-500/10 disabled:opacity-25">Remove</button>
          </div></div>
          <label className="block text-sm font-medium">Chapter title<input className={inputClass} value={chapter.title} onChange={event => updateChapter(index, { title: event.target.value })} maxLength={250} required /></label>
          <label className="mt-5 block text-sm font-medium">Chapter text<textarea className={`${inputClass} min-h-72 leading-7`} rows={12} value={chapter.body} onChange={event => updateChapter(index, { body: event.target.value })} maxLength={180000} required /></label>
        </section>)}</div>
      </section>
    </fieldset>
    <div className="sticky bottom-4 z-10 mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-4 shadow-lg md:p-5">
      <div aria-live="polite" className="min-w-0 text-sm">{pending ? "Saving…" : state.error ? <p role="alert" className="text-red-500">{state.error}</p> : saved ? <p className="text-[var(--accent)]">Saved. Your story is live.</p> : changed ? "You have unsaved changes." : "Ready to edit."}</div>
      <button type="submit" disabled={pending || !changed} className="cursor-pointer rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-on)] disabled:cursor-not-allowed disabled:opacity-50">{pending ? "Saving…" : "Save changes"}</button>
    </div>
  </form>;
}

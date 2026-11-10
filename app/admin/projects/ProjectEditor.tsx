"use client";

import { useActionState, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ImagePlus, Trash2 } from "lucide-react";
import type { ProjectContent } from "@/lib/content/project-validation";
import { deleteProject, saveProject } from "./actions";

const inputClass = "mt-2 w-full rounded-xl border border-[var(--border-color)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-border)]";
function Field({ label, value, onChange, multiline = false, type = "text", max = 2048, required = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; type?: string; max?: number; required?: boolean }) {
  return <label className="block min-w-0 text-sm font-medium">{label}{multiline ? <textarea className={inputClass} value={value} onChange={event => onChange(event.target.value)} rows={5} maxLength={max} required={required} /> : <input className={inputClass} type={type} value={value} onChange={event => onChange(event.target.value)} maxLength={max} required={required} />}</label>;
}
function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="space-y-5 rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-5 md:p-7"><h2 className="text-lg font-semibold tracking-tight">{title}</h2>{children}</section>;
}
const lines = (value: string[]) => value.map(item => item.trim()).filter(Boolean);
function contentOf(data: ProjectContent): ProjectContent {
  return { slug: data.slug, title: data.title, category: data.category, year: data.year, shortDescription: data.shortDescription, fullDescription: data.fullDescription, coverImage: data.coverImage, gallery: data.gallery, technologies: data.technologies, features: data.features, liveUrl: data.liveUrl, githubUrl: data.githubUrl, featured: data.featured, published: data.published, sortOrder: data.sortOrder };
}
const toPayload = (data: ProjectContent) => JSON.stringify({ ...contentOf(data), technologies: lines(data.technologies), features: lines(data.features) });

function DeleteProject({ id, title, disabled }: { id: string; title: string; disabled: boolean }) {
  const [confirm, setConfirm] = useState(false);
  const [state, action, pending] = useActionState(deleteProject, {});
  return <section className="mt-8 rounded-2xl border border-red-500/20 p-5"><h2 className="text-sm font-semibold">Delete project</h2><p className="mt-2 text-xs leading-6 text-[var(--secondary-text)]">Permanently remove this project and its public page.</p>
    {!confirm ? <button type="button" disabled={disabled} onClick={() => setConfirm(true)} className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-500/25 px-4 py-2.5 text-xs font-semibold text-red-500 disabled:opacity-40"><Trash2 size={14} />Delete project</button> : <form action={action} className="mt-4"><input type="hidden" name="id" value={id} /><p className="mb-4 break-words text-sm">Delete “{title}”? This cannot be undone.</p><div className="flex flex-wrap gap-3"><button type="submit" disabled={pending || disabled} className="cursor-pointer rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-40">{pending ? "Deleting…" : "Yes, delete project"}</button><button type="button" disabled={pending} onClick={() => setConfirm(false)} className="cursor-pointer rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-xs">Cancel</button></div>{state.error && <p role="alert" className="mt-3 text-sm text-red-500">{state.error}</p>}</form>}
  </section>;
}

export default function ProjectEditor({ initialData, id = "" }: { initialData: ProjectContent; id?: string }) {
  const [data, setData] = useState<ProjectContent>(() => contentOf(initialData));
  const [state, action, pending] = useActionState(saveProject, {});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [slugTouched, setSlugTouched] = useState(Boolean(id));
  const payload = toPayload(data);
  // Ignore the database-only ID when comparing an existing project with the form.
  const initialPayload = toPayload(initialData);
  const saved = state.saved === payload;
  const changed = !id || (state.saved ? !saved : payload !== initialPayload);
  function set<K extends keyof ProjectContent>(key: K, value: ProjectContent[K]) { setData(previous => ({ ...previous, [key]: value })); }
  async function upload(event: ChangeEvent<HTMLInputElement>, gallery: boolean) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    if (gallery && data.gallery.length + files.length > 24) { setUploadError("The gallery can contain up to 24 images."); return; }
    setUploading(true); setUploadError("");
    try {
      for (const file of files) {
        if (!file.size || file.size > 5 * 1024 * 1024 || !["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"].includes(file.type)) throw new Error("Choose JPG, PNG, WebP, AVIF or GIF images up to 5 MB each.");
        const form = new FormData(); form.set("file", file);
        const response = await fetch("/api/admin/projects/upload", { method: "POST", body: form });
        if (response.redirected) throw new Error("Your session expired. Sign in again before uploading.");
        const result = await response.json();
        if (!response.ok || typeof result.url !== "string") throw new Error(result.error || "Image upload failed.");
        setData(previous => ({ ...previous, ...(gallery ? { gallery: [...previous.gallery, result.url] } : { coverImage: result.url }) }));
      }
    } catch (error) { setUploadError(error instanceof Error ? error.message : "Unable to upload. Please try again."); }
    finally { setUploading(false); }
  }
  return <>
    <form action={action}>
      <input type="hidden" name="id" value={id} /><input type="hidden" name="content" value={payload} />
      <fieldset disabled={pending || uploading} className="space-y-6 disabled:opacity-70">
        <Section title="Project details">
          <Field label="Project title" value={data.title} max={200} required onChange={title => setData(previous => ({ ...previous, title, ...(!slugTouched ? { slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") } : {}) }))} />
          <Field label="URL slug" value={data.slug} max={200} required onChange={value => { setSlugTouched(true); set("slug", value); }} />
          <p className="-mt-3 break-all text-xs leading-6 text-[var(--secondary-text)]">Page address: /projects/{data.slug || "your-project"}. Use lowercase English letters, numbers and hyphens.</p>
          <div className="grid gap-5 sm:grid-cols-2"><Field label="Category" value={data.category} max={120} onChange={value => set("category", value)} /><label className="block text-sm font-medium">Year<input type="number" min={1900} max={9999} required className={inputClass} value={Number.isNaN(data.year) ? "" : data.year} onChange={event => set("year", event.target.valueAsNumber)} /></label></div>
          <Field label="Short description" multiline value={data.shortDescription} max={1000} onChange={value => set("shortDescription", value)} />
          <Field label="Full description" multiline value={data.fullDescription} max={20000} onChange={value => set("fullDescription", value)} />
        </Section>
        <Section title="Images">
          <p className="text-xs leading-6 text-[var(--secondary-text)]">JPG, PNG, WebP, AVIF or GIF. Maximum 5 MB per image. The cover appears in the project list and at the top of its page.</p>
          {data.coverImage ? <div className="overflow-hidden rounded-xl border border-[var(--border-color)]"><div className="relative aspect-video bg-[var(--surface-muted)]"><Image src={data.coverImage} alt="Project cover preview" fill sizes="(max-width: 1024px) 90vw, 850px" className="object-contain" /></div><div className="flex items-center justify-between gap-3 px-4 py-3"><span className="text-xs font-medium">Cover image</span><button type="button" onClick={() => set("coverImage", "")} className="cursor-pointer text-xs text-red-500">Remove cover</button></div></div> : <div className="rounded-xl border border-dashed border-[var(--border-color)] p-8 text-center text-sm text-[var(--secondary-text)]"><ImagePlus size={24} className="mx-auto mb-3" />No cover image yet</div>}
          <label className="block text-sm font-medium">{data.coverImage ? "Replace cover" : "Upload cover"}<input aria-label="Upload cover image" type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/gif" onChange={event => void upload(event, false)} className={`${inputClass} file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[var(--accent-soft)] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[var(--accent)]`} /></label>
          <div className="border-t border-[var(--border-color)] pt-5"><h3 className="text-sm font-semibold">Gallery ({data.gallery.length}/24)</h3><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{data.gallery.map((url, index) => <div key={`${url}-${index}`} className="overflow-hidden rounded-xl border border-[var(--border-color)]"><div className="relative aspect-video"><Image src={url} alt={`Gallery preview ${index + 1}`} fill sizes="300px" className="object-cover" /></div><div className="flex items-center justify-between p-2 text-xs"><div><button type="button" disabled={index === 0} aria-label={`Move gallery image ${index + 1} left`} className="cursor-pointer p-2 disabled:opacity-30" onClick={() => { const gallery = [...data.gallery]; [gallery[index - 1], gallery[index]] = [gallery[index], gallery[index - 1]]; set("gallery", gallery); }}>←</button><button type="button" disabled={index === data.gallery.length - 1} aria-label={`Move gallery image ${index + 1} right`} className="cursor-pointer p-2 disabled:opacity-30" onClick={() => { const gallery = [...data.gallery]; [gallery[index], gallery[index + 1]] = [gallery[index + 1], gallery[index]]; set("gallery", gallery); }}>→</button></div><button type="button" aria-label={`Remove gallery image ${index + 1}`} onClick={() => set("gallery", data.gallery.filter((_, i) => i !== index))} className="cursor-pointer p-2 text-red-500">Remove</button></div></div>)}</div><label className="mt-4 block text-sm font-medium">Add gallery images<input aria-label="Upload gallery images" type="file" multiple accept="image/png,image/jpeg,image/webp,image/avif,image/gif" onChange={event => void upload(event, true)} className={inputClass} /></label></div>
        </Section>
        <Section title="Technologies & features"><Field label="Technologies — one per line" multiline value={data.technologies.join("\n")} max={10000} onChange={value => set("technologies", value.split("\n"))} /><Field label="Key features — one per line" multiline value={data.features.join("\n")} max={100000} onChange={value => set("features", value.split("\n"))} /></Section>
        <Section title="Links"><Field label="Live website URL" type="url" value={data.liveUrl} onChange={value => set("liveUrl", value)} /><Field label="GitHub URL (optional)" type="url" value={data.githubUrl ?? ""} onChange={value => set("githubUrl", value || null)} /><p className="text-xs text-[var(--secondary-text)]">Use full HTTPS links. Leave a link blank to hide its button.</p></Section>
        <Section title="Visibility & order">
          <label className="flex items-start gap-3 rounded-xl border border-[var(--border-color)] p-4"><input type="checkbox" className="mt-1 accent-[var(--accent)]" checked={data.published} onChange={event => set("published", event.target.checked)} /><span><span className="block text-sm font-semibold">Published</span><span className="mt-1 block text-xs leading-6 text-[var(--secondary-text)]">Show this project in the public portfolio. Uncheck to keep it as a private draft.</span></span></label>
          <label className="flex items-start gap-3 rounded-xl border border-[var(--border-color)] p-4"><input type="checkbox" className="mt-1 accent-[var(--accent)]" checked={data.featured} onChange={event => set("featured", event.target.checked)} /><span><span className="block text-sm font-semibold">Featured on homepage</span><span className="mt-1 block text-xs leading-6 text-[var(--secondary-text)]">Show in Selected Work when published. The first four featured projects appear, by display order.</span></span></label>
          <label className="block max-w-xs text-sm font-medium">Display order<input type="number" className={inputClass} min={0} max={2147483647} required value={Number.isNaN(data.sortOrder) ? "" : data.sortOrder} onChange={event => set("sortOrder", event.target.valueAsNumber)} /></label><p className="text-xs text-[var(--secondary-text)]">Lower numbers appear first. Changes take effect when you save.</p>
        </Section>
      </fieldset>
      <div className="sticky bottom-4 z-10 mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-4 shadow-lg">
        <div aria-live="polite" className="min-w-0 text-sm">{uploading ? "Uploading images…" : pending ? "Saving…" : uploadError ? <p role="alert" className="text-red-500">{uploadError}</p> : state.error ? <p role="alert" className="text-red-500">{state.error}</p> : saved ? "Saved. Project updated." : changed ? "You have unsaved changes." : "Ready to edit."}</div><div className="flex flex-wrap items-center gap-3">{id && initialData.published && <Link href={`/projects/${initialData.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[var(--accent)]">View page<ArrowUpRight size={14} /></Link>}<button type="submit" disabled={pending || uploading || !changed} className="cursor-pointer rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-on)] disabled:cursor-not-allowed disabled:opacity-40">{pending ? "Saving…" : id ? "Save changes" : "Create project"}</button></div>
      </div>
    </form>
    {id && <DeleteProject id={id} title={initialData.title} disabled={pending || uploading} />}
  </>;
}

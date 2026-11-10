"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, FolderOpen, Pencil, Search } from "lucide-react";
import type { ManagedProject } from "@/lib/content/project-validation";

export default function ProjectsList({ projects }: { projects: ManagedProject[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const visible = projects.filter(project => (filter === "all" || (filter === "published" ? project.published : !project.published)) && `${project.title} ${project.category} ${project.slug}`.toLowerCase().includes(query.toLowerCase()));
  return <>
    <div className="mb-6 grid grid-cols-3 gap-3">{[{ label: "All projects", count: projects.length }, { label: "Published", count: projects.filter(project => project.published).length }, { label: "Drafts", count: projects.filter(project => !project.published).length }].map(item => <div key={item.label} className="rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-4 md:p-5"><p className="text-xs text-[var(--secondary-text)]">{item.label}</p><p className="mt-3 text-2xl font-semibold">{item.count}</p></div>)}</div>
    <div className="mb-5 flex flex-wrap gap-3"><label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--background)] px-4"><Search size={17} className="shrink-0 text-[var(--secondary-text)]" /><input aria-label="Search projects" type="search" placeholder="Search projects…" value={query} onChange={event => setQuery(event.target.value)} className="w-full min-w-0 bg-transparent py-3 text-sm outline-none" /></label><select aria-label="Filter projects by status" value={filter} onChange={event => setFilter(event.target.value)} className="rounded-xl border border-[var(--border-color)] bg-[var(--background)] px-4 py-3 text-sm"><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Drafts</option></select></div>
    <div className="space-y-3">{visible.map(project => <article key={project.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--background)] p-4 md:p-5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><FolderOpen size={22} /></span>
      <div className="min-w-0 flex-1 basis-40"><Link href={`/admin/projects/${project.id}`} className="break-words text-base font-semibold hover:text-[var(--accent)]">{project.title}</Link><p className="mt-1 break-words text-xs text-[var(--secondary-text)]">{project.category || "Uncategorized"} · {project.year} · Order {project.sortOrder}</p><p className="mt-1 break-all text-[11px] text-[var(--text-muted)]">/projects/{project.slug}</p></div>
      <div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${project.published ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "bg-[var(--surface-muted)] text-[var(--secondary-text)]"}`}>{project.published ? "Published" : "Draft"}</span>{project.featured && <span className="rounded-full border border-[var(--accent-border)] px-3 py-1.5 text-[10px]">Featured</span>}</div>
      <div className="flex items-center gap-2">{project.published && <Link href={`/projects/${project.slug}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title}`} className="rounded-xl border border-[var(--border-color)] p-3 hover:text-[var(--accent)]"><ArrowUpRight size={16} /></Link>}<Link href={`/admin/projects/${project.id}`} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] px-4 py-3 text-xs font-semibold hover:border-[var(--accent)]"><Pencil size={14} />Edit</Link></div>
    </article>)}</div>
    {!visible.length && <div className="rounded-2xl border border-dashed border-[var(--border-color)] p-12 text-center"><FolderOpen size={26} className="mx-auto text-[var(--accent)]" /><p className="mt-4 text-sm">{projects.length ? "No projects match your search." : "Your first project starts here."}</p>{projects.length === 0 && <Link href="/admin/projects/new" className="mt-4 inline-block text-sm font-semibold text-[var(--accent)]">Add a project →</Link>}</div>}
    <p className="mt-5 text-xs text-[var(--secondary-text)]">Showing {visible.length} of {projects.length} projects. Lower display order appears first.</p>
  </>;
}

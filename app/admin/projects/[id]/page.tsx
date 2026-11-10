import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { isProjectId, projectFromRow } from "@/lib/content/project-validation";
import ProjectEditor from "../ProjectEditor";

// Private IDs are resolved after authentication, rather than during prerendering.
export const instant = false;

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!isProjectId(id)) notFound();
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error("Unable to load this project.");
  if (!data) notFound();
  return <ProjectEditor key={id} id={id} initialData={projectFromRow(data, getSupabaseConfig().url)} />;
}
export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  return <main id="main-content" tabIndex={-1} className="mx-auto max-w-[1100px] px-5 py-8 md:px-8 md:py-10 lg:px-10"><Link href="/admin/projects" className="text-xs text-[var(--secondary-text)] hover:text-[var(--accent)]">← All projects</Link><h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">Edit project</h1><p className="mt-3 mb-8 text-sm text-[var(--secondary-text)]">Update the project page, images and publication settings.</p><Suspense fallback={<p role="status">Loading project editor…</p>}><Content params={params} /></Suspense></main>;
}

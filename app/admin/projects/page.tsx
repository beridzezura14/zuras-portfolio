import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/supabase/admin";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { projectFromRow, type ManagedProject } from "@/lib/content/project-validation";
import ProjectsList from "./ProjectsList";

async function Content() {
  const { supabase } = await requireAdmin();
  const projects: ManagedProject[] = [];
  for (let offset = 0; ; offset += 100) {
    const { data, error } = await supabase.from("projects").select("*").order("sort_order").order("created_at", { ascending: false }).order("id").range(offset, offset + 99);
    if (error) throw new Error("Unable to load projects.");
    projects.push(...data.map(row => projectFromRow(row, getSupabaseConfig().url)));
    if (data.length < 100) break;
  }
  return <ProjectsList projects={projects} />;
}
export default function AdminProjectsPage() {
  return <main id="main-content" tabIndex={-1} className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 md:py-10 lg:px-10">
    <div className="mb-8 flex flex-wrap items-start justify-between gap-5"><div><p className="text-xs text-[var(--secondary-text)]">Your project collection</p><h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Projects</h1><p className="mt-3 text-sm leading-6 text-[var(--secondary-text)]">Manage project pages and choose what appears in your portfolio.</p></div><Link href="/admin/projects/new" className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-on)]"><Plus size={17} />Add project</Link></div>
    <Suspense fallback={<p role="status">Loading projects…</p>}><Content /></Suspense>
  </main>;
}

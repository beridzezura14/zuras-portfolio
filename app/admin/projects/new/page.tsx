import { Suspense } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import ProjectEditor from "../ProjectEditor";

async function Content() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("projects").select("sort_order").order("sort_order", { ascending: false }).limit(1);
  if (error) throw new Error("Unable to prepare a new project.");
  return <ProjectEditor initialData={{ slug: "", title: "", category: "", year: new Date().getFullYear(), shortDescription: "", fullDescription: "", coverImage: "", gallery: [], technologies: [], features: [], liveUrl: "", githubUrl: null, featured: false, published: false, sortOrder: Math.min(2147483647, (data[0]?.sort_order ?? -1) + 1) }} />;
}
export default function NewProjectPage() {
  return <main id="main-content" tabIndex={-1} className="mx-auto max-w-[1100px] px-5 py-8 md:px-8 md:py-10 lg:px-10"><Link href="/admin/projects" className="text-xs text-[var(--secondary-text)] hover:text-[var(--accent)]">← All projects</Link><h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">Add project</h1><p className="mt-3 mb-8 text-sm text-[var(--secondary-text)]">Start with a draft. Publish when your project is ready.</p><Suspense fallback={<p role="status">Preparing project editor…</p>}><Content /></Suspense></main>;
}

import { Suspense } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { validateAbout } from "@/lib/content/about-validation";
import AboutEditor from "./AboutEditor";

async function Content() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("site_content").select("content").eq("key", "about").single();
  if (error || !data) throw new Error("Unable to load About. Check your database setup.");
  return <AboutEditor initialData={validateAbout(data.content)} />;
}
export default function AboutAdminPage() {
  return <main id="main-content" tabIndex={-1} className="mx-auto max-w-[1100px] px-5 py-8 md:px-8 md:py-10 lg:px-10">
    <div className="mb-10 flex flex-wrap justify-between gap-4 text-sm"><Link href="/admin" className="text-[var(--secondary-text)] hover:text-[var(--accent)]">← Dashboard</Link><Link href="/#about" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)]">View About ↗</Link></div>
    <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Edit About.</h1>
    <p className="mt-4 mb-10 text-sm leading-7 text-[var(--secondary-text)]">Update the About section on your homepage. Save your changes to publish them.</p>
    <nav aria-label="About editor sections" className="mb-6 flex flex-wrap gap-2">{["Profile", "Experience", "Education", "Skills", "Languages"].map(title => <a key={title} href={`#edit-${title.toLowerCase()}`} className="rounded-full border border-[var(--border-color)] bg-[var(--background)] px-4 py-2 text-xs font-medium hover:border-[var(--accent)] hover:text-[var(--accent)]">{title}</a>)}</nav>
    <Suspense fallback={<p role="status">Loading About editor…</p>}><Content /></Suspense>
  </main>;
}

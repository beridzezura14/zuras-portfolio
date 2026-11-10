import { Suspense } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { validateStory } from "@/lib/content/story-validation";
import StoryEditor from "./StoryEditor";

async function Content() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("site_content").select("content").eq("key", "story").single();
  if (error || !data) throw new Error("Unable to load My Story. Check your database setup.");
  return <StoryEditor initialData={validateStory(data.content)} />;
}

export default function StoryAdminPage() {
  return <main id="main-content" tabIndex={-1} className="mx-auto max-w-[1100px] px-5 py-8 md:px-8 md:py-10 lg:px-10">
    <div className="mb-10 flex flex-wrap justify-between gap-4 text-sm"><Link href="/admin" className="text-[var(--secondary-text)] hover:text-[var(--accent)]">← Dashboard</Link><Link href="/about" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)]">View My Story ↗</Link></div>
    <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Edit My Story.</h1>
    <p className="mt-4 mb-10 text-sm leading-7 text-[var(--secondary-text)]">Edit the page opened by More About Me. Save your changes to publish them.</p>
    <Suspense fallback={<p role="status">Loading My Story editor…</p>}><Content /></Suspense>
  </main>;
}

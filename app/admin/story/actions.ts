"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { validateStory } from "@/lib/content/story-validation";

export type SaveStoryState = { error?: string; saved?: string };

export async function saveStory(_previous: SaveStoryState, formData: FormData): Promise<SaveStoryState> {
  const { supabase } = await requireAdmin();
  const raw = formData.get("content");
  if (typeof raw !== "string" || raw.length > 200000) return { error: "Story content is too large or missing." };
  let content;
  try { content = validateStory(JSON.parse(raw)); }
  catch (error) { return { error: error instanceof SyntaxError ? "Invalid form data. Please reload and try again." : error instanceof Error ? error.message : "Check your story fields." }; }
  const { error } = await supabase.from("site_content").update({ content }).eq("key", "story").select("key").single();
  if (error) return { error: "Unable to save My Story. Please try again." };
  updateTag("portfolio-story");
  revalidatePath("/about");
  revalidatePath("/admin/story");
  return { saved: raw };
}

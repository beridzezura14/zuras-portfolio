"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { validateAbout } from "@/lib/content/about-validation";

export type SaveAboutState = { error?: string; saved?: string };

export async function saveAbout(_previous: SaveAboutState, formData: FormData): Promise<SaveAboutState> {
  const { supabase } = await requireAdmin();
  const raw = formData.get("content");
  if (typeof raw !== "string" || raw.length > 200000) return { error: "About content is too large or missing." };
  let content;
  try { content = validateAbout(JSON.parse(raw)); }
  catch (error) { return { error: error instanceof SyntaxError ? "Invalid form data. Please reload and try again." : error instanceof Error ? error.message : "Check your form fields." }; }
  // Contact details have their own editor; preserve the existing values here.
  const { data: current, error: readError } = await supabase.from("site_content").select("content").eq("key", "about").single();
  if (readError || !current) return { error: "Unable to load the current About content. Please try again." };
  content.email = current.content.email;
  content.phone = current.content.phone;
  const { error } = await supabase.from("site_content").update({ content }).eq("key", "about").select("key").single();
  if (error) return { error: "Unable to save About. Please try again." };
  updateTag("portfolio-about");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/about");
  return { saved: raw };
}

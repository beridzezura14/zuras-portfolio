"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { isProjectId, projectToRow, validateProject } from "@/lib/content/project-validation";

export type ProjectActionState = { error?: string; saved?: string };
function refreshProjects() {
  updateTag("portfolio-projects");
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/admin");
  revalidatePath("/admin/projects", "layout");
}
export async function saveProject(_previous: ProjectActionState, formData: FormData): Promise<ProjectActionState> {
  const { supabase } = await requireAdmin();
  const id = formData.get("id");
  if (id !== "" && !isProjectId(id)) return { error: "Invalid project ID." };
  const raw = formData.get("content");
  if (typeof raw !== "string" || raw.length > 150000) return { error: "Project content is too large or missing." };
  let content;
  try { content = validateProject(JSON.parse(raw), getSupabaseConfig().url); }
  catch (error) { return { error: error instanceof SyntaxError ? "Invalid form data. Please reload and try again." : error instanceof Error ? error.message : "Check the project fields." }; }
  const row = projectToRow(content);
  const query = id ? supabase.from("projects").update(row).eq("id", id) : supabase.from("projects").insert(row);
  const { data, error } = await query.select("id").single();
  if (error || !data) return { error: error?.code === "23505" ? "This URL slug is already used by another project. Choose a different one." : "Unable to save the project. Please try again." };
  refreshProjects();
  if (!id) redirect(`/admin/projects/${data.id}`);
  return { saved: raw };
}
export async function deleteProject(_previous: ProjectActionState, formData: FormData): Promise<ProjectActionState> {
  const { supabase } = await requireAdmin();
  const id = formData.get("id");
  if (!isProjectId(id)) return { error: "Invalid project ID." };
  const { error } = await supabase.from("projects").delete().eq("id", id).select("id").single();
  if (error) return { error: "Unable to delete this project. Please try again." };
  refreshProjects();
  redirect("/admin/projects");
}

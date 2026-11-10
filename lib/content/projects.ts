import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { projectsData } from "@/app/data/projects";
import { getSupabaseConfig, hasSupabaseConfig } from "@/lib/supabase/config";
import { projectFromRow } from "./project-validation";

export async function getPublishedProjects() {
  "use cache";
  cacheLife("hours");
  cacheTag("portfolio-projects");
  if (!hasSupabaseConfig()) return projectsData.filter(project => project.published);
  const { url, key } = getSupabaseConfig();
  const projects = [];
  // Read every page instead of silently dropping records at PostgREST's row limit.
  for (let offset = 0; ; offset += 100) {
    const response = await fetch(`${url}/rest/v1/projects?select=*&published=eq.true&order=sort_order.asc,created_at.desc,id.asc&limit=100&offset=${offset}`, { headers: { apikey: key }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error("Unable to load projects.");
    const rows = await response.json();
    if (!Array.isArray(rows)) throw new Error("Invalid projects response.");
    projects.push(...rows.map(row => projectFromRow(row, url)));
    if (rows.length < 100) return projects;
  }
}

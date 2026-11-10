import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { aboutData } from "@/app/data/about";
import { getSupabaseConfig, hasSupabaseConfig } from "@/lib/supabase/config";
import { validateAbout } from "./about-validation";

export async function getAboutContent() {
  "use cache";
  cacheLife("hours");
  cacheTag("portfolio-about");
  if (!hasSupabaseConfig()) return aboutData;
  const { url, key } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/site_content?key=eq.about&select=content`, {
    headers: { apikey: key },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("Unable to load About content.");
  const rows = await response.json();
  if (!Array.isArray(rows) || !rows[0]?.content) throw new Error("About content is missing. Check the database setup.");
  return validateAbout(rows[0].content);
}

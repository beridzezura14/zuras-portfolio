import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { storyChapters } from "@/app/data/story";
import { getSupabaseConfig, hasSupabaseConfig } from "@/lib/supabase/config";
import { validateStory } from "./story-validation";

export async function getStoryContent() {
  "use cache";
  cacheLife("hours");
  cacheTag("portfolio-story");
  if (!hasSupabaseConfig()) return validateStory({ title: "My Story.", subtitle: "Not a straight path, but one worth taking.", chapters: storyChapters });
  const { url, key } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/site_content?key=eq.story&select=content`, {
    headers: { apikey: key }, signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("Unable to load My Story content.");
  const rows = await response.json();
  if (!Array.isArray(rows) || !rows[0]?.content) throw new Error("My Story content is missing. Check the database setup.");
  return validateStory(rows[0].content);
}

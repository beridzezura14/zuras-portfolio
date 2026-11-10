import { readFile, writeFile } from "node:fs/promises";
import { aboutData } from "../app/data/about.ts";
import { projectsData } from "../app/data/projects.ts";
import { storyChapters } from "../app/data/story.ts";

function sqlJson(value) {
  const json = JSON.stringify(value, null, 2);
  let tag = "$portfolio_seed$";
  while (json.includes(tag)) tag = tag.replace(/\$$/, "_$");
  return `${tag}\n${json}\n${tag}::jsonb`;
}

const contact = {
  email: aboutData.email,
  phone: aboutData.phone,
  phoneLink: aboutData.phone.replace(/[^+\d]/g, ""),
  whatsapp: `https://wa.me/${aboutData.phone.replace(/\D/g, "")}`,
  github: aboutData.socialLinks.github,
  linkedin: aboutData.socialLinks.linkedin,
  location: aboutData.location,
  availability: "Open to opportunities",
};
const story = {
  title: "My Story.",
  subtitle: "Not a straight path, but one worth taking.",
  chapters: storyChapters,
};
const projects = projectsData.map((project, index) => ({
  slug: project.slug,
  title: project.title,
  category: project.category,
  year: project.year,
  short_description: project.shortDescription,
  full_description: project.fullDescription,
  cover_image: project.coverImage,
  gallery: project.gallery,
  technologies: project.technologies,
  features: project.features,
  live_url: project.liveUrl,
  github_url: project.githubUrl,
  featured: project.featured,
  published: project.published,
  sort_order: index,
}));

const schema = await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8");
const seed = `
-- Seed current public content. Re-running never overwrites existing edits.
insert into public.site_content (key, content) values
  ('about', ${sqlJson(aboutData)}),
  ('story', ${sqlJson(story)}),
  ('contact', ${sqlJson(contact)})
on conflict (key) do nothing;

insert into public.projects (
  slug, title, category, year, short_description, full_description,
  cover_image, gallery, technologies, features, live_url, github_url,
  featured, published, sort_order
)
select
  slug, title, category, year, short_description, full_description,
  cover_image, gallery, technologies, features, live_url, github_url,
  featured, published, sort_order
from jsonb_to_recordset(${sqlJson(projects)}) as project (
  slug text, title text, category text, year integer,
  short_description text, full_description text, cover_image text,
  gallery text[], technologies text[], features text[], live_url text,
  github_url text, featured boolean, published boolean, sort_order integer
)
on conflict (slug) do nothing;

notify pgrst, 'reload schema';
`;
const hardening = (await readFile(new URL("../supabase/security-hardening.sql", import.meta.url), "utf8"))
  .replace(/^begin;\s*$/m, "").replace(/^commit;\s*$/m, "");
const sql = `-- Zura Portfolio: tables, policies, image bucket, and existing content.
-- Generated from supabase/schema.sql, supabase/security-hardening.sql and app/data/*.ts.
-- Paste this entire file into Supabase SQL Editor and click Run.
-- Does not create auth users or grant anyone admin access.
begin;
\n${schema}\n${hardening}\n${seed}\ncommit;\n`;
await writeFile(new URL("../supabase/setup.sql", import.meta.url), sql, "utf8");
console.log(`Created supabase/setup.sql: ${projects.length} projects, ${storyChapters.length} story chapters, About, and contact settings.`);

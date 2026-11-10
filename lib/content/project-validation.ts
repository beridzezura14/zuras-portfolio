import type { Project } from "@/app/data/projects";

export type ProjectContent = Omit<Project, "id"> & { sortOrder: number };
export type ManagedProject = Project & { sortOrder: number };
export const isProjectId = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

function text(value: unknown, label: string, max: number, required = false) {
  if (typeof value !== "string" || value.length > max || required && !value.trim()) throw new Error(`Check ${label} (maximum ${max} characters).`);
  return value.trim();
}
function link(value: unknown, label: string) {
  const result = text(value, label, 2048);
  if (result) {
    try { if (new URL(result).protocol !== "https:") throw new Error(); }
    catch { throw new Error(`Enter a valid HTTPS ${label}.`); }
  }
  return result;
}
function image(value: unknown, origin: string) {
  const result = text(value, "image", 2048);
  if (!result) return result;
  if (/^\/projects\/[a-z0-9/_-]+\.(png|jpe?g|webp|avif|gif)$/i.test(result)) return result;
  if (origin && !/[?#\s]/.test(result)) {
    try {
      const parsed = new URL(result);
      if (parsed.protocol === "https:" && parsed.origin === origin && !parsed.username && !parsed.password && parsed.pathname.startsWith("/storage/v1/object/public/portfolio-media/") && parsed.pathname.length > "/storage/v1/object/public/portfolio-media/".length) return result;
    } catch { /* Invalid URLs are rejected below. */ }
  }
  throw new Error("Use an uploaded image or an existing /projects/ image path.");
}
function list(value: unknown, label: string, max: number, mapper: (value: unknown) => string) {
  if (!Array.isArray(value) || value.length > max) throw new Error(`${label}: maximum ${max} items.`);
  return [...new Set(value.map(mapper))];
}
export function validateProject(value: unknown, storageOrigin = ""): ProjectContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid project content.");
  const data = value as Record<string, unknown>;
  const slug = text(data.slug, "URL slug", 200, true);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("URL slug must use lowercase English letters, numbers and single hyphens.");
  if (typeof data.year !== "number" || !Number.isInteger(data.year) || data.year < 1900 || data.year > 9999) throw new Error("Enter a year between 1900 and 9999.");
  if (typeof data.sortOrder !== "number" || !Number.isInteger(data.sortOrder) || data.sortOrder < 0 || data.sortOrder > 2147483647) throw new Error("Display order must be a whole number from 0 to 2147483647.");
  if (typeof data.featured !== "boolean" || typeof data.published !== "boolean") throw new Error("Invalid publication settings.");
  const coverImage = image(data.coverImage, storageOrigin);
  if (data.published && !coverImage) throw new Error("Add a cover image before publishing.");
  return {
    slug, title: text(data.title, "title", 200, true), category: text(data.category, "category", 120), year: data.year,
    shortDescription: text(data.shortDescription, "short description", 1000), fullDescription: text(data.fullDescription, "full description", 20000), coverImage,
    gallery: list(data.gallery, "Gallery", 24, value => { const result = image(value, storageOrigin); if (!result) throw new Error("Gallery images cannot be blank."); return result; }),
    technologies: list(data.technologies, "Technologies", 50, value => text(value, "technology", 150, true)),
    features: list(data.features, "Features", 100, value => text(value, "feature", 1000, true)),
    liveUrl: link(data.liveUrl, "website URL"), githubUrl: data.githubUrl === null ? null : link(data.githubUrl, "GitHub URL") || null,
    featured: data.featured, published: data.published, sortOrder: data.sortOrder,
  };
}
export function projectToRow(project: ProjectContent) {
  return { slug: project.slug, title: project.title, category: project.category, year: project.year, short_description: project.shortDescription, full_description: project.fullDescription, cover_image: project.coverImage, gallery: project.gallery, technologies: project.technologies, features: project.features, live_url: project.liveUrl, github_url: project.githubUrl, featured: project.featured, published: project.published, sort_order: project.sortOrder };
}
export function projectFromRow(row: Record<string, unknown>, origin: string): ManagedProject {
  if (!isProjectId(row.id)) throw new Error("Invalid project ID.");
  return { id: row.id, ...validateProject({ slug: row.slug, title: row.title, category: row.category, year: row.year, shortDescription: row.short_description, fullDescription: row.full_description, coverImage: row.cover_image, gallery: row.gallery, technologies: row.technologies, features: row.features, liveUrl: row.live_url, githubUrl: row.github_url, featured: row.featured, published: row.published, sortOrder: row.sort_order }, origin) };
}

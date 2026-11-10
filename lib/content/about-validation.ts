import type { AboutData } from "@/app/data/about";

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid About content.");
  return value as Record<string, unknown>;
}
function text(value: unknown, label: string, max = 500, optional = false): string {
  if (typeof value !== "string" || value.length > max || (!optional && !value.trim())) throw new Error(`Check ${label} (maximum ${max} characters).`);
  return value.trim();
}
function list(value: unknown, label: string): unknown[] {
  if (!Array.isArray(value) || value.length > 50) throw new Error(`${label} must contain at most 50 items.`);
  return value;
}
function id(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1) throw new Error("Invalid item ID.");
  return value;
}
function date(value: unknown, label: string): string {
  const result = text(value, label, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result) || !Number.isFinite(Date.parse(result)) || new Date(result).toISOString().slice(0, 10) !== result) throw new Error(`Check ${label}.`);
  return result;
}
function dates(start: unknown, end: unknown, label: string) {
  const startDate = date(start, `${label} start date`);
  const endDate = end === null ? null : date(end, `${label} end date`);
  if (endDate && endDate < startDate) throw new Error(`${label}: end date must follow start date.`);
  return { startDate, endDate };
}
function url(value: unknown, label: string) {
  const result = text(value, label, 2048, true);
  if (result) {
    let parsed: URL;
    try { parsed = new URL(result); } catch { throw new Error(`Enter a valid HTTPS ${label} URL.`); }
    if (parsed.protocol !== "https:") throw new Error(`Enter a valid HTTPS ${label} URL.`);
  }
  return result;
}
export function validateAbout(value: unknown): AboutData {
  const data = object(value);
  const social = object(data.socialLinks);
  const result: AboutData = {
    name: text(data.name, "name", 150), title: text(data.title, "title", 250), location: text(data.location, "location", 250),
    email: text(data.email, "email", 254), phone: text(data.phone, "phone", 80),
    introduction: text(data.introduction, "introduction", 2000), description: text(data.description, "description", 10000),
    socialLinks: { github: url(social.github, "GitHub"), linkedin: url(social.linkedin, "LinkedIn") },
    experience: list(data.experience, "Experience").map(value => {
      const item = object(value);
      return { id: id(item.id), position: text(item.position, "position"), company: text(item.company, "company"), ...dates(item.startDate, item.endDate, "Experience"), description: list(item.description, "Responsibilities").map(value => text(value, "responsibility", 2000)) };
    }),
    education: list(data.education, "Education").map(value => {
      const item = object(value);
      const period = dates(item.startDate, item.endDate, "Education");
      if (!period.endDate) throw new Error("Enter an education end date.");
      return { id: id(item.id), institution: text(item.institution, "institution"), program: text(item.program, "program"), startDate: period.startDate, endDate: period.endDate };
    }),
    skills: list(data.skills, "Skill groups").map(value => {
      const item = object(value);
      return { id: id(item.id), category: text(item.category, "skill category"), skills: list(item.skills, "Skills").map(value => text(value, "skill", 150)) };
    }),
    languages: list(data.languages, "Languages").map(value => {
      const item = object(value);
      return { name: text(item.name, "language", 100), level: text(item.level, "language level", 150) };
    }),
  };
  for (const items of [result.experience, result.education, result.skills]) {
    if (new Set(items.map(item => item.id)).size !== items.length) throw new Error("Duplicate item IDs.");
  }
  return result;
}

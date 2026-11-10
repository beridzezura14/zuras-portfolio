export interface StoryChapter {
  id: string;
  title: string;
  paragraphs: string[];
}

export interface StoryContent {
  title: string;
  subtitle: string;
  chapters: StoryChapter[];
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid story content.");
  return value as Record<string, unknown>;
}

function text(value: unknown, label: string, max: number): string {
  if (typeof value !== "string" || !value.trim() || value.length > max) throw new Error(`Check ${label} (maximum ${max} characters).`);
  return value.trim();
}

export function validateStory(value: unknown): StoryContent {
  const data = object(value);
  if (!Array.isArray(data.chapters) || data.chapters.length < 1 || data.chapters.length > 30) throw new Error("Your story must contain between 1 and 30 chapters.");
  const chapters = data.chapters.map((value, index) => {
    const chapter = object(value);
    const id = text(chapter.id, "chapter ID", 100);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error("Invalid chapter ID.");
    if (!Array.isArray(chapter.paragraphs) || chapter.paragraphs.length < 1 || chapter.paragraphs.length > 100) throw new Error(`Chapter ${index + 1} must contain between 1 and 100 paragraphs.`);
    return {
      id,
      title: text(chapter.title, `chapter ${index + 1} title`, 250),
      paragraphs: chapter.paragraphs.map(value => text(value, `chapter ${index + 1} paragraph`, 10000)),
    };
  });
  if (new Set(chapters.map(chapter => chapter.id)).size !== chapters.length) throw new Error("Chapter IDs must be unique.");
  return { title: text(data.title, "page title", 150), subtitle: text(data.subtitle, "subtitle", 1000), chapters };
}

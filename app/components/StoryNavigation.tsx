"use client";

import { useEffect, useState } from "react";

type Chapter = { id: string; title: string };

export default function StoryNavigation({ chapters }: { chapters: Chapter[] }) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "");

  useEffect(() => {
    let frame = 0;
    const sections = chapters.map((chapter) => ({
      id: chapter.id,
      element: document.getElementById(`story-${chapter.id}`),
    }));
    const update = () => {
      frame = 0;
      const readingLine = Math.min(window.innerHeight * 0.25, 160);
      let current = sections[0]?.id ?? "";
      for (const section of sections) {
        if (section.element && section.element.getBoundingClientRect().top <= readingLine) {
          current = section.id;
        }
      }
      setActiveId(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
    };
  }, [chapters]);

  return (
    <nav aria-label="Story chapters">
      <p className="mb-5 text-[10px] font-semibold tracking-[0.22em] text-[var(--text-muted)] uppercase">The journey</p>
      <ol className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
        {chapters.map((chapter, index) => {
          const active = chapter.id === activeId;
          return (
            <li key={chapter.id}>
              <a href={`#story-${chapter.id}`} aria-current={active ? "location" : undefined} className={`group flex items-baseline gap-3 rounded-r-lg border-l-2 px-3 py-2.5 text-xs leading-relaxed transition-colors duration-200 ${active ? "border-[var(--accent)] bg-[var(--accent-soft)] font-semibold text-[var(--accent)]" : "border-transparent text-[var(--secondary-text)] hover:text-[var(--accent)]"}`}>
                <span className={`text-[10px] ${active ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`}>{String(index + 1).padStart(2, "0")}</span>
                <span>{chapter.title.split(" — ")[0]}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

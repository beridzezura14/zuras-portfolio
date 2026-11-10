import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";
import SectionDecoration from "../components/SectionDecoration";
import StoryNavigation from "../components/StoryNavigation";
import { getAboutContent } from "@/lib/content/about";
import { getStoryContent } from "@/lib/content/story";

export async function generateMetadata(): Promise<Metadata> {
  const [story, profile] = await Promise.all([getStoryContent(), getAboutContent()]);
  const title = `${story.title.replace(/\.$/, "")} | ${profile.name}`;
  return { title, description: story.subtitle, openGraph: { title, description: story.subtitle } };
}

export default async function AboutPage() {
  const [story, aboutData] = await Promise.all([getStoryContent(), getAboutContent()]);
  const storyChapters = story.chapters;
  const titleBreak = story.title.lastIndexOf(" ");
  return (
    <main id="main-content" tabIndex={-1} className="relative pt-36 pb-24 text-[var(--foreground)] md:pt-44 md:pb-32">
      <SectionDecoration variant="detail" />
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20">
        <Link href="/#about" className="group inline-flex items-center gap-2 text-xs font-medium tracking-wider text-[var(--secondary-text)] transition-colors hover:text-[var(--accent)]">
          <ArrowLeft size={16} aria-hidden="true" className="transition-transform group-hover:-translate-x-1" />
          BACK TO OVERVIEW
        </Link>

        <header className="mt-14 border-b border-[var(--border-color)] pb-12 md:mt-20 md:pb-16">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[var(--secondary-text)] uppercase">Behind the work / {aboutData.name}</p>
          <h1 className="mt-7 text-[clamp(4.25rem,12vw,10rem)] leading-[1] font-semibold tracking-[-0.075em] [overflow-wrap:anywhere]">
            {titleBreak >= 0 && `${story.title.slice(0, titleBreak)} `}<span className="text-[var(--accent)]">{story.title.slice(titleBreak + 1)}</span>
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-relaxed tracking-tight md:text-3xl [overflow-wrap:anywhere]">{story.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-[var(--secondary-text)]">
            <span>{aboutData.title}</span>
            <span className="inline-flex items-center gap-2"><MapPin size={14} aria-hidden="true" />{aboutData.location}</span>
          </div>
        </header>

        <div className="mt-12 grid items-start gap-12 lg:mt-16 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-20">
          <aside className="lg:sticky lg:top-28">
            <StoryNavigation chapters={storyChapters.map(({ id, title }) => ({ id, title }))} />
            <p className="mt-7 hidden max-w-44 border-t border-[var(--border-color)] pt-5 text-xs leading-6 text-[var(--text-muted)] lg:block">A little context behind the code, the projects, and the person building them.</p>
          </aside>

          <article aria-label={story.title} className="min-w-0 max-w-[760px] [overflow-wrap:anywhere]">
            {storyChapters.map((chapter, index) => (
              <section key={chapter.id} id={`story-${chapter.id}`} aria-labelledby={`heading-${chapter.id}`} className="relative scroll-mt-6 border-l border-[var(--accent-border)] pb-14 pl-7 last:pb-0 md:pb-20 md:pl-12">
                <span aria-hidden="true" className="absolute top-2 -left-[5px] h-[9px] w-[9px] rounded-full bg-[var(--accent)] ring-4 ring-[var(--background)]" />
                <p className="mb-4 text-[10px] font-semibold tracking-[0.2em] text-[var(--accent)] uppercase">Chapter {String(index + 1).padStart(2, "0")}</p>
                <h2 id={`heading-${chapter.id}`} className="mb-7 text-[clamp(1.75rem,3vw,2.75rem)] leading-tight font-semibold tracking-[-0.045em]">{chapter.title}</h2>
                <div className="space-y-5 text-[15px] leading-[1.9] text-[var(--secondary-text)] md:text-base">
                  {chapter.paragraphs.map((paragraph, paragraphIndex) => (
                    paragraph.startsWith("**") && paragraph.endsWith("**") ? (
                      <blockquote key={paragraphIndex} className="my-8 rounded-r-xl border-l-2 border-[var(--accent)] bg-[var(--accent-soft)] px-5 py-5 text-lg leading-relaxed font-medium tracking-tight text-[var(--foreground)] md:px-7 md:text-xl">
                        {paragraph.slice(2, -2)}
                      </blockquote>
                    ) : <p key={paragraphIndex}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </article>
        </div>

        <section aria-labelledby="story-next-step" className="mt-20 rounded-3xl border border-[var(--accent-border)] bg-[var(--accent-soft)] px-7 py-10 md:mt-28 md:px-12 md:py-14">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[var(--secondary-text)] uppercase">The next chapter</p>
          <h2 id="story-next-step" className="mt-4 max-w-xl text-3xl leading-tight font-semibold tracking-[-0.05em] md:text-5xl">Let&apos;s build something<br />worth sharing.</h2>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/#contact" className="group inline-flex items-center gap-5 rounded-full bg-[var(--accent)] px-6 py-4 text-xs font-semibold text-[var(--accent-on)] transition-colors hover:bg-[var(--accent-hover)]">
              GET IN TOUCH<ArrowUpRight size={18} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link href="/projects" className="group inline-flex items-center gap-5 rounded-full border border-[var(--foreground)] px-6 py-4 text-xs font-semibold transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
              EXPLORE MY WORK<ArrowUpRight size={18} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

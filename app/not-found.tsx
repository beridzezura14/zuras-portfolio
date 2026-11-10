import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="relative flex min-h-[85svh] items-center px-6 pt-32 pb-16 text-[var(--foreground)] md:px-12 md:pt-40 md:pb-24">
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5 text-[10px] font-medium tracking-[0.18em] text-[var(--secondary-text)] uppercase">
          <span className="inline-flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />404 / Page not found</span>
          <span className="hidden sm:block">A small detour</span>
        </div>
        <div className="grid items-center gap-10 py-12 md:gap-12 md:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          <div aria-hidden="true" className="relative mx-auto flex w-full max-w-[540px] items-center justify-center gap-1 py-8 select-none md:gap-2 md:py-12">
            <span className="text-[clamp(6.5rem,20vw,13rem)] leading-none font-semibold tracking-[-0.1em] opacity-20" style={{ WebkitTextStroke: "1px var(--foreground)", color: "transparent" }}>4</span>
            <div className="relative mx-1 flex aspect-square w-[clamp(6rem,19vw,12rem)] shrink-0 items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)]">
              <div className="absolute -inset-4 rounded-full border border-dashed border-[var(--accent-border)] md:-inset-6" />
              <div className="absolute inset-3 rounded-full border border-[var(--accent-border)] md:inset-5" />
              <Compass className="h-8 w-8 text-[var(--accent)] md:h-12 md:w-12" strokeWidth={1} />
              <span className="absolute top-[12%] right-[12%] h-2.5 w-2.5 rounded-full bg-[var(--accent)] ring-4 ring-[var(--background)]" />
            </div>
            <span className="text-[clamp(6.5rem,20vw,13rem)] leading-none font-semibold tracking-[-0.1em] opacity-20" style={{ WebkitTextStroke: "1px var(--foreground)", color: "transparent" }}>4</span>
          </div>
          <div className="mx-auto w-full max-w-lg text-center lg:text-left">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[var(--accent)] uppercase">Nothing to see here. Yet.</p>
            <h1 className="mt-5 text-[clamp(2.75rem,5.5vw,5rem)] leading-[1.05] font-semibold tracking-[-0.065em]">This page<br />went <span className="text-[var(--accent)]">missing.</span></h1>
            <p className="mx-auto mt-6 max-w-sm text-sm leading-7 text-[var(--secondary-text)] lg:mx-0">The link may have changed, or this page never existed. There&apos;s still plenty of good work to explore.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link href="/" className="group inline-flex min-h-12 items-center justify-center gap-4 rounded-full bg-[var(--foreground)] px-6 py-3.5 text-xs font-semibold text-[var(--background)] transition-opacity hover:opacity-80"><ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 motion-reduce:transform-none" aria-hidden="true" />BACK HOME</Link>
              <Link href="/projects" className="group inline-flex min-h-12 items-center justify-center gap-4 rounded-full border border-[var(--border-color)] px-6 py-3.5 text-xs font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--foreground)]">VIEW PROJECTS<ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-color)] pt-5 text-[11px] text-[var(--text-muted)]"><span>Good things are one click away.</span><Link href="/#contact" className="inline-flex items-center gap-2 font-medium text-[var(--secondary-text)] transition-colors hover:text-[var(--accent)]">Need a hand? Get in touch<ArrowUpRight size={13} aria-hidden="true" /></Link></div>
      </div>
    </main>
  );
}

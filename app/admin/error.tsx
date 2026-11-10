"use client";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="mx-auto min-h-[70svh] max-w-lg px-6 pt-40 pb-20">
      <h1 className="text-3xl font-semibold tracking-tight">Unable to load the admin workspace.</h1>
      <p className="mt-5 text-sm leading-7 text-[var(--secondary-text)]">Check your connection and try again.</p>
      <button type="button" onClick={reset} className="mt-7 cursor-pointer rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-on)]">Try again</button>
    </main>
  );
}

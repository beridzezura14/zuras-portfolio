import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import LoginForm from "./LoginForm";
import { hasSupabaseConfig } from "@/lib/supabase/config";

type LoginParams = { access?: string; password?: string; sessions?: string };
async function AccessNotice({ searchParams }: { searchParams: Promise<LoginParams> }) {
  const { access, password, sessions } = await searchParams;
  return <>
    {access === "denied" && <p role="alert" className="mt-6 rounded-xl border border-[var(--accent-border)] bg-[var(--accent-soft)] p-4 text-sm leading-6">This account does not have administrator access. Complete the admin account setup in Supabase first.</p>}
    {password === "updated" && <p role="status" className="mt-6 rounded-xl border border-[var(--accent-border)] bg-[var(--accent-soft)] p-4 text-sm leading-6">Your password has been updated. Sign in with your new password.</p>}
    {sessions === "retry" && <p role="alert" className="mt-4 text-sm leading-6">Some previous sessions could not be signed out. Review your sessions in Supabase.</p>}
  </>;
}

export default function AdminLogin({ searchParams }: { searchParams: Promise<LoginParams> }) {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto flex min-h-svh max-w-lg flex-col justify-center px-6 py-12 md:py-16">
      <Link href="/" className="mb-8 inline-flex w-fit items-center gap-2 text-xs text-[var(--secondary-text)] hover:text-[var(--accent)]"><ArrowLeft size={14} />Back to portfolio</Link>
      <div className="rounded-3xl border border-[var(--accent-border)] bg-[var(--accent-surface)] p-7 md:p-10">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><LockKeyhole size={20} /></span>
        <p className="mt-6 text-[10px] font-semibold tracking-[0.2em] text-[var(--secondary-text)] uppercase">Portfolio admin</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">Welcome back.</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--secondary-text)]">Sign in to access your portfolio workspace.</p>
        <Suspense fallback={null}><AccessNotice searchParams={searchParams} /></Suspense>
        {hasSupabaseConfig() ? <LoginForm /> : <p role="alert" className="mt-6 text-sm leading-6">Add the Supabase project URL and publishable key to the site configuration to enable sign-in.</p>}
      </div>
    </main>
  );
}

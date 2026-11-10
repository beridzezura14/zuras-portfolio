import { Suspense } from "react";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PasswordForm from "./PasswordForm";

async function Content({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  if (params.error !== "expired") {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (!error && user) {
      const { data: admin, error: roleError } = await supabase.rpc("is_admin");
      if (!roleError && admin === true) return <PasswordForm />;
    }
  }
  return <div className="mt-8"><p role="alert" className="rounded-xl border border-[var(--accent-border)] bg-[var(--accent-soft)] p-4 text-sm leading-7">This recovery link is invalid or has expired. Request a new link and open it in the same browser where you requested it.</p><Link href="/admin/forgot-password" className="mt-6 inline-flex text-sm font-semibold text-[var(--accent)]">Request a new recovery link →</Link></div>;
}
export default function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return <main id="main-content" tabIndex={-1} className="mx-auto flex min-h-svh max-w-lg flex-col justify-center px-6 py-12"><Link href="/admin/login" className="mb-8 text-xs text-[var(--secondary-text)]">← Back to sign in</Link><div className="rounded-3xl border border-[var(--accent-border)] bg-[var(--accent-surface)] p-7 md:p-10"><LockKeyhole size={22} className="text-[var(--accent)]" /><h1 className="mt-6 text-3xl font-semibold tracking-tight">Set a new password.</h1><p className="mt-4 text-sm leading-7 text-[var(--secondary-text)]">Choose your new password, then sign in again.</p><Suspense fallback={<p role="status" className="mt-8 text-sm">Checking recovery access…</p>}><Content searchParams={searchParams} /></Suspense></div></main>;
}

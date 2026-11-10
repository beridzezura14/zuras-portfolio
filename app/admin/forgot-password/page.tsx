import Link from "next/link";
import { KeyRound } from "lucide-react";
import RecoveryForm from "./RecoveryForm";

export default function ForgotPasswordPage() {
  return <main id="main-content" tabIndex={-1} className="mx-auto flex min-h-svh max-w-lg flex-col justify-center px-6 py-12"><Link href="/admin/login" className="mb-8 text-xs text-[var(--secondary-text)] hover:text-[var(--accent)]">← Back to sign in</Link><div className="rounded-3xl border border-[var(--accent-border)] bg-[var(--accent-surface)] p-7 md:p-10"><span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><KeyRound size={20} /></span><h1 className="mt-6 text-3xl font-semibold tracking-tight">Forgot your password?</h1><p className="mt-4 text-sm leading-7 text-[var(--secondary-text)]">Enter your account email and we will send you a link to reset your password.</p><RecoveryForm /></div></main>;
}

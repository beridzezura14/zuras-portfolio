"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { signIn } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(signIn, { error: null });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="mt-9 space-y-6">
      <div>
        <label htmlFor="admin-email" className="mb-2 block text-xs font-semibold text-[var(--secondary-text)]">Email address</label>
        <input id="admin-email" name="email" type="email" autoComplete="username" required maxLength={254} disabled={pending} className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--background)] px-4 py-3.5 text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-60" />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-2 block text-xs font-semibold text-[var(--secondary-text)]">Password</label>
        <div className="relative">
          <input id="admin-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required maxLength={1024} disabled={pending} className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--background)] py-3.5 pr-14 pl-4 text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-60" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-[var(--secondary-text)] hover:text-[var(--foreground)]">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <Link href="/admin/forgot-password" className="mt-3 inline-block text-xs font-medium text-[var(--accent)] hover:underline">Forgot password?</Link>
      </div>
      {state.error && <p role="alert" className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-[var(--foreground)]">{state.error}</p>}
      <button type="submit" disabled={pending} className="flex min-h-12 w-full cursor-pointer items-center justify-between rounded-xl bg-[var(--accent)] px-5 py-3.5 text-sm font-semibold text-[var(--accent-on)] transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-wait disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
        {pending ? <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}
      </button>
      <p className="text-xs leading-6 text-[var(--text-muted)]">Use the account created for this portfolio. Access is limited to designated administrators.</p>
    </form>
  );
}

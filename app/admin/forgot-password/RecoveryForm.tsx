"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "./actions";

export default function RecoveryForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, {});
  if (state.success) return <div className="mt-8 space-y-4"><p role="status" className="rounded-xl border border-[var(--accent-border)] bg-[var(--accent-soft)] p-5 text-sm leading-7">Recovery request received. If the email matches an account, Supabase will attempt to send a reset link. Check your inbox and spam folder. Open the link in the same browser where you requested it.</p><p className="text-xs leading-6 text-[var(--secondary-text)]">No email? Check the account address and the email delivery status in Supabase Authentication logs before requesting another link.</p></div>;
  return <form action={action} className="mt-8 space-y-5"><label className="block text-xs font-semibold text-[var(--secondary-text)]">Email address<input name="email" type="email" autoComplete="email" maxLength={254} required disabled={pending} className="mt-2 w-full rounded-xl border border-[var(--border-color)] bg-[var(--background)] px-4 py-3.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]" /></label>{state.error && <p role="alert" className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm leading-6">{state.error}</p>}<button type="submit" disabled={pending} className="w-full cursor-pointer rounded-xl bg-[var(--accent)] px-5 py-3.5 text-sm font-semibold text-[var(--accent-on)] disabled:opacity-50">{pending ? "Sending recovery link…" : "Send recovery link"}</button></form>;
}

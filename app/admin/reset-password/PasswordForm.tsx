"use client";

import { useActionState, useState } from "react";
import { updatePassword } from "./actions";

export default function PasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, {});
  const [show, setShow] = useState(false);
  return <form action={action} className="mt-8 space-y-5">{[{ name: "password", label: "New password" }, { name: "confirmation", label: "Confirm new password" }].map(field => <label key={field.name} className="block text-xs font-semibold text-[var(--secondary-text)]">{field.label}<input name={field.name} type={show ? "text" : "password"} autoComplete="new-password" required minLength={8} maxLength={128} disabled={pending} className="mt-2 w-full rounded-xl border border-[var(--border-color)] bg-[var(--background)] px-4 py-3.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]" /></label>)}<label className="flex items-center gap-2 text-xs text-[var(--secondary-text)]"><input type="checkbox" checked={show} onChange={event => setShow(event.target.checked)} />Show passwords</label><p className="text-xs leading-6 text-[var(--secondary-text)]">Use at least 8 characters. A unique passphrase is a good choice.</p>{state.error && <p role="alert" className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm leading-6">{state.error}</p>}<button type="submit" disabled={pending} className="w-full cursor-pointer rounded-xl bg-[var(--accent)] px-5 py-3.5 text-sm font-semibold text-[var(--accent-on)] disabled:opacity-50">{pending ? "Updating password…" : "Save new password"}</button></form>;
}

"use client";

import { useActionState, useState } from "react";
import { updateMessage } from "./actions";

export default function MessageControls({ id, isRead }: { id: string; isRead: boolean }) {
  const [state, action, pending] = useActionState(updateMessage, {});
  const [confirm, setConfirm] = useState(false);
  return <form action={action} className="mt-5 border-t border-[var(--border-color)] pt-5"><input type="hidden" name="id" value={id} />
    <fieldset disabled={pending} className="flex flex-wrap items-center gap-3 disabled:opacity-50">
      {!confirm ? <><button type="submit" name="intent" value={isRead ? "unread" : "read"} className="cursor-pointer rounded-xl border border-[var(--accent-border)] bg-[var(--accent-soft)] px-4 py-2.5 text-xs font-semibold text-[var(--accent)]">{isRead ? "Mark as unread" : "Mark as read"}</button><button type="button" onClick={() => setConfirm(true)} className="cursor-pointer rounded-xl px-4 py-2.5 text-xs text-red-500">Delete</button></> : <><p className="text-xs">Permanently delete this message?</p><button type="submit" name="intent" value="delete" className="cursor-pointer rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white">Yes, delete</button><button type="button" onClick={() => setConfirm(false)} className="cursor-pointer rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-xs">Cancel</button></>}
    </fieldset>
    <p aria-live="polite" className={`mt-3 text-xs ${state.error ? "text-red-500" : "text-[var(--secondary-text)]"}`}>{pending ? "Updating…" : state.error || state.notice}</p>
  </form>;
}

"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export default function RefreshInbox() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <button type="button" onClick={() => startTransition(() => router.refresh())} disabled={pending} className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--background)] px-4 py-3 text-xs font-semibold disabled:opacity-50"><RefreshCw size={15} className={pending ? "animate-spin" : ""} />{pending ? "Refreshing…" : "Refresh inbox"}</button>;
}

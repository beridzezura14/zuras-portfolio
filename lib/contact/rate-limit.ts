import { createHash } from "node:crypto";

// Best-effort protection per server process; never store addresses or messages.
const attempts = new Map<string, { count: number; expires: number }>();
const windowMs = 60_000;
export function allowContactAttempt(email: string, now = Date.now()) {
  for (const [key, entry] of attempts) if (entry.expires <= now) attempts.delete(key);
  const key = createHash("sha256").update(email).digest("hex");
  const current = attempts.get(key);
  if (current && current.count >= 3) return false;
  if (!current && attempts.size >= 10000) return false;
  attempts.set(key, current ? { ...current, count: current.count + 1 } : { count: 1, expires: now + windowMs });
  return true;
}

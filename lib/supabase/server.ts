import "server-only";

import { cookies } from "next/headers";
import { connection } from "next/server";
import { getSupabaseConfig } from "./config";

export async function createClient() {
  // Auth reads the current time internally. Keep SDK initialization and token
  // verification out of prerendering, including when a session cookie exists.
  await connection();
  const { url, key } = getSupabaseConfig();
  const cookieStore = await cookies();
  const { createServerClient } = await import("@supabase/ssr");

  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies. The proxy refreshes them.
        }
      },
    },
  });
}

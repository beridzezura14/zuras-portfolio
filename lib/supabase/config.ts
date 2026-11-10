export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()),
  );
}

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !key) {
    throw new Error(
      "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local.",
    );
  }

  const parsed = new URL(url);
  if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname))) {
    throw new Error("Use an HTTPS Supabase project URL or a local development URL.");
  }
  if (key.startsWith("sb_secret_")) {
    throw new Error("Use a publishable key in NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, not a secret key.");
  }
  if (key.startsWith("eyJ")) {
    let role: unknown;
    try {
      const payload = key.split(".")[1];
      role = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))).role;
    } catch {
      throw new Error("The Supabase legacy API key is malformed.");
    }
    if (role !== "anon") {
      throw new Error("Only a publishable or legacy anon key can be used in public Supabase configuration.");
    }
  }

  return { url: parsed.origin, key };
}

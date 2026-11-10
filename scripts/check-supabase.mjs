import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd(), true);

async function main() {
  const { getSupabaseConfig } = await import("../lib/supabase/config.ts");
  const { url, key } = getSupabaseConfig();
  // The REST root serves an OpenAPI document and can require a secret key.
  // A zero-row table request checks the public Data API without reading records.
  for (const [name, path] of [["Auth", "/auth/v1/settings"], ["Data API", "/rest/v1/projects?select=*&limit=0"]]) {
    let response;
    try {
      response = await fetch(`${url}${path}`, {
        headers: { apikey: key },
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      throw new Error(`${name} is unreachable. Check the project URL, project status, and network connection.`);
    }
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      if (name === "Data API" && response.status === 404 && body?.code === "PGRST205") {
        console.log("Data API: connected (projects table is not exposed yet)");
        continue;
      }
      throw new Error(`${name} returned HTTP ${response.status}. Check the public API key and project configuration.`);
    }
    await response.body?.cancel();
    console.log(`${name}: connected`);
  }
  console.log("Supabase connection verified. No records were created or changed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Supabase connection check failed.");
  process.exitCode = 1;
});

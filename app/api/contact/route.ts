import { getSupabaseConfig, hasSupabaseConfig } from "@/lib/supabase/config";
import { validateContactMessage } from "@/lib/contact/validation";
import { allowContactAttempt } from "@/lib/contact/rate-limit";
import { BodyTooLargeError, readLimitedBody } from "@/lib/security/request-body";

const maxBodySize = 32768;
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return Response.json({ error: "Please send the message using this website's contact form." }, { status: 403 });
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return Response.json({ error: "Invalid message format." }, { status: 415 });
  if (!hasSupabaseConfig()) return Response.json({ error: "Message delivery is temporarily unavailable. Please try again later." }, { status: 503 });
  let input: unknown;
  try {
    input = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(await readLimitedBody(request, maxBodySize)));
  } catch (error) { return Response.json({ error: error instanceof BodyTooLargeError ? "Your message is too large." : "Invalid message format. Please try again." }, { status: error instanceof BodyTooLargeError ? 413 : 400 }); }
  if (input && typeof input === "object" && "website" in input && input.website !== "") return Response.json({ error: "Unable to send this message." }, { status: 400 });
  let message;
  try { message = validateContactMessage(input); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Please check your message fields." }, { status: 400 }); }
  if (!allowContactAttempt(message.email)) return Response.json({ error: "Please wait a minute before sending another message." }, { status: 429, headers: { "Retry-After": "60" } });
  try {
    const { url, key } = getSupabaseConfig();
    // Insert only public submission fields; visitors cannot set IDs or read status.
    // return=minimal avoids requesting inbox read access from the anonymous role.
    const response = await fetch(`${url}/rest/v1/contact_messages`, {
      method: "POST", headers: { apikey: key, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(message), signal: AbortSignal.timeout(15000), cache: "no-store",
    });
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      if (error?.code === "P0001" && error?.message === "CONTACT_RATE_LIMIT") return Response.json({ error: "Please wait a minute before sending another message." }, { status: 429, headers: { "Retry-After": "60" } });
      return Response.json({ error: "Your message could not be delivered. Please try again." }, { status: 503 });
    }
    return Response.json({ success: true }, { status: 201 });
  } catch { return Response.json({ error: "Message delivery is temporarily unavailable. Please try again." }, { status: 503 }); }
}

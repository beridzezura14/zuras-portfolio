import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const tokenHash = params.get("token_hash");
  // Always redirect to fixed local paths; never trust a next/redirect query value.
  function destination(path: string) {
    const response = NextResponse.redirect(new URL(path, request.url));
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  }
  if (params.has("error") || (!code && (!tokenHash || params.get("type") !== "recovery")) || (code?.length ?? 0) > 2048 || (tokenHash?.length ?? 0) > 2048) return destination("/admin/reset-password?error=expired");
  try {
    const supabase = await createClient();
    const flowId = params.get("sb_flow_id");
    const { error } = code
      ? await supabase.auth.exchangeCodeForSession(code, flowId ? { flowId } : undefined)
      : await supabase.auth.verifyOtp({ token_hash: tokenHash!, type: "recovery" });
    if (error) return destination("/admin/reset-password?error=expired");
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    const { data: admin, error: roleError } = await supabase.rpc("is_admin");
    if (userError || !user || roleError || admin !== true) {
      await supabase.auth.signOut({ scope: "local" });
      return destination("/admin/login?access=denied");
    }
    return destination("/admin/reset-password");
  } catch { return destination("/admin/reset-password?error=expired"); }
}

"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { recoveryRedirectUrl } from "@/lib/supabase/recovery";
import { recoveryErrorMessage } from "@/lib/supabase/recovery-errors";

export type RecoveryState = { error?: string; success?: boolean };

export async function requestPasswordReset(_previous: RecoveryState, formData: FormData): Promise<RecoveryState> {
  const value = formData.get("email");
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };
  if (!hasSupabaseConfig()) return { error: "Password recovery is temporarily unavailable." };
  try {
    const requestHeaders = await headers();
    const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);
    const redirectTo = recoveryRedirectUrl(configuredUrl, requestHeaders.get("origin"), process.env.NODE_ENV === "development");
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error && error.code !== "user_not_found") {
      // Keep diagnostic codes only; never log an address, token, link or password.
      console.warn("Password recovery rejected", { code: error.code, status: error.status });
      return { error: recoveryErrorMessage(error) };
    }
  } catch { return { error: "Password recovery is unavailable. Please check the website URL and email settings." }; }
  // Do not reveal whether an address belongs to an existing account.
  return { success: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { signInErrorMessage } from "@/lib/supabase/auth-errors";

export async function signIn(_previous: { error: string | null }, formData: FormData): Promise<{ error: string | null }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || email.length > 254 || !password || password.length > 1024) {
    return { error: "Enter your email address and password." };
  }
  if (!hasSupabaseConfig()) return { error: "Supabase connection settings are missing." };

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // Diagnostic codes only; never log an email, password, or session token.
      console.warn("Admin sign-in rejected", { code: error.code, status: error.status });
      return { error: signInErrorMessage(error) };
    }
    if (!data.user) return { error: "The sign-in session could not be created. Please try again." };

    const { data: admin, error: roleError } = await supabase.rpc("is_admin");
    if (roleError || admin !== true) {
      await supabase.auth.signOut({ scope: "local" });
      return { error: roleError
        ? "Administrator access could not be verified. Check the database setup and try again."
        : "This account does not have administrator access. Complete the admin account setup in Supabase first." };
    }
  } catch {
    return { error: "The sign-in service could not be reached. Please try again." };
  }

  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) throw new Error("Sign out failed. Please try again.");
  revalidatePath("/admin", "layout");
  redirect("/admin/login");
}

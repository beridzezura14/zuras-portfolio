"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { validateNewPassword } from "@/lib/supabase/recovery";

export type PasswordState = { error?: string };
export async function updatePassword(_previous: PasswordState, formData: FormData): Promise<PasswordState> {
  const { supabase } = await requireAdmin();
  let password: string;
  try { password = validateNewPassword(formData.get("password"), formData.get("confirmation")); }
  catch (error) { return { error: error instanceof Error ? error.message : "Check your new password." }; }
  let sessionWarning = false;
  try {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { error: error.code === "same_password" ? "Choose a different password from your previous one." : error.code === "weak_password" ? "Choose a stronger password. Avoid common or previously leaked passwords." : "Unable to update your password. Request a new recovery link and try again." };
    const result = await supabase.auth.signOut({ scope: "global" });
    sessionWarning = Boolean(result.error);
    if (sessionWarning) await supabase.auth.signOut({ scope: "local" });
  } catch { return { error: "The password service could not be reached. Try signing in with your new password, or request another recovery link." }; }
  revalidatePath("/admin", "layout");
  redirect(`/admin/login?password=updated${sessionWarning ? "&sessions=retry" : ""}`);
}

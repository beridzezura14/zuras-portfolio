import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "./server";
import { hasSupabaseConfig } from "./config";

export async function requireAdmin() {
  if (!hasSupabaseConfig()) redirect("/admin/login");
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/admin/login");

  const { data: admin, error: roleError } = await supabase.rpc("is_admin");
  if (roleError || admin !== true) redirect("/admin/login?access=denied");
  return { supabase, user };
}

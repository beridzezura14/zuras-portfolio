"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";

export type MessageActionState = { error?: string; notice?: string };
export async function updateMessage(_previous: MessageActionState, formData: FormData): Promise<MessageActionState> {
  const { supabase } = await requireAdmin();
  const id = formData.get("id");
  const intent = formData.get("intent");
  if (typeof id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) || !["read", "unread", "delete"].includes(String(intent))) return { error: "Invalid message action." };
  const query = intent === "delete" ? supabase.from("contact_messages").delete().eq("id", id) : supabase.from("contact_messages").update({ is_read: intent === "read" }).eq("id", id);
  const { error } = await query.select("id").single();
  if (error) return { error: "Unable to update this message. Please try again." };
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { notice: intent === "delete" ? "Message deleted." : intent === "read" ? "Marked as read." : "Marked as unread." };
}
